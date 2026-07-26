// certificateController.js — Full implementation
const db = require('../config/database');
const jwt = require('jsonwebtoken');
const CertificateModel = require('../models/Certificate');

const JWT_SECRET = process.env.JWT_SECRET || 'smartgn_jwt_secret_key_987654321';

const getUserFromToken = (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
};

const generateCertificateNumber = () => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `CERT-${date}-${rand}`;
};

// Helper function
const parseDetails = (detailsRaw) => {
    if (!detailsRaw) return {};
    if (typeof detailsRaw === 'object') return detailsRaw;
    try {
        return JSON.parse(detailsRaw);
    } catch {
        return {};
    }
};

// RESIDENT ENDPOINTS

// POST /api/certificates/apply
exports.submitCertificateRequest = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const { certificateType, purpose, requestDate, ...extraFields } = req.body;

    if (!certificateType || !purpose) {
        return res.status(400).json({ error: 'certificateType and purpose are required.' });
    }

    const normalizedType = String(certificateType).toUpperCase();
    const validTypes = ['RESIDENCE', 'INCOME', 'CHARACTER'];
    if (!validTypes.includes(normalizedType)) {
        return res.status(400).json({ error: 'Invalid certificate type. Allowed: RESIDENCE, INCOME, CHARACTER.' });
    }

    try {
        const residentNic = user.id;
        const gnId = await CertificateModel.findOfficerForResident(residentNic);
        const certNumber = generateCertificateNumber();
        const reqDate = requestDate || new Date().toISOString().split('T')[0];

        const details = {
            purpose,
            requestDate: reqDate,
            ...extraFields
        };

        const requestId = await CertificateModel.createPendingRequest({
            certificateNumber: certNumber,
            certificateType: normalizedType,
            purpose,
            requestDate: reqDate,
            residentNic,
            gnId,
            details
        });

        return res.status(201).json({
            message: 'Certificate application submitted successfully. Assigned to your Grama Niladhari division.',
            certificateNumber: certNumber,
            request_id: requestId,
            id: requestId,
            status: 'PENDING'
        });
    } catch (error) {
        console.error('Error submitting certificate request:', error);
        return res.status(500).json({ error: 'Server error submitting certificate request.' });
    }
};

// GET /api/certificates/resident
exports.getResidentCertificates = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const residentNic = user.id;

    try {
        const [pending] = await db.query(`
            SELECT request_id, certificate_number, certificate_type, purpose, request_date,
                   'PENDING' AS status, NULL AS gn_remarks, NULL AS rejection_reason,
                   NULL AS issued_date, NULL AS expiry_date, details, requested_at AS created_at
            FROM certificate_pending
            WHERE resident_nic = ?
        `, [residentNic]);

        const [approved] = await db.query(`
            SELECT request_id, certificate_number, certificate_type, purpose, request_date,
                   'APPROVED' AS status, gn_remarks, NULL AS rejection_reason,
                   issued_date, expiry_date, details, approved_at AS created_at
            FROM certificate_approved
            WHERE resident_nic = ?
        `, [residentNic]);

        const [rejected] = await db.query(`
            SELECT request_id, certificate_number, certificate_type, purpose, request_date,
                   'REJECTED' AS status, gn_remarks, rejection_reason,
                   NULL AS issued_date, NULL AS expiry_date, details, rejected_at AS created_at
            FROM certificate_rejected
            WHERE resident_nic = ?
        `, [residentNic]);

        const allRequests = [...pending, ...approved, ...rejected].map(item => ({
            ...item,
            id: item.request_id,
            details: parseDetails(item.details)
        })).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

        return res.json(allRequests);
    } catch (error) {
        console.error('Error fetching resident certificates:', error);
        return res.status(500).json({ error: 'Server error fetching certificate requests.' });
    }
};

// OFFICER / ADMIN ENDPOINTS

// GET /api/certificates/officer
exports.getOfficerCertificates = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied. Officers/Admins only.' });
    }

    try {
        let gnId = user.id || null;
        let divisionId = user.divisionId || null;

        if (user.role === 'OFFICER') {
            try {
                const [officer] = await db.query(
                    'SELECT gn_id, division_id FROM grama_niladhari WHERE gn_id = ? OR email = ? OR username = ?',
                    [user.id, user.email || user.id, user.id]
                );
                if (officer && officer.length > 0) {
                    gnId = officer[0].gn_id || gnId;
                    divisionId = officer[0].division_id || divisionId;
                }
            } catch (err) {
                console.error('Error finding officer profile:', err);
            }
        }

        const filterParams = [];
        let filterSql = '';

        if (gnId || divisionId) {
            filterSql = 'AND (cp.gn_id = ? OR r.division_id = ? OR cp.gn_id IS NULL)';
            filterParams.push(gnId, divisionId);
        }

        const [pending] = await db.query(`
            SELECT cp.request_id, cp.certificate_number, cp.certificate_type, cp.purpose, cp.request_date,
                   'PENDING' AS status, cp.details, cp.requested_at AS created_at,
                   CONCAT(r.first_name, ' ', r.last_name) AS resident_name,
                   r.r_nic AS resident_nic, r.home_address AS resident_address, r.mobile_no
            FROM certificate_pending cp
            LEFT JOIN resident r ON cp.resident_nic = r.r_nic
            WHERE 1=1 ${filterSql}
            ORDER BY cp.requested_at DESC
        `, filterParams);

        const filterApprovedSql = filterSql.replace(/cp\./g, 'ca.');
        const [approved] = await db.query(`
            SELECT ca.request_id, ca.certificate_number, ca.certificate_type, ca.purpose, ca.request_date,
                   'APPROVED' AS status, ca.gn_remarks, ca.issued_date, ca.expiry_date, ca.details, ca.approved_at AS created_at,
                   CONCAT(r.first_name, ' ', r.last_name) AS resident_name,
                   r.r_nic AS resident_nic, r.home_address AS resident_address, r.mobile_no
            FROM certificate_approved ca
            LEFT JOIN resident r ON ca.resident_nic = r.r_nic
            WHERE 1=1 ${filterApprovedSql}
            ORDER BY ca.approved_at DESC
        `, filterParams);

        const filterRejectedSql = filterSql.replace(/cp\./g, 'cr.');
        const [rejected] = await db.query(`
            SELECT cr.request_id, cr.certificate_number, cr.certificate_type, cr.purpose, cr.request_date,
                   'REJECTED' AS status, cr.gn_remarks, cr.rejection_reason, cr.details, cr.rejected_at AS created_at,
                   CONCAT(r.first_name, ' ', r.last_name) AS resident_name,
                   r.r_nic AS resident_nic, r.home_address AS resident_address, r.mobile_no
            FROM certificate_rejected cr
            LEFT JOIN resident r ON cr.resident_nic = r.r_nic
            WHERE 1=1 ${filterRejectedSql}
            ORDER BY cr.rejected_at DESC
        `, filterParams);

        const results = [...pending, ...approved, ...rejected].map(item => ({
            ...item,
            id: item.request_id,
            details: parseDetails(item.details)
        }));

        return res.json(results);
    } catch (error) {
        console.error('Error fetching officer certificates:', error);
        return res.status(500).json({ error: 'Server error fetching certificate requests.' });
    }
};

// GET /api/certificates/:id
exports.getCertificateDetails = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    const { id } = req.params;

    try {
        const [pending] = await db.query(`
            SELECT cp.*, 'PENDING' AS status,
                   CONCAT(r.first_name, ' ', r.last_name) AS resident_name,
                   r.home_address AS resident_address, r.mobile_no, r.email AS resident_email
            FROM certificate_pending cp
            JOIN resident r ON cp.resident_nic = r.r_nic
            WHERE cp.request_id = ? OR cp.certificate_number = ?
        `, [id, id]);

        if (pending.length > 0) {
            const item = pending[0];
            return res.json({ ...item, id: item.request_id, details: parseDetails(item.details) });
        }

        const [approved] = await db.query(`
            SELECT ca.*, 'APPROVED' AS status,
                   CONCAT(r.first_name, ' ', r.last_name) AS resident_name,
                   r.home_address AS resident_address, r.mobile_no, r.email AS resident_email
            FROM certificate_approved ca
            JOIN resident r ON ca.resident_nic = r.r_nic
            WHERE ca.request_id = ? OR ca.certificate_number = ?
        `, [id, id]);

        if (approved.length > 0) {
            const item = approved[0];
            return res.json({ ...item, id: item.request_id, details: parseDetails(item.details) });
        }

        const [rejected] = await db.query(`
            SELECT cr.*, 'REJECTED' AS status,
                   CONCAT(r.first_name, ' ', r.last_name) AS resident_name,
                   r.home_address AS resident_address, r.mobile_no, r.email AS resident_email
            FROM certificate_rejected cr
            JOIN resident r ON cr.resident_nic = r.r_nic
            WHERE cr.request_id = ? OR cr.certificate_number = ?
        `, [id, id]);

        if (rejected.length > 0) {
            const item = rejected[0];
            return res.json({ ...item, id: item.request_id, details: parseDetails(item.details) });
        }

        return res.status(404).json({ error: 'Certificate request not found.' });
    } catch (error) {
        console.error('Error fetching certificate details:', error);
        return res.status(500).json({ error: 'Server error fetching certificate details.' });
    }
};

// PUT /api/certificates/:id/action
exports.handleCertificateAction = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied. Officers/Admins only.' });
    }

    const { id } = req.params;
    const { status, rejectionReason, remarks, gnRemarks, issuedDate, expiryDate, ...otherData } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required (APPROVED or REJECTED).' });
    }

    const actionStatus = String(status).toUpperCase();

    try {
        let gnId = null;
        if (user.role === 'OFFICER') {
            const [officer] = await db.query('SELECT gn_id FROM grama_niladhari WHERE officer_id = ?', [user.id]);
            if (officer.length === 0) return res.status(404).json({ error: 'Officer profile not found.' });
            gnId = officer[0].gn_id;
        } else {
            gnId = user.id;
        }

        const [pending] = await db.query(
            'SELECT * FROM certificate_pending WHERE request_id = ? OR certificate_number = ?',
            [id, id]
        );

        if (pending.length === 0) {
            return res.status(404).json({ error: 'Certificate request not found in pending queue.' });
        }

        const cp = pending[0];
        const now = new Date();
        const remarksContent = remarks || gnRemarks || null;
        const currentDetails = parseDetails(cp.details);
        const updatedDetails = { ...currentDetails, ...otherData };

        if (actionStatus === 'APPROVED' || actionStatus === 'ACCEPT' || actionStatus === 'ACCEPTED') {
            const issueD = issuedDate || new Date().toISOString().split('T')[0];
            // Expiry 6 months by default if not set
            const expD = expiryDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            await db.query(`
                INSERT INTO certificate_approved
                (request_id, certificate_number, certificate_type, purpose, request_date,
                 resident_nic, gn_id, approved_by, gn_remarks, details, approved_at, issued_date, expiry_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                cp.request_id, cp.certificate_number, cp.certificate_type, cp.purpose, cp.request_date,
                cp.resident_nic, cp.gn_id, gnId, remarksContent, JSON.stringify(updatedDetails),
                now, issueD, expD
            ]);

            await db.query('DELETE FROM certificate_pending WHERE request_id = ?', [cp.request_id]);

            // Create notification for resident
            try {
                await db.query(`
                    INSERT INTO notification (recipient_type, recipient_id, title, message, type)
                    VALUES ('RESIDENT', ?, 'Certificate Approved', ?, 'SUCCESS')
                `, [cp.resident_nic, `Your request for ${cp.certificate_type} certificate (${cp.certificate_number}) has been approved.`]);
            } catch (notifErr) {
                console.warn('Failed to insert notification:', notifErr.message);
            }

            return res.json({
                message: `Certificate request ${cp.certificate_number} has been approved and issued successfully.`,
                status: 'APPROVED',
                request_id: cp.request_id
            });
        } else if (actionStatus === 'REJECTED') {
            const reason = rejectionReason || 'Certificate application did not meet verification criteria.';

            await db.query(`
                INSERT INTO certificate_rejected
                (request_id, certificate_number, certificate_type, purpose, request_date,
                 resident_nic, gn_id, rejected_by, rejection_reason, gn_remarks, details, rejected_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                cp.request_id, cp.certificate_number, cp.certificate_type, cp.purpose, cp.request_date,
                cp.resident_nic, cp.gn_id, gnId, reason, remarksContent, JSON.stringify(updatedDetails),
                now
            ]);