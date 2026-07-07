const db = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'smartgn_jwt_secret_key_987654321';

// 1. GET /api/auth/divisions
exports.getDivisions = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT name FROM divisions ORDER BY name ASC');
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching divisions:', error);
    return res.status(500).json({ error: 'Server error while fetching divisions.' });
  }
};