// Backend/src/controllers/officerController.js
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { saveBase64Image } = require('../utils/fileUpload');

// ============================================================
// GENERATE ANNOUNCEMENT NUMBER
// ============================================================
const generateAnnouncementNumber = () => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const rand = Math.floor(100 + Math.random() * 900);
    return `ANN-${date}-${rand}`;
};

// ============================================================
// GET OFFICER PROFILE
// ============================================================
exports.getOfficerProfile = async (req, res) => {
    const user = req.user;
    
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
            WHERE g.gn_id = ? OR g.email = ? OR g.username = ?
        `, [user.id, user.email || user.id, user.id]);

        if (rows.length === 0) {
            return res.json({
                gn_id: user.id || 'GN-001',
                first_name: user.name ? user.name.split(' ')[0] : 'GN',
                last_name: user.name ? user.name.split(' ').slice(1).join(' ') : 'Officer',
                full_name: user.name || 'GN Officer',
                email: user.email || '',
                division_name: user.divisionName || 'Assigned Division',
                division: user.divisionName || 'Assigned Division',
                gnFront: null,
                gnBack: null,
            });
        }

        return res.json({
            ...rows[0],
            id: rows[0].gn_id,
            name: rows[0].full_name || `${rows[0].first_name} ${rows[0].last_name}`,
            division: rows[0].division_name || 'Not Assigned',
            profilePhoto: rows[0].profile_photo_path || null,
            gnFront: rows[0].gn_front_path || null,
            gnBack: rows[0].gn_back_path || null,
        });
    } catch (error) {
        console.error('Error fetching officer profile:', error);
        return res.status(500).json({ error: 'Server error fetching officer profile.' });
    }
};

// ============================================================
// UPDATE OFFICER PROFILE
// ============================================================
exports.updateOfficerProfile = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'OFFICER') {
        return res.status(403).json({ error: 'Access denied. Officers only.' });
    }

    const { firstName, lastName, fullName, email, mobile, password, profilePhoto, idCardFront, idCardBack, gnFront, gnBack } = req.body;

    if (!firstName || !lastName || !email || !mobile) {
        return res.status(400).json({ error: 'First name, last name, email, and mobile are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    const mobileRegex = /^(0[7][0-9]{8})$/;
    if (!mobileRegex.test(mobile)) {
        return res.status(400).json({ error: 'Invalid mobile number format. Use 07XXXXXXXX.' });
    }

    try {
        const [existing] = await db.query(
            'SELECT gn_id FROM grama_niladhari WHERE email = ? AND gn_id != ?',
            [email, user.id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email is already used by another officer.' });
        }

        const updates = [];
        const values = [];

        updates.push('first_name = ?');
        values.push(firstName);

        updates.push('last_name = ?');
        values.push(lastName);

        const fullNameToSave = fullName || `${firstName} ${lastName}`;
        updates.push('full_name = ?');
        values.push(fullNameToSave);

        updates.push('email = ?');
        values.push(email);

        updates.push('mobile = ?');
        values.push(mobile);

        if (password && password.trim() !== '') {
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password_hash = ?');
            values.push(hashedPassword);
        }

        const photoVal = profilePhoto;
        if (photoVal !== undefined && photoVal !== null) {
            const photoPath = saveBase64Image(photoVal, 'officer_profile', user.id);
            updates.push('profile_photo_path = ?');
            values.push(photoPath);
        }

        const frontVal = idCardFront || gnFront;
        if (frontVal !== undefined && frontVal !== null) {
            const frontPath = saveBase64Image(frontVal, 'officer_front', user.id);
            updates.push('gn_front_path = ?');
            values.push(frontPath);
        }

        const backVal = idCardBack || gnBack;
        if (backVal !== undefined && backVal !== null) {
            const backPath = saveBase64Image(backVal, 'officer_back', user.id);
            updates.push('gn_back_path = ?');
            values.push(backPath);
        }

        values.push(user.id);
        const query = `UPDATE grama_niladhari SET ${updates.join(', ')} WHERE gn_id = ?`;
        
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Officer not found.' });
        }

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

        const updatedData = updatedRows[0] || {};
        return res.json({
            success: true,
            message: 'Officer profile updated successfully.',
            data: updatedData,
            profile_photo_path: updatedData.profile_photo_path || null,
            gn_front_path: updatedData.gn_front_path || null,
            gn_back_path: updatedData.gn_back_path || null
        });
    } catch (error) {
        console.error('Error updating officer profile:', error);
        return res.status(500).json({ error: 'Server error updating profile.' });
    }
};

// ============================================================
// GET OFFICER DASHBOARD STATS
// ============================================================
exports.getOfficerDashboardStats = async (req, res) => {
    const user = req.user;
    
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        let divisionId = user.divisionId || null;
        let gnId = user.id || null;

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
                console.error('Error fetching officer for dashboard stats:', err);
            }
        }

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

        let pendingCertificates = 0;
        let pendingAppointments = 0;
        let pendingAllowances = 0;
        let pendingDisasters = 0;

        if (divisionId || gnId) {
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

        const totalPendingRequests = pendingCertificates + pendingAppointments + pendingAllowances + pendingDisasters;

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

        return res.json({
            totalResidents,
            totalPendingRequests,
            pendingCertificates,
            pendingAppointments,
            pendingAllowances,
            pendingDisasters,
            activeDisasters,
        });
    } catch (error) {
        console.error('Error fetching officer dashboard stats:', error);
        return res.status(500).json({ error: 'Server error fetching dashboard stats.' });
    }
};

// ============================================================
// ANNOUNCEMENT FUNCTIONS
// ============================================================

exports.getPublicAnnouncementFeed = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                a.announcement_id,
                a.announcement_number,
                a.title,
                a.date,
                a.description,
                a.type,
                a.priority,
                a.created_at,
                g.full_name AS officer_name,
                d.name AS division_name
            FROM announcement a
            JOIN grama_niladhari g ON a.gn_id = g.gn_id
            JOIN gn_division d ON g.division_id = d.division_id
            WHERE a.is_active = TRUE
            AND (a.expires_at IS NULL OR a.expires_at > NOW())
            ORDER BY a.date DESC, a.priority DESC
            LIMIT 10
        `);
        return res.json(rows);
    } catch (error) {
        console.error('Error fetching public announcement feed:', error);
        return res.status(500).json({ error: 'Server error fetching announcements.' });
    }
};

exports.getAnnouncements = async (req, res) => {
    const user = req.user;
    
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        let gnId = null;
        if (user.role === 'OFFICER') {
            const [officer] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE gn_id = ?',
                [user.id]
            );
            if (officer.length === 0) {
                return res.status(404).json({ error: 'Officer not found.' });
            }
            gnId = officer[0].gn_id;
        }

        const filter = gnId ? 'WHERE a.gn_id = ?' : '';
        const params = gnId ? [gnId] : [];

        const [rows] = await db.query(`
            SELECT 
                a.announcement_id,
                a.announcement_number,
                a.title,
                a.date,
                a.description,
                a.type,
                a.priority,
                a.is_active,
                a.expires_at,
                a.created_at,
                g.full_name AS officer_name,
                d.name AS division_name
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

exports.createAnnouncement = async (req, res) => {
    const user = req.user;
    
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
            const [officer] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE gn_id = ?',
                [user.id]
            );
            if (officer.length === 0) {
                return res.status(404).json({ error: 'Officer not found.' });
            }
            gnId = officer[0].gn_id;
        } else {
            gnId = user.id;
        }

        const annNumber = generateAnnouncementNumber();
        const today = new Date().toISOString().split('T')[0];

        const annType = type ? type.toUpperCase() : 'GENERAL';
        const annPriority = ['LOW', 'MEDIUM', 'HIGH'].includes((priority || '').toUpperCase())
            ? priority.toUpperCase() : 'MEDIUM';

        await db.query(`
            INSERT INTO announcement (
                announcement_number, 
                title, 
                date, 
                description, 
                type, 
                priority, 
                gn_id, 
                expires_at,
                is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)
        `, [annNumber, title, today, description, annType, annPriority, gnId, expiresAt || null]);

        return res.status(201).json({ 
            success: true,
            message: 'Announcement published successfully.',
            data: { announcementNumber: annNumber }
        });
    } catch (error) {
        console.error('Error creating announcement:', error);
        return res.status(500).json({ error: 'Server error creating announcement.' });
    }
};

exports.updateAnnouncement = async (req, res) => {
    const user = req.user;
    
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const { id } = req.params;
    const { title, description, type, priority, isActive, expiresAt } = req.body;

    try {
        const [existing] = await db.query(
            'SELECT gn_id FROM announcement WHERE announcement_id = ?',
            [id]
        );
        
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Announcement not found.' });
        }

        if (user.role === 'OFFICER') {
            const [officer] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE gn_id = ?',
                [user.id]
            );
            if (officer.length > 0 && existing[0].gn_id !== officer[0].gn_id) {
                return res.status(403).json({ error: 'Access denied. You can only update your own announcements.' });
            }
        }

        const annType = type ? type.toUpperCase() : null;

        const updates = [];
        const values = [];

        if (title) { updates.push('title = ?'); values.push(title); }
        if (description) { updates.push('description = ?'); values.push(description); }
        if (annType) { updates.push('type = ?'); values.push(annType); }
        if (priority) { updates.push('priority = ?'); values.push(priority.toUpperCase()); }
        if (isActive !== undefined) { updates.push('is_active = ?'); values.push(isActive); }
        if (expiresAt !== undefined) { updates.push('expires_at = ?'); values.push(expiresAt); }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update.' });
        }

        values.push(id);
        const query = `UPDATE announcement SET ${updates.join(', ')} WHERE announcement_id = ?`;
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Announcement not found.' });
        }

        return res.json({ 
            success: true,
            message: 'Announcement updated successfully.' 
        });
    } catch (error) {
        console.error('Error updating announcement:', error);
        return res.status(500).json({ error: 'Server error updating announcement.' });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    const user = req.user;
    
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const { id } = req.params;

    try {
        const [existing] = await db.query(
            'SELECT gn_id FROM announcement WHERE announcement_id = ?',
            [id]
        );
        
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Announcement not found.' });
        }

        if (user.role === 'OFFICER') {
            const [officer] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE gn_id = ?',
                [user.id]
            );
            if (officer.length > 0 && existing[0].gn_id !== officer[0].gn_id) {
                return res.status(403).json({ error: 'Access denied. You can only delete your own announcements.' });
            }
        }

        const [result] = await db.query(
            'UPDATE announcement SET is_active = FALSE WHERE announcement_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Announcement not found.' });
        }

        return res.json({ 
            success: true,
            message: 'Announcement deleted successfully.' 
        });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        return res.status(500).json({ error: 'Server error deleting announcement.' });
    }
};

// ============================================================
// GET RESIDENT STATISTICS FOR OFFICER'S DIVISION
// ============================================================
exports.getResidentStats = async (req, res) => {
    const user = req.user;
    
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied. Officers only.' });
    }

    try {
        let gnId = null;
        let divisionId = null;
        let totalResidents = 0;
        let totalFamilies = 0;
        let totalBeneficiaries = 0;

        // Get officer's GN ID and division ID
        if (user.role === 'OFFICER') {
            const [officer] = await db.query(
                'SELECT gn_id, division_id FROM grama_niladhari WHERE gn_id = ? OR email = ? OR username = ?',
                [user.id, user.email || user.id, user.id]
            );
            
            if (officer.length === 0) {
                return res.status(404).json({ error: 'Officer not found.' });
            }
            
            gnId = officer[0].gn_id;
            divisionId = officer[0].division_id;
        } else {
            gnId = user.id;
        }

        if (divisionId && gnId) {
            // ✅ 1. Total Residents in the officer's division
            const [residentCount] = await db.query(`
                SELECT COUNT(DISTINCT r.r_nic) AS count 
                FROM resident r
                LEFT JOIN household h ON r.household_number = h.household_number
                WHERE r.division_id = ? OR h.division_id = ?
            `, [divisionId, divisionId]);
            totalResidents = residentCount[0]?.count || 0;

            // ✅ 2. Total Families (Households) in the officer's division
            const [householdCount] = await db.query(`
                SELECT COUNT(*) AS count 
                FROM household 
                WHERE division_id = ?
            `, [divisionId]);
            totalFamilies = householdCount[0]?.count || 0;

            // ✅ 3. Total Beneficiaries - Count from allowance_approved table
            // All records in allowance_approved are approved by default
            const [beneficiaryCount] = await db.query(`
                SELECT COUNT(DISTINCT aa.resident_nic) AS count 
                FROM allowance_approved aa
                LEFT JOIN resident r ON aa.resident_nic = r.r_nic
                LEFT JOIN household h ON r.household_number = h.household_number
                WHERE aa.gn_id = ?
                AND (r.division_id = ? OR h.division_id = ?)
            `, [gnId, divisionId, divisionId]);
            totalBeneficiaries = beneficiaryCount[0]?.count || 0;
        }

        return res.json({
            success: true,
            data: {
                totalResidents,
                totalFamilies,
                totalBeneficiaries
            }
        });

    } catch (error) {
        console.error('Error fetching resident stats:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Server error fetching resident statistics.',
            details: error.message 
        });
    }
};

// ============================================================
// GET ALL RESIDENTS FOR OFFICER'S DIVISION
// ============================================================
exports.getResidents = async (req, res) => {
    const user = req.user;
    
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied. Officers only.' });
    }

    try {
        let divisionId = null;

        // Get officer's division ID
        if (user.role === 'OFFICER') {
            const [officer] = await db.query(
                'SELECT division_id FROM grama_niladhari WHERE gn_id = ? OR email = ?',
                [user.id, user.email || user.id]
            );
            
            if (officer.length === 0) {
                return res.status(404).json({ error: 'Officer not found.' });
            }
            
            divisionId = officer[0].division_id;
        }

        let residents = [];

        if (divisionId) {
            const [rows] = await db.query(`
                SELECT 
                    r.r_nic,
                    r.first_name,
                    r.last_name,
                    r.full_name,
                    r.email,
                    r.mobile_no,
                    r.occupation,
                    r.household_number,
                    r.home_address,
                    r.profile_photo_path,
                    r.status,
                    r.created_at,
                    h.address AS household_address,
                    d.name AS division_name
                FROM resident r
                LEFT JOIN household h ON r.household_number = h.household_number
                LEFT JOIN gn_division d ON r.division_id = d.division_id
                WHERE r.division_id = ? OR h.division_id = ?
                AND (r.status = 'Active' OR r.status IS NULL)
                ORDER BY r.first_name ASC
            `, [divisionId, divisionId]);
            residents = rows;
        }

        return res.json({
            success: true,
            data: residents,
            count: residents.length
        });

    } catch (error) {
        console.error('Error fetching residents:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Server error fetching residents.',
            details: error.message 
        });
    }
};