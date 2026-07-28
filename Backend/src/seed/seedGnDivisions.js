// src/seed/seedGnDivisions.js
const { getDistricts, getCities, getDNDivisions } = require('@rdilshan/gn-division');
const db = require('../config/database');

/**
 * Seed all GN divisions from the package into the database
 * This handles all districts, cities, and GN divisions from the JSON data
 */
async function seedGnDivisions() {
    try {
        console.log('🌱 Starting GN Divisions seeding...');
        console.log('⏳ This will insert all GN divisions. Please wait...');
        
        const startTime = Date.now();

        // Get all districts from the package
        const districts = getDistricts();
        console.log(`📋 Found ${districts.length} districts in Sri Lanka`);

        // Check if divisions already exist
        const [existingCount] = await db.query('SELECT COUNT(*) as count FROM gn_division');
        if (existingCount[0].count > 0) {
            console.log(`⚠️ ${existingCount[0].count} divisions already exist.`);
            console.log('💡 To re-seed, truncate the gn_division table first:');
            console.log('   TRUNCATE TABLE gn_division;');
            return;
        }

        let totalDivisions = 0;
        let totalCities = 0;
        let batchSize = 500;
        let batch = [];
        let batchCount = 0;

        for (const district of districts) {
            console.log(`\n📌 Processing district: ${district}`);
            
            // Get cities for this district
            const cities = getCities(district);
            console.log(`  📍 ${cities.length} cities in ${district}`);

            for (const city of cities) {
                // Get GN divisions for this city
                const divisions = getDNDivisions(district, city);
                console.log(`    📌 ${divisions.length} divisions in ${city}`);

                // Determine province based on district
                const province = getProvinceByDistrict(district);

                for (const divisionName of divisions) {
                    // Generate a unique division_code
                    const divisionCode = generateDivisionCode(district, city, divisionName);
                    
                    batch.push([
                        divisionCode,
                        divisionName,
                        district,
                        province,
                        city,
                        true // is_active
                    ]);
                    
                    totalDivisions++;

                    // Insert batch when it reaches batchSize
                    if (batch.length >= batchSize) {
                        await insertBatch(batch);
                        batchCount++;
                        console.log(`  ✅ Inserted ${batchCount * batchSize} divisions so far...`);
                        batch = [];
                    }
                }
                totalCities++;
            }
        }

        // Insert remaining records
        if (batch.length > 0) {
            await insertBatch(batch);
            console.log(`  ✅ Final batch inserted (${batch.length} records)`);
        }

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        console.log('\n✅ GN Divisions seeding completed successfully!');
        console.log(`📊 Summary:`);
        console.log(`   - ${districts.length} districts processed`);
        console.log(`   - ${totalCities} cities processed`);
        console.log(`   - ${totalDivisions} GN divisions inserted`);
        console.log(`   - ⏱️  Time taken: ${duration.toFixed(2)} seconds`);

        // Verify the count
        const [countResult] = await db.query('SELECT COUNT(*) as total FROM gn_division');
        console.log(`   - ✅ Verified: ${countResult[0].total} records in database`);

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        console.error('Stack trace:', error.stack);
        throw error;
    }
}

/**
 * Insert a batch of divisions
 */
async function insertBatch(batch) {
    const values = batch.map(row => 
        `(UUID(), '${row[0].replace(/'/g, "''")}', '${row[1].replace(/'/g, "''")}', '${row[2].replace(/'/g, "''")}', '${row[3].replace(/'/g, "''")}', '${row[4].replace(/'/g, "''")}', ${row[5]})`
    ).join(',');

    await db.query(`
        INSERT INTO gn_division (
            division_id,
            division_code,
            name,
            district,
            province,
            divisional_secretariat,
            is_active
        ) VALUES ${values}
    `);
}

/**
 * Get province by district name
 */
function getProvinceByDistrict(district) {
    const provinceMap = {
        'Colombo': 'Western',
        'Gampaha': 'Western',
        'Kalutara': 'Western',
        'Kandy': 'Central',
        'Matale': 'Central',
        'Nuwara Eliya': 'Central',
        'Galle': 'Southern',
        'Matara': 'Southern',
        'Hambantota': 'Southern',
        'Jaffna': 'Northern',
        'Kilinochchi': 'Northern',
        'Mannar': 'Northern',
        'Mullaitivu': 'Northern',
        'Vavuniya': 'Northern',
        'Batticaloa': 'Eastern',
        'Ampara': 'Eastern',
        'Trincomalee': 'Eastern',
        'Kurunegala': 'North Western',
        'Puttalam': 'North Western',
        'Anuradhapura': 'North Central',
        'Polonnaruwa': 'North Central',
        'Badulla': 'Uva',
        'Monaragala': 'Uva',
        'Ratnapura': 'Sabaragamuwa',
        'Kegalle': 'Sabaragamuwa'
    };
    return provinceMap[district] || 'Unknown';
}

/**
 * Generate a unique division code
 */
function generateDivisionCode(district, city, division) {
    // Take first 3 letters of district, city, and division
    const districtCode = district.substring(0, 3).toUpperCase();
    const cityCode = city.substring(0, 3).toUpperCase();
    const divisionCode = division.substring(0, 3).toUpperCase();
    
    // Generate a hash for uniqueness
    const hash = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    return `GN-${districtCode}-${cityCode}-${divisionCode}-${hash}`;
}

module.exports = seedGnDivisions;