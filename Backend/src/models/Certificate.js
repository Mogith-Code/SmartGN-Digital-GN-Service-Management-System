const db = require('../config/database');

module.exports = {
  async findOfficerForResident(residentNic) {
    try {
      const [residentRows] = await db.query(`
        SELECT r.division_id, r.r_nic, r.household_number
        FROM resident r
        WHERE r.r_nic = ?
      `, [residentNic]);

      if (residentRows.length === 0) {
        console.warn(`Resident with NIC ${residentNic} not found`);
        return null;
      }

      const resident = residentRows[0];
      let divisionId = resident.division_id;

      if (!divisionId && resident.household_number) {
        const [householdRows] = await db.query(`
          SELECT division_id FROM household WHERE household_number = ?
        `, [resident.household_number]);
        if (householdRows.length > 0) {
          divisionId = householdRows[0].division_id;
        }
      }

      if (!divisionId) {
        console.warn(`No division found for resident ${residentNic}`);
        return null;
      }

      const [officerRows] = await db.query(
        'SELECT gn_id FROM grama_niladhari WHERE division_id = ? AND status = "Active" LIMIT 1',
        [divisionId]
      );

      if (officerRows.length === 0) {
        console.warn(`No active GN officer found for division ${divisionId}`);
        return null;
      }

      return officerRows[0].gn_id;
    } catch (err) {
      console.error('Error finding officer for resident:', err);
      return null;
    }
  },

  async createPendingRequest(data) {
    const { certificateNumber, certificateType, purpose, requestDate, residentNic, gnId, details } = data;
    
    if (!certificateNumber || !certificateType || !purpose || !residentNic) {
      throw new Error('Missing required fields for certificate request');
    }

    const detailsJson = JSON.stringify(details || {});
    
    await db.query(`
      INSERT INTO certificate_pending
      (certificate_number, certificate_type, purpose, request_date, resident_nic, gn_id, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [certificateNumber, certificateType, purpose, requestDate, residentNic, gnId, detailsJson]);

    const [rows] = await db.query('SELECT request_id FROM certificate_pending WHERE certificate_number = ?', [certificateNumber]);
    return rows[0] ? rows[0].request_id : null;
  },

  async getResidentPendingRequests(residentNic) {
    const [rows] = await db.query(`
      SELECT request_id, certificate_number, certificate_type, purpose, request_date, details, requested_at
      FROM certificate_pending
      WHERE resident_nic = ?
      ORDER BY requested_at DESC
    `, [residentNic]);
    return rows;
  },

  async getResidentApprovedRequests(residentNic) {
    const [rows] = await db.query(`
      SELECT request_id, certificate_number, certificate_type, purpose, request_date, 
             gn_remarks, issued_date, expiry_date, details, approved_at
      FROM certificate_approved
      WHERE resident_nic = ?
      ORDER BY approved_at DESC
    `, [residentNic]);
    return rows;
  },

  async getResidentRejectedRequests(residentNic) {
    const [rows] = await db.query(`
      SELECT request_id, certificate_number, certificate_type, purpose, request_date,
             gn_remarks, rejection_reason, details, rejected_at
      FROM certificate_rejected
      WHERE resident_nic = ?
      ORDER BY rejected_at DESC
    `, [residentNic]);
    return rows;
  }
};