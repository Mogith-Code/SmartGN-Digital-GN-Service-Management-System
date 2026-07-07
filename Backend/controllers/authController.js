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

// 4. POST /api/auth/register/officer (Admin creates GN Officer)
exports.registerOfficer = async (req, res) => {
  const { username, name, email, mobile, division, password } = req.body;

  if (!username || !name || !email || !mobile || !division || !password) {
    return res.status(400).json({ error: 'Please enter all fields.' });
  }

  try {
    // Check if division exists and get ID
    const [divisions] = await db.query('SELECT id FROM divisions WHERE name = ?', [division]);
    if (divisions.length === 0) {
      return res.status(400).json({ error: 'Selected division is invalid.' });
    }
    const divisionId = divisions[0].id;

    // Check if officer username/email already exists
    const [existing] = await db.query('SELECT id FROM officers WHERE username = ? OR email = ?', [username, email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Officer with this username or email already exists.' });
    }

    // Generate unique ID like GN-123
    let uniqueId;
    let isUnique = false;
    while (!isUnique) {
      const randNum = Math.floor(100 + Math.random() * 900);
      uniqueId = `GN-${randNum}`;
      const [rows] = await db.query('SELECT id FROM officers WHERE id = ?', [uniqueId]);
      if (rows.length === 0) {
        isUnique = true;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert Officer
    await db.query(`
      INSERT INTO officers (id, username, name, email, mobile, division_id, password, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')
    `, [uniqueId, username, name, email, mobile, divisionId, hashedPassword]);

    return res.status(201).json({ message: 'GN Officer account registered successfully.' });
  } catch (error) {
    console.error('Error creating officer:', error);
    return res.status(500).json({ error: 'Server error creating officer account.' });
  }
};

// 5. GET /api/auth/admin/officers
exports.getOfficers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.id AS gn_id, o.username, o.name, o.email, o.mobile, d.name AS division_name, o.status
      FROM officers o
      JOIN divisions d ON o.division_id = d.id
      ORDER BY o.created_at DESC
    `);
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching officers list:', error);
    return res.status(500).json({ error: 'Server error fetching officers.' });
  }
};

// 6. GET /api/auth/admin/residents
exports.getResidents = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.nic AS r_nic, r.name, r.email, r.mobile AS mobile_no, d.name AS division_name, r.status, r.occupation, r.household_number
      FROM residents r
      JOIN divisions d ON r.division_id = d.id
      ORDER BY r.created_at DESC
    `);
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching residents list:', error);
    return res.status(500).json({ error: 'Server error fetching residents.' });
  }
};

// 7. PUT /api/auth/admin/officers/:id/status
exports.updateOfficerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || (status !== 'Active' && status !== 'Suspended')) {
    return res.status(400).json({ error: 'Valid status (Active or Suspended) required.' });
  }

  try {
    const [result] = await db.query('UPDATE officers SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Officer not found.' });
    }
    return res.json({ message: 'Officer status updated successfully.' });
  } catch (error) {
    console.error('Error updating officer status:', error);
    return res.status(500).json({ error: 'Server error updating officer status.' });
  }
};

// 8. PUT /api/auth/admin/residents/:nic/status
exports.updateResidentStatus = async (req, res) => {
  const { nic } = req.params;
  const { status } = req.body;

  if (!status || (status !== 'Active' && status !== 'Suspended')) {
    return res.status(400).json({ error: 'Valid status (Active or Suspended) required.' });
  }

  try {
    const [result] = await db.query('UPDATE residents SET status = ? WHERE nic = ?', [status, nic]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Resident not found.' });
    }
    return res.json({ message: 'Resident status updated successfully.' });
  } catch (error) {
    console.error('Error updating resident status:', error);
    return res.status(500).json({ error: 'Server error updating resident status.' });
  }
};

// 9. DELETE /api/auth/admin/officers/:id
exports.deleteOfficer = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM officers WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Officer not found.' });
    }
    return res.json({ message: 'GN Officer account deleted successfully.' });
  } catch (error) {
    console.error('Error deleting officer:', error);
    return res.status(500).json({ error: 'Server error deleting officer.' });
  }
};

// 10. DELETE /api/auth/admin/residents/:nic
exports.deleteResident = async (req, res) => {
  const { nic } = req.params;

  try {
    const [result] = await db.query('DELETE FROM residents WHERE nic = ?', [nic]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Resident not found.' });
    }
    return res.json({ message: 'Resident account deleted successfully.' });
  } catch (error) {
    console.error('Error deleting resident:', error);
    return res.status(500).json({ error: 'Server error deleting resident.' });
  }
};

// 11. PUT /api/auth/admin/officers/:id
exports.updateOfficer = async (req, res) => {
  const { id } = req.params;
  const { username, name, email, mobile, division, status, password } = req.body;

  if (!username || !name || !email || !mobile || !division || !status) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  try {
    // Check if division exists and get ID
    const [divisions] = await db.query('SELECT id FROM divisions WHERE name = ?', [division]);
    if (divisions.length === 0) {
      return res.status(400).json({ error: 'Selected division is invalid.' });
    }
    const divisionId = divisions[0].id;

    // Check if username/email already taken by another officer
    const [existing] = await db.query('SELECT id FROM officers WHERE (username = ? OR email = ?) AND id != ?', [username, email, id]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username or Email is already taken by another officer.' });
    }

    let result;
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      [result] = await db.query(`
        UPDATE officers 
        SET username = ?, name = ?, email = ?, mobile = ?, division_id = ?, status = ?, password = ?
        WHERE id = ?
      `, [username, name, email, mobile, divisionId, status, hashedPassword, id]);
    } else {
      [result] = await db.query(`
        UPDATE officers 
        SET username = ?, name = ?, email = ?, mobile = ?, division_id = ?, status = ?
        WHERE id = ?
      `, [username, name, email, mobile, divisionId, status, id]);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Officer not found.' });
    }

    return res.json({ message: 'Officer account updated successfully.' });
  } catch (error) {
    console.error('Error updating officer:', error);
    return res.status(500).json({ error: 'Server error updating officer details.' });
  }
};

// 12. PUT /api/auth/admin/residents/:nic
exports.updateResident = async (req, res) => {
  const { nic } = req.params;
  const { name, email, mobile_no, status, occupation, household_number } = req.body;

  if (!name || !email || !mobile_no || !status || !household_number) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  try {
    // Check if email already taken by another resident
    const [existing] = await db.query('SELECT nic FROM residents WHERE email = ? AND nic != ?', [email, nic]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email is already taken by another resident.' });
    }

    const [result] = await db.query(`
      UPDATE residents 
      SET name = ?, email = ?, mobile = ?, status = ?, occupation = ?, household_number = ?
      WHERE nic = ?
    `, [name, email, mobile_no, status, occupation, household_number, nic]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Resident not found.' });
    }

    return res.json({ message: 'Resident account updated successfully.' });
  } catch (error) {
    console.error('Error updating resident:', error);
    return res.status(500).json({ error: 'Server error updating resident details.' });
  }
};