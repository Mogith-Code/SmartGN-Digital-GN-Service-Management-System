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

// BOOK APPOINTMENT (Resident)
// ============================================================
exports.bookAppointment = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const residentNic = user.id;
    const { purpose, date, time, contactNumber } = req.body;

    // Validate required fields
    if (!purpose || !date || !time || !contactNumber) {
        return res.status(400).json({ 
            error: 'All fields are required: purpose, date, time, and contactNumber.' 
        });
    }

    try {
        // 1. Get resident's division ID from their household
        const [residentRows] = await db.query(`
            SELECT h.division_id
            FROM resident r
            JOIN household h ON r.household_number = h.household_number
            WHERE r.r_nic = ?
        `, [residentNic]);

        if (residentRows.length === 0) {
            return res.status(404).json({ error: 'Resident household not found.' });
        }

        const divisionId = residentRows[0].division_id;

        // 2. Find active GN officer for this division
        const [officerRows] = await db.query(`
            SELECT gn_id 
            FROM grama_niladhari 
            WHERE division_id = ? AND status = 'Active' 
            LIMIT 1
        `, [divisionId]);

        if (officerRows.length === 0) {
            return res.status(404).json({ 
                error: 'No active GN Officer found for your division. Please contact your GN office.' 
            });
        }

        const gnId = officerRows[0].gn_id;

        // 3. Generate unique appointment number
        const appointmentNumber = generateAppointmentNumber();

        // 4. Insert into appointment_pending table with contact_number
        const [result] = await db.query(`
            INSERT INTO appointment_pending (
                appointment_number,
                date,
                time,
                purpose,
                contact_number,
                resident_nic,
                gn_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            appointmentNumber,
            date,
            time,
            purpose,
            contactNumber,  // ✅ Added contact_number
            residentNic,
            gnId
        ]);

        // 5. Return success response
        return res.status(201).json({
            success: true,
            message: 'Appointment booked successfully! Awaiting officer confirmation.',
            data: {
                appointmentNumber: appointmentNumber,
                date: date,
                time: time,
                purpose: purpose,
                contactNumber: contactNumber,
                status: 'Pending'
            }
        });

    } catch (error) {
        console.error('Error booking appointment:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                error: 'An appointment with this number already exists. Please try again.' 
            });
        }

        return res.status(500).json({ 
            error: 'Server error booking appointment. Please try again later.' 
        });
    }
};