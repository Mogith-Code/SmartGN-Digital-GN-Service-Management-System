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

// 2. POST /api/auth/register (Resident registration)
exports.registerResident = async (req, res) => {
  const { nic, name, dob, password, gender, mobile, email, householdNumber, division } = req.body;

  if (!nic || !name || !dob || !password || !gender || !mobile || !email || !householdNumber || !division) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  try {
    // Check if division exists and get ID
    const [divisions] = await db.query('SELECT id FROM divisions WHERE name = ?', [division]);
    if (divisions.length === 0) {
      return res.status(400).json({ error: 'Selected division is invalid.' });
    }
    const divisionId = divisions[0].id;

    // Check if resident already exists
    const [existing] = await db.query('SELECT nic FROM residents WHERE nic = ? OR email = ?', [nic, email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Resident account with this NIC or Email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert resident
    await db.query(`
      INSERT INTO residents (nic, name, dob, password, gender, mobile, email, household_number, division_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')
    `, [nic, name, dob, hashedPassword, gender, mobile, email, householdNumber, divisionId]);

    return res.status(201).json({ message: 'Registration successful. You can now login.' });
  } catch (error) {
    console.error('Error registering resident:', error);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
};

// 3. POST /api/auth/login (Universal Login)
exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Please enter all fields.' });
  }

  const queryVal = identifier.trim();

  try {
    // 1. Check in admins table
    const [admins] = await db.query('SELECT * FROM admins WHERE username = ? OR email = ?', [queryVal, queryVal]);
    if (admins.length > 0) {
      const admin = admins[0];
      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials or suspended account.' });
      }

      // Generate JWT
      const token = jwt.sign({ id: admin.id, name: admin.name, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({
        token,
        role: 'ADMIN',
        user: {
          id: admin.id,
          name: admin.name
        }
      });
    }