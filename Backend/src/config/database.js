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

    // 2. Create household_details table
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS household_details (
      household_number VARCHAR(50) PRIMARY KEY,
      address VARCHAR(255),
      land_size VARCHAR(50) COMMENT 'Size of the land (e.g., 10 perches, 20 acres)',
      land_owner VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

    // 3. Create residents table
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
      FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE,
      FOREIGN KEY (household_number) REFERENCES household_details(household_number) ON DELETE RESTRICT
    )
  `);

    // 4. Create officers table
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

    // 5. Create admins table
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

    // 6. Seed Divisions
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

    // Get division IDs for seeding
    const [[maharagamaDiv]] = await dbPool.query('SELECT id FROM divisions WHERE name = "Maharagama"');
    const [[colomboDiv]] = await dbPool.query('SELECT id FROM divisions WHERE name = "Colombo 03"');

    const maharagamaId = maharagamaDiv ? maharagamaDiv.id : 1;
    const colomboId = colomboDiv ? colomboDiv.id : 2;

    // 7. Seed Household Details
    await dbPool.query(`
    INSERT IGNORE INTO household_details (household_number, address, land_size, land_owner)
    VALUES (?, ?, ?, ?)
  `, ['HH-908', '45/2, Temple Road, Maharagama', '15 perches', 'Kamala Silva']);

    await dbPool.query(`
    INSERT IGNORE INTO household_details (household_number, address, land_size, land_owner)
    VALUES (?, ?, ?, ?)
  `, ['HH-341', '12, School Lane, Colombo 03', '20 perches', 'Ranasinghe Banda']);

    // 8. Seed Admin
    const adminPasswordHash = bcrypt.hashSync('admin', 10);
    await dbPool.query(`
    INSERT IGNORE INTO admins (id, username, name, email, password)
    VALUES (?, ?, ?, ?, ?)
  `, ['ADMIN-001', 'admin', 'System Admin', 'admin@smartgn.gov.lk', adminPasswordHash]);

    // 9. Seed Officers
    const officerPasswordHash = bcrypt.hashSync('officer', 10);
    await dbPool.query(`
    INSERT IGNORE INTO officers (id, username, name, email, mobile, division_id, password, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, ['GN-001', 'officer', 'Kamal Perera', 'kamal@smartgn.gov.lk', '0771234567', maharagamaId, officerPasswordHash, 'Active']);

    await dbPool.query(`
    INSERT IGNORE INTO officers (id, username, name, email, mobile, division_id, password, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, ['GN-002', 'saman_officer', 'Saman Kumara', 'saman@smartgn.gov.lk', '0719876543', colomboId, officerPasswordHash, 'Active']);

    // 10. Seed Residents
    const residentPasswordHash = bcrypt.hashSync('resident', 10);
    await dbPool.query(`
    INSERT IGNORE INTO residents (nic, name, dob, password, gender, mobile, email, household_number, division_id, status, occupation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
        '197812345678V',
        'Kamala Silva',
        '1978-05-12',
        residentPasswordHash,
        'Female',
        '0723456789',
        'kamala@gmail.com',
        'HH-908',
        maharagamaId,
        'Active',
        'Teacher'
    ]);

    await dbPool.query(`
    INSERT IGNORE INTO residents (nic, name, dob, password, gender, mobile, email, household_number, division_id, status, occupation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
        '199598765432V',
        'Ranasinghe Banda',
        '1995-11-20',
        residentPasswordHash,
        'Male',
        '0765432109',
        'ranasinghe@gmail.com',
        'HH-341',
        colomboId,
        'Active',
        'Farmer'
    ]);

    console.log('✅ Database tables verified and seeded successfully.');
}

async function getPool() {
    if (pool) return pool;

    try {
        // Connect to MySQL server first (without database to ensure we can create it)
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306
        });

        const dbName = process.env.DB_NAME || 'smartgn_db';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.end();

        // Create the connection pool with database selected
        pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: dbName,
            port: process.env.DB_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Run table setups and seeds
        await setupTables(pool);

        return pool;
    } catch (error) {
        console.error('❌ Failed to connect to MySQL database:', error.message);
        throw error;
    }
}

module.exports = {
    getPool,
    query: async (sql, params) => {
        const activePool = await getPool();
        return activePool.query(sql, params);
    }
};