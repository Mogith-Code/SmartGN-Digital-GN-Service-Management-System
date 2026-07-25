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
