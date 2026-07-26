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
        let [rows] = await db.query(`
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
            WHERE g.gn_id = ? OR g.email = ? OR g.username = ?
        `, [user.id, user.email || user.id, user.id]);

        if (rows.length === 0) {
            // Fallback profile from token data if DB entry not found directly
            const fallbackProfile = {
                gn_id: user.id || 'GN-001',
                first_name: user.name ? user.name.split(' ')[0] : 'GN',
                last_name: user.name ? user.name.split(' ').slice(1).join(' ') : 'Officer',
                full_name: user.name || 'GN Officer',
                email: user.email || '',
                division_name: user.divisionName || 'Assigned Division',
                division: user.divisionName || 'Assigned Division',
                gnFront: null,
                gnBack: null,
            };
            return res.json(fallbackProfile);
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

// PUT /api/officer/profile
exports.updateOfficerProfile = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'OFFICER') {
        return res.status(403).json({ error: 'Access denied. Officers only.' });
    }

    const { firstName, lastName, fullName, email, mobile, password } = req.body;

    // ✅ Validate required fields
    if (!firstName || !lastName || !email || !mobile) {
        return res.status(400).json({ error: 'First name, last name, email, and mobile are required.' });
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    // ✅ Validate mobile format (Sri Lankan mobile numbers)
    const mobileRegex = /^(0[7][0-9]{8})$/;
    if (!mobileRegex.test(mobile)) {
        return res.status(400).json({ error: 'Invalid mobile number format. Use 07XXXXXXXX.' });
    }

    try {
        // ✅ Check if email is already taken by another officer (using gn_id)
        const [existing] = await db.query(
            'SELECT gn_id FROM grama_niladhari WHERE email = ? AND gn_id != ?',
            [email, user.id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email is already used by another officer.' });
        }

        // ✅ Build update query
        const updates = [];
        const values = [];

        updates.push('first_name = ?');
        values.push(firstName);

        updates.push('last_name = ?');
        values.push(lastName);

        // ✅ Full name: if not provided, combine first and last name
        const fullNameToSave = fullName || `${firstName} ${lastName}`;
        updates.push('full_name = ?');
        values.push(fullNameToSave);

        updates.push('email = ?');
        values.push(email);

        updates.push('mobile = ?');
        values.push(mobile);

        // ✅ Handle password update if provided
        if (password && password.trim() !== '') {
            // Validate password strength
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password_hash = ?');
            values.push(hashedPassword);
        }

        // ✅ Execute update (using gn_id)
        values.push(user.id);
        const query = `UPDATE grama_niladhari SET ${updates.join(', ')} WHERE gn_id = ?`;
        
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Officer not found.' });
        }

        // ✅ Fetch updated profile
        const [updatedRows] = await db.query(`
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
                d.name AS division_name
            FROM grama_niladhari g
            LEFT JOIN gn_division d ON g.division_id = d.division_id
            WHERE g.gn_id = ?
        `, [user.id]);

        return res.json({
            success: true,
            message: 'Officer profile updated successfully.',
            data: updatedRows[0]
        });
    } catch (error) {
        console.error('Error updating officer profile:', error);
        return res.status(500).json({ error: 'Server error updating profile.' });
    }
};

// ============================================================
// OFFICER DASHBOARD STATS
// ============================================================

// GET /api/officer/dashboard-stats
exports.getOfficerDashboardStats = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        let divisionId = user.divisionId || null;
        let gnId = user.id || null;

        if (user.role === 'OFFICER') {
            // Get officer's division_id and gn_id
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
                console.error('Error fetching officer for dashboard stats:', err);
            }
        }

        // ============================================================
        // 1. TOTAL RESIDENTS in officer's division
        // ============================================================
        let totalResidents = 0;
        try {
            if (divisionId) {
                const [residentCount] = await db.query(`
                    SELECT COUNT(*) AS count 
                    FROM resident r
                    LEFT JOIN household h ON r.household_number = h.household_number
                    WHERE (r.division_id = ? OR h.division_id = ?) AND (r.status = 'Active' OR r.status IS NULL)
                `, [divisionId, divisionId]);
                totalResidents = residentCount[0]?.count || 0;
            } else {
                const [residentCount] = await db.query(
                    "SELECT COUNT(*) AS count FROM resident WHERE status = 'Active' OR status IS NULL"
                );
                totalResidents = residentCount[0]?.count || 0;
            }
        } catch (err) {
            console.error('Error counting residents for stats:', err);
        }

        // ============================================================
        // 2. TOTAL PENDING REQUESTS (All types combined)
        // ============================================================
        let pendingCertificates = 0;
        let pendingAppointments = 0;
        let pendingAllowances = 0;
        let pendingDisasters = 0;

        if (divisionId || gnId) {
            // Pending Certificates
            try {
                const [certCount] = await db.query(`
                    SELECT COUNT(*) AS count 
                    FROM certificate_pending cp
                    LEFT JOIN resident r ON cp.resident_nic = r.r_nic
                    LEFT JOIN household h ON r.household_number = h.household_number
                    WHERE cp.gn_id = ? OR r.division_id = ? OR h.division_id = ?
                `, [gnId, divisionId, divisionId]);
                pendingCertificates = certCount[0]?.count || 0;
            } catch (err) {
                console.error('Error counting pending certificates:', err);
            }

            // Pending Appointments
            try {
                const [apptCount] = await db.query(`
                    SELECT COUNT(*) AS count 
                    FROM appointment_pending ap
                    LEFT JOIN resident r ON ap.resident_nic = r.r_nic
                    LEFT JOIN household h ON r.household_number = h.household_number
                    WHERE ap.gn_id = ? OR r.division_id = ? OR h.division_id = ?
                `, [gnId, divisionId, divisionId]);
                pendingAppointments = apptCount[0]?.count || 0;
            } catch (err) {
                console.error('Error counting pending appointments:', err);
            }

            // Pending Allowances
            try {
                const [allowCount] = await db.query(`
                    SELECT COUNT(*) AS count 
                    FROM allowance_pending al
                    LEFT JOIN resident r ON al.resident_nic = r.r_nic
                    LEFT JOIN household h ON r.household_number = h.household_number
                    WHERE al.gn_id = ? OR r.division_id = ? OR h.division_id = ?
                `, [gnId, divisionId, divisionId]);
                pendingAllowances = allowCount[0]?.count || 0;
            } catch (err) {
                console.error('Error counting pending allowances:', err);
            }

            // Pending Disasters
            try {
                const [disasterCount] = await db.query(`
                    SELECT COUNT(*) AS count 
                    FROM disaster_pending dp
                    LEFT JOIN resident r ON dp.resident_nic = r.r_nic
                    LEFT JOIN household h ON r.household_number = h.household_number
                    WHERE dp.gn_id = ? OR r.division_id = ? OR h.division_id = ?
                `, [gnId, divisionId, divisionId]);
                pendingDisasters = disasterCount[0]?.count || 0;
            } catch (err) {
                console.error('Error counting pending disasters:', err);
            }
        } else {
            // Admin - all pending requests
            try {
                const [certCount] = await db.query("SELECT COUNT(*) AS count FROM certificate_pending");
                pendingCertificates = certCount[0]?.count || 0;
            } catch (e) {}

            try {
                const [apptCount] = await db.query("SELECT COUNT(*) AS count FROM appointment_pending");
                pendingAppointments = apptCount[0]?.count || 0;
            } catch (e) {}

            try {
                const [allowCount] = await db.query("SELECT COUNT(*) AS count FROM allowance_pending");
                pendingAllowances = allowCount[0]?.count || 0;
            } catch (e) {}

            try {
                const [disasterCount] = await db.query("SELECT COUNT(*) AS count FROM disaster_pending");
                pendingDisasters = disasterCount[0]?.count || 0;
            } catch (e) {}
        }

        // ============================================================
        // 3. TOTAL PENDING REQUESTS (Combined)
        // ============================================================
        const totalPendingRequests = pendingCertificates + pendingAppointments + pendingAllowances + pendingDisasters;

        // ============================================================
        // 4. ACTIVE DISASTERS (Pending + Approved = Active)
        // ============================================================
        let activeDisasters = 0;
        try {
            if (divisionId || gnId) {
                const [activeCount] = await db.query(`
                    SELECT COUNT(*) AS count 
                    FROM (
                        SELECT disaster_id FROM disaster_pending dp
                        LEFT JOIN resident r ON dp.resident_nic = r.r_nic
                        LEFT JOIN household h ON r.household_number = h.household_number
                        WHERE dp.gn_id = ? OR r.division_id = ? OR h.division_id = ?
                        UNION ALL
                        SELECT disaster_id FROM disaster_approved da
                        LEFT JOIN resident r ON da.resident_nic = r.r_nic
                        LEFT JOIN household h ON r.household_number = h.household_number
                        WHERE da.gn_id = ? OR r.division_id = ? OR h.division_id = ?
                    ) AS active_disasters
                `, [gnId, divisionId, divisionId, gnId, divisionId, divisionId]);
                activeDisasters = activeCount[0]?.count || 0;
            } else {
                const [activeCount] = await db.query(`
                    SELECT COUNT(*) AS count 
                    FROM (
                        SELECT disaster_id FROM disaster_pending
                        UNION ALL
                        SELECT disaster_id FROM disaster_approved
                    ) AS active_disasters
                `);
                activeDisasters = activeCount[0]?.count || 0;
            }
        } catch (err) {
            console.error('Error counting active disasters:', err);
        }

        // ============================================================
        // RETURN RESPONSE
        // ============================================================
        return res.json({
            totalResidents: totalResidents,
            totalPendingRequests: totalPendingRequests,
            pendingCertificates: pendingCertificates,
            pendingAppointments: pendingAppointments,
            pendingAllowances: pendingAllowances,
            pendingDisasters: pendingDisasters,
            activeDisasters: activeDisasters,
        });

    } catch (error) {
        console.error('Error fetching officer dashboard stats:', error);
        return res.status(500).json({ error: 'Server error fetching dashboard stats.' });
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
