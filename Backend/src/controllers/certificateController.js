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
        let gnId = null;
        if (user.role === 'OFFICER') {
            const [officer] = await db.query('SELECT gn_id FROM grama_niladhari WHERE officer_id = ?', [user.id]);
            if (officer.length === 0) return res.status(404).json({ error: 'Officer profile not found.' });
            gnId = officer[0].gn_id;
        }

        const filter = gnId ? 'AND cp.gn_id = ?' : '';
        const params = gnId ? [gnId] : [];

        const [pending] = await db.query(`
            SELECT cp.request_id, cp.certificate_number, cp.certificate_type, cp.purpose, cp.request_date,
                   'PENDING' AS status, cp.details, cp.requested_at AS created_at,
                   CONCAT(r.first_name, ' ', r.last_name) AS resident_name,
                   r.r_nic AS resident_nic, r.home_address AS resident_address, r.mobile_no
            FROM certificate_pending cp
            JOIN resident r ON cp.resident_nic = r.r_nic
            WHERE 1=1 ${filter}
            ORDER BY cp.requested_at DESC
        `, params);

        const [approved] = await db.query(`
            SELECT ca.request_id, ca.certificate_number, ca.certificate_type, ca.purpose, ca.request_date,
                   'APPROVED' AS status, ca.gn_remarks, ca.issued_date, ca.expiry_date, ca.details, ca.approved_at AS created_at,
                   CONCAT(r.first_name, ' ', r.last_name) AS resident_name,
                   r.r_nic AS resident_nic, r.home_address AS resident_address, r.mobile_no
            FROM certificate_approved ca
            JOIN resident r ON ca.resident_nic = r.r_nic
            WHERE 1=1 ${filter.replace('cp.gn_id', 'ca.gn_id')}
            ORDER BY ca.approved_at DESC
        `, params);

        const [rejected] = await db.query(`
            SELECT cr.request_id, cr.certificate_number, cr.certificate_type, cr.purpose, cr.request_date,
                   'REJECTED' AS status, cr.gn_remarks, cr.rejection_reason, cr.details, cr.rejected_at AS created_at,
                   CONCAT(r.first_name, ' ', r.last_name) AS resident_name,
                   r.r_nic AS resident_nic, r.home_address AS resident_address, r.mobile_no
            FROM certificate_rejected cr
            JOIN resident r ON cr.resident_nic = r.r_nic
            WHERE 1=1 ${filter.replace('cp.gn_id', 'cr.gn_id')}
            ORDER BY cr.rejected_at DESC
        `, params);

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
