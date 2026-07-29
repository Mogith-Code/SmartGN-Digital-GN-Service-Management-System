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
