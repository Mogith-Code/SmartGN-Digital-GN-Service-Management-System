const db = require('../config/database');

module.exports = {
  async findOfficerForResident(residentNic) {
    const [householdRows] = await db.query(`
      SELECT h.division_id
      FROM resident r
      JOIN household h ON r.household_number = h.household_number
      WHERE r.r_nic = ?
    `, [residentNic]);