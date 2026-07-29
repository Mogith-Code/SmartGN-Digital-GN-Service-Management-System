// Backend/src/controllers/residentController.js
const db = require('../config/database');

// ============================================================
// PROFILE MANAGEMENT
// ============================================================

exports.getProfile = async (req, res) => {
    const user = req.user;
    
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
                r.division_id,
                r.home_address,
                r.profile_photo_path,
                r.nic_front_path,
                r.nic_back_path,
                r.status,
                r.email_verified,
                r.nic_verified,
                r.created_at,
                h.address AS household_address,
                d.name AS division_name,
                d.district,
                d.province,
                d.divisional_secretariat,
                d.division_code
            FROM resident r
            LEFT JOIN household h ON r.household_number = h.household_number
            LEFT JOIN gn_division d ON r.division_id = d.division_id
            WHERE r.r_nic = ? OR r.email = ?
        `, [user.id, user.email || user.id]);

        if (rows.length === 0) {
            return res.json({
                r_nic: user.id || '197812345678V',
                first_name: user.name ? user.name.split(' ')[0] : 'Resident',
                last_name: user.name ? user.name.split(' ').slice(1).join(' ') : 'User',
                full_name: user.name || 'Resident User',
                email: user.email || '',
                division_name: user.divisionName || 'Assigned Division',
                division_id: user.divisionId || '',
                household_address: '',
                status: 'Active'
            });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching resident profile:', error);
        return res.status(500).json({ error: 'Server error fetching profile.' });
    }
};

exports.updateProfile = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const { firstName, lastName, fullName, mobile, occupation, homeAddress } = req.body;

    try {
        const updates = [];
        const values = [];

        if (firstName !== undefined && firstName !== '') {
            updates.push('first_name = ?');
            values.push(firstName);
        }
        if (lastName !== undefined && lastName !== '') {
            updates.push('last_name = ?');
            values.push(lastName);
        }
        if (fullName !== undefined) {
            updates.push('full_name = ?');
            values.push(fullName || null);
        }
        if (mobile !== undefined && mobile !== '') {
            updates.push('mobile_no = ?');
            values.push(mobile);
        }
        if (occupation !== undefined) {
            updates.push('occupation = ?');
            values.push(occupation || null);
        }
        if (homeAddress !== undefined) {
            updates.push('home_address = ?');
            values.push(homeAddress || null);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update.' });
        }

        values.push(user.id);
        const query = `UPDATE resident SET ${updates.join(', ')} WHERE r_nic = ? OR email = ?`;
        values.push(user.email || user.id);
        
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Resident not found.' });
        }

        if (homeAddress !== undefined) {
            const [resident] = await db.query(
                'SELECT household_number FROM resident WHERE r_nic = ?',
                [user.id]
            );
            if (resident.length > 0 && resident[0].household_number) {
                await db.query(
                    'UPDATE household SET address = ? WHERE household_number = ?',
                    [homeAddress || null, resident[0].household_number]
                );
            }
        }

        const [updatedRows] = await db.query(`
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
                r.division_id,
                r.home_address,
                r.profile_photo_path,
                r.nic_front_path,
                r.nic_back_path,
                r.status,
                r.email_verified,
                r.nic_verified,
                r.created_at,
                d.name AS division_name
            FROM resident r
            JOIN gn_division d ON r.division_id = d.division_id
            WHERE r.r_nic = ?
        `, [user.id]);

        return res.json({ 
            success: true,
            message: 'Profile updated successfully.',
            data: updatedRows[0] || null
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ error: 'Server error updating profile.' });
    }
};

// ============================================================
// DASHBOARD STATISTICS
// ============================================================

exports.getDashboardStats = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const nic = user.id;
    let pendingCerts = 0, approvedCerts = 0;
    let pendingAppts = 0, approvedAppts = 0;
    let pendingAllowances = 0, approvedAllowances = 0;
    let pendingDisasters = 0, familyCount = 0;

    try {
        const [certPending] = await db.query('SELECT COUNT(*) AS count FROM certificate_pending WHERE resident_nic = ?', [nic]);
        pendingCerts = certPending[0]?.count || 0;

        const [certApproved] = await db.query('SELECT COUNT(*) AS count FROM certificate_approved WHERE resident_nic = ?', [nic]);
        approvedCerts = certApproved[0]?.count || 0;

        const [apptPending] = await db.query('SELECT COUNT(*) AS count FROM appointment_pending WHERE resident_nic = ?', [nic]);
        pendingAppts = apptPending[0]?.count || 0;

        const [apptApproved] = await db.query('SELECT COUNT(*) AS count FROM appointment_approved WHERE resident_nic = ?', [nic]);
        approvedAppts = apptApproved[0]?.count || 0;

        const [allowPending] = await db.query('SELECT COUNT(*) AS count FROM allowance_pending WHERE resident_nic = ?', [nic]);
        pendingAllowances = allowPending[0]?.count || 0;

        const [allowApproved] = await db.query('SELECT COUNT(*) AS count FROM allowance_approved WHERE resident_nic = ?', [nic]);
        approvedAllowances = allowApproved[0]?.count || 0;

        const [disasterPending] = await db.query('SELECT COUNT(*) AS count FROM disaster_pending WHERE resident_nic = ?', [nic]);
        pendingDisasters = disasterPending[0]?.count || 0;

        const [family] = await db.query('SELECT COUNT(*) AS count FROM family_member WHERE resident_nic = ? AND is_active = TRUE', [nic]);
        familyCount = family[0]?.count || 0;

        return res.json({
            certificates: { pending: pendingCerts, approved: approvedCerts },
            appointments: { pending: pendingAppts, approved: approvedAppts },
            allowances: { pending: pendingAllowances, approved: approvedAllowances },
            disasters: { pending: pendingDisasters },
            familyMembers: familyCount
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// ============================================================
// FAMILY MEMBERS CRUD
// ============================================================

exports.getFamilyMembers = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        const [rows] = await db.query(`
            SELECT member_id, name, age, relationship, nic, gender, date_of_birth, occupation
            FROM family_member
            WHERE resident_nic = ? AND is_active = TRUE
            ORDER BY CASE relationship
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

exports.addFamilyMember = async (req, res) => {
    const user = req.user;
    
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

exports.updateFamilyMember = async (req, res) => {
    const user = req.user;
    
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

exports.deleteFamilyMember = async (req, res) => {
    const user = req.user;
    
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
// HOUSEHOLD MANAGEMENT
// ============================================================

exports.getHousehold = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        const [residentRows] = await db.query(`
            SELECT r.household_number, r.home_address, r.first_name, r.last_name, r.full_name, r.r_nic
            FROM resident r
            WHERE r.r_nic = ?
        `, [user.id]);
        
        if (residentRows.length === 0) {
            return res.status(404).json({ error: 'Resident not found.' });
        }

        const resident = residentRows[0];
        const householdNumber = resident.household_number;

        const [rows] = await db.query(`
            SELECT h.household_number, h.address, h.total_members, h.land_size, h.land_owner,
                   h.created_at, h.updated_at, d.name AS division_name, d.district, d.province
            FROM household h
            JOIN gn_division d ON h.division_id = d.division_id
            WHERE h.household_number = ?
        `, [householdNumber]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Household not found.' });
        }

        if (rows[0].address !== resident.home_address) {
            await db.query(
                'UPDATE household SET address = ? WHERE household_number = ?',
                [resident.home_address, householdNumber]
            );
            rows[0].address = resident.home_address;
        }

        return res.json({
            ...rows[0],
            head_of_household: resident.full_name || `${resident.first_name} ${resident.last_name}`,
            head_nic: resident.r_nic
        });
    } catch (error) {
        console.error('Error fetching household:', error);
        return res.status(500).json({ error: 'Server error fetching household.' });
    }
};

exports.updateHousehold = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const { address, land_size, land_owner } = req.body;

    try {
        const [residentRows] = await db.query(
            'SELECT household_number FROM resident WHERE r_nic = ?',
            [user.id]
        );
        if (residentRows.length === 0) {
            return res.status(404).json({ error: 'Resident not found.' });
        }

        const householdNumber = residentRows[0].household_number;
        const updates = [];
        const values = [];

        if (address !== undefined) {
            updates.push('address = ?');
            values.push(address || null);
            await db.query('UPDATE resident SET home_address = ? WHERE r_nic = ?', [address || null, user.id]);
        }
        if (land_size !== undefined) {
            updates.push('land_size = ?');
            values.push(land_size || null);
        }
        if (land_owner !== undefined) {
            updates.push('land_owner = ?');
            values.push(land_owner || null);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update.' });
        }

        values.push(householdNumber);
        const [result] = await db.query(
            `UPDATE household SET ${updates.join(', ')} WHERE household_number = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Household not found.' });
        }

        const [updatedRows] = await db.query(
            'SELECT household_number, address, total_members, land_size, land_owner, created_at FROM household WHERE household_number = ?',
            [householdNumber]
        );

        return res.json({ 
            success: true,
            message: 'Household updated successfully.',
            data: updatedRows[0]
        });
    } catch (error) {
        console.error('Error updating household:', error);
        return res.status(500).json({ error: 'Server error updating household.' });
    }
};

// ============================================================
// ANNOUNCEMENTS
// ============================================================

exports.getAnnouncements = async (req, res) => {
    const user = req.user;
    
    if (!user) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    try {
        let divisionId = user?.divisionId || null;

        if (user && user.role === 'RESIDENT') {
            const [rows] = await db.query(`
                SELECT r.division_id, h.division_id AS h_division_id
                FROM resident r
                LEFT JOIN household h ON r.household_number = h.household_number
                WHERE r.r_nic = ? OR r.email = ?
            `, [user.id, user.email || user.id]);
            if (rows.length > 0) {
                divisionId = rows[0].division_id || rows[0].h_division_id || divisionId;
            }
        }

        let query = `
            SELECT a.*, g.full_name AS officer_name, d.name AS division_name
            FROM announcement a
            LEFT JOIN grama_niladhari g ON a.gn_id = g.gn_id
            LEFT JOIN gn_division d ON g.division_id = d.division_id
            WHERE (a.is_active = TRUE OR a.is_active IS NULL)
        `;

        const params = [];

        if (divisionId) {
            query += ` AND (g.division_id = ? OR a.gn_id IN (SELECT gn_id FROM grama_niladhari WHERE division_id = ?))`;
            params.push(divisionId, divisionId);
        }

        query += ` ORDER BY a.created_at DESC LIMIT 20`;

        const [announcements] = await db.query(query, params);

        return res.json(announcements || []);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return res.json([]);
    }
};