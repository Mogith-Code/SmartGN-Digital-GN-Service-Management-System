// Backend/src/controllers/allowanceController.js
const db = require('../config/database');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'smartgn_jwt_secret_key_987654321';

// Generate UUID using built-in crypto
const generateUUID = () => {
    return crypto.randomUUID();
};

// Helper function to get user from token
const getUserFromToken = (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;
    try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
};

// ============================================================
// GET ALLOWANCES (Resident Panel)
// ============================================================
exports.getResidentAllowances = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const residentNic = user.id;

    try {
        const [rows] = await db.query(
            `SELECT * FROM allowance_pending 
             WHERE resident_nic = ?
             ORDER BY application_date DESC`,
            [residentNic]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching resident allowances:', error);
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// GET ALLOWANCES (Officer Panel)
// ============================================================
exports.getOfficerAllowances = async (req, res) => {
    const user = req.user;
    
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied. Officers only.' });
    }

    const gnId = user.id;

    try {
        const [rows] = await db.query(
            `SELECT 
                ap.*, 
                r.full_name AS resident_name, 
                r.email AS resident_email, 
                h.address AS resident_address
             FROM allowance_pending ap
             JOIN resident r ON r.r_nic = ap.resident_nic
             LEFT JOIN household h ON h.household_number = r.household_number
             WHERE ap.gn_id = ?
             ORDER BY ap.application_date DESC`,
            [gnId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching officer allowances:', error);
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// DISBURSE ALLOWANCE (Secure Transfer Simulation)
// ============================================================
exports.disburseAllowance = async (req, res) => {
    const user = req.user;
    
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied. Officers only.' });
    }

    const { id } = req.params;
    const { disburseAmount } = req.body;

    try {
        const [rows] = await db.query(
            'SELECT * FROM allowance_pending WHERE allowance_id = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Allowance application not found.' });
        }

        const application = rows[0];
        
        // If status is not APPROVED, automatically approve it
        if (application.status !== 'APPROVED') {
            await db.query(
                'UPDATE allowance_pending SET status = "APPROVED" WHERE allowance_id = ?',
                [id]
            );
        }

        const txnRef = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;

        // Update payment status
        await db.query(
            `UPDATE allowance_pending 
             SET payment_status = 'PAID', 
                 cleared_amount = ?, 
                 cleared_time = NOW(), 
                 txn_reference = ? 
             WHERE allowance_id = ?`,
            [disburseAmount || 5000.00, txnRef, id]
        );

        res.status(200).json({
            success: true,
            message: 'RTGS Secure Funds Disbursed successfully.',
            transaction: {
                id,
                amount: disburseAmount || 5000.00,
                txnRef,
                timestamp: new Date(),
                clearingBank: 'Central Bank of Sri Lanka',
                status: 'PAID'
            }
        });
    } catch (error) {
        console.error('Error disbursing allowance:', error);
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// UPDATE ALLOWANCE STATUS (Approve/Reject) - Officer
// ============================================================
exports.updateAllowanceStatus = async (req, res) => {
    const user = req.user;
    
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied. Officers only.' });
    }

    const { id } = req.params;
    const { status } = req.body;

    try {
        if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ error: 'Valid status (APPROVED/REJECTED) is required.' });
        }

        const [rows] = await db.query(
            'SELECT * FROM allowance_pending WHERE allowance_id = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Allowance application not found.' });
        }

        await db.query(
            `UPDATE allowance_pending 
             SET status = ? 
             WHERE allowance_id = ?`,
            [status, id]
        );

        res.status(200).json({ 
            success: true, 
            message: `Allowance application has been successfully ${status.toLowerCase()}.` 
        });
    } catch (error) {
        console.error('Error updating allowance status:', error);
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// GET ALLOWANCE STATS (For Dashboard)
// ============================================================
exports.getAllowanceStats = async (req, res) => {
    const user = req.user;
    
    if (!user || (user.role !== 'OFFICER' && user.role !== 'RESIDENT' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        let pendingCount = 0;
        let approvedCount = 0;
        let totalAmount = 0;

        if (user.role === 'RESIDENT') {
            const nic = user.id;
            
            const [pendingResult] = await db.query(
                'SELECT COUNT(*) AS count FROM allowance_pending WHERE resident_nic = ? AND status = "PENDING"',
                [nic]
            );
            pendingCount = pendingResult[0]?.count || 0;

            const [approvedResult] = await db.query(
                'SELECT COUNT(*) AS count FROM allowance_pending WHERE resident_nic = ? AND status = "APPROVED"',
                [nic]
            );
            approvedCount = approvedResult[0]?.count || 0;

        } else if (user.role === 'OFFICER') {
            const gnId = user.id;

            const [pendingResult] = await db.query(
                'SELECT COUNT(*) AS count FROM allowance_pending WHERE gn_id = ? AND status = "PENDING"',
                [gnId]
            );
            pendingCount = pendingResult[0]?.count || 0;

            const [approvedResult] = await db.query(
                'SELECT COUNT(*) AS count FROM allowance_pending WHERE gn_id = ? AND status = "APPROVED"',
                [gnId]
            );
            approvedCount = approvedResult[0]?.count || 0;

            const [amountResult] = await db.query(
                'SELECT COALESCE(SUM(cleared_amount), 0) AS total FROM allowance_pending WHERE gn_id = ? AND payment_status = "PAID"',
                [gnId]
            );
            totalAmount = amountResult[0]?.total || 0;
        }

        res.status(200).json({
            pending: pendingCount,
            approved: approvedCount,
            totalDisbursed: totalAmount
        });
    } catch (error) {
        console.error('Error fetching allowance stats:', error);
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// CREATE ALLOWANCE APPLICATION (Resident)
// ============================================================
exports.createAllowanceApplication = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const residentNic = user.id;
    const { allowanceType, incomeDetails, applicationDate, bankDetails, supportDoc, documentPath, document_path } = req.body;
    const docData = supportDoc || documentPath || document_path || null;

    if (!allowanceType || !incomeDetails) {
        return res.status(400).json({ error: 'Allowance type and income details are required.' });
    }

    try {
        // Get the GN officer for this resident's division
        const [residentRows] = await db.query(
            'SELECT division_id FROM resident WHERE r_nic = ?',
            [residentNic]
        );

        let divisionId = residentRows.length > 0 ? residentRows[0].division_id : null;
        let gnId = null;

        if (divisionId) {
            const [officerRows] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE division_id = ? AND status = "Active" LIMIT 1',
                [divisionId]
            );
            if (officerRows.length > 0) {
                gnId = officerRows[0].gn_id;
            }
        }

        // Fallback: If no GN officer matched for division, assign any active officer
        if (!gnId) {
            const [anyOfficer] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE status = "Active" LIMIT 1'
            );
            if (anyOfficer.length > 0) {
                gnId = anyOfficer[0].gn_id;
            }
        }

        const allowanceId = generateUUID();
        const allowanceNumber = `ALW-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
        const bankDetailsStr = bankDetails ? (typeof bankDetails === 'string' ? bankDetails : JSON.stringify(bankDetails)) : null;

        await db.query(
            `INSERT INTO allowance_pending (
                allowance_id,
                allowance_number,
                allowance_type,
                application_date,
                income_details,
                bank_details,
                document_path,
                resident_nic,
                gn_id,
                status,
                payment_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'UNPAID')`,
            [
                allowanceId,
                allowanceNumber,
                allowanceType,
                applicationDate || new Date().toISOString().split('T')[0],
                incomeDetails,
                bankDetailsStr,
                docData,
                residentNic,
                gnId
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Allowance application submitted successfully!',
            allowanceId,
            allowanceNumber,
            data: {
                allowanceId,
                allowanceNumber,
                status: 'PENDING'
            }
        });
    } catch (error) {
        console.error('Error creating allowance application:', error);
        res.status(500).json({ error: error.message });
    }
};