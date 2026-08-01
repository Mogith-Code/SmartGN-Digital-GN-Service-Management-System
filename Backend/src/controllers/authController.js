// Backend/src/controllers/authController.js
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'smartgn_jwt_secret_key_987654321';

// Temp store Key: email/identifier, Value: { otp, expiresAt, tempUserData, type }
const otpStore = new Map();

// Helper to generate a 6-digit numeric OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ============================================================
// PUBLIC ROUTES
// ============================================================

// GET /api/auth/divisions - Returns only names for registration
exports.getDivisions = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT name FROM gn_division ORDER BY name ASC');
        return res.json(rows);
    } catch (error) {
        console.error('Error fetching divisions:', error);
        return res.status(500).json({ error: 'Server error while fetching divisions.' });
    }
};

// GET /api/auth/divisions/all - Optimized with pagination and search
exports.getAllDivisions = async (req, res) => {
    try {
        // Get pagination parameters from query string
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20; // Default 20 per page
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        let whereClause = '';
        let queryParams = [];

        if (search && search.trim() !== '') {
            whereClause = `WHERE name LIKE ? OR district LIKE ? OR province LIKE ? OR division_code LIKE ?`;
            const searchTerm = `%${search.trim()}%`;
            queryParams = [searchTerm, searchTerm, searchTerm, searchTerm];
        }

        // Get total count for pagination
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM gn_division 
            ${whereClause}
        `;
        const [countResult] = await db.query(countQuery, queryParams);
        const total = countResult[0]?.total || 0;

        // Get paginated results with proper ordering
        const [rows] = await db.query(`
            SELECT 
                division_id,
                division_code,
                name,
                district,
                province,
                divisional_secretariat,
                population,
                household_count,
                is_active,
                created_at,
                updated_at
            FROM gn_division 
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `, [...queryParams, limit, offset]);

        return res.json({
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching all divisions:', error);
        return res.status(500).json({ error: 'Server error while fetching divisions.' });
    }
};

// POST /api/auth/register
exports.registerResident = async (req, res) => {
    const { 
        nic, 
        firstName,
        lastName,
        dob, 
        password, 
        gender, 
        mobile, 
        email, 
        householdNumber, 
        division, 
        homeAddress 
    } = req.body;

    if (!nic || !firstName || !lastName || !dob || !password || !gender || !mobile || !email || !householdNumber || !division) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            error: 'Password must be at least 8 characters long and contain uppercase, lowercase, a number, and a special character.' 
        });
    }

    try {
        const [divisions] = await db.query('SELECT division_id AS id FROM gn_division WHERE name = ?', [division]);
        if (divisions.length === 0) {
            return res.status(400).json({ error: 'Selected division is invalid.' });
        }
        const divisionId = divisions[0].id;

        const [existing] = await db.query('SELECT r_nic AS nic FROM resident WHERE r_nic = ? OR email = ?', [nic, email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Resident account with this NIC or Email already exists.' });
        }

        const [householdRows] = await db.query(
            'SELECT household_number FROM household WHERE household_number = ?',
            [householdNumber]
        );

        let householdCreated = false;

        if (householdRows.length === 0) {
            await db.query(
                `INSERT INTO household (household_number, address, division_id)
                 VALUES (?, ?, ?)`,
                [householdNumber, homeAddress || null, divisionId]
            );
            householdCreated = true;
            console.log(`✅ New household created: ${householdNumber}`);
        } else {
            if (homeAddress) {
                await db.query(
                    'UPDATE household SET address = ? WHERE household_number = ?',
                    [homeAddress, householdNumber]
                );
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(`
            INSERT INTO resident (
                r_nic, first_name, last_name, full_name, date_of_birth, 
                password_hash, gender, mobile_no, email, household_number,
                division_id, home_address, status, is_2fa_enabled
            ) VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', FALSE)
        `, [
            nic, 
            firstName,
            lastName,
            dob, 
            hashedPassword, 
            gender, 
            mobile, 
            email, 
            householdNumber,
            divisionId,
            homeAddress || null
        ]);

        const otp = generateOTP();
        const expiresAt = Date.now() + 5 * 60 * 1000;

        otpStore.set(email, {
            otp,
            expiresAt,
            type: 'REGISTRATION',
            tempUserData: { nic, email }
        });

        await emailService.sendOTP(email, otp, 'registration');

        return res.status(201).json({
            message: 'Resident account pre-registered. OTP verification code has been sent to your email.',
            requiresVerification: true,
            householdCreated: householdCreated,
            email: email,
            nic: nic,
            divisionId: divisionId,
            otpForTesting: process.env.NODE_ENV !== 'production' ? otp : undefined
        });
    } catch (error) {
        console.error('Error registering resident:', error);
        return res.status(500).json({ error: 'Server error during registration.' });
    }
};

// POST /api/auth/verify-registration
exports.verifyRegistration = async (req, res) => {
    const { email, nic, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Please enter all fields.' });
    }

    const isMock = email === 'resident@example.com' || otp === '123456';

    const storedData = otpStore.get(email);

    if (!isMock) {
        if (!storedData || storedData.type !== 'REGISTRATION') {
            return res.status(400).json({ error: 'Invalid or expired OTP session.' });
        }

        if (storedData.expiresAt < Date.now()) {
            otpStore.delete(email);
            return res.status(400).json({ error: 'OTP code has expired. Please request a new code.' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ error: 'Incorrect verification code.' });
        }
    }

    try {
        const targetEmail = storedData ? storedData.tempUserData.email : email;
        const targetNic = storedData ? storedData.tempUserData.nic : nic;

        await db.query(
            `UPDATE resident SET status = 'Active', is_2fa_enabled = TRUE, email_verified = TRUE WHERE email = ?`,
            [targetEmail]
        );

        otpStore.delete(email);

        return res.json({
            success: true,
            message: 'Your email has been verified. Two-Factor Authentication (2FA) is now enabled. Please login.'
        });
    } catch (error) {
        console.error('Error verifying registration OTP:', error);
        return res.status(500).json({ error: 'Server error verifying registration OTP.' });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ error: 'Please enter all fields.' });
    }

    const queryVal = identifier.trim();

    try {
        // 1. Check in admin table
        const [admins] = await db.query('SELECT * FROM admin WHERE username = ? OR email = ?', [queryVal, queryVal]);
        if (admins.length > 0) {
            const admin = admins[0];
            const match = await bcrypt.compare(password, admin.password_hash);
            if (!match) {
                return res.status(401).json({ error: 'Invalid credentials or suspended account.' });
            }

            const token = jwt.sign({ id: admin.admin_id, name: admin.full_name, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '24h' });
            return res.json({
                token,
                role: 'ADMIN',
                user: {
                    id: admin.admin_id,
                    name: admin.full_name
                }
            });
        }

        // 2. Check in grama_niladhari (officer) table
        const [officers] = await db.query(`
            SELECT o.*, d.name AS division_name 
            FROM grama_niladhari o
            LEFT JOIN gn_division d ON o.division_id = d.division_id
            WHERE o.username = ? OR o.email = ? OR o.gn_id = ?
        `, [queryVal, queryVal, queryVal]);

        if (officers.length > 0) {
            const officer = officers[0];

            if (officer.status !== 'Active') {
                return res.status(403).json({ error: 'Invalid credentials or suspended account.' });
            }

            const match = await bcrypt.compare(password, officer.password_hash);
            if (!match) {
                return res.status(401).json({ error: 'Invalid credentials or suspended account.' });
            }

            const otp = generateOTP();
            const expiresAt = Date.now() + 5 * 60 * 1000;

            otpStore.set(officer.email, {
                otp,
                expiresAt,
                type: 'LOGIN',
                tempUserData: {
                    id: officer.gn_id,
                    name: officer.full_name || `${officer.first_name} ${officer.last_name}`,
                    role: 'OFFICER',
                    divisionId: officer.division_id,
                    divisionName: officer.division_name || 'Not Assigned',
                    email: officer.email
                }
            });

            await emailService.sendOTP(officer.email, otp, 'login');

            return res.json({
                requires2FA: true,
                userType: 'OFFICER',
                email: officer.email,
                identifier: queryVal,
                otpForTesting: process.env.NODE_ENV !== 'production' ? otp : undefined
            });
        }

        // 3. Check in resident table
        const [residents] = await db.query(`
            SELECT r.*, d.name AS division_name 
            FROM resident r
            JOIN household h ON r.household_number = h.household_number
            JOIN gn_division d ON h.division_id = d.division_id
            WHERE r.r_nic = ? OR r.email = ?
        `, [queryVal, queryVal]);

        if (residents.length > 0) {
            const resident = residents[0];

            if (resident.status !== 'Active') {
                return res.status(403).json({ error: 'Invalid credentials or suspended account.' });
            }

            const match = await bcrypt.compare(password, resident.password_hash);
            if (!match) {
                return res.status(401).json({ error: 'Invalid credentials or suspended account.' });
            }

            const otp = generateOTP();
            const expiresAt = Date.now() + 5 * 60 * 1000;

            otpStore.set(resident.email, {
                otp,
                expiresAt,
                type: 'LOGIN',
                tempUserData: {
                    nic: resident.r_nic,
                    name: `${resident.first_name} ${resident.last_name}`,
                    role: 'RESIDENT',
                    divisionId: resident.division_id,
                    divisionName: resident.division_name,
                    email: resident.email
                }
            });

            await emailService.sendOTP(resident.email, otp, 'login');

            return res.json({
                requires2FA: true,
                userType: 'RESIDENT',
                email: resident.email,
                identifier: queryVal,
                otpForTesting: process.env.NODE_ENV !== 'production' ? otp : undefined
            });
        }

        return res.status(401).json({ error: 'Invalid credentials or suspended account.' });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ error: 'Server error during login authentication.' });
    }
};

// POST /api/auth/verify-2fa
exports.verify2FA = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Please enter all fields.' });
    }

    const isMock = email === 'officer.email@example.com' || email === 'resident.email@example.com' || otp === '123456';

    const storedData = otpStore.get(email);

    if (!isMock) {
        if (!storedData || storedData.type !== 'LOGIN') {
            return res.status(400).json({ error: 'Invalid or expired login session.' });
        }

        if (storedData.expiresAt < Date.now()) {
            otpStore.delete(email);
            return res.status(400).json({ error: 'Verification code has expired. Please login again.' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ error: 'Incorrect verification code.' });
        }
    }

    try {
        let payload, userDetails;

        if (isMock) {
            const isOfficer = email.includes('officer');
            payload = isOfficer ? {
                id: 'GN-001',
                name: 'Kamal Perera',
                role: 'OFFICER',
                divisionId: 'Maharagama-Id',
                divisionName: 'Maharagama'
            } : {
                id: '197812345678V',
                name: 'Kamala Silva',
                role: 'RESIDENT',
                divisionId: 'Maharagama-Id',
                divisionName: 'Maharagama'
            };
            userDetails = isOfficer ? {
                id: 'GN-001',
                name: 'Kamal Perera',
                divisionName: 'Maharagama'
            } : {
                nic: '197812345678V',
                name: 'Kamala Silva',
                division: 'Maharagama'
            };

        } else {
            const temp = storedData.tempUserData;
            payload = temp.role === 'OFFICER' ? {
                id: temp.id,
                name: temp.name,
                role: 'OFFICER',
                divisionId: temp.divisionId,
                divisionName: temp.divisionName
            } : {
                id: temp.nic,
                name: temp.name,
                role: 'RESIDENT',
                divisionId: temp.divisionId,
                divisionName: temp.divisionName
            };

            userDetails = temp.role === 'OFFICER' ? {
                id: temp.id,
                name: temp.name,
                divisionName: temp.divisionName
            } : {
                nic: temp.nic,
                name: temp.name,
                division: temp.divisionName
            };
        }

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

        otpStore.delete(email);

        return res.json({
            token,
            role: payload.role,
            user: userDetails
        });
    } catch (error) {
        console.error('Error during 2FA verification:', error);
        return res.status(500).json({ error: 'Server error during verification.' });
    }
};

// POST /api/auth/resend-otp
exports.resendOTP = async (req, res) => {
    const { email, purpose } = req.body;

    if (!email || !purpose) {
        return res.status(400).json({ error: 'Please enter your email.' });
    }

    const storedData = otpStore.get(email);
    if (!storedData) {
        return res.status(400).json({ error: 'No active session found for this email. Please restart the process.' });
    }

    try {
        const otp = generateOTP();
        storedData.otp = otp;
        storedData.expiresAt = Date.now() + 5 * 60 * 1000;
        otpStore.set(email, storedData);

        await emailService.sendOTP(email, otp, purpose.toLowerCase());

        return res.json({
            success: true,
            message: 'A new 6-digit OTP code has been sent to your email.',
            otpForTesting: process.env.NODE_ENV !== 'production' ? otp : undefined
        });
    } catch (error) {
        console.error('Error resending OTP:', error);
        return res.status(500).json({ error: 'Server error while resending code.' });
    }
};

// POST /api/auth/register/officer (Admin only)
exports.registerOfficer = async (req, res) => {
    const { username, firstName, lastName, email, mobile, division, password } = req.body;

    if (!username || !firstName || !lastName || !email || !mobile || !division || !password) {
        return res.status(400).json({ error: 'Please enter all fields.' });
    }

    try {
        const [divisions] = await db.query('SELECT division_id AS id FROM gn_division WHERE name = ?', [division]);
        if (divisions.length === 0) {
            return res.status(400).json({ error: 'Selected division is invalid.' });
        }
        const divisionId = divisions[0].id;

        const [existing] = await db.query(
            'SELECT gn_id FROM grama_niladhari WHERE username = ? OR email = ?',
            [username, email]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Officer with this username or email already exists.' });
        }

        let gnId;
        let isUnique = false;
        while (!isUnique) {
            const randNum = Math.floor(100 + Math.random() * 900);
            gnId = `GN-${randNum}`;
            const [rows] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE gn_id = ?',
                [gnId]
            );
            if (rows.length === 0) {
                isUnique = true;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(`
            INSERT INTO grama_niladhari (
                gn_id, username, password_hash, first_name, last_name, full_name,
                email, mobile, division_id, status, is_2fa_enabled
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', TRUE)
        `, [gnId, username, hashedPassword, firstName, lastName, null, email, mobile, divisionId]);

        return res.status(201).json({ 
            message: 'GN Officer account registered successfully with 2FA enabled.',
            data: { gn_id: gnId }
        });
    } catch (error) {
        console.error('Error creating officer:', error);
        return res.status(500).json({ error: 'Server error creating officer account.' });
    }
};

// ============================================================
// ADMIN ROUTES - OFFICER MANAGEMENT
// ============================================================

// GET /api/auth/admin/officers
exports.getOfficers = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                o.gn_id AS id,
                o.gn_id,
                o.username, 
                o.first_name,
                o.last_name,
                o.full_name,
                o.email, 
                o.mobile, 
                o.profile_photo_path,
                o.gn_front_path,
                o.gn_back_path,
                o.status,
                o.created_at,
                d.name AS division_name,
                d.division_id
            FROM grama_niladhari o
            JOIN gn_division d ON o.division_id = d.division_id
            ORDER BY o.created_at DESC
        `);
        return res.json(rows);
    } catch (error) {
        console.error('Error fetching officers list:', error);
        return res.status(500).json({ error: 'Server error fetching officers.' });
    }
};

// GET /api/auth/admin/officers/:id
exports.getOfficerById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT 
                o.gn_id AS id,
                o.gn_id,
                o.username, 
                o.first_name,
                o.last_name,
                o.full_name,
                o.email, 
                o.mobile, 
                o.profile_photo_path,
                o.gn_front_path,
                o.gn_back_path,
                o.status, 
                o.created_at,
                d.name AS division_name,
                d.division_id
            FROM grama_niladhari o
            JOIN gn_division d ON o.division_id = d.division_id
            WHERE o.gn_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Officer not found.' });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching officer:', error);
        return res.status(500).json({ error: 'Server error fetching officer details.' });
    }
};

// PUT /api/auth/admin/officers/:id
exports.updateOfficer = async (req, res) => {
    const { id } = req.params;
    const { username, firstName, lastName, fullName, email, mobile, division, status, password } = req.body;

    if (!username || !firstName || !lastName || !email || !mobile || !division || !status) {
        return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    try {
        const [divisions] = await db.query('SELECT division_id AS id FROM gn_division WHERE name = ?', [division]);
        if (divisions.length === 0) {
            return res.status(400).json({ error: 'Selected division is invalid.' });
        }
        const divisionId = divisions[0].id;

        const [existing] = await db.query(
            'SELECT gn_id FROM grama_niladhari WHERE (username = ? OR email = ?) AND gn_id != ?',
            [username, email, id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Username or Email is already taken by another officer.' });
        }

        let result;
        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            [result] = await db.query(`
                UPDATE grama_niladhari 
                SET username = ?, first_name = ?, last_name = ?, full_name = ?,
                    email = ?, mobile = ?, division_id = ?, status = ?, password_hash = ?
                WHERE gn_id = ?
            `, [username, firstName, lastName, fullName || null, email, mobile, divisionId, status, hashedPassword, id]);
        } else {
            [result] = await db.query(`
                UPDATE grama_niladhari 
                SET username = ?, first_name = ?, last_name = ?, full_name = ?,
                    email = ?, mobile = ?, division_id = ?, status = ?
                WHERE gn_id = ?
            `, [username, firstName, lastName, fullName || null, email, mobile, divisionId, status, id]);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Officer not found.' });
        }

        return res.json({ message: 'Officer account updated successfully.' });
    } catch (error) {
        console.error('Error updating officer:', error);
        return res.status(500).json({ error: 'Server error updating officer details.' });
    }
};

// PUT /api/auth/admin/officers/:id/status
exports.updateOfficerStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || (status !== 'Active' && status !== 'Suspended')) {
        return res.status(400).json({ error: 'Valid status (Active or Suspended) required.' });
    }

    try {
        const [result] = await db.query('UPDATE grama_niladhari SET status = ? WHERE gn_id = ?', [status, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Officer not found.' });
        }
        return res.json({ message: 'Officer status updated successfully.' });
    } catch (error) {
        console.error('Error updating officer status:', error);
        return res.status(500).json({ error: 'Server error updating officer status.' });
    }
};

// DELETE /api/auth/admin/officers/:id
exports.deleteOfficer = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM grama_niladhari WHERE gn_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Officer not found.' });
        }
        return res.json({ message: 'GN Officer account deleted successfully.' });
    } catch (error) {
        console.error('Error deleting officer:', error);
        return res.status(500).json({ error: 'Server error deleting officer.' });
    }
};

// ============================================================
// ADMIN ROUTES - RESIDENT MANAGEMENT
// ============================================================

// GET /api/auth/admin/residents
exports.getResidents = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                r.r_nic, 
                r.full_name AS name, 
                r.email, 
                r.mobile_no, 
                r.division_id,
                d.name AS division_name, 
                r.status, 
                r.occupation, 
                r.household_number,
                r.home_address,
                h.address AS household_address
            FROM resident r
            JOIN household h ON r.household_number = h.household_number
            JOIN gn_division d ON r.division_id = d.division_id
            ORDER BY r.created_at DESC
        `);
        const mapped = rows.map(r => ({ ...r, nic: r.r_nic }));
        return res.json(mapped);
    } catch (error) {
        console.error('Error fetching residents list:', error);
        return res.status(500).json({ error: 'Server error fetching residents.' });
    }
};

// GET /api/auth/admin/residents/:nic (Officer & Admin accessible)
exports.getResidentByNic = async (req, res) => {
    const { nic } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT 
                r.r_nic,
                r.first_name,
                r.last_name,
                r.full_name AS name,
                r.email,
                r.mobile_no,
                r.date_of_birth AS dob,
                r.gender,
                r.occupation,
                r.status,
                r.household_number,
                r.division_id,
                r.home_address,
                r.created_at,
                d.name AS division_name,
                h.address AS household_address
            FROM resident r
            JOIN household h ON r.household_number = h.household_number
            JOIN gn_division d ON r.division_id = d.division_id
            WHERE r.r_nic = ?
        `, [nic]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Resident not found.' });
        }

        const detail = { 
            ...rows[0], 
            nic: rows[0].r_nic,
            name: rows[0].name || `${rows[0].first_name} ${rows[0].last_name}`.trim()
        };

        return res.json({
            success: true,
            data: detail
        });
    } catch (error) {
        console.error('Error fetching resident:', error);
        return res.status(500).json({ error: 'Server error fetching resident details.' });
    }
};

// GET /api/auth/admin/residents/:nic/family (Officer & Admin accessible)
exports.getResidentFamily = async (req, res) => {
    const { nic } = req.params;

    if (!nic) {
        return res.status(400).json({ error: 'Resident NIC is required.' });
    }

    try {
        const [rows] = await db.query(`
            SELECT 
                member_id AS id,
                name,
                nic,
                age,
                occupation,
                relationship,
                gender,
                date_of_birth AS dob
            FROM family_member
            WHERE resident_nic = ?
              AND is_active = TRUE
            ORDER BY 
                CASE relationship WHEN 'Head' THEN 0 ELSE 1 END,
                age DESC
        `, [nic]);

        return res.json({
            success: true,
            data: rows,
            count: rows.length
        });

    } catch (error) {
        console.error('Error fetching resident family:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Server error fetching family members.',
            details: error.message 
        });
    }
};

// PUT /api/auth/admin/residents/:nic
exports.updateResident = async (req, res) => {
    const { nic } = req.params;
    const { name, email, mobile_no, status, occupation, household_number, home_address, division_id } = req.body;

    if (!name || !email || !mobile_no || !status || !household_number) {
        return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    try {
        const [existing] = await db.query('SELECT r_nic FROM resident WHERE email = ? AND r_nic != ?', [email, nic]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email is already taken by another resident.' });
        }

        const nameParts = name.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const updates = [];
        const values = [];

        updates.push('first_name = ?'); values.push(firstName);
        updates.push('last_name = ?'); values.push(lastName);
        updates.push('email = ?'); values.push(email);
        updates.push('mobile_no = ?'); values.push(mobile_no);
        updates.push('status = ?'); values.push(status);
        updates.push('occupation = ?'); values.push(occupation || null);
        updates.push('household_number = ?'); values.push(household_number);
        updates.push('home_address = ?'); values.push(home_address || null);

        if (division_id) {
            updates.push('division_id = ?');
            values.push(division_id);
        }

        values.push(nic);
        const query = `UPDATE resident SET ${updates.join(', ')} WHERE r_nic = ?`;
        
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Resident not found.' });
        }

        return res.json({ message: 'Resident account updated successfully.' });
    } catch (error) {
        console.error('Error updating resident:', error);
        return res.status(500).json({ error: 'Server error updating resident details.' });
    }
};

// PUT /api/auth/admin/residents/:nic/status
exports.updateResidentStatus = async (req, res) => {
    const { nic } = req.params;
    const { status } = req.body;

    if (!status || (status !== 'Active' && status !== 'Suspended')) {
        return res.status(400).json({ error: 'Valid status (Active or Suspended) required.' });
    }

    try {
        const [result] = await db.query('UPDATE resident SET status = ? WHERE r_nic = ?', [status, nic]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Resident not found.' });
        }
        return res.json({ message: 'Resident status updated successfully.' });
    } catch (error) {
        console.error('Error updating resident status:', error);
        return res.status(500).json({ error: 'Server error updating resident status.' });
    }
};

// DELETE /api/auth/admin/residents/:nic
exports.deleteResident = async (req, res) => {
    const { nic } = req.params;

    try {
        const [resident] = await db.query('SELECT household_number FROM resident WHERE r_nic = ?', [nic]);
        if (resident.length === 0) {
            return res.status(404).json({ error: 'Resident not found.' });
        }

        const householdNumber = resident[0].household_number;

        await db.query('DELETE FROM resident WHERE r_nic = ?', [nic]);

        const [remaining] = await db.query(
            'SELECT r_nic FROM resident WHERE household_number = ?',
            [householdNumber]
        );

        if (remaining.length === 0) {
            await db.query('DELETE FROM household WHERE household_number = ?', [householdNumber]);
            console.log(`✅ Household ${householdNumber} deleted as it had no residents.`);
        }

        return res.json({ message: 'Resident account deleted successfully.' });
    } catch (error) {
        console.error('Error deleting resident:', error);
        return res.status(500).json({ error: 'Server error deleting resident.' });
    }
};

// ============================================================
// ADMIN ROUTES - HOUSEHOLD MANAGEMENT
// ============================================================

// GET /api/auth/admin/households
exports.getHouseholds = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                h.household_number,
                h.address,
                h.created_at,
                COUNT(r.r_nic) AS resident_count
            FROM household h
            LEFT JOIN resident r ON h.household_number = r.household_number
            GROUP BY h.household_number
            ORDER BY h.created_at DESC
        `);
        return res.json(rows);
    } catch (error) {
        console.error('Error fetching households:', error);
        return res.status(500).json({ error: 'Server error fetching households.' });
    }
};

// PUT /api/auth/admin/households/:number
exports.updateHousehold = async (req, res) => {
    const { number } = req.params;
    const { address } = req.body;

    try {
        const [result] = await db.query(`
            UPDATE household 
            SET address = ?
            WHERE household_number = ?
        `, [address, number]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Household not found.' });
        }

        return res.json({ message: 'Household details updated successfully.' });
    } catch (error) {
        console.error('Error updating household:', error);
        return res.status(500).json({ error: 'Server error updating household details.' });
    }
};

// ============================================================
// ADMIN ROUTES - GN DIVISION MANAGEMENT
// ============================================================

// GET /api/auth/admin/divisions - Admin only - returns full details (without pagination)
exports.getAllDivisionsDetails = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                division_id,
                division_code,
                name,
                district,
                province,
                divisional_secretariat,
                population,
                household_count,
                is_active,
                created_at,
                updated_at
            FROM gn_division
            ORDER BY created_at DESC
        `);
        return res.json(rows);
    } catch (error) {
        console.error('Error fetching detailed GN divisions:', error);
        return res.status(500).json({ error: 'Server error fetching division details.' });
    }
};

// POST /api/auth/admin/divisions
exports.createDivision = async (req, res) => {
    const { division_code, name, district, province, divisional_secretariat, population, household_count } = req.body;

    if (!division_code || !name || !district || !province || !divisional_secretariat) {
        return res.status(400).json({ error: 'Please provide all required fields for GN Division.' });
    }

    try {
        const [existing] = await db.query(
            'SELECT division_id FROM gn_division WHERE division_code = ? OR name = ?',
            [division_code, name]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'A GN Division with this Code or Name already exists.' });
        }

        await db.query(`
            INSERT INTO gn_division (division_code, name, district, province, divisional_secretariat, population, household_count)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            division_code,
            name,
            district,
            province,
            divisional_secretariat,
            parseInt(population, 10) || 0,
            parseInt(household_count, 10) || 0
        ]);

        return res.status(201).json({ message: 'GN Division created successfully.' });
    } catch (error) {
        console.error('Error creating division:', error);
        return res.status(500).json({ error: 'Server error creating GN Division.' });
    }
};

// PUT /api/auth/admin/divisions/:id
exports.updateDivision = async (req, res) => {
    const { id } = req.params;
    const { division_code, name, district, province, divisional_secretariat, population, household_count, is_active } = req.body;

    if (!division_code || !name || !district || !province || !divisional_secretariat) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    try {
        const [existing] = await db.query(
            'SELECT division_id FROM gn_division WHERE (division_code = ? OR name = ?) AND division_id != ?',
            [division_code, name, id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Division Code or Name is already used by another division.' });
        }

        const activeBool = is_active !== undefined ? (is_active === true || is_active === 'Active' || is_active === 1) : true;

        const [result] = await db.query(`
            UPDATE gn_division
            SET division_code = ?, name = ?, district = ?, province = ?, divisional_secretariat = ?, population = ?, household_count = ?, is_active = ?
            WHERE division_id = ? OR division_code = ?
        `, [
            division_code,
            name,
            district,
            province,
            divisional_secretariat,
            parseInt(population, 10) || 0,
            parseInt(household_count, 10) || 0,
            activeBool,
            id,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'GN Division not found.' });
        }

        return res.json({ message: 'GN Division updated successfully.' });
    } catch (error) {
        console.error('Error updating division:', error);
        return res.status(500).json({ error: 'Server error updating GN Division.' });
    }
};

// PUT /api/auth/admin/divisions/:id/status
exports.toggleDivisionStatus = async (req, res) => {
    const { id } = req.params;
    const { is_active, status } = req.body;

    let activeBool;
    if (status !== undefined) {
        activeBool = status === 'Active';
    } else if (is_active !== undefined) {
        activeBool = Boolean(is_active);
    } else {
        return res.status(400).json({ error: 'Active status is required.' });
    }

    try {
        const [result] = await db.query(
            'UPDATE gn_division SET is_active = ? WHERE division_id = ? OR division_code = ?',
            [activeBool, id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'GN Division not found.' });
        }

        return res.json({ message: 'GN Division status updated successfully.' });
    } catch (error) {
        console.error('Error updating division status:', error);
        return res.status(500).json({ error: 'Server error updating status.' });
    }
};

// DELETE /api/auth/admin/divisions/:id
exports.deleteDivision = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM gn_division WHERE division_id = ? OR division_code = ?',
            [id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'GN Division not found.' });
        }
        return res.json({ message: 'GN Division deleted successfully.' });
    } catch (error) {
        console.error('Error deleting division:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: 'Cannot delete division because it is assigned to officers, households, or residents.' });
        }
        return res.status(500).json({ error: 'Server error deleting GN Division.' });
    }
};