const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

let pool;

async function setupTables(dbPool) {
    // ============================================
    // 1. DIVISIONS TABLE
    // ============================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS divisions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // ============================================
    // 2. HOUSEHOLD DETAILS TABLE
    // ============================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS household_details (
      household_number VARCHAR(50) PRIMARY KEY,
      address VARCHAR(255),
      land_size VARCHAR(50),
      land_owner VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

    // ============================================
    // 3. RESIDENTS TABLE (with column checks)
    // ============================================
    // First, create table if not exists (basic structure)
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

    // Check and add missing columns
    try {
        // Check if profile_photo_path exists
        const [columns] = await dbPool.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'smartgn_db'}' 
            AND TABLE_NAME = 'residents'
        `);
        
        const columnNames = columns.map(c => c.COLUMN_NAME);
        
        // Add missing columns one by one
        if (!columnNames.includes('profile_photo_path')) {
            await dbPool.query(`ALTER TABLE residents ADD COLUMN profile_photo_path VARCHAR(255)`);
            console.log('✅ Added column: profile_photo_path');
        }
        if (!columnNames.includes('profile_photo_filename')) {
            await dbPool.query(`ALTER TABLE residents ADD COLUMN profile_photo_filename VARCHAR(255)`);
            console.log('✅ Added column: profile_photo_filename');
        }
        if (!columnNames.includes('nic_front_path')) {
            await dbPool.query(`ALTER TABLE residents ADD COLUMN nic_front_path VARCHAR(255)`);
            console.log('✅ Added column: nic_front_path');
        }
        if (!columnNames.includes('nic_front_filename')) {
            await dbPool.query(`ALTER TABLE residents ADD COLUMN nic_front_filename VARCHAR(255)`);
            console.log('✅ Added column: nic_front_filename');
        }
        if (!columnNames.includes('nic_back_path')) {
            await dbPool.query(`ALTER TABLE residents ADD COLUMN nic_back_path VARCHAR(255)`);
            console.log('✅ Added column: nic_back_path');
        }
        if (!columnNames.includes('nic_back_filename')) {
            await dbPool.query(`ALTER TABLE residents ADD COLUMN nic_back_filename VARCHAR(255)`);
            console.log('✅ Added column: nic_back_filename');
        }
        if (!columnNames.includes('nic_verified')) {
            await dbPool.query(`ALTER TABLE residents ADD COLUMN nic_verified BOOLEAN DEFAULT FALSE`);
            console.log('✅ Added column: nic_verified');
        }
        if (!columnNames.includes('updated_at')) {
            await dbPool.query(`ALTER TABLE residents ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
            console.log('✅ Added column: updated_at');
        }
    } catch (error) {
        console.log('⚠️ Some columns may already exist:', error.message);
    }

    // ============================================
    // 4. FAMILY MEMBERS TABLE
    // ============================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS family_members (
      id INT PRIMARY KEY AUTO_INCREMENT,
      r_nic VARCHAR(20) NOT NULL,
      name VARCHAR(255) NOT NULL,
      age INT NOT NULL,
      relationship VARCHAR(50) NOT NULL,
      nic VARCHAR(20),
      gender VARCHAR(10),
      date_of_birth DATE,
      occupation VARCHAR(100),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (r_nic) REFERENCES residents(nic) ON DELETE CASCADE,
      INDEX idx_r_nic (r_nic)
    )
  `);

    // ============================================
    // 5. OFFICERS TABLE
    // ============================================
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
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE
    )
  `);

    // ============================================
    // 6. ADMINS TABLE
    // ============================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id VARCHAR(20) PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

    // ============================================
    // 7. CERTIFICATES TABLE
    // ============================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS certificates (
      id INT PRIMARY KEY AUTO_INCREMENT,
      certificate_id VARCHAR(36) UNIQUE NOT NULL,
      r_nic VARCHAR(20) NOT NULL,
      certificate_type VARCHAR(50) NOT NULL,
      purpose VARCHAR(255) NOT NULL,
      request_date DATE NOT NULL,
      status VARCHAR(20) DEFAULT 'PENDING',
      rejection_reason TEXT,
      gn_remarks TEXT,
      officer_id VARCHAR(20),
      issued_date DATE,
      expiry_date DATE,
      certificate_pdf_path VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (r_nic) REFERENCES residents(nic) ON DELETE CASCADE,
      FOREIGN KEY (officer_id) REFERENCES officers(id) ON DELETE SET NULL,
      INDEX idx_r_nic (r_nic),
      INDEX idx_status (status)
    )
  `);

    // ============================================
    // 8. APPOINTMENTS TABLE
    // ============================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INT PRIMARY KEY AUTO_INCREMENT,
      appointment_id VARCHAR(36) UNIQUE NOT NULL,
      appointment_number VARCHAR(20) UNIQUE NOT NULL,
      r_nic VARCHAR(20) NOT NULL,
      officer_id VARCHAR(20) NOT NULL,
      date DATE NOT NULL,
      time TIME NOT NULL,
      purpose VARCHAR(255) NOT NULL,
      status VARCHAR(20) DEFAULT 'PENDING',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (r_nic) REFERENCES residents(nic) ON DELETE CASCADE,
      FOREIGN KEY (officer_id) REFERENCES officers(id) ON DELETE RESTRICT,
      INDEX idx_r_nic (r_nic),
      INDEX idx_officer (officer_id),
      INDEX idx_date (date)
    )
  `);

    // ============================================
    // 9. ALLOWANCE PROGRAMS TABLE
    // ============================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS allowance_programs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      allowance_id VARCHAR(36) UNIQUE NOT NULL,
      allowance_number VARCHAR(50) UNIQUE NOT NULL,
      r_nic VARCHAR(20) NOT NULL,
      allowance_type VARCHAR(100) NOT NULL,
      application_date DATE NOT NULL,
      income_details TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'PENDING',
      rejection_reason TEXT,
      gn_remarks TEXT,
      officer_id VARCHAR(20),
      payment_status VARCHAR(20) DEFAULT 'UNPAID',
      cleared_amount DECIMAL(12,2) DEFAULT 0.00,
      cleared_time DATETIME,
      txn_reference VARCHAR(50),
      bank_details TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (r_nic) REFERENCES residents(nic) ON DELETE CASCADE,
      FOREIGN KEY (officer_id) REFERENCES officers(id) ON DELETE SET NULL,
      INDEX idx_r_nic (r_nic),
      INDEX idx_status (status)
    )
  `);

    // ============================================
    // 10. DISASTER REPORTS TABLE
    // ============================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS disaster_reports (
      id INT PRIMARY KEY AUTO_INCREMENT,
      disaster_id VARCHAR(36) UNIQUE NOT NULL,
      report_number VARCHAR(50) UNIQUE NOT NULL,
      r_nic VARCHAR(20) NOT NULL,
      disaster_type VARCHAR(100) NOT NULL,
      report_date DATE NOT NULL,
      description TEXT NOT NULL,
      location VARCHAR(255) NOT NULL,
      contact_number VARCHAR(15) NOT NULL,
      severity VARCHAR(20) DEFAULT 'MEDIUM',
      status VARCHAR(30) DEFAULT 'PENDING',
      aid_requested TEXT,
      relief_provided TEXT,
      officer_remarks TEXT,
      officer_id VARCHAR(20),
      admin_id VARCHAR(20),
      estimated_damage DECIMAL(15,2),
      resolved_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (r_nic) REFERENCES residents(nic) ON DELETE CASCADE,
      FOREIGN KEY (officer_id) REFERENCES officers(id) ON DELETE SET NULL,
      FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL,
      INDEX idx_r_nic (r_nic),
      INDEX idx_status (status)
    )
  `);

    // ============================================
    // 11. ANNOUNCEMENTS TABLE
    // ============================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INT PRIMARY KEY AUTO_INCREMENT,
      announcement_id VARCHAR(36) UNIQUE NOT NULL,
      announcement_number VARCHAR(50) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      priority VARCHAR(20) DEFAULT 'MEDIUM',
      target_audience TEXT,
      officer_id VARCHAR(20) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      expires_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (officer_id) REFERENCES officers(id) ON DELETE CASCADE,
      INDEX idx_officer (officer_id),
      INDEX idx_is_active (is_active)
    )
  `);

    // ============================================
    // 12. AUDIT LOG TABLE
    // ============================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      user_type VARCHAR(20) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      action VARCHAR(100) NOT NULL,
      table_name VARCHAR(50),
      record_id VARCHAR(36),
      old_values JSON,
      new_values JSON,
      ip_address VARCHAR(45),
      user_agent TEXT,
      session_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user (user_type, user_id),
      INDEX idx_action (action),
      INDEX idx_created (created_at)
    )
  `);

    // ============================================
    // SEEDING DATA (ONLY IF NO DATA EXISTS)
    // ============================================

    // Check if divisions exist before seeding
    const [divisionCount] = await dbPool.query('SELECT COUNT(*) as count FROM divisions');
    if (divisionCount[0].count === 0) {
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
    }

    // Get division IDs for seeding
    const [maharagamaRows] = await dbPool.query('SELECT id FROM divisions WHERE name = "Maharagama"');
    const [colomboRows] = await dbPool.query('SELECT id FROM divisions WHERE name = "Colombo 03"');

    const maharagamaId = maharagamaRows.length > 0 ? maharagamaRows[0].id : 1;
    const colomboId = colomboRows.length > 0 ? colomboRows[0].id : 2;

    // Check if household_details exist before seeding
    const [householdCount] = await dbPool.query('SELECT COUNT(*) as count FROM household_details');
    if (householdCount[0].count === 0) {
        // 2. Seed Household Details
        await dbPool.query(`
        INSERT IGNORE INTO household_details (household_number, address, land_size, land_owner)
        VALUES (?, ?, ?, ?)
      `, ['HH-908', '45/2, Temple Road, Maharagama', '15 perches', 'Kamala Silva']);

        await dbPool.query(`
        INSERT IGNORE INTO household_details (household_number, address, land_size, land_owner)
        VALUES (?, ?, ?, ?)
      `, ['HH-341', '12, School Lane, Colombo 03', '20 perches', 'Ranasinghe Banda']);
    }

    // Check if admins exist before seeding
    const [adminCount] = await dbPool.query('SELECT COUNT(*) as count FROM admins');
    if (adminCount[0].count === 0) {
        const adminPasswordHash = bcrypt.hashSync('admin', 10);
        await dbPool.query(`
        INSERT IGNORE INTO admins (id, username, name, email, password)
        VALUES (?, ?, ?, ?, ?)
      `, ['ADMIN-001', 'admin', 'System Admin', 'admin@smartgn.gov.lk', adminPasswordHash]);
    }

    // Check if officers exist before seeding
    const [officerCount] = await dbPool.query('SELECT COUNT(*) as count FROM officers');
    if (officerCount[0].count === 0) {
        const officerPasswordHash = bcrypt.hashSync('officer', 10);
        await dbPool.query(`
        INSERT IGNORE INTO officers (id, username, name, email, mobile, division_id, password, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, ['GN-001', 'officer', 'Kamal Perera', 'kamal@smartgn.gov.lk', '0771234567', maharagamaId, officerPasswordHash, 'Active']);

        await dbPool.query(`
        INSERT IGNORE INTO officers (id, username, name, email, mobile, division_id, password, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, ['GN-002', 'saman_officer', 'Saman Kumara', 'saman@smartgn.gov.lk', '0719876543', colomboId, officerPasswordHash, 'Active']);
    }

    // Check if residents exist before seeding
    const [residentCount] = await dbPool.query('SELECT COUNT(*) as count FROM residents');
    if (residentCount[0].count === 0) {
        const residentPasswordHash = bcrypt.hashSync('resident', 10);
        await dbPool.query(`
        INSERT IGNORE INTO residents (
          nic, name, dob, password, gender, mobile, email, household_number, division_id, status, occupation,
          profile_photo_path, profile_photo_filename, nic_front_path, nic_front_filename, nic_back_path, nic_back_filename, nic_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            'Teacher',
            null,
            null,
            null,
            null,
            null,
            null,
            false
        ]);

        await dbPool.query(`
        INSERT IGNORE INTO residents (
          nic, name, dob, password, gender, mobile, email, household_number, division_id, status, occupation,
          profile_photo_path, profile_photo_filename, nic_front_path, nic_front_filename, nic_back_path, nic_back_filename, nic_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            'Farmer',
            null,
            null,
            null,
            null,
            null,
            null,
            false
        ]);

        // Seed Family Members
        await dbPool.query(`
        INSERT IGNORE INTO family_members (r_nic, name, age, relationship, gender)
        VALUES (?, ?, ?, ?, ?)
      `, ['197812345678V', 'Kamala Silva', 45, 'Head', 'Female']);

        await dbPool.query(`
        INSERT IGNORE INTO family_members (r_nic, name, age, relationship, gender)
        VALUES (?, ?, ?, ?, ?)
      `, ['197812345678V', 'Saman Silva', 47, 'Spouse', 'Male']);

        await dbPool.query(`
        INSERT IGNORE INTO family_members (r_nic, name, age, relationship, gender)
        VALUES (?, ?, ?, ?, ?)
      `, ['197812345678V', 'Nuwan Silva', 20, 'Son', 'Male']);

        await dbPool.query(`
        INSERT IGNORE INTO family_members (r_nic, name, age, relationship, gender)
        VALUES (?, ?, ?, ?, ?)
      `, ['199598765432V', 'Ranasinghe Banda', 28, 'Head', 'Male']);
    }

    console.log('✅ Database tables verified and seeded successfully.');
}

async function getPool() {
    if (pool) return pool;

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306
        });

        const dbName = process.env.DB_NAME || 'smartgn_db';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.end();

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