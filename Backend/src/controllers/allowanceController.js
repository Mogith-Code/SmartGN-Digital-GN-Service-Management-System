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



