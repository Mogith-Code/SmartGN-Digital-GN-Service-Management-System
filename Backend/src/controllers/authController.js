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

// 1. GET /api/auth/divisions
exports.getDivisions = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT name FROM gn_division ORDER BY name ASC');
        return res.json(rows);
    } catch (error) {
        console.error('Error fetching divisions:', error);
        return res.status(500).json({ error: 'Server error while fetching divisions.' });
    }
};

// POST /api/auth/register
exports.registerResident = async (req, res) => {
    const { nic, name, dob, password, gender, mobile, email, householdNumber, division, homeAddress } = req.body;

    if (!nic || !name || !dob || !password || !gender || !mobile || !email || !householdNumber || !division) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    try {
        // Check if division exists and get ID
        const [divisions] = await db.query('SELECT division_id AS id FROM gn_division WHERE name = ?', [division]);
        if (divisions.length === 0) {
            return res.status(400).json({ error: 'Selected division is invalid.' });
        }
        const divisionId = divisions[0].id;

        // Check if resident already exists
        const [existing] = await db.query('SELECT r_nic AS nic FROM resident WHERE r_nic = ? OR email = ?', [nic, email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Resident account with this NIC or Email already exists.' });
        }

        // Check if household exists
        const [householdRows] = await db.query(
            'SELECT household_number FROM household WHERE household_number = ?',
            [householdNumber]
        );

        let householdCreated = false;

        // If household doesn't exist, create it
        if (householdRows.length === 0) {
            await db.query(
                `INSERT INTO household (household_number, address, division_id)
                 VALUES (?, ?, ?)`,
                [householdNumber, homeAddress || `Address for household ${householdNumber}, ${division}`, divisionId]
            );
            householdCreated = true;
            console.log(`✅ New household created: ${householdNumber}`);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Split name into first and last name
        const nameParts = name.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Insert resident with home_address
        await db.query(`
            INSERT INTO resident (
                r_nic, first_name, last_name, full_name, date_of_birth, 
                password_hash, gender, mobile_no, email, household_number, 
                home_address, status, is_2fa_enabled
            ) VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, 'Pending', FALSE)
        `, [nic, firstName, lastName, dob, hashedPassword, gender, mobile, email, householdNumber, homeAddress || null]);

        // Generate OTP
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
            otpForTesting: process.env.NODE_ENV !== 'production' ? otp : undefined
        });
    } catch (error) {
        console.error('Error registering resident:', error);
        return res.status(500).json({ error: 'Server error during registration.' });
    }
};

// POST /api/auth/verify-registration (Verifies registration OTP and activates account)
exports.verifyRegistration = async (req, res) => {
    const { email, nic, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Please enter all fields.' });
    }

    // Support offline bypass/development bypass
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
        // Update resident status to Active and enable 2FA
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

// 3. POST /api/auth/login (Universal Login with 2FA)
exports.login = async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ error: 'Please enter all fields.' });
    }

    const queryVal = identifier.trim();

    try {
        // 1. Check in admin table (no 2FA required for admins, as requested)
        const [admins] = await db.query('SELECT * FROM admin WHERE username = ? OR email = ?', [queryVal, queryVal]);
        if (admins.length > 0) {
            const admin = admins[0];
            const match = await bcrypt.compare(password, admin.password_hash);
            if (!match) {
                return res.status(401).json({ error: 'Invalid credentials or suspended account.' });
            }

            // Generate final JWT for Admin
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
            WHERE o.username = ? OR o.email = ? OR o.officer_id = ?
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

            // Generate OTP for Officer Login
            const otp = generateOTP();
            const expiresAt = Date.now() + 5 * 60 * 1000;

            otpStore.set(officer.email, {
                otp,
                expiresAt,
                type: 'LOGIN',
                tempUserData: {
                    id: officer.officer_id,
                    gn_id: officer.gn_id,
                    name: officer.full_name,
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
                // Include OTP in dev mode for easy testing
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

            // Generate OTP for Resident Login
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
                // Include OTP in dev mode for easy testing
                otpForTesting: process.env.NODE_ENV !== 'production' ? otp : undefined
            });
        }

        return res.status(401).json({ error: 'Invalid credentials or suspended account.' });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ error: 'Server error during login authentication.' });
    }
};

// POST /api/auth/verify-2fa (Verifies login OTP and returns JWT)
exports.verify2FA = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Please enter all fields.' });
    }

    // Support offline bypass/development bypass
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
            // Simulated login token details
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

// POST /api/auth/resend-otp (Resends OTP for active session)
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

// 4. POST /api/auth/register/officer (Admin creates GN Officer)
exports.registerOfficer = async (req, res) => {
    const { username, name, email, mobile, division, password } = req.body;

    if (!username || !name || !email || !mobile || !division || !password) {
        return res.status(400).json({ error: 'Please enter all fields.' });
    }

    try {
        // Check if division exists and get ID
        const [divisions] = await db.query('SELECT division_id AS id FROM gn_division WHERE name = ?', [division]);
        if (divisions.length === 0) {
            return res.status(400).json({ error: 'Selected division is invalid.' });
        }
        const divisionId = divisions[0].id;

        // Check if officer username/email already exists
        const [existing] = await db.query('SELECT gn_id FROM grama_niladhari WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Officer with this username or email already exists.' });
        }

        // Generate unique ID like GN-123
        let uniqueId;
        let isUnique = false;
        while (!isUnique) {
            const randNum = Math.floor(100 + Math.random() * 900);
            uniqueId = `GN-${randNum}`;
            const [rows] = await db.query('SELECT gn_id FROM grama_niladhari WHERE officer_id = ?', [uniqueId]);
            if (rows.length === 0) {
                isUnique = true;
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert Officer (By default set is_2fa_enabled to true so they must verify OTP on login)
        await db.query(`
            INSERT INTO grama_niladhari (officer_id, username, password_hash, full_name, email, mobile, division_id, status, is_2fa_enabled)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', TRUE)
        `, [uniqueId, username, hashedPassword, name, email, mobile, divisionId]);

        return res.status(201).json({ message: 'GN Officer account registered successfully with 2FA enabled.' });
    } catch (error) {
        console.error('Error creating officer:', error);
        return res.status(500).json({ error: 'Server error creating officer account.' });
    }
};

// 5. GET /api/auth/admin/officers
exports.getOfficers = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.gn_id, o.officer_id, o.username, o.full_name AS name, o.email, o.mobile, d.name AS division_name, o.status
            FROM grama_niladhari o
            LEFT JOIN gn_division d ON o.division_id = d.division_id
            ORDER BY o.created_at DESC
        `);
        // Map gn_id to id for frontend compatibility
        const mapped = rows.map(r => ({ ...r, id: r.officer_id }));
        return res.json(mapped);
    } catch (error) {
        console.error('Error fetching officers list:', error);
        return res.status(500).json({ error: 'Server error fetching officers.' });
    }
};

// GET /api/auth/admin/residents
exports.getResidents = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                r.r_nic, 
                r.full_name AS name, 
                r.email, 
                r.mobile_no, 
                d.name AS division_name, 
                r.status, 
                r.occupation, 
                r.household_number,
                r.home_address,
                h.address AS household_address
            FROM resident r
            JOIN household h ON r.household_number = h.household_number
            JOIN gn_division d ON h.division_id = d.division_id
            ORDER BY r.created_at DESC
        `);
        const mapped = rows.map(r => ({ ...r, nic: r.r_nic }));
        return res.json(mapped);
    } catch (error) {
        console.error('Error fetching residents list:', error);
        return res.status(500).json({ error: 'Server error fetching residents.' });
    }
};

// 7. GET /api/auth/admin/households
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

// 8. PUT /api/auth/admin/households/:householdNumber
exports.updateHousehold = async (req, res) => {
    const { householdNumber } = req.params;
    const { address } = req.body;

    try {
        const [result] = await db.query(`
            UPDATE household 
            SET address = ?
            WHERE household_number = ?
        `, [address, householdNumber]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Household not found.' });
        }

        return res.json({ message: 'Household details updated successfully.' });
    } catch (error) {
        console.error('Error updating household:', error);
        return res.status(500).json({ error: 'Server error updating household details.' });
    }
};

// 9. PUT /api/auth/admin/officers/:id/status
exports.updateOfficerStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || (status !== 'Active' && status !== 'Suspended')) {
        return res.status(400).json({ error: 'Valid status (Active or Suspended) required.' });
    }

    try {
        const [result] = await db.query('UPDATE grama_niladhari SET status = ? WHERE officer_id = ? OR gn_id = ?', [status, id, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Officer not found.' });
        }
        return res.json({ message: 'Officer status updated successfully.' });
    } catch (error) {
        console.error('Error updating officer status:', error);
        return res.status(500).json({ error: 'Server error updating officer status.' });
    }
};

// 10. PUT /api/auth/admin/residents/:nic/status
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

// 11. DELETE /api/auth/admin/officers/:id
exports.deleteOfficer = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM grama_niladhari WHERE officer_id = ? OR gn_id = ?', [id, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Officer not found.' });
        }
        return res.json({ message: 'GN Officer account deleted successfully.' });
    } catch (error) {
        console.error('Error deleting officer:', error);
        return res.status(500).json({ error: 'Server error deleting officer.' });
    }
};

// 12. DELETE /api/auth/admin/residents/:nic
exports.deleteResident = async (req, res) => {
    const { nic } = req.params;

    try {
        // Check if resident exists and get household number
        const [resident] = await db.query('SELECT household_number FROM resident WHERE r_nic = ?', [nic]);
        if (resident.length === 0) {
            return res.status(404).json({ error: 'Resident not found.' });
        }

        const householdNumber = resident[0].household_number;

        // Delete resident
        await db.query('DELETE FROM resident WHERE r_nic = ?', [nic]);

        // Check if any other residents are in this household
        const [remaining] = await db.query(
            'SELECT r_nic FROM resident WHERE household_number = ?',
            [householdNumber]
        );

        // If no residents remain, delete the household
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

// 13. PUT /api/auth/admin/officers/:id
exports.updateOfficer = async (req, res) => {
    const { id } = req.params;
    const { username, name, email, mobile, division, status, password } = req.body;

    if (!username || !name || !email || !mobile || !division || !status) {
        return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    try {
        // Check if division exists and get ID
        const [divisions] = await db.query('SELECT division_id AS id FROM gn_division WHERE name = ?', [division]);
        if (divisions.length === 0) {
            return res.status(400).json({ error: 'Selected division is invalid.' });
        }
        const divisionId = divisions[0].id;

        // Check if username/email already taken by another officer
        const [existing] = await db.query('SELECT gn_id FROM grama_niladhari WHERE (username = ? OR email = ?) AND officer_id != ? AND gn_id != ?', [username, email, id, id]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Username or Email is already taken by another officer.' });
        }

        let result;
        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            [result] = await db.query(`
                UPDATE grama_niladhari 
                SET username = ?, full_name = ?, email = ?, mobile = ?, division_id = ?, status = ?, password_hash = ?
                WHERE officer_id = ? OR gn_id = ?
            `, [username, name, email, mobile, divisionId, status, hashedPassword, id, id]);
        } else {
            [result] = await db.query(`
                UPDATE grama_niladhari 
                SET username = ?, full_name = ?, email = ?, mobile = ?, division_id = ?, status = ?
                WHERE officer_id = ? OR gn_id = ?
            `, [username, name, email, mobile, divisionId, status, id, id]);
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

// PUT /api/auth/admin/residents/:nic
exports.updateResident = async (req, res) => {
    const { nic } = req.params;
    const { name, email, mobile_no, status, occupation, household_number, home_address, address } = req.body;

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

        const [result] = await db.query(`
            UPDATE resident 
            SET first_name = ?, last_name = ?, email = ?, mobile_no = ?, status = ?, 
                occupation = ?, household_number = ?, home_address = ?
            WHERE r_nic = ?
        `, [firstName, lastName, email, mobile_no, status, occupation, household_number, home_address || null, nic]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Resident not found.' });
        }

        if (address) {
            await db.query(`
                UPDATE household 
                SET address = ?
                WHERE household_number = ?
            `, [address, household_number]);
        }

        return res.json({ message: 'Resident account updated successfully.' });
    } catch (error) {
        console.error('Error updating resident:', error);
        return res.status(500).json({ error: 'Server error updating resident details.' });
    }
};

// GET /api/auth/admin/residents/:nic
exports.getResidentByNic = async (req, res) => {
    const { nic } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT 
                r.r_nic,
                r.full_name AS name,
                r.email,
                r.mobile_no,
                r.date_of_birth AS dob,
                r.gender,
                r.occupation,
                r.status,
                r.household_number,
                r.home_address,
                r.created_at,
                d.name AS division_name,
                h.address AS household_address
            FROM resident r
            JOIN household h ON r.household_number = h.household_number
            JOIN gn_division d ON h.division_id = d.division_id
            WHERE r.r_nic = ?
        `, [nic]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Resident not found.' });
        }

        const detail = { ...rows[0], nic: rows[0].r_nic };
        return res.json(detail);
    } catch (error) {
        console.error('Error fetching resident:', error);
        return res.status(500).json({ error: 'Server error fetching resident details.' });
    }
};

// 16. GET /api/auth/admin/officers/:id
exports.getOfficerById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT o.gn_id, o.officer_id, o.username, o.full_name AS name, o.email, o.mobile, d.name AS division_name, o.status, o.created_at
            FROM grama_niladhari o
            LEFT JOIN gn_division d ON o.division_id = d.division_id
            WHERE o.officer_id = ? OR o.gn_id = ?
        `, [id, id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Officer not found.' });
        }

        const detail = { ...rows[0], id: rows[0].officer_id };
        return res.json(detail);
    } catch (error) {
        console.error('Error fetching officer:', error);
        return res.status(500).json({ error: 'Server error fetching officer details.' });
    }
};

// GN DIVISION MANAGEMENT CONTROLLERS

// 17. GET /api/auth/admin/divisions
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

// 18. POST /api/auth/admin/divisions
exports.createDivision = async (req, res) => {
    const { division_code, name, district, province, divisional_secretariat, population, household_count } = req.body;

    if (!division_code || !name || !district || !province || !divisional_secretariat) {
        return res.status(400).json({ error: 'Please provide all required fields for GN Division.' });
    }

    try {
        // Check if code or name exists
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

// 19. PUT /api/auth/admin/divisions/:id
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