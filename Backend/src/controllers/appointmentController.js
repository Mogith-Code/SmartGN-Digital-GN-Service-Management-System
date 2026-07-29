// Backend/src/controllers/appointmentController.js
const db = require('../config/database');

// Generate appointment number e.g. APT-20260718-123
const generateAppointmentNumber = () => {
    const date = new Date();
    const dateStr = date.getFullYear() +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0');
    const rand = Math.floor(100 + Math.random() * 900);
    return `APT-${dateStr}-${rand}`;
};

// Convert time to 24-hour format
const convertTo24Hour = (timeStr) => {
    if (!timeStr) return "09:00:00";
    
    timeStr = timeStr.trim();
    
    if (timeStr.match(/^\d{1,2}:\d{2}(:\d{2})?$/)) {
        const parts = timeStr.split(':');
        const hours = parts[0].padStart(2, '0');
        const minutes = parts[1].padStart(2, '0');
        const seconds = parts[2] ? parts[2].padStart(2, '0') : '00';
        return `${hours}:${minutes}:${seconds}`;
    }
    
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
        let hours = parseInt(match[1]);
        const minutes = match[2];
        const period = match[3].toUpperCase();
        
        if (period === 'PM' && hours !== 12) hours += 12;
        else if (period === 'AM' && hours === 12) hours = 0;
        
        return `${String(hours).padStart(2, '0')}:${minutes}:00`;
    }
    
    if (timeStr.match(/^\d{2}:\d{2}:\d{2}$/)) return timeStr;
    
    console.warn('Unrecognized time format:', timeStr);
    return "09:00:00";
};

// ============================================================
// RESIDENT APPOINTMENT COUNTS
// ============================================================
exports.getAppointmentCounts = async (req, res) => {
    const user = req.user;
    
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
// GET ALL RESIDENT APPOINTMENTS
// ============================================================
exports.getAllResidentAppointments = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const nic = user.id;

    try {
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
        console.error('Error fetching appointments:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Server error fetching appointments.'
        });
    }
};

// ============================================================
// BOOK APPOINTMENT
// ============================================================
exports.bookAppointment = async (req, res) => {
    const user = req.user;
    
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
                appointmentNumber,
                date,
                time: formattedTime,
                purpose,
                contactNumber,
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
// UPDATE APPOINTMENT
// ============================================================
exports.updateAppointment = async (req, res) => {
    const user = req.user;
    
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
        const [pending] = await db.query(
            'SELECT * FROM appointment_pending WHERE appointment_id = ? AND resident_nic = ?',
            [id, nic]
        );

        if (pending.length === 0) {
            return res.status(404).json({ 
                error: 'Appointment not found or you do not have permission to edit it.' 
            });
        }

        const formattedTime = convertTo24Hour(time);

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
// CANCEL APPOINTMENT
// ============================================================
exports.cancelAppointment = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const { id } = req.params;
    const nic = user.id;

    try {
        const [pending] = await db.query(
            'SELECT * FROM appointment_pending WHERE appointment_id = ? AND resident_nic = ?',
            [id, nic]
        );

        if (pending.length === 0) {
            return res.status(404).json({ 
                error: 'Appointment not found or already processed.' 
            });
        }

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

// ============================================================
// OFFICER APPOINTMENT COUNTS (Including Tomorrow)
// ============================================================
exports.getOfficerAppointmentCounts = async (req, res) => {
    const user = req.user;
    
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied. Officers only.' });
    }

    try {
        let gnId = null;
        
        if (user.role === 'OFFICER') {
            const [officer] = await db.query(
                'SELECT gn_id, division_id FROM grama_niladhari WHERE gn_id = ? OR email = ? OR username = ?',
                [user.id, user.email || user.id, user.id]
            );
            
            if (officer.length === 0) {
                return res.status(404).json({ error: 'Officer not found in database.' });
            }
            
            gnId = officer[0].gn_id;
        } else {
            // ADMIN - use their ID as gn_id
            gnId = user.id;
        }

        let pendingCount = 0;
        let approvedCount = 0;
        let tomorrowCount = 0;

        if (gnId) {
            // Get pending appointments count
            const [pendingResult] = await db.query(`
                SELECT COUNT(*) AS count 
                FROM appointment_pending ap
                WHERE ap.gn_id = ?
            `, [gnId]);
            pendingCount = pendingResult[0]?.count || 0;

            // Get approved appointments count
            const [approvedResult] = await db.query(`
                SELECT COUNT(*) AS count 
                FROM appointment_approved aa
                WHERE aa.gn_id = ?
            `, [gnId]);
            approvedCount = approvedResult[0]?.count || 0;

            // Get tomorrow's appointments (Pending + Approved)
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            // Get pending appointments for tomorrow
            const [pendingTomorrow] = await db.query(`
                SELECT COUNT(*) AS count 
                FROM appointment_pending ap
                WHERE ap.gn_id = ? AND ap.date = ?
            `, [gnId, tomorrowStr]);

            // Get approved appointments for tomorrow
            const [approvedTomorrow] = await db.query(`
                SELECT COUNT(*) AS count 
                FROM appointment_approved aa
                WHERE aa.gn_id = ? AND aa.date = ?
            `, [gnId, tomorrowStr]);

            // Combine both counts
            tomorrowCount = (pendingTomorrow[0]?.count || 0) + (approvedTomorrow[0]?.count || 0);
        }

        return res.json({
            success: true,
            pending: pendingCount,
            approved: approvedCount,
            tomorrow: tomorrowCount,
            total: pendingCount + approvedCount
        });
    } catch (error) {
        console.error('Error fetching officer appointment counts:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Server error fetching appointment counts.',
            details: error.message 
        });
    }
};

// ============================================================
// GET OFFICER APPOINTMENTS (All appointments for officer's division)
// ============================================================
exports.getOfficerAppointments = async (req, res) => {
    const user = req.user;
    
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied. Officers only.' });
    }

    try {
        let gnId = null;
        
        if (user.role === 'OFFICER') {
            const [officer] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE gn_id = ? OR email = ? OR username = ?',
                [user.id, user.email || user.id, user.id]
            );
            
            if (officer.length === 0) {
                return res.status(404).json({ error: 'Officer not found.' });
            }
            gnId = officer[0].gn_id;
        }

        let pendingAppointments = [];
        let approvedAppointments = [];

        if (gnId) {
            // Get pending appointments - ✅ Format date as YYYY-MM-DD
            const [pending] = await db.query(`
                SELECT 
                    appointment_id,
                    appointment_number,
                    DATE_FORMAT(date, '%Y-%m-%d') AS date,
                    time,
                    purpose,
                    contact_number,
                    resident_nic,
                    created_at AS requested_at,
                    'Pending' AS status
                FROM appointment_pending 
                WHERE gn_id = ?
                ORDER BY date ASC, time ASC
            `, [gnId]);

            // Get approved appointments - ✅ Format date as YYYY-MM-DD
            const [approved] = await db.query(`
                SELECT 
                    appointment_id,
                    appointment_number,
                    DATE_FORMAT(date, '%Y-%m-%d') AS date,
                    time,
                    purpose,
                    contact_number,
                    resident_nic,
                    requested_at,
                    approved_at,
                    'Approved' AS status
                FROM appointment_approved 
                WHERE gn_id = ?
                ORDER BY date ASC, time ASC
            `, [gnId]);

            pendingAppointments = pending;
            approvedAppointments = approved;
        }

        // Get resident details for each appointment
        const allAppointments = [...pendingAppointments, ...approvedAppointments];
        
        // Fetch resident details for each appointment
        for (let appointment of allAppointments) {
            const [resident] = await db.query(`
                SELECT 
                    r_nic,
                    first_name,
                    last_name,
                    full_name,
                    mobile_no,
                    email,
                    home_address
                FROM resident 
                WHERE r_nic = ?
            `, [appointment.resident_nic]);
            
            if (resident.length > 0) {
                appointment.resident = {
                    nic: resident[0].r_nic,
                    firstName: resident[0].first_name,
                    lastName: resident[0].last_name,
                    fullName: resident[0].full_name || `${resident[0].first_name} ${resident[0].last_name}`,
                    mobile: resident[0].mobile_no,
                    email: resident[0].email,
                    address: resident[0].home_address
                };
            }
        }

        return res.json({
            success: true,
            appointments: allAppointments,
            counts: {
                pending: pendingAppointments.length,
                approved: approvedAppointments.length,
                total: allAppointments.length
            }
        });
    } catch (error) {
        console.error('Error fetching officer appointments:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Server error fetching appointments.',
            details: error.message 
        });
    }
};

// ============================================================
// APPROVE APPOINTMENT (Officer)
// ============================================================
exports.approveAppointment = async (req, res) => {
    const user = req.user;
    
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied. Officers only.' });
    }

    const { id } = req.params;

    try {
        // Get the pending appointment
        const [pending] = await db.query(
            'SELECT * FROM appointment_pending WHERE appointment_id = ?',
            [id]
        );
        
        if (pending.length === 0) {
            return res.status(404).json({ error: 'Appointment not found in pending queue.' });
        }

        const ap = pending[0];
        
        // Get the officer's GN ID
        let gnId = null;
        if (user.role === 'OFFICER') {
            const [officer] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE gn_id = ? OR email = ?',
                [user.id, user.email || user.id]
            );
            if (officer.length > 0) {
                gnId = officer[0].gn_id;
            }
        } else {
            gnId = user.id;
        }

        // Insert into appointment_approved table
        await db.query(`
            INSERT INTO appointment_approved (
                appointment_id,
                appointment_number,
                date,
                time,
                purpose,
                contact_number,
                resident_nic,
                gn_id,
                approved_by,
                requested_at,
                approved_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `, [
            ap.appointment_id,
            ap.appointment_number,
            ap.date,
            ap.time,
            ap.purpose,
            ap.contact_number,
            ap.resident_nic,
            ap.gn_id,
            gnId,
            ap.created_at
        ]);

        // Delete from pending table
        await db.query('DELETE FROM appointment_pending WHERE appointment_id = ?', [id]);

        return res.json({
            success: true,
            message: 'Appointment approved successfully.',
            data: {
                appointment_id: ap.appointment_id,
                appointment_number: ap.appointment_number
            }
        });

    } catch (error) {
        console.error('Error approving appointment:', error);
        return res.status(500).json({ error: 'Server error approving appointment.' });
    }
};

// ============================================================
// REJECT APPOINTMENT (Officer) - Complete Version
// ============================================================
exports.rejectAppointment = async (req, res) => {
    const user = req.user;
    
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ 
            success: false,
            error: 'Access denied. Officers only.' 
        });
    }

    const { id } = req.params;
    const { rejectionReason } = req.body;

    // Validate rejection reason
    if (!rejectionReason || !rejectionReason.trim()) {
        return res.status(400).json({ 
            success: false,
            error: 'Rejection reason is required.' 
        });
    }

    try {
        // Get the pending appointment
        const [pending] = await db.query(
            'SELECT * FROM appointment_pending WHERE appointment_id = ?',
            [id]
        );
        
        if (pending.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Appointment not found in pending queue.' 
            });
        }

        const ap = pending[0];
        
        // Get the officer's GN ID
        let gnId = null;
        if (user.role === 'OFFICER') {
            const [officer] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE gn_id = ? OR email = ?',
                [user.id, user.email || user.id]
            );
            if (officer.length > 0) {
                gnId = officer[0].gn_id;
            }
        } else {
            gnId = user.id;
        }

        // Try to insert into appointment_rejected
        try {
            await db.query(`
                INSERT INTO appointment_rejected (
                    appointment_id,
                    appointment_number,
                    date,
                    time,
                    purpose,
                    contact_number,
                    resident_nic,
                    gn_id,
                    rejected_by,
                    rejection_reason,
                    requested_at,
                    rejected_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [
                ap.appointment_id,
                ap.appointment_number,
                ap.date,
                ap.time,
                ap.purpose,
                ap.contact_number || '', // Handle null contact_number
                ap.resident_nic,
                ap.gn_id,
                gnId,
                rejectionReason.trim(),
                ap.created_at
            ]);
        } catch (insertError) {
            // If the table doesn't have contact_number column, try without it
            if (insertError.code === 'ER_BAD_FIELD_ERROR') {
                console.log('contact_number column missing, trying without it...');
                await db.query(`
                    INSERT INTO appointment_rejected (
                        appointment_id,
                        appointment_number,
                        date,
                        time,
                        purpose,
                        resident_nic,
                        gn_id,
                        rejected_by,
                        rejection_reason,
                        requested_at,
                        rejected_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                `, [
                    ap.appointment_id,
                    ap.appointment_number,
                    ap.date,
                    ap.time,
                    ap.purpose,
                    ap.resident_nic,
                    ap.gn_id,
                    gnId,
                    rejectionReason.trim(),
                    ap.created_at
                ]);
            } else {
                throw insertError;
            }
        }

        // Delete from pending table
        await db.query('DELETE FROM appointment_pending WHERE appointment_id = ?', [id]);

        return res.json({
            success: true,
            message: 'Appointment rejected successfully.',
            data: {
                appointment_id: ap.appointment_id,
                appointment_number: ap.appointment_number,
                rejection_reason: rejectionReason.trim()
            }
        });

    } catch (error) {
        console.error('Error rejecting appointment:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Server error rejecting appointment.',
            details: error.message 
        });
    }
};