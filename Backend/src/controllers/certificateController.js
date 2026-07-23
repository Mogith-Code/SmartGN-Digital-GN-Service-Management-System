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