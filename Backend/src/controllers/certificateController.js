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
