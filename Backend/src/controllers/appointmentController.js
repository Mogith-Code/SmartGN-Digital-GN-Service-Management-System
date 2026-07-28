// Backend/src/controllers/appointmentController.js
const db = require('../config/database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'smartgn_jwt_secret_key_987654321';

const getUserFromToken = (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;
    try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
};

// Generate appointment number e.g. APT-20260718-123
const generateAppointmentNumber = () => {
    const date = new Date();
    const dateStr = date.getFullYear() +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0');
    const rand = Math.floor(100 + Math.random() * 900);
    return `APT-${dateStr}-${rand}`;
};

// ============================================================================
// CONVERT TIME TO 24-HOUR FORMAT (Backend helper)
// ============================================================================
const convertTo24Hour = (timeStr) => {
    if (!timeStr) return "09:00:00";
    
    // Trim whitespace
    timeStr = timeStr.trim();
    
    // If already in 24-hour format (HH:MM:SS or HH:MM)
    if (timeStr.match(/^\d{1,2}:\d{2}(:\d{2})?$/)) {
        const parts = timeStr.split(':');
        const hours = parts[0].padStart(2, '0');
        const minutes = parts[1].padStart(2, '0');
        const seconds = parts[2] ? parts[2].padStart(2, '0') : '00';
        return `${hours}:${minutes}:${seconds}`;
    }
    
    // Convert from 12-hour format (e.g., "2:30 PM" or "02:30 PM")
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
        let hours = parseInt(match[1]);
        const minutes = match[2];
        const period = match[3].toUpperCase();
        
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        return `${String(hours).padStart(2, '0')}:${minutes}:00`;
    }
    
    // If format is like "14:30:00" already
    if (timeStr.match(/^\d{2}:\d{2}:\d{2}$/)) {
        return timeStr;
    }
    
    // Default fallback
    console.warn('Unrecognized time format:', timeStr);
    return "09:00:00";
};

// ============================================================
// GET APPOINTMENT COUNTS (Pending & Approved only)
// ============================================================
exports.getAppointmentCounts = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const nic = user.id;

    try {
        const [pendingResult] = await db.query(
            'SELECT COUNT(*) AS count FROM appointment_pending WHERE resident_nic = ?',
            [nic]
        );

        const [approvedResult] = await db.query(
            'SELECT COUNT(*) AS count FROM appointment_approved WHERE resident_nic = ?',
            [nic]
        );

        return res.json({
            pending: pendingResult[0]?.count || 0,
            approved: approvedResult[0]?.count || 0
        });

    } catch (error) {
        console.error('Error fetching appointment counts:', error);
        return res.status(500).json({ error: 'Server error fetching appointment counts.' });
    }
};

// ============================================================
// GET ALL RESIDENT APPOINTMENTS (For Calendar & Display)
// ============================================================
exports.getAllResidentAppointments = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const nic = user.id;

    try {
        // Get pending appointments
        const [pending] = await db.query(`
            SELECT 
                appointment_id, 
                appointment_number, 
                date, 
                time, 
                purpose,
                contact_number,
                'Pending' AS status, 
                created_at AS requested_at
            FROM appointment_pending 
            WHERE resident_nic = ?
            ORDER BY date ASC, time ASC
        `, [nic]);

        // Get approved appointments
        const [approved] = await db.query(`
            SELECT 
                appointment_id, 
                appointment_number, 
                date, 
                time, 
                purpose,
                contact_number,
                'Approved' AS status, 
                requested_at,
                approved_at
            FROM appointment_approved 
            WHERE resident_nic = ?
            ORDER BY date ASC, time ASC
        `, [nic]);

        // Combine all appointments
        const allAppointments = [...pending, ...approved];

        return res.json({
            success: true,
            appointments: allAppointments,
            counts: {
                pending: pending.length,
                approved: approved.length,
                total: allAppointments.length
            }
        });

    } catch (error) {
        console.error('Error fetching all appointments:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Server error fetching appointments.',
            details: error.message 
        });
    }
};

// ============================================================
// BOOK APPOINTMENT (Resident)
// ============================================================
exports.bookAppointment = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const residentNic = user.id;
    const { purpose, date, time, contactNumber } = req.body;

    if (!purpose || !date || !time || !contactNumber) {
        return res.status(400).json({ 
            error: 'All fields are required: purpose, date, time, and contactNumber.' 
        });
    }

    try {
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

        const [officerRows] = await db.query(`
            SELECT gn_id 
            FROM grama_niladhari 
            WHERE division_id = ? AND status = 'Active' 
            LIMIT 1
        `, [divisionId]);

        if (officerRows.length === 0) {
            return res.status(404).json({ 
                error: 'No active GN Officer found for your division.' 
            });
        }

        const gnId = officerRows[0].gn_id;
        const appointmentNumber = generateAppointmentNumber();

        // ✅ Convert time to 24-hour format
        const formattedTime = convertTo24Hour(time);

        await db.query(`
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
            formattedTime,
            purpose,
            contactNumber,
            residentNic,
            gnId
        ]);

        return res.status(201).json({
            success: true,
            message: 'Appointment booked successfully! Awaiting officer confirmation.',
            data: {
                appointmentNumber: appointmentNumber,
                date: date,
                time: formattedTime,
                purpose: purpose,
                contactNumber: contactNumber,
                status: 'Pending'
            }
        });

    } catch (error) {
        console.error('Error booking appointment:', error);
        return res.status(500).json({ 
            error: 'Server error booking appointment. Please try again later.' 
        });
    }
};

// ============================================================
// UPDATE APPOINTMENT (Resident)
// ============================================================
exports.updateAppointment = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const { id } = req.params;
    const nic = user.id;
    const { purpose, date, time, contactNumber } = req.body;

    if (!purpose || !date || !time || !contactNumber) {
        return res.status(400).json({ 
            error: 'All fields are required: purpose, date, time, and contactNumber.' 
        });
    }

    try {
        // Check if appointment exists and belongs to this resident
        const [pending] = await db.query(
            'SELECT * FROM appointment_pending WHERE appointment_id = ? AND resident_nic = ?',
            [id, nic]
        );

        if (pending.length === 0) {
            return res.status(404).json({ 
                error: 'Appointment not found or you do not have permission to edit it.' 
            });
        }

        // ✅ Convert time to 24-hour format
        const formattedTime = convertTo24Hour(time);

        // Update the appointment
        await db.query(`
            UPDATE appointment_pending 
            SET purpose = ?, date = ?, time = ?, contact_number = ?
            WHERE appointment_id = ? AND resident_nic = ?
        `, [purpose, date, formattedTime, contactNumber, id, nic]);

        return res.json({
            success: true,
            message: 'Appointment updated successfully.',
            data: {
                appointment_id: id,
                purpose,
                date,
                time: formattedTime,
                contactNumber
            }
        });

    } catch (error) {
        console.error('Error updating appointment:', error);
        return res.status(500).json({ 
            error: 'Server error updating appointment.' 
        });
    }
};

// ============================================================
// CANCEL APPOINTMENT (Resident)
// ============================================================
exports.cancelAppointment = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const { id } = req.params;
    const nic = user.id;

    try {
        // Check if appointment exists and belongs to this resident
        const [pending] = await db.query(
            'SELECT * FROM appointment_pending WHERE appointment_id = ? AND resident_nic = ?',
            [id, nic]
        );

        if (pending.length === 0) {
            return res.status(404).json({ 
                error: 'Appointment not found or already processed.' 
            });
        }

        // Delete the appointment
        await db.query(
            'DELETE FROM appointment_pending WHERE appointment_id = ?',
            [id]
        );

        return res.json({
            success: true,
            message: 'Appointment cancelled successfully.'
        });

    } catch (error) {
        console.error('Error cancelling appointment:', error);
        return res.status(500).json({ 
            error: 'Server error cancelling appointment.' 
        });
    }
};