const db = require('../config/database');

module.exports = {
  async findOfficerForResident(residentNic) {
    const [householdRows] = await db.query(`
      SELECT h.division_id
      FROM resident r
      JOIN household h ON r.household_number = h.household_number
      WHERE r.r_nic = ?
    `, [residentNic]);

    if (householdRows.length === 0) return null;

    const [officerRows] = await db.query(
      'SELECT gn_id FROM grama_niladhari WHERE division_id = ? AND status = "Active" LIMIT 1',
      [householdRows[0].division_id]
    );

    return officerRows.length > 0 ? officerRows[0].gn_id : null;
  },

  async createPendingRequest(data) {
    const { certificateNumber, certificateType, purpose, requestDate, residentNic, gnId, details } = data;
    await db.query(`
      INSERT INTO certificate_pending
      (certificate_number, certificate_type, purpose, request_date, resident_nic, gn_id, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [certificateNumber, certificateType, purpose, requestDate, residentNic, gnId, JSON.stringify(details || {})]);

    const [rows] = await db.query('SELECT request_id FROM certificate_pending WHERE certificate_number = ?', [certificateNumber]);
    return rows[0] ? rows[0].request_id : null;
  }
};