const db = require('../config/database');

module.exports = {
  async findOfficerForResident(residentNic) {
    try {
      const [residentRows] = await db.query(`
        SELECT r.division_id, h.division_id AS h_division_id
        FROM resident r
        LEFT JOIN household h ON r.household_number = h.household_number
        WHERE r.r_nic = ? OR r.email = ?
      `, [residentNic, residentNic]);


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