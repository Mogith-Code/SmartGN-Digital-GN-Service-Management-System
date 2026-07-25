import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = express.Router();

const authUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Authorization header required.' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = { id: decoded.id, role: decoded.role, name: decoded.name };
    next();
  } catch (err) {
    // Fallback/backwards compatibility with custom headers
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];
    if (userId && userRole) {
      req.user = { id: userId, role: userRole };
      return next();
    }
    return res.status(401).json({ error: 'Invalid or expired authorization token.' });
  }
};

// 1. Submit Allowance Application (Resident)
router.post('/apply', authUser, async (req, res) => {
  const { allowanceType, incomeDetails, bankDetails } = req.body;
  const residentNic = req.user.id;

  try {
    if (!allowanceType || !incomeDetails || !bankDetails) {
      return res.status(400).json({ error: 'Allowance type, income details, and bank account metadata are required.' });
    }

    const allowanceId = `AL-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Get assigned GN officer
    const [gnRows] = await pool.query(
      `SELECT gn.gn_id FROM grama_niladhari gn
       JOIN resident r ON r.r_nic = ?
       JOIN household h ON h.household_number = r.household_number
       WHERE gn.division_id = h.division_id`,
      [residentNic]
    );
    const gnId = gnRows.length > 0 ? gnRows[0].gn_id : null;

    // Insert Allowance Application
    await pool.query(
      `INSERT INTO allowance_application (allowance_id, allowance_type, application_date, income_details, status, resident_nic, gn_id, bank_details) 
       VALUES (?, ?, CURDATE(), ?, 'PENDING', ?, ?, ?)`,
      [allowanceId, allowanceType, incomeDetails, residentNic, gnId, JSON.stringify(bankDetails)]
    );

    res.status(201).json({ success: true, message: 'Allowance application submitted.', allowanceId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Fetch Allowances (Resident Panel)
router.get('/resident', authUser, async (req, res) => {
  const residentNic = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM allowance_application 
       WHERE resident_nic = ?
       ORDER BY application_date DESC`,
      [residentNic]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Fetch Allowances (GN Audit panel)
router.get('/officer', authUser, async (req, res) => {
  const officerId = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT aa.*, r.name AS resident_name, r.email AS resident_email, h.address AS resident_address
       FROM allowance_application aa
       JOIN resident r ON r.r_nic = aa.resident_nic
       JOIN household h ON h.household_number = r.household_number
       WHERE aa.gn_id = ?
       ORDER BY aa.application_date DESC`,
      [officerId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Secure Transfer Simulation via simulated RTGS
router.post('/:id/disburse', authUser, async (req, res) => {
  const { id } = req.params;
  const { disburseAmount } = req.body; // Amount in LKR

  try {
    const [rows] = await pool.query('SELECT * FROM allowance_application WHERE allowance_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Allowance application not found.' });
    }

    const application = rows[0];
    if (application.status !== 'APPROVED') {
      // Automatically approve upon disbursement authorization
      await pool.query('UPDATE allowance_application SET status = "APPROVED" WHERE allowance_id = ?', [id]);
    }

    const txnRef = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;

    // Update payment register
    await pool.query(
      `UPDATE allowance_application 
       SET payment_status = 'PAID', cleared_amount = ?, cleared_time = NOW(), txn_reference = ? 
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
    res.status(500).json({ error: error.message });
  }
});

// 5. Update Allowance Status (Approve/Reject) (GN Officer)
router.put('/:id/status', authUser, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // status: 'APPROVED', 'REJECTED'







