// Backend/src/controllers/residentController.js
const db = require('../config/database');
const fs = require('fs');
const path = require('path');

// ============================================================
// HELPER: DELETE IMAGE FILE
// ============================================================
const deleteImageFile = (imagePath) => {
    if (!imagePath) return;
    try {
        // Handle both relative paths and full URLs
        let filePath = imagePath;
        
        // If it's a URL with http, extract the path
        if (imagePath.startsWith('http')) {
            const url = new URL(imagePath);
            filePath = url.pathname;
        }
        
        // Remove leading slash if present
        if (filePath.startsWith('/')) {
            filePath = filePath.substring(1);
        }
        
        // Build full path - images are directly in uploads folder
        let fullPath;
        if (filePath.startsWith('uploads/')) {
            fullPath = path.join(__dirname, '../..', filePath);
        } else {
            fullPath = path.join(__dirname, '../../uploads', filePath);
        }
        
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`✅ Deleted image: ${fullPath}`);
            return true;
        } else {
            console.log(`⚠️ Image not found: ${fullPath}`);
            return false;
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        return false;
    }
};

// ============================================================
// HELPER: SAVE BASE64 IMAGE - DIRECTLY IN UPLOADS FOLDER
// ============================================================
const saveBase64Image = (base64String, prefix, identifier) => {
    if (!base64String) return null;
    
    // Check if it's already a URL/path (not base64)
    if (typeof base64String === 'string' && !base64String.startsWith('data:image/')) {
        return base64String;
    }
    
    try {
        // Extract image type and data
        const matches = base64String.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            console.error('Invalid base64 image format');
            return null;
        }
        
        const extension = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Create uploads folder if it doesn't exist
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        // Generate unique filename - directly in uploads folder
        const timestamp = Date.now();
        const random = Math.floor(1000 + Math.random() * 9000);
        const filename = `${prefix}_${identifier}_${timestamp}_${random}.${extension}`;
        const filePath = path.join(uploadDir, filename);
        
        // Save file
        fs.writeFileSync(filePath, buffer);
        
        // Return relative path for database storage
        return `/uploads/${filename}`;
    } catch (error) {
        console.error('Error saving image:', error);
        return null;
    }
};

// ============================================================
// GET PROFILE
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

        // Ensure image paths are properly formatted
        const result = rows[0];
        result.profile_photo_path = result.profile_photo_path || null;
        result.nic_front_path = result.nic_front_path || null;
        result.nic_back_path = result.nic_back_path || null;

        return res.json(result);
    } catch (error) {
        console.error('Error fetching resident profile:', error);
        return res.status(500).json({ error: 'Server error fetching profile.' });
    }
};

// ============================================================
// UPDATE PROFILE
// ============================================================
exports.updateProfile = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const { 
        firstName, 
        lastName, 
        fullName, 
        mobile, 
        occupation, 
        homeAddress, 
        profilePhoto, 
        nicFront, 
        nicBack 
    } = req.body;

    try {
        // First, get current profile to check existing images
        const [currentProfile] = await db.query(
            'SELECT profile_photo_path, nic_front_path, nic_back_path FROM resident WHERE r_nic = ?',
            [user.id]
        );

        const updates = [];
        const values = [];

        // Text fields
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

        // ✅ Profile Photo - Handle remove, update, or keep
        if (profilePhoto !== undefined) {
            const currentPhoto = currentProfile.length > 0 ? currentProfile[0].profile_photo_path : null;
            
            if (profilePhoto === null || profilePhoto === '') {
                // User wants to remove the photo
                if (currentPhoto) {
                    deleteImageFile(currentPhoto);
                }
                updates.push('profile_photo_path = ?');
                values.push(null);
            } else if (typeof profilePhoto === 'string' && profilePhoto.startsWith('data:image/')) {
                // ✅ New photo uploaded (base64) - DELETE OLD PHOTO FIRST
                if (currentPhoto) {
                    deleteImageFile(currentPhoto);
                }
                const photoPath = saveBase64Image(profilePhoto, 'profile', user.id);
                if (photoPath) {
                    updates.push('profile_photo_path = ?');
                    values.push(photoPath);
                }
            } else {
                // Keep existing path
                updates.push('profile_photo_path = ?');
                values.push(profilePhoto);
            }
        }

        // ✅ NIC Front - Handle remove, update, or keep
        if (nicFront !== undefined) {
            const currentFront = currentProfile.length > 0 ? currentProfile[0].nic_front_path : null;
            
            if (nicFront === null || nicFront === '') {
                // User wants to remove the photo
                if (currentFront) {
                    deleteImageFile(currentFront);
                }
                updates.push('nic_front_path = ?');
                values.push(null);
            } else if (typeof nicFront === 'string' && nicFront.startsWith('data:image/')) {
                // ✅ New photo uploaded (base64) - DELETE OLD PHOTO FIRST
                if (currentFront) {
                    deleteImageFile(currentFront);
                }
                const frontPath = saveBase64Image(nicFront, 'nic_front', user.id);
                if (frontPath) {
                    updates.push('nic_front_path = ?');
                    values.push(frontPath);
                }
            } else {
                // Keep existing path
                updates.push('nic_front_path = ?');
                values.push(nicFront);
            }
        }

        // ✅ NIC Back - Handle remove, update, or keep
        if (nicBack !== undefined) {
            const currentBack = currentProfile.length > 0 ? currentProfile[0].nic_back_path : null;
            
            if (nicBack === null || nicBack === '') {
                // User wants to remove the photo
                if (currentBack) {
                    deleteImageFile(currentBack);
                }
                updates.push('nic_back_path = ?');
                values.push(null);
            } else if (typeof nicBack === 'string' && nicBack.startsWith('data:image/')) {
                // ✅ New photo uploaded (base64) - DELETE OLD PHOTO FIRST
                if (currentBack) {
                    deleteImageFile(currentBack);
                }
                const backPath = saveBase64Image(nicBack, 'nic_back', user.id);
                if (backPath) {
                    updates.push('nic_back_path = ?');
                    values.push(backPath);
                }
            } else {
                // Keep existing path
                updates.push('nic_back_path = ?');
                values.push(nicBack);
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update.' });
        }

        // Execute update
        values.push(user.id);
        const query = `UPDATE resident SET ${updates.join(', ')} WHERE r_nic = ? OR email = ?`;
        values.push(user.email || user.id);
        
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Resident not found.' });
        }

        // Sync household address if homeAddress was updated
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

        // Fetch updated profile
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
                r.profile_photo_filename,
                r.nic_front_filename,
                r.nic_back_filename,
                r.status,
                r.email_verified,
                r.nic_verified,
                r.created_at,
                d.name AS division_name
            FROM resident r
            JOIN gn_division d ON r.division_id = d.division_id
            WHERE r.r_nic = ?
        `, [user.id]);

        // Ensure image paths are properly formatted
        const updatedData = updatedRows[0] || null;
        if (updatedData) {
            updatedData.profile_photo_path = updatedData.profile_photo_path || null;
            updatedData.nic_front_path = updatedData.nic_front_path || null;
            updatedData.nic_back_path = updatedData.nic_back_path || null;
        }

        return res.json({ 
            success: true,
            message: 'Profile updated successfully.',
            data: updatedData
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ 
            error: 'Server error updating profile.',
            details: error.message 
        });
    }
};

// ============================================================
// GET DASHBOARD STATS
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
    let pendingDisasters = 0, approvedDisasters = 0;
    let familyCount = 0;
    let upcomingAppts = 0;

    try {
        // Certificate counts
        try {
            const [rows] = await db.query(
                'SELECT COUNT(*) AS count FROM certificate_pending WHERE resident_nic = ?',
                [nic]
            );
            pendingCerts = rows[0]?.count || 0;
        } catch (e) { /* Table might not exist */ }

        try {
            const [rows] = await db.query(
                'SELECT COUNT(*) AS count FROM certificate_approved WHERE resident_nic = ?',
                [nic]
            );
            approvedCerts = rows[0]?.count || 0;
        } catch (e) { /* Table might not exist */ }

        // Appointment counts
        try {
            const [rows] = await db.query(
                'SELECT COUNT(*) AS count FROM appointment_pending WHERE resident_nic = ?',
                [nic]
            );
            pendingAppts = rows[0]?.count || 0;
        } catch (e) { /* Table might not exist */ }

        try {
            const [rows] = await db.query(
                'SELECT COUNT(*) AS count FROM appointment_approved WHERE resident_nic = ?',
                [nic]
            );
            approvedAppts = rows[0]?.count || 0;
        } catch (e) { /* Table might not exist */ }

        // Get upcoming appointments (from tomorrow onwards)
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const year = tomorrow.getFullYear();
            const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
            const day = String(tomorrow.getDate()).padStart(2, '0');
            const tomorrowStr = `${year}-${month}-${day}`;

            const [rows] = await db.query(
                `SELECT COUNT(*) AS count 
                 FROM appointment_approved 
                 WHERE resident_nic = ? AND date >= ?`,
                [nic, tomorrowStr]
            );
            upcomingAppts = rows[0]?.count || 0;
            
            console.log(`📅 Upcoming appointments for ${nic}: ${upcomingAppts} (from ${tomorrowStr})`);
        } catch (e) { 
            console.log('Error counting upcoming appointments:', e.message);
            upcomingAppts = 0;
        }

        // Allowance counts
        try {
            const [rows] = await db.query(
                'SELECT COUNT(*) AS count FROM allowance_pending WHERE resident_nic = ?',
                [nic]
            );
            pendingAllowances = rows[0]?.count || 0;
        } catch (e) { /* Table might not exist */ }

        try {
            const [rows] = await db.query(
                'SELECT COUNT(*) AS count FROM allowance_approved WHERE resident_nic = ?',
                [nic]
            );
            approvedAllowances = rows[0]?.count || 0;
        } catch (e) { /* Table might not exist */ }

        // Disaster counts
        try {
            const [rows] = await db.query(
                'SELECT COUNT(*) AS count FROM disaster_pending WHERE resident_nic = ?',
                [nic]
            );
            pendingDisasters = rows[0]?.count || 0;
        } catch (e) { /* Table might not exist */ }

        // Add disaster approved count
        try {
            const [rows] = await db.query(
                'SELECT COUNT(*) AS count FROM disaster_approved WHERE resident_nic = ?',
                [nic]
            );
            approvedDisasters = rows[0]?.count || 0;
        } catch (e) { /* Table might not exist */ }

        // Family member count
        try {
            const [rows] = await db.query(
                'SELECT COUNT(*) AS count FROM family_member WHERE resident_nic = ? AND is_active = TRUE',
                [nic]
            );
            familyCount = rows[0]?.count || 0;
        } catch (e) { /* Table might not exist */ }

        return res.json({
            certificates: {
                pending: pendingCerts,
                approved: approvedCerts
            },
            appointments: {
                pending: pendingAppts,
                approved: approvedAppts,
                upcoming: upcomingAppts
            },
            allowances: {
                pending: pendingAllowances,
                approved: approvedAllowances
            },
            disasters: {
                pending: pendingDisasters,
                approved: approvedDisasters
            },
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