// userController.js — Officer-facing endpoints (profile, dashboard stats, announcements)
const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'smartgn_jwt_secret_key_987654321';

const getUserFromToken = (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;
    try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
};

const generateAnnouncementNumber = () => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const rand = Math.floor(100 + Math.random() * 900);
    return `ANN-${date}-${rand}`;
};

// ============================================================
// OFFICER PROFILE
// ============================================================
// GET /api/officer/profile
exports.getOfficerProfile = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'OFFICER') {
        return res.status(403).json({ error: 'Access denied. Officers only.' });
    }

    try {
        const [rows] = await db.query(`
            SELECT 
                g.gn_id,
                g.username,
                g.first_name,
                g.last_name,
                g.full_name,
                g.email,
                g.mobile,
                g.status,
                g.is_2fa_enabled,
                g.profile_photo_path,
                g.profile_photo_filename,
                g.gn_front_path,
                g.gn_front_filename,
                g.gn_back_path,
                g.gn_back_filename,
                g.created_at,
                g.last_login_at,
                g.updated_at,
                d.division_id,
                d.name AS division_name,
                d.district,
                d.province,
                d.divisional_secretariat,
                d.division_code
            FROM grama_niladhari g
            LEFT JOIN gn_division d ON g.division_id = d.division_id
            WHERE g.gn_id = ?
        `, [user.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Officer profile not found.' });
        }

        // Map the response for frontend compatibility
        const officerProfile = {
            ...rows[0],
            id: rows[0].gn_id,
            name: rows[0].full_name || `${rows[0].first_name} ${rows[0].last_name}`,
            division: rows[0].division_name || 'Not Assigned',
            profilePhoto: rows[0].profile_photo_path || null,
            gnFront: rows[0].gn_front_path || null,
            gnBack: rows[0].gn_back_path || null,
        };

        return res.json(officerProfile);
    } catch (error) {
        console.error('Error fetching officer profile:', error);
        return res.status(500).json({ error: 'Server error fetching officer profile.' });
    }
};

// PUT /api/users/officer/profile
exports.updateOfficerProfile = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'OFFICER') {
        return res.status(403).json({ error: 'Access denied. Officers only.' });
    }

    const { fullName, email, mobile, password } = req.body;

    try {
        // Check email not taken by another officer
        const [existing] = await db.query(
            'SELECT gn_id FROM grama_niladhari WHERE email = ? AND officer_id != ?', [email, user.id]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email is already used by another officer.' });
        }

        if (password && password.trim()) {
            const hashed = await bcrypt.hash(password, 10);
            await db.query(`
                UPDATE grama_niladhari
                SET full_name = ?, email = ?, mobile = ?, password_hash = ?
                WHERE officer_id = ?
            `, [fullName, email, mobile, hashed, user.id]);
        } else {
            await db.query(`
                UPDATE grama_niladhari
                SET full_name = ?, email = ?, mobile = ?
                WHERE officer_id = ?
            `, [fullName, email, mobile, user.id]);
        }

        return res.json({ message: 'Officer profile updated successfully.' });
    } catch (error) {
        console.error('Error updating officer profile:', error);
        return res.status(500).json({ error: 'Server error updating profile.' });
    }
};

// ============================================================
// OFFICER DASHBOARD STATS
// ============================================================

// GET /api/users/officer/dashboard-stats
exports.getOfficerDashboardStats = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        let gnId = null;
        if (user.role === 'OFFICER') {
            const [officer] = await db.query('SELECT gn_id FROM grama_niladhari WHERE officer_id = ?', [user.id]);
            if (officer.length === 0) return res.status(404).json({ error: 'Officer not found.' });
            gnId = officer[0].gn_id;
        }

        const gnFilter = gnId ? 'AND gn_id = ?' : '';
        const p = gnId ? [gnId] : [];

        const [[pendingCerts]] = await db.query(`SELECT COUNT(*) AS count FROM certificate_pending WHERE 1=1 ${gnFilter}`, p);
        const [[pendingAppts]] = await db.query(`SELECT COUNT(*) AS count FROM appointment_pending WHERE 1=1 ${gnFilter}`, p);
        const [[pendingAllowances]] = await db.query(`SELECT COUNT(*) AS count FROM allowance_pending WHERE 1=1 ${gnFilter}`, p);
        const [[pendingDisasters]] = await db.query(`SELECT COUNT(*) AS count FROM disaster_pending WHERE 1=1 ${gnFilter}`, p);

        // Total residents in division
        let residentCount = 0;
        if (gnId) {
            const [officer] = await db.query('SELECT division_id FROM grama_niladhari WHERE gn_id = ?', [gnId]);
            if (officer.length > 0) {
                const [[rc]] = await db.query(`
                    SELECT COUNT(*) AS count FROM resident r
                    JOIN household h ON r.household_number = h.household_number
                    WHERE h.division_id = ? AND r.status = 'Active'
                `, [officer[0].division_id]);
                residentCount = rc.count;
            }
        } else {
            const [[rc]] = await db.query("SELECT COUNT(*) AS count FROM resident WHERE status = 'Active'");
            residentCount = rc.count;
        }

        // Today's approved appointments
        const today = new Date().toISOString().split('T')[0];
        const [[todayAppts]] = await db.query(
            `SELECT COUNT(*) AS count FROM appointment_approved WHERE date = ? ${gnFilter}`,
            gnId ? [today, gnId] : [today]
        );

        return res.json({
            pendingCertificates: pendingCerts.count,
            pendingAppointments: pendingAppts.count,
            pendingAllowances: pendingAllowances.count,
            pendingDisasters: pendingDisasters.count,
            totalResidents: residentCount,
            todayAppointments: todayAppts.count
        });
    } catch (error) {
        console.error('Error fetching officer dashboard stats:', error);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// ============================================================
// PUBLIC ANNOUNCEMENT FEED (for resident dashboard, no auth needed)
// ============================================================

// GET /api/announcements/feed
exports.getPublicAnnouncementFeed = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT a.announcement_id, a.title, a.description, a.type, a.priority, a.date,
                   g.full_name AS officer_name, d.name AS division_name
            FROM announcement a
            JOIN grama_niladhari g ON a.gn_id = g.gn_id
            JOIN gn_division d ON g.division_id = d.division_id
            WHERE a.is_active = TRUE
            ORDER BY a.date DESC
            LIMIT 10
        `);
        return res.json(rows);
    } catch (error) {
        console.error('Error fetching public announcement feed:', error);
        return res.status(500).json({ error: 'Server error fetching announcements.' });
    }
};

// ============================================================
// ANNOUNCEMENTS
// ============================================================

// GET /api/announcements/officer  (also used as /api/users/officer/announcements)
exports.getAnnouncements = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        let gnId = null;
        if (user.role === 'OFFICER') {
            const [officer] = await db.query('SELECT gn_id FROM grama_niladhari WHERE officer_id = ?', [user.id]);
            if (officer.length === 0) return res.status(404).json({ error: 'Officer not found.' });
            gnId = officer[0].gn_id;
        }

        const filter = gnId ? 'WHERE a.gn_id = ?' : '';
        const params = gnId ? [gnId] : [];

        const [rows] = await db.query(`
            SELECT a.*, g.full_name AS officer_name, d.name AS division_name
            FROM announcement a
            JOIN grama_niladhari g ON a.gn_id = g.gn_id
            JOIN gn_division d ON g.division_id = d.division_id
            ${filter}
            ORDER BY a.date DESC
        `, params);

        return res.json(rows);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return res.status(500).json({ error: 'Server error fetching announcements.' });
    }
};

// POST /api/announcements/publish
exports.createAnnouncement = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const { title, description, type, priority, expiresAt } = req.body;

    if (!title || !description || !type) {
        return res.status(400).json({ error: 'title, description, and type are required.' });
    }

    try {
        let gnId = null;
        if (user.role === 'OFFICER') {
            const [officer] = await db.query('SELECT gn_id FROM grama_niladhari WHERE officer_id = ?', [user.id]);
            if (officer.length === 0) return res.status(404).json({ error: 'Officer not found.' });
            gnId = officer[0].gn_id;
        } else {
            // For admin, get first active officer's gnId or use user.id
            gnId = user.id;
        }

        const annNumber = generateAnnouncementNumber();
        const today = new Date().toISOString().split('T')[0];

        const validTypes = ['HEALTH', 'UTILITIES', 'EDUCATION', 'TRANSPORT', 'ENVIRONMENT', 'SOCIAL_WELFARE', 'OTHER'];
        const annType = validTypes.includes(type.toUpperCase()) ? type.toUpperCase() : 'OTHER';
        const annPriority = ['LOW', 'MEDIUM', 'HIGH'].includes((priority || '').toUpperCase())
            ? priority.toUpperCase() : 'MEDIUM';

        await db.query(`
            INSERT INTO announcement (announcement_number, title, date, description, type, priority, gn_id, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [annNumber, title, today, description, annType, annPriority, gnId, expiresAt || null]);

        return res.status(201).json({ message: 'Announcement published successfully.', announcementNumber: annNumber });
    } catch (error) {
        console.error('Error creating announcement:', error);
        return res.status(500).json({ error: 'Server error creating announcement.' });
    }
};

// PUT /api/announcements/:id
exports.updateAnnouncement = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const { id } = req.params;
    const { title, description, type, priority, isActive } = req.body;

    try {
        const validTypes = ['HEALTH', 'UTILITIES', 'EDUCATION', 'TRANSPORT', 'ENVIRONMENT', 'SOCIAL_WELFARE', 'OTHER'];
        const annType = type && validTypes.includes(type.toUpperCase()) ? type.toUpperCase() : 'OTHER';

        const [result] = await db.query(`
            UPDATE announcement
            SET title = ?, description = ?, type = ?, priority = ?, is_active = ?
            WHERE announcement_id = ?
        `, [title, description, annType, priority || 'MEDIUM', isActive !== undefined ? isActive : true, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Announcement not found.' });
        }

        return res.json({ message: 'Announcement updated successfully.' });
    } catch (error) {
        console.error('Error updating announcement:', error);
        return res.status(500).json({ error: 'Server error updating announcement.' });
    }
};

// DELETE /api/announcements/:id
exports.deleteAnnouncement = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const { id } = req.params;

    try {
        const [result] = await db.query(
            'UPDATE announcement SET is_active = FALSE WHERE announcement_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Announcement not found.' });
        }

        return res.json({ message: 'Announcement deleted (deactivated) successfully.' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        return res.status(500).json({ error: 'Server error deleting announcement.' });
    }
};
