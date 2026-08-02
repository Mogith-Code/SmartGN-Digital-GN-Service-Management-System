const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

let pool;

async function setupTables(dbPool) {
    // ============================================================
    // 1. GN DIVISION TABLE
    // ============================================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS gn_division (
        division_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        division_code VARCHAR(20) UNIQUE NOT NULL COMMENT 'e.g., GN-001A',
        name VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        province VARCHAR(100) NOT NULL,
        divisional_secretariat VARCHAR(255) NOT NULL COMMENT 'DS Division',
        population INT DEFAULT 0,
        household_count INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_division_code (division_code),
        INDEX idx_district (district),
        INDEX idx_province (province),
        INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

    // Add performance indexes for division table
    try {
        await dbPool.query(`CREATE INDEX idx_gn_division_name ON gn_division(name)`);
        await dbPool.query(`CREATE INDEX idx_gn_division_created ON gn_division(created_at DESC)`);
    } catch (e) {
        // Indexes might already exist
        console.log('📌 Division indexes already exist or could not be created');
    }

    // ============================================================
    // 2. HOUSEHOLD TABLE
    // ============================================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS household (
        household_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        household_number VARCHAR(50) UNIQUE NOT NULL,
        address TEXT NULL COMMENT 'Household address (synced with resident)',
        division_id VARCHAR(36) NOT NULL,
        head_of_household_nic VARCHAR(12) COMMENT 'Resident NIC',
        total_members INT DEFAULT 1,
        land_size VARCHAR(50) COMMENT 'Size of the land (e.g., 10 perches, 20 acres)',
        land_owner VARCHAR(255) COMMENT 'Name of the land owner',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (division_id) REFERENCES gn_division(division_id) ON DELETE CASCADE,
        INDEX idx_household_number (household_number),
        INDEX idx_division (division_id),
        INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`);

    // ============================================================
    // 3. RESIDENT TABLE
    // ============================================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS resident (
        r_nic VARCHAR(12) PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        full_name VARCHAR(101) NULL,
        date_of_birth DATE NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        mobile_no VARCHAR(15) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt hashed',
        occupation VARCHAR(100),
        household_number VARCHAR(50) NOT NULL,
        division_id VARCHAR(36) NOT NULL,
        
        -- Address field
        home_address TEXT,
        
        -- Images
        profile_photo_path VARCHAR(255),
        nic_front_path VARCHAR(255),
        nic_back_path VARCHAR(255),
        profile_photo_filename VARCHAR(255),
        nic_front_filename VARCHAR(255),
        nic_back_filename VARCHAR(255),
        
        -- Verification status
        status ENUM('Active', 'Inactive', 'Suspended', 'Pending') DEFAULT 'Pending',
        email_verified BOOLEAN DEFAULT FALSE,
        mobile_verified BOOLEAN DEFAULT FALSE,
        nic_verified BOOLEAN DEFAULT FALSE,
        
        -- Security
        failed_login_attempts INT DEFAULT 0,
        account_locked_until DATETIME DEFAULT NULL,
        last_login_at DATETIME DEFAULT NULL,
        last_login_ip VARCHAR(45),
        password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- 2FA
        two_factor_secret VARCHAR(255),
        is_2fa_enabled BOOLEAN DEFAULT FALSE,
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (household_number) REFERENCES household(household_number) ON DELETE RESTRICT,
        FOREIGN KEY (division_id) REFERENCES gn_division(division_id) ON DELETE RESTRICT,
        INDEX idx_nic (r_nic),
        INDEX idx_email (email),
        INDEX idx_mobile (mobile_no),
        INDEX idx_full_name (full_name),
        INDEX idx_household (household_number),
        INDEX idx_status (status),
        INDEX idx_nic_verified (nic_verified)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

    // ============================================================
    // 4. FAMILY MEMBER TABLE
    // ============================================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS family_member (
        member_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL,
        age INT NOT NULL CHECK (age >= 0 AND age <= 150),
        relationship ENUM('Head', 'Wife', 'Son', 'Daughter', 'Mother', 'Father', 'Sibling', 'Other') NOT NULL,
        nic VARCHAR(12) UNIQUE COMMENT 'NIC if available',
        gender ENUM('Male', 'Female', 'Other'),
        date_of_birth DATE,
        occupation VARCHAR(100),
        resident_nic VARCHAR(12) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        INDEX idx_resident (resident_nic),
        INDEX idx_relationship (relationship),
        INDEX idx_nic (nic)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

    // ============================================================
    // 5. GRAMA NILADHARI (GN Officer) TABLE
    // ============================================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS grama_niladhari (
        gn_id VARCHAR(20) PRIMARY KEY COMMENT 'e.g., GN-001',
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        full_name VARCHAR(101) NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        mobile VARCHAR(15) NOT NULL,
        division_id VARCHAR(36) NOT NULL COMMENT 'Assigned division',
        status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
        
        -- Profile image
        profile_photo_path VARCHAR(255),
        profile_photo_filename VARCHAR(255),
        
        -- GN ID Card images
        gn_front_path VARCHAR(255),
        gn_front_filename VARCHAR(255),
        gn_back_path VARCHAR(255),
        gn_back_filename VARCHAR(255),
        
        -- Security
        failed_login_attempts INT DEFAULT 0,
        account_locked_until DATETIME DEFAULT NULL,
        last_login_at DATETIME DEFAULT NULL,
        last_login_ip VARCHAR(45),
        password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- 2FA
        two_factor_secret VARCHAR(255),
        is_2fa_enabled BOOLEAN DEFAULT FALSE,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (division_id) REFERENCES gn_division(division_id) ON DELETE RESTRICT,
        INDEX idx_username (username),
        INDEX idx_email (email),
        INDEX idx_division (division_id),
        INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`);

    // ============================================================
    // 6. ADMIN TABLE
    // ============================================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS admin (
        admin_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        full_name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        role ENUM('SuperAdmin', 'Admin') DEFAULT 'Admin',
        status ENUM('Active', 'Inactive') DEFAULT 'Active',
        last_login_at DATETIME DEFAULT NULL,
        last_login_ip VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_username (username),
        INDEX idx_email (email),
        INDEX idx_role (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

    // ============================================================
    // 7. APPOINTMENT TABLES (Separated)
    // ============================================================
    
    // 7a. PENDING APPOINTMENTS
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS appointment_pending (
        appointment_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        appointment_number VARCHAR(20) UNIQUE NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        purpose VARCHAR(255) NOT NULL,
        contact_number VARCHAR(15) NOT NULL COMMENT 'Resident contact number',
        resident_nic VARCHAR(12) NOT NULL,
        gn_id VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE RESTRICT,
        INDEX idx_resident (resident_nic),
        INDEX idx_gn (gn_id),
        INDEX idx_date (date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7b. APPROVED APPOINTMENTS
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS appointment_approved (
        appointment_id VARCHAR(36) PRIMARY KEY,
        appointment_number VARCHAR(20) UNIQUE NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        purpose VARCHAR(255) NOT NULL,
        contact_number VARCHAR(15) NOT NULL COMMENT 'Resident contact number',
        resident_nic VARCHAR(12) NOT NULL,
        gn_id VARCHAR(20) NOT NULL,
        approved_by VARCHAR(20) NOT NULL,
        requested_at TIMESTAMP NOT NULL COMMENT 'Original request time from pending table',
        approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Time when approved',
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE RESTRICT,
        FOREIGN KEY (approved_by) REFERENCES grama_niladhari(gn_id) ON DELETE RESTRICT,
        INDEX idx_resident (resident_nic),
        INDEX idx_gn (gn_id),
        INDEX idx_date (date),
        INDEX idx_approved_at (approved_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7c. REJECTED APPOINTMENTS
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS appointment_rejected (
        appointment_id VARCHAR(36) PRIMARY KEY,
        appointment_number VARCHAR(20) UNIQUE NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        purpose VARCHAR(255) NOT NULL,
        contact_number VARCHAR(15) NOT NULL COMMENT 'Resident contact number',
        resident_nic VARCHAR(12) NOT NULL,
        gn_id VARCHAR(20) NOT NULL,
        rejected_by VARCHAR(20) NOT NULL,
        rejection_reason TEXT,
        requested_at TIMESTAMP NOT NULL COMMENT 'Original request time from pending table',
        rejected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Time when rejected',
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE RESTRICT,
        FOREIGN KEY (rejected_by) REFERENCES grama_niladhari(gn_id) ON DELETE RESTRICT,
        INDEX idx_resident (resident_nic),
        INDEX idx_gn (gn_id),
        INDEX idx_date (date),
        INDEX idx_rejected_at (rejected_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ============================================================
    // 8. CERTIFICATE TABLES (Separated) - FIXED
    // ============================================================
    
    // 8a. PENDING CERTIFICATES
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS certificate_pending (
        request_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        certificate_number VARCHAR(50) UNIQUE NOT NULL,
        certificate_type ENUM('RESIDENCE', 'INCOME', 'CHARACTER') NOT NULL,
        purpose VARCHAR(255) NOT NULL,
        request_date DATE NOT NULL,
        resident_nic VARCHAR(12) NOT NULL,
        gn_id VARCHAR(20),
        details JSON COMMENT 'Full certificate application form data',
        requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE SET NULL,
        INDEX idx_resident (resident_nic),
        INDEX idx_type (certificate_type),
        INDEX idx_request_date (request_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 8b. APPROVED CERTIFICATES
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS certificate_approved (
        request_id VARCHAR(36) PRIMARY KEY,
        certificate_number VARCHAR(50) UNIQUE NOT NULL,
        certificate_type ENUM('RESIDENCE', 'INCOME', 'CHARACTER') NOT NULL,
        purpose VARCHAR(255) NOT NULL,
        request_date DATE NOT NULL,
        resident_nic VARCHAR(12) NOT NULL,
        gn_id VARCHAR(20),
        approved_by VARCHAR(20) NOT NULL,
        gn_remarks TEXT,
        details JSON COMMENT 'Full certificate application form data',
        approved_at DATETIME DEFAULT NULL,
        issued_date DATE,
        expiry_date DATE,
        certificate_pdf_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE SET NULL,
        FOREIGN KEY (approved_by) REFERENCES grama_niladhari(gn_id) ON DELETE RESTRICT,
        INDEX idx_resident (resident_nic),
        INDEX idx_type (certificate_type),
        INDEX idx_approved_at (approved_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 8c. REJECTED CERTIFICATES
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS certificate_rejected (
        request_id VARCHAR(36) PRIMARY KEY,
        certificate_number VARCHAR(50) UNIQUE NOT NULL,
        certificate_type ENUM('RESIDENCE', 'INCOME', 'CHARACTER') NOT NULL,
        purpose VARCHAR(255) NOT NULL,
        request_date DATE NOT NULL,
        resident_nic VARCHAR(12) NOT NULL,
        gn_id VARCHAR(20),
        rejected_by VARCHAR(20) NOT NULL,
        rejection_reason TEXT,
        gn_remarks TEXT,
        details JSON COMMENT 'Full certificate application form data',
        rejected_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE SET NULL,
        FOREIGN KEY (rejected_by) REFERENCES grama_niladhari(gn_id) ON DELETE RESTRICT,
        INDEX idx_resident (resident_nic),
        INDEX idx_type (certificate_type),
        INDEX idx_rejected_at (rejected_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ============================================================
    // 9. ALLOWANCE TABLES (Separated)
    // ============================================================
    
    // 9a. PENDING ALLOWANCES
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS allowance_pending (
        allowance_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        allowance_number VARCHAR(50) UNIQUE NOT NULL,
        allowance_type ENUM('Aswesuma', 'Samurdhi', 'Disability', 'Elderly', 'Widow', 'Other') NOT NULL,
        application_date DATE NOT NULL,
        income_details TEXT NOT NULL,
        resident_nic VARCHAR(12) NOT NULL,
        gn_id VARCHAR(20),
        status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
        payment_status ENUM('UNPAID', 'PROCESSING', 'PAID') DEFAULT 'UNPAID',
        cleared_amount DECIMAL(12,2) DEFAULT 0.00,
        cleared_time DATETIME,
        txn_reference VARCHAR(50),
        bank_details TEXT,
        document_path LONGTEXT,
        requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE SET NULL,
        INDEX idx_resident (resident_nic),
        INDEX idx_type (allowance_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Ensure columns exist if table was created previously without them
    const alterCols = [
        "ALTER TABLE allowance_pending ADD COLUMN status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING'",
        "ALTER TABLE allowance_pending ADD COLUMN payment_status ENUM('UNPAID', 'PROCESSING', 'PAID') DEFAULT 'UNPAID'",
        "ALTER TABLE allowance_pending ADD COLUMN cleared_amount DECIMAL(12,2) DEFAULT 0.00",
        "ALTER TABLE allowance_pending ADD COLUMN cleared_time DATETIME",
        "ALTER TABLE allowance_pending ADD COLUMN txn_reference VARCHAR(50)",
        "ALTER TABLE allowance_pending ADD COLUMN bank_details TEXT",
        "ALTER TABLE allowance_pending ADD COLUMN document_path LONGTEXT"
    ];
    for (const q of alterCols) {
        try { await dbPool.query(q); } catch (e) { /* column exists */ }
    }

    // 9b. APPROVED ALLOWANCES
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS allowance_approved (
        allowance_id VARCHAR(36) PRIMARY KEY,
        allowance_number VARCHAR(50) UNIQUE NOT NULL,
        allowance_type ENUM('Aswesuma', 'Samurdhi', 'Disability', 'Elderly', 'Widow', 'Other') NOT NULL,
        application_date DATE NOT NULL,
        income_details TEXT NOT NULL,
        resident_nic VARCHAR(12) NOT NULL,
        gn_id VARCHAR(20),
        approved_by VARCHAR(20) NOT NULL,
        gn_remarks TEXT,
        approved_at DATETIME DEFAULT NULL,
        payment_status ENUM('UNPAID', 'PROCESSING', 'PAID') DEFAULT 'UNPAID',
        cleared_amount DECIMAL(12,2) DEFAULT 0.00,
        cleared_time DATETIME,
        txn_reference VARCHAR(50),
        bank_details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE SET NULL,
        FOREIGN KEY (approved_by) REFERENCES grama_niladhari(gn_id) ON DELETE RESTRICT,
        INDEX idx_resident (resident_nic),
        INDEX idx_type (allowance_type),
        INDEX idx_approved_at (approved_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 9c. REJECTED ALLOWANCES
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS allowance_rejected (
        allowance_id VARCHAR(36) PRIMARY KEY,
        allowance_number VARCHAR(50) UNIQUE NOT NULL,
        allowance_type ENUM('Aswesuma', 'Samurdhi', 'Disability', 'Elderly', 'Widow', 'Other') NOT NULL,
        application_date DATE NOT NULL,
        income_details TEXT NOT NULL,
        resident_nic VARCHAR(12) NOT NULL,
        gn_id VARCHAR(20),
        rejected_by VARCHAR(20) NOT NULL,
        rejection_reason TEXT,
        gn_remarks TEXT,
        rejected_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE SET NULL,
        FOREIGN KEY (rejected_by) REFERENCES grama_niladhari(gn_id) ON DELETE RESTRICT,
        INDEX idx_resident (resident_nic),
        INDEX idx_type (allowance_type),
        INDEX idx_rejected_at (rejected_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ============================================================
    // 10. DISASTER TABLES (Separated) - FIXED
    // ============================================================
    
    // 10a. PENDING DISASTER REQUESTS
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS disaster_pending (
        disaster_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        request_number VARCHAR(50) UNIQUE NOT NULL,
        disaster_type ENUM('Flood', 'Fire', 'Earthquake', 'Landslide', 'Cyclone', 'Drought', 'Pandemic', 'Other') NOT NULL,
        request_date DATE NOT NULL,
        description TEXT NOT NULL,
        severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
        location VARCHAR(255) NOT NULL,
        contact_number VARCHAR(15) NOT NULL,
        aid_requested TEXT,
        resident_nic VARCHAR(12) NOT NULL,
        gn_id VARCHAR(20) NOT NULL,
        requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE RESTRICT,
        INDEX idx_resident (resident_nic),
        INDEX idx_type (disaster_type),
        INDEX idx_severity (severity),
        INDEX idx_gn (gn_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 10b. APPROVED DISASTER REQUESTS
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS disaster_approved (
        disaster_id VARCHAR(36) PRIMARY KEY,
        request_number VARCHAR(50) UNIQUE NOT NULL,
        disaster_type ENUM('Flood', 'Fire', 'Earthquake', 'Landslide', 'Cyclone', 'Drought', 'Pandemic', 'Other') NOT NULL,
        request_date DATE NOT NULL,
        description TEXT NOT NULL,
        severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
        location VARCHAR(255) NOT NULL,
        contact_number VARCHAR(15) NOT NULL,
        aid_requested TEXT,
        relief_provided TEXT,
        resident_nic VARCHAR(12) NOT NULL,
        gn_id VARCHAR(20),
        approved_by VARCHAR(20) NOT NULL,
        officer_remarks TEXT,
        approved_at DATETIME DEFAULT NULL,
        estimated_damage DECIMAL(15,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE SET NULL,
        FOREIGN KEY (approved_by) REFERENCES grama_niladhari(gn_id) ON DELETE RESTRICT,
        INDEX idx_resident (resident_nic),
        INDEX idx_type (disaster_type),
        INDEX idx_approved_at (approved_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 10c. REJECTED DISASTER REQUESTS
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS disaster_rejected (
        disaster_id VARCHAR(36) PRIMARY KEY,
        request_number VARCHAR(50) UNIQUE NOT NULL,
        disaster_type ENUM('Flood', 'Fire', 'Earthquake', 'Landslide', 'Cyclone', 'Drought', 'Pandemic', 'Other') NOT NULL,
        request_date DATE NOT NULL,
        description TEXT NOT NULL,
        severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
        location VARCHAR(255) NOT NULL,
        contact_number VARCHAR(15) NOT NULL,
        aid_requested TEXT,
        resident_nic VARCHAR(12) NOT NULL,
        gn_id VARCHAR(20),
        rejected_by VARCHAR(20) NOT NULL,
        rejection_reason TEXT,
        officer_remarks TEXT,
        rejected_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE SET NULL,
        FOREIGN KEY (rejected_by) REFERENCES grama_niladhari(gn_id) ON DELETE RESTRICT,
        INDEX idx_resident (resident_nic),
        INDEX idx_type (disaster_type),
        INDEX idx_rejected_at (rejected_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 10d. RESOLVED DISASTER REQUESTS
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS disaster_resolved (
        disaster_id VARCHAR(36) PRIMARY KEY,
        request_number VARCHAR(50) UNIQUE NOT NULL,
        disaster_type ENUM('Flood', 'Fire', 'Earthquake', 'Landslide', 'Cyclone', 'Drought', 'Pandemic', 'Other') NOT NULL,
        request_date DATE NOT NULL,
        description TEXT NOT NULL,
        severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
        location VARCHAR(255) NOT NULL,
        contact_number VARCHAR(15) NOT NULL,
        aid_requested TEXT,
        relief_provided TEXT,
        resident_nic VARCHAR(12) NOT NULL,
        gn_id VARCHAR(20),
        admin_id VARCHAR(36),
        resolved_by VARCHAR(20) NOT NULL,
        resolved_at DATETIME DEFAULT NULL,
        resolution_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE SET NULL,
        FOREIGN KEY (admin_id) REFERENCES admin(admin_id) ON DELETE SET NULL,
        FOREIGN KEY (resolved_by) REFERENCES grama_niladhari(gn_id) ON DELETE RESTRICT,
        INDEX idx_resident (resident_nic),
        INDEX idx_type (disaster_type),
        INDEX idx_resolved_at (resolved_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ============================================================
    // 11. DOCUMENT TABLE
    // ============================================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS document (
        document_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        document_type ENUM('NIC_FRONT', 'NIC_BACK', 'PROFILE_PHOTO', 'UTILITY_BILL', 'INCOME_DOC', 'CERTIFICATE', 'OTHER') NOT NULL,
        file_path VARCHAR(512) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_size INT,
        mime_type VARCHAR(50),
        upload_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        resident_nic VARCHAR(12) NOT NULL,
        allowance_id VARCHAR(36),
        request_id VARCHAR(36),
        is_verified BOOLEAN DEFAULT FALSE,
        verified_by VARCHAR(20),
        verified_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        FOREIGN KEY (allowance_id) REFERENCES allowance_pending(allowance_id) ON DELETE CASCADE,
        FOREIGN KEY (request_id) REFERENCES certificate_pending(request_id) ON DELETE CASCADE,
        INDEX idx_resident (resident_nic),
        INDEX idx_type (document_type),
        INDEX idx_is_verified (is_verified)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ============================================================
    // 12. CHAT TABLES
    // ============================================================
    
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS chat_session (
        session_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        session_token VARCHAR(255) UNIQUE NOT NULL,
        start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        end_time DATETIME DEFAULT NULL,
        resident_nic VARCHAR(12) NOT NULL,
        division_id VARCHAR(36) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        total_messages INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (resident_nic) REFERENCES resident(r_nic) ON DELETE CASCADE,
        FOREIGN KEY (division_id) REFERENCES gn_division(division_id) ON DELETE CASCADE,
        INDEX idx_resident (resident_nic),
        INDEX idx_division (division_id),
        INDEX idx_session_token (session_token),
        INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS knowledge_base (
        knowledge_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category VARCHAR(100) NOT NULL COMMENT 'e.g., Certificates, Allowances, General',
        keywords TEXT COMMENT 'Comma-separated keywords for search',
        priority INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_category (category),
        INDEX idx_is_active (is_active),
        FULLTEXT INDEX idx_fulltext (question, answer, keywords)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS chat_message (
        message_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        message_text TEXT NOT NULL,
        sender_type ENUM('RESIDENT', 'SYSTEM') NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        session_id VARCHAR(36) NOT NULL,
        knowledge_id VARCHAR(36),
        is_response BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (session_id) REFERENCES chat_session(session_id) ON DELETE CASCADE,
        FOREIGN KEY (knowledge_id) REFERENCES knowledge_base(knowledge_id) ON DELETE SET NULL,
        INDEX idx_session (session_id),
        INDEX idx_sender_type (sender_type),
        INDEX idx_timestamp (timestamp)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ============================================================
    // 13. GOVERNMENT PROPERTY TABLE
    // ============================================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS government_property (
        property_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        property_code VARCHAR(50) UNIQUE NOT NULL,
        property_name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        condition_status ENUM('GOOD', 'NEEDS_REPAIR', 'DAMAGED', 'UNDER_RENOVATION') NOT NULL,
        property_type ENUM('Building', 'Land', 'Vehicle', 'Equipment', 'Other') NOT NULL,
        value DECIMAL(15,2),
        acquisition_date DATE,
        gn_id VARCHAR(20) NOT NULL,
        notes TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE CASCADE,
        INDEX idx_property_code (property_code),
        INDEX idx_gn (gn_id),
        INDEX idx_condition (condition_status),
        INDEX idx_type (property_type),
        INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ============================================================
    // 14. ANNOUNCEMENT TABLE
    // ============================================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS announcement (
        announcement_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        announcement_number VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        description TEXT NOT NULL,
        type ENUM('HEALTH', 'UTILITIES', 'EDUCATION', 'TRANSPORT', 'ENVIRONMENT', 'SOCIAL_WELFARE', 'OTHER') NOT NULL,
        priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
        target_audience TEXT COMMENT 'JSON array of target groups',
        gn_id VARCHAR(20) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (gn_id) REFERENCES grama_niladhari(gn_id) ON DELETE CASCADE,
        INDEX idx_announcement_number (announcement_number),
        INDEX idx_gn (gn_id),
        INDEX idx_type (type),
        INDEX idx_date (date),
        INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ============================================================
    // 15. AUDIT LOG TABLE
    // ============================================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS audit_log (
        log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_type ENUM('RESIDENT', 'GN_OFFICER', 'ADMIN') NOT NULL,
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
        INDEX idx_table (table_name),
        INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ============================================================
    // 16. NOTIFICATION TABLE
    // ============================================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS notification (
        notification_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        recipient_type ENUM('RESIDENT', 'GN_OFFICER', 'ADMIN') NOT NULL,
        recipient_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR') DEFAULT 'INFO',
        link VARCHAR(255),
        is_read BOOLEAN DEFAULT FALSE,
        read_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_recipient (recipient_type, recipient_id),
        INDEX idx_is_read (is_read),
        INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ============================================================
    // 17. LOGIN ATTEMPTS TABLE
    // ============================================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS login_attempts (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_type ENUM('RESIDENT', 'GN_OFFICER', 'ADMIN') NOT NULL,
        user_id VARCHAR(36),
        ip_address VARCHAR(45) NOT NULL,
        user_agent TEXT,
        success BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_user (user_type, user_id),
        INDEX idx_ip (ip_address),
        INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ============================================================
    // 18. SYSTEM SETTINGS TABLE
    // ============================================================
    await dbPool.query(`
    CREATE TABLE IF NOT EXISTS system_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT NOT NULL,
        description TEXT,
        category VARCHAR(50),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_category (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ============================================================
    // SEED GN DIVISIONS FROM PACKAGE - KEEP AS ORIGINAL
    // ============================================================
    let firstDivisionId = null;
    
    try {
        // Check if divisions exist before seeding
        const [divisionCount] = await dbPool.query('SELECT COUNT(*) as count FROM gn_division');
        if (divisionCount[0].count === 0) {
            console.log('🌱 Seeding GN divisions from package...');
            
            // Use the direct JSON import method
            const seedGnDivisions = require('../seed/seedGnDivisions');
            await seedGnDivisions(dbPool);
            console.log('✅ GN divisions seeded successfully from package');
        } else {
            console.log(`✅ GN divisions already exist (${divisionCount[0].count} records)`);
        }
        
        // Get the first division ID (GN-001A or any division)
        const [firstDivisionRow] = await dbPool.query(`
            SELECT division_id FROM gn_division 
            ORDER BY division_code ASC 
            LIMIT 1
        `);
        
        if (firstDivisionRow.length > 0) {
            firstDivisionId = firstDivisionRow[0].division_id;
            console.log(`📍 Using first division ID: ${firstDivisionId}`);
        } else {
            console.warn('⚠️ No division found after seeding. Please check the seed package.');
        }
    } catch (error) {
        console.warn('⚠️ Could not seed GN divisions from package:', error.message);
        console.log('📌 Falling back to manual division seeding...');
        
        // Fallback: Seed divisions manually if package fails
        const [divisionCount] = await dbPool.query('SELECT COUNT(*) as count FROM gn_division');
        if (divisionCount[0].count === 0) {
            const divisions = [
                ['GN-001A', 'Colombo Borella', 'Colombo', 'Western', 'Colombo Divisional Secretariat'],
                ['GN-001B', 'Colombo Fort', 'Colombo', 'Western', 'Colombo Divisional Secretariat'],
                ['GN-002A', 'Kandy Central', 'Kandy', 'Central', 'Kandy Divisional Secretariat']
            ];

            for (const [code, name, district, province, secretariat] of divisions) {
                await dbPool.query(`
                    INSERT INTO gn_division (division_id, division_code, name, district, province, divisional_secretariat)
                    VALUES (UUID(), ?, ?, ?, ?, ?)
                `, [code, name, district, province, secretariat]);
            }
            console.log('✅ GN divisions seeded manually (fallback)');
        }
        
        // Get the first division ID
        const [firstDivisionRow] = await dbPool.query(`
            SELECT division_id FROM gn_division 
            ORDER BY division_code ASC 
            LIMIT 1
        `);
        
        if (firstDivisionRow.length > 0) {
            firstDivisionId = firstDivisionRow[0].division_id;
            console.log(`📍 Using first division ID: ${firstDivisionId}`);
        }
    }

    // ============================================================
    // SEED HOUSEHOLD, RESIDENT, GN OFFICER, ADMIN
    // ============================================================
    
    if (firstDivisionId) {
        console.log('📌 Seeding related data for the first division...');
        
        // 1. SEED HOUSEHOLD
        const [householdCount] = await dbPool.query('SELECT COUNT(*) as count FROM household');
        if (householdCount[0].count === 0) {
            console.log('📌 Seeding household...');
            await dbPool.query(`
                INSERT INTO household (household_id, household_number, address, division_id) 
                VALUES (UUID(), 'H-90823', '45/2, Temple Road, Borella', ?)
            `, [firstDivisionId]);
            console.log('✅ Household seeded');
        } else {
            console.log(`✅ Household already exists (${householdCount[0].count} records)`);
        }

        // 2. SEED RESIDENT
        const [residentCount] = await dbPool.query('SELECT COUNT(*) as count FROM resident');
        if (residentCount[0].count === 0) {
            console.log('📌 Seeding resident...');
            const residentPasswordHash = bcrypt.hashSync('password123', 10);
            
            await dbPool.query(`
                INSERT INTO resident (
                    r_nic, first_name, last_name, full_name, date_of_birth, gender, mobile_no, email, 
                    password_hash, occupation, household_number, division_id, status, 
                    email_verified, mobile_verified, home_address
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, ?, ?)
            `, [
                '789456123V',
                'Nimal',
                'Perera',
                'Nimal Perera',
                '1990-05-15',
                'Male',
                '0771234567',
                'nimal@example.com',
                residentPasswordHash,
                'Engineer',
                'H-90823',
                firstDivisionId,
                true,
                true,
                '45/2, Temple Road, Borella'
            ]);
            console.log('✅ Resident seeded');
        } else {
            console.log(`✅ Resident already exists (${residentCount[0].count} records)`);
        }

        // 3. SEED GN OFFICER
        const [officerCount] = await dbPool.query('SELECT COUNT(*) as count FROM grama_niladhari');
        if (officerCount[0].count === 0) {
            console.log('📌 Seeding GN Officer...');
            const officerPasswordHash = bcrypt.hashSync('password123', 10);
            
            await dbPool.query(`
                INSERT INTO grama_niladhari (
                    gn_id, username, password_hash, first_name, last_name, full_name,
                    email, mobile, division_id, status, is_2fa_enabled
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', TRUE)
            `, [
                'GN-001',
                'kamal_gn',
                officerPasswordHash,
                'Kamal',
                'Perera',
                'Kamal Perera',
                'kamal.gn@example.com',
                '0703564478',
                firstDivisionId
            ]);
            console.log('✅ GN Officer seeded');
        } else {
            console.log(`✅ GN Officer already exists (${officerCount[0].count} records)`);
        }
    } else {
        console.warn('⚠️ No division ID available. Skipping household, resident, and GN officer seeding.');
    }

    // 4. SEED ADMIN (Always seed if not exists)
    const [adminCount] = await dbPool.query('SELECT COUNT(*) as count FROM admin');
    if (adminCount[0].count === 0) {
        console.log('📌 Seeding Admin...');
        const adminPasswordHash = bcrypt.hashSync('admin123', 10);
        
        await dbPool.query(`
            INSERT INTO admin (full_name, username, password_hash, email, role) 
            VALUES (?, ?, ?, ?, ?)
        `, [
            'System Administrator',
            'admin',
            adminPasswordHash,
            'admin@smartgn.gov.lk',
            'SuperAdmin'
        ]);
        console.log('✅ Admin seeded');
    } else {
        console.log(`✅ Admin already exists (${adminCount[0].count} records)`);
    }

    // 5. SEED SYSTEM SETTINGS
    const [settingsCount] = await dbPool.query('SELECT COUNT(*) as count FROM system_settings');
    if (settingsCount[0].count === 0) {
        console.log('📌 Seeding system settings...');
        await dbPool.query(`
            INSERT INTO system_settings (setting_key, setting_value, description, category) VALUES
            ('app_name', 'SmartGN', 'Application name', 'general'),
            ('app_version', '2.0.0', 'Application version', 'general'),
            ('max_login_attempts', '5', 'Maximum failed login attempts before lockout', 'security'),
            ('lockout_duration_minutes', '30', 'Account lockout duration in minutes', 'security'),
            ('session_timeout_minutes', '60', 'Session timeout in minutes', 'security'),
            ('certificate_validity_days', '365', 'Default certificate validity period', 'certificate')
        `);
        console.log('✅ System settings seeded');
    }

    // 6. SEED KNOWLEDGE BASE
    const [kbCount] = await dbPool.query('SELECT COUNT(*) as count FROM knowledge_base');
    if (kbCount[0].count === 0) {
        console.log('📌 Seeding knowledge base...');
        await dbPool.query(`
            INSERT INTO knowledge_base (question, answer, category) VALUES
            ('How to apply for a character certificate?', 'To apply for a character certificate, visit your local GN office or apply online through the SmartGN portal. You will need to provide your NIC and fill out the application form.', 'Certificates'),
            ('What is the Aswesuma allowance?', 'Aswesuma is a social welfare benefit program that provides financial assistance to low-income families in Sri Lanka.', 'Allowances'),
            ('How to report a disaster?', 'You can report a disaster through the SmartGN portal by creating a disaster request. Provide details about the disaster type, location, and your contact information.', 'Disaster')
        `);
        console.log('✅ Knowledge base seeded');
    }

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