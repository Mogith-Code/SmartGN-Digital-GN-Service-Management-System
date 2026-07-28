const db = require('../config/database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'smartgn_jwt_secret_key_987654321';

const getUserFromToken = (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;
    try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
};

// GET APPOINTMENT COUNTS (Pending & Approved only)
// ============================================================
exports.getAppointmentCounts = async (req, res) => {
    // Check if user is authenticated and is a resident
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const nic = user.id;

    try {
        // Get count of pending appointments
        const [pendingResult] = await db.query(
            'SELECT COUNT(*) AS count FROM appointment_pending WHERE resident_nic = ?',
            [nic]
        );

        // Get count of approved appointments
        const [approvedResult] = await db.query(
            'SELECT COUNT(*) AS count FROM appointment_approved WHERE resident_nic = ?',
            [nic]
        );

        // Return the counts
        return res.json({
            pending: pendingResult[0]?.count || 0,
            approved: approvedResult[0]?.count || 0
        });

    } catch (error) {
        console.error('Error fetching appointment counts:', error);
        return res.status(500).json({ error: 'Server error fetching appointment counts.' });
    }
};
