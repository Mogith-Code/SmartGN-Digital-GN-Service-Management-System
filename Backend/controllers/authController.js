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

    // 2. Check in officers table (join divisions to get division name)
    const [officers] = await db.query(`
      SELECT o.*, d.name AS division_name 
      FROM officers o
      JOIN divisions d ON o.division_id = d.id
      WHERE o.username = ? OR o.email = ? OR o.id = ?
    `, [queryVal, queryVal, queryVal]);

    if (officers.length > 0) {
      const officer = officers[0];

      if (officer.status !== 'Active') {
        return res.status(403).json({ error: 'Invalid credentials or suspended account.' });
      }

      const match = await bcrypt.compare(password, officer.password);
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials or suspended account.' });
      }

      // Generate JWT
      const token = jwt.sign({ 
        id: officer.id, 
        name: officer.name, 
        role: 'OFFICER',
        divisionId: officer.division_id,
        divisionName: officer.division_name
      }, JWT_SECRET, { expiresIn: '24h' });

      return res.json({
        token,
        role: 'OFFICER',
        user: {
          id: officer.id,
          name: officer.name,
          divisionName: officer.division_name
        }
      });
    }

    // 3. Check in residents table (join divisions to get division name)
    const [residents] = await db.query(`
      SELECT r.*, d.name AS division_name 
      FROM residents r
      JOIN divisions d ON r.division_id = d.id
      WHERE r.nic = ? OR r.email = ?
    `, [queryVal, queryVal]);

    if (residents.length > 0) {
      const resident = residents[0];

      if (resident.status !== 'Active') {
        return res.status(403).json({ error: 'Invalid credentials or suspended account.' });
      }

      const match = await bcrypt.compare(password, resident.password);
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials or suspended account.' });
      }

      // Generate JWT
      const token = jwt.sign({ 
        id: resident.nic, 
        name: resident.name, 
        role: 'RESIDENT',
        divisionId: resident.division_id,
        divisionName: resident.division_name
      }, JWT_SECRET, { expiresIn: '24h' });

      return res.json({
        token,
        role: 'RESIDENT',
        user: {
          nic: resident.nic,
          name: resident.name,
          division: resident.division_name
        }
      });
    }

    // If no match found in any table
    return res.status(401).json({ error: 'Invalid credentials or suspended account.' });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ error: 'Server error during login authentication.' });
  }
};