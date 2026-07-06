const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

let pool;

async function setupTables(dbPool) {
  // 1. Create divisions table
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS divisions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL
    )
  `);

  // 2. Create residents table
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS residents (
      nic VARCHAR(20) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      dob DATE NOT NULL,
      password VARCHAR(255) NOT NULL,
      gender VARCHAR(10) NOT NULL,
      mobile VARCHAR(20) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      household_number VARCHAR(50) NOT NULL,
      division_id INT NOT NULL,
      status VARCHAR(20) DEFAULT 'Active',
      occupation VARCHAR(100) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE
    )
  `);

  // 3. Create officers table
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS officers (
      id VARCHAR(20) PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      mobile VARCHAR(20) NOT NULL,
      division_id INT NOT NULL,
      password VARCHAR(255) NOT NULL,
      status VARCHAR(20) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE
    )
  `);

  // 4. Create admins table
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id VARCHAR(20) PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

   // 1. Seed Divisions
  const defaultDivisions = [
    'Maharagama', 
    'Colombo 03', 
    'Colombo 07', 
    'Galle Fort', 
    'Kandy Town', 
    'Negombo South', 
    'Colombo, Borella'
  ];

  for (const divName of defaultDivisions) {
    await dbPool.query('INSERT IGNORE INTO divisions (name) VALUES (?)', [divName]);
  }

  // Get Maharagama and Colombo division IDs for seeding
  const [[maharagamaDiv]] = await dbPool.query('SELECT id FROM divisions WHERE name = "Maharagama"');
  const [[colomboDiv]] = await dbPool.query('SELECT id FROM divisions WHERE name = "Colombo 03"');

  const maharagamaId = maharagamaDiv ? maharagamaDiv.id : 1;
  const colomboId = colomboDiv ? colomboDiv.id : 2;
