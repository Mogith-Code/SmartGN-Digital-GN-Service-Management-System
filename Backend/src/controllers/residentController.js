// Backend/src/controllers/residentController.js
const db = require('../config/database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'smartgn_jwt_secret_key_987654321';

const getUserFromToken = (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;
    try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
};

// ============================================================
// DASHBOARD STATS
// ============================================================

// GET /api/residents/dashboard-stats
exports.getDashboardStats = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const nic = user.id;

    try {
        // Get pending certificates
        const [pendingCerts] = await db.query(
            'SELECT COUNT(*) AS count FROM certificate_pending WHERE resident_nic = ?',
            [nic]
        );

        // Get approved certificates
        const [approvedCerts] = await db.query(
            'SELECT COUNT(*) AS count FROM certificate_approved WHERE resident_nic = ?',
            [nic]
        );

        // Get pending appointments
        const [pendingAppts] = await db.query(
            'SELECT COUNT(*) AS count FROM appointment_pending WHERE resident_nic = ?',
            [nic]
        );

        // Get approved appointments
        const [approvedAppts] = await db.query(
            'SELECT COUNT(*) AS count FROM appointment_approved WHERE resident_nic = ?',
            [nic]
        );

        // Get pending allowances
        const [pendingAllow] = await db.query(
            'SELECT COUNT(*) AS count FROM allowance_pending WHERE resident_nic = ?',
            [nic]
        );

        // Get approved allowances
        const [approvedAllow] = await db.query(
            'SELECT COUNT(*) AS count FROM allowance_approved WHERE resident_nic = ?',
            [nic]
        );

        // Get pending disasters
        const [pendingDisaster] = await db.query(
            'SELECT COUNT(*) AS count FROM disaster_pending WHERE resident_nic = ?',
            [nic]
        );

        // Get family members count
        const [familyCount] = await db.query(
            'SELECT COUNT(*) AS count FROM family_member WHERE resident_nic = ? AND is_active = TRUE',
            [nic]
        );

        // Upcoming appointments (approved and future)
        const [upcomingAppts] = await db.query(
            `SELECT COUNT(*) AS count FROM appointment_approved 
             WHERE resident_nic = ? AND date >= CURDATE()`,
            [nic]
        );

        return res.json({
            certificates: {
                pending: parseInt(pendingCerts[0].count) || 0,
                approved: parseInt(approvedCerts[0].count) || 0
            },
            appointments: {
                pending: parseInt(pendingAppts[0].count) || 0,
                approved: parseInt(approvedAppts[0].count) || 0,
                upcoming: parseInt(upcomingAppts[0].count) || 0
            },
            allowances: {
                pending: parseInt(pendingAllow[0].count) || 0,
                approved: parseInt(approvedAllow[0].count) || 0
            },
            disasters: {
                pending: parseInt(pendingDisaster[0].count) || 0
            },
            familyMembers: parseInt(familyCount[0].count) || 0
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return res.status(500).json({ error: 'Server error fetching dashboard stats.' });
    }
};

// ============================================================
// RESIDENT PROFILE
// ============================================================

// GET /api/residents/profile
exports.getProfile = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    try {
        const [rows] = await db.query(`
            SELECT 
                r.r_nic,
                r.first_name,
                r.last_name,
                r.full_name,
                r.date_of_birth,
                r.gender,
                r.mobile_no,
                r.email,
                r.occupation,
                r.household_number,
                r.permanent_address,
                r.current_address,
                r.profile_photo_path,
                r.nic_front_path,
                r.nic_back_path,
                r.profile_photo_filename,
                r.nic_front_filename,
                r.nic_back_filename,
                r.status,
                r.email_verified,
                r.nic_verified,
                r.created_at,
                h.address AS household_address,
                d.name AS division_name,
                d.district,
                d.province,
                d.divisional_secretariat
            FROM resident r
            JOIN household h ON r.household_number = h.household_number
            JOIN gn_division d ON h.division_id = d.division_id
            WHERE r.r_nic = ?
        `, [user.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Resident profile not found.' });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching resident profile:', error);
        return res.status(500).json({ error: 'Server error fetching profile.' });
    }
};

// PUT /api/residents/profile
exports.updateProfile = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const { firstName, lastName, fullName, mobile, occupation, permanentAddress, currentAddress } = req.body;

    try {
        // Build dynamic update query
        const updates = [];
        const values = [];

        if (firstName !== undefined) {
            updates.push('first_name = ?');
            values.push(firstName);
        }
        if (lastName !== undefined) {
            updates.push('last_name = ?');
            values.push(lastName);
        }
        if (fullName !== undefined) {
            updates.push('full_name = ?');
            values.push(fullName);
        }
        if (mobile !== undefined) {
            updates.push('mobile_no = ?');
            values.push(mobile);
        }
        if (occupation !== undefined) {
            updates.push('occupation = ?');
            values.push(occupation || null);
        }
        if (permanentAddress !== undefined) {
            updates.push('permanent_address = ?');
            values.push(permanentAddress || null);
        }
        if (currentAddress !== undefined) {
            updates.push('current_address = ?');
            values.push(currentAddress || null);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update.' });
        }

        values.push(user.id);
        const query = `UPDATE resident SET ${updates.join(', ')} WHERE r_nic = ?`;
        
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Resident not found.' });
        }

        return res.json({ 
            success: true,
            message: 'Profile updated successfully.' 
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ error: 'Server error updating profile.' });
    }
};

// ============================================================
// FAMILY MEMBERS
// ============================================================

// GET /api/residents/family
exports.getFamilyMembers = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        const [rows] = await db.query(`
            SELECT 
                member_id,
                name,
                age,
                relationship,
                nic,
                gender,
                date_of_birth,
                occupation,
                is_active
            FROM family_member
            WHERE resident_nic = ? AND is_active = TRUE
            ORDER BY 
                CASE relationship
                    WHEN 'Head' THEN 1
                    WHEN 'Spouse' THEN 2
                    WHEN 'Son' THEN 3
                    WHEN 'Daughter' THEN 4
                    ELSE 5
                END
        `, [user.id]);

        return res.json(rows);
    } catch (error) {
        console.error('Error fetching family members:', error);
        return res.status(500).json({ error: 'Server error fetching family members.' });
    }
};

// POST /api/residents/family
exports.addFamilyMember = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const { name, age, relationship, nic, gender, dateOfBirth, occupation } = req.body;

    if (!name || !age || !relationship) {
        return res.status(400).json({ error: 'name, age, and relationship are required.' });
    }

    try {
        await db.query(`
            INSERT INTO family_member (name, age, relationship, nic, gender, date_of_birth, occupation, resident_nic)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [name, age, relationship, nic || null, gender || null, dateOfBirth || null, occupation || null, user.id]);

        return res.status(201).json({ message: 'Family member added successfully.' });
    } catch (error) {
        console.error('Error adding family member:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'A family member with this NIC already exists.' });
        }
        return res.status(500).json({ error: 'Server error adding family member.' });
    }
};

// PUT /api/residents/family/:id
exports.updateFamilyMember = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const { id } = req.params;
    const { name, age, relationship, nic, gender, dateOfBirth, occupation } = req.body;

    try {
        const [result] = await db.query(`
            UPDATE family_member
            SET name = ?, age = ?, relationship = ?, nic = ?, gender = ?, date_of_birth = ?, occupation = ?
            WHERE member_id = ? AND resident_nic = ?
        `, [name, age, relationship, nic || null, gender || null, dateOfBirth || null, occupation || null, id, user.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Family member not found or access denied.' });
        }

        return res.json({ message: 'Family member updated successfully.' });
    } catch (error) {
        console.error('Error updating family member:', error);
        return res.status(500).json({ error: 'Server error updating family member.' });
    }
};

// DELETE /api/residents/family/:id
exports.deleteFamilyMember = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const { id } = req.params;

    try {
        const [result] = await db.query(
            'UPDATE family_member SET is_active = FALSE WHERE member_id = ? AND resident_nic = ?',
            [id, user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Family member not found or access denied.' });
        }

        return res.json({ message: 'Family member removed successfully.' });
    } catch (error) {
        console.error('Error deleting family member:', error);
        return res.status(500).json({ error: 'Server error deleting family member.' });
    }
};

// ============================================================
// HOUSEHOLD
// ============================================================

// GET /api/residents/household
exports.getHousehold = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        const [residentRows] = await db.query(
            'SELECT household_number FROM resident WHERE r_nic = ?',
            [user.id]
        );
        if (residentRows.length === 0) {
            return res.status(404).json({ error: 'Resident not found.' });
        }

        const householdNumber = residentRows[0].household_number;

        const [rows] = await db.query(`
            SELECT 
                h.household_number,
                h.address,
                h.total_members,
                h.created_at,
                d.name AS division_name,
                d.district,
                d.province
            FROM household h
            JOIN gn_division d ON h.division_id = d.division_id
            WHERE h.household_number = ?
        `, [householdNumber]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Household not found.' });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching household:', error);
        return res.status(500).json({ error: 'Server error fetching household.' });
    }
};

// PUT /api/residents/household
exports.updateHousehold = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const { address } = req.body;

    if (!address) {
        return res.status(400).json({ error: 'Address is required.' });
    }

    try {
        const [residentRows] = await db.query(
            'SELECT household_number FROM resident WHERE r_nic = ?',
            [user.id]
        );
        if (residentRows.length === 0) {
            return res.status(404).json({ error: 'Resident not found.' });
        }

        const householdNumber = residentRows[0].household_number;

        const [result] = await db.query(
            'UPDATE household SET address = ? WHERE household_number = ?',
            [address, householdNumber]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Household not found.' });
        }

        return res.json({ message: 'Household updated successfully.' });
    } catch (error) {
        console.error('Error updating household:', error);
        return res.status(500).json({ error: 'Server error updating household.' });
    }
};

// ============================================================
// ANNOUNCEMENTS
// ============================================================

// GET /api/residents/announcements
exports.getAnnouncements = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    try {
        let divisionId = null;

        if (user.role === 'RESIDENT') {
            const [rows] = await db.query(`
                SELECT h.division_id
                FROM resident r
                JOIN household h ON r.household_number = h.household_number
                WHERE r.r_nic = ?
            `, [user.id]);
            if (rows.length > 0) divisionId = rows[0].division_id;
        }

        let query = `
            SELECT a.*, g.full_name AS officer_name, d.name AS division_name
            FROM announcement a
            JOIN grama_niladhari g ON a.gn_id = g.gn_id
            JOIN gn_division d ON g.division_id = d.division_id
            WHERE a.is_active = TRUE
        `;

        const params = [];

        if (divisionId) {
            query += ` AND g.division_id = ?`;
            params.push(divisionId);
        }

        query += ` ORDER BY a.date DESC LIMIT 20`;

        const [announcements] = await db.query(query, params);

        return res.json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return res.status(500).json({ error: 'Server error fetching announcements.' });
    }
};