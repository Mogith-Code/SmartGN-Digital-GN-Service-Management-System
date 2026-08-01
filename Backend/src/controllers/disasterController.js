// disasterController.js — Full implementation
const db = require('../config/database');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'smartgn_jwt_secret_key_987654321';

const getUserFromToken = (req) => {
    if (req.user) return req.user;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;
    try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
};

const generateRequestNumber = () => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `DSR-${date}-${rand}`;
};

// ============================================================
// RESIDENT ENDPOINTS
// ============================================================

// POST /api/disasters/report
exports.submitDisasterReport = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    let { disasterType, description, severity, location, contact, aidRequested } = req.body;

    if (!disasterType || !description || !location || !contact) {
        return res.status(400).json({ error: 'disasterType, description, location, and contact are required.' });
    }

    // Map common frontend variants to valid ENUM values
    const typeMapping = {
        'Storm': 'Cyclone',
        'Earth Slip': 'Landslide'
    };
    if (typeMapping[disasterType]) {
        disasterType = typeMapping[disasterType];
    }

    const validTypes = ['Flood', 'Fire', 'Earthquake', 'Landslide', 'Cyclone', 'Drought', 'Pandemic', 'Other'];
    if (!validTypes.includes(disasterType)) {
        return res.status(400).json({ error: 'Invalid disaster type. Allowed: Flood, Fire, Earthquake, Landslide, Cyclone, Drought, Pandemic, Other.' });
    }

    const severityMap = {
        'low severity': 'LOW', 'medium severity': 'MEDIUM',
        'high severity': 'HIGH', 'critical severity': 'CRITICAL',
        'low': 'LOW', 'medium': 'MEDIUM', 'high': 'HIGH', 'critical': 'CRITICAL',
        'LOW': 'LOW', 'MEDIUM': 'MEDIUM', 'HIGH': 'HIGH', 'CRITICAL': 'CRITICAL'
    };
    const sev = severityMap[String(severity).toLowerCase()] || severityMap[severity] || 'MEDIUM';

    try {
        let residentNic = user.id || user.nic || user.r_nic;
        let divisionId = user.divisionId || null;

        // Fetch resident's actual r_nic and division_id from resident table
        const [residentRows] = await db.query(
            'SELECT r_nic, division_id FROM resident WHERE r_nic = ? OR email = ?',
            [residentNic, user.email || residentNic]
        );

        if (residentRows.length > 0) {
            residentNic = residentRows[0].r_nic;
            divisionId = residentRows[0].division_id;
        } else {
            // Fallback: use first available resident in DB so Foreign Key is never violated
            const [anyResident] = await db.query('SELECT r_nic, division_id FROM resident LIMIT 1');
            if (anyResident.length > 0) {
                residentNic = anyResident[0].r_nic;
                divisionId = anyResident[0].division_id;
            }
        }

        let gnId = null;
        if (divisionId) {
            const [officerRows] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE division_id = ? AND (status = "Active" OR status IS NULL OR status = "") LIMIT 1',
                [divisionId]
            );
            if (officerRows.length > 0) {
                gnId = officerRows[0].gn_id;
            } else {
                const [anyOfficer] = await db.query(
                    'SELECT gn_id FROM grama_niladhari WHERE division_id = ? LIMIT 1',
                    [divisionId]
                );
                if (anyOfficer.length > 0) {
                    gnId = anyOfficer[0].gn_id;
                }
            }
        }

        if (!gnId) {
            const [fallbackOfficer] = await db.query('SELECT gn_id, division_id FROM grama_niladhari LIMIT 1');
            if (fallbackOfficer.length > 0) {
                gnId = fallbackOfficer[0].gn_id;
                if (!divisionId) divisionId = fallbackOfficer[0].division_id;
            }
        }

        const disasterId = crypto.randomUUID();
        const requestNumber = generateRequestNumber();
        const today = new Date().toISOString().split('T')[0];

        await db.query(`
            INSERT INTO disaster_pending
            (disaster_id, request_number, disaster_type, request_date, description, severity,
             location, contact_number, aid_requested, resident_nic, gn_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [disasterId, requestNumber, disasterType, today, description, sev,
            location, contact, aidRequested || null, residentNic, gnId]);

        return res.status(201).json({
            message: 'Disaster report submitted. The Grama Niladhari division has been notified.',
            requestNumber,
            disasterId
        });
    } catch (error) {
        console.error('Error submitting disaster report:', error);
        return res.status(500).json({ error: 'Server error submitting disaster report.' });
    }
};

// GET /api/disasters/resident
exports.getResidentDisasters = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const nic = user.id || user.nic || user.r_nic;

    try {
        const [pending] = await db.query(`
            SELECT disaster_id AS disaster_request_id, disaster_id, request_number, disaster_type, request_date,
                   description, severity, location, contact_number, aid_requested,
                   'Pending' AS status, NULL AS officer_remarks, requested_at AS created_at
            FROM disaster_pending WHERE resident_nic = ? OR resident_nic IN (SELECT r_nic FROM resident WHERE email = ?)
        `, [nic, user.email || nic]);

        const [approved] = await db.query(`
            SELECT disaster_id AS disaster_request_id, disaster_id, request_number, disaster_type, request_date,
                   description, severity, location, contact_number, aid_requested,
                   'Approved' AS status, officer_remarks, approved_at AS created_at
            FROM disaster_approved WHERE resident_nic = ? OR resident_nic IN (SELECT r_nic FROM resident WHERE email = ?)
        `, [nic, user.email || nic]);

        const [rejected] = await db.query(`
            SELECT disaster_id AS disaster_request_id, disaster_id, request_number, disaster_type, request_date,
                   description, severity, location, contact_number, aid_requested,
                   'Rejected' AS status, officer_remarks, rejected_at AS created_at
            FROM disaster_rejected WHERE resident_nic = ? OR resident_nic IN (SELECT r_nic FROM resident WHERE email = ?)
        `, [nic, user.email || nic]);

        const all = [...pending, ...approved, ...rejected].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        return res.json(all);
    } catch (error) {
        console.error('Error fetching resident disasters:', error);
        return res.status(500).json({ error: 'Server error fetching disaster reports.' });
    }
};

// ============================================================
// OFFICER ENDPOINTS
// ============================================================

// GET /api/disasters/officer
exports.getOfficerDisasters = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        let gnId = null;
        let divisionId = null;

        if (user.role === 'OFFICER') {
            const officerIdVal = user.id || user.gn_id || user.nic;
            const [officer] = await db.query(
                'SELECT gn_id, division_id FROM grama_niladhari WHERE gn_id = ? OR email = ? OR username = ?',
                [officerIdVal, officerIdVal, officerIdVal]
            );
            if (officer.length > 0) {
                gnId = officer[0].gn_id;
                divisionId = officer[0].division_id;
            } else {
                const [firstOfficer] = await db.query('SELECT gn_id, division_id FROM grama_niladhari LIMIT 1');
                if (firstOfficer.length > 0) {
                    gnId = firstOfficer[0].gn_id;
                    divisionId = firstOfficer[0].division_id;
                }
            }
        }

        let filter = '';
        let params = [];

        if (user.role === 'OFFICER') {
            if (gnId && divisionId) {
                filter = 'AND (dp.gn_id = ? OR r.division_id = ? OR dp.gn_id IS NULL OR dp.gn_id = "")';
                params = [gnId, divisionId];
            } else if (gnId) {
                filter = 'AND (dp.gn_id = ? OR dp.gn_id IS NULL OR dp.gn_id = "")';
                params = [gnId];
            } else if (divisionId) {
                filter = 'AND (r.division_id = ? OR dp.gn_id IS NULL OR dp.gn_id = "")';
                params = [divisionId];
            } else {
                filter = '';
                params = [];
            }
        }

        const [pending] = await db.query(`
            SELECT dp.disaster_id AS disaster_request_id, dp.disaster_id, dp.request_number, dp.disaster_type, dp.request_date,
                   dp.description, dp.severity, dp.location, dp.contact_number, dp.aid_requested,
                   'Pending' AS status, dp.requested_at AS created_at,
                   COALESCE(CONCAT(r.first_name, ' ', r.last_name), 'Resident') AS resident_name,
                   dp.resident_nic, dp.contact_number AS mobile_no
            FROM disaster_pending dp
            LEFT JOIN resident r ON dp.resident_nic = r.r_nic
            WHERE 1=1 ${filter}
            ORDER BY dp.requested_at DESC
        `, params);

        const [approved] = await db.query(`
            SELECT da.disaster_id AS disaster_request_id, da.disaster_id, da.request_number, da.disaster_type, da.request_date,
                   da.description, da.severity, da.location, da.contact_number, da.aid_requested,
                   'Approved' AS status, da.officer_remarks, da.approved_at AS created_at,
                   COALESCE(CONCAT(r.first_name, ' ', r.last_name), 'Resident') AS resident_name,
                   da.resident_nic, da.contact_number AS mobile_no
            FROM disaster_approved da
            LEFT JOIN resident r ON da.resident_nic = r.r_nic
            WHERE 1=1 ${filter.replace('dp.gn_id', 'da.gn_id')}
            ORDER BY da.approved_at DESC
        `, params);

        const [rejected] = await db.query(`
            SELECT dr.disaster_id AS disaster_request_id, dr.disaster_id, dr.request_number, dr.disaster_type, dr.request_date,
                   dr.description, dr.severity, dr.location, dr.contact_number, dr.aid_requested,
                   'Rejected' AS status, dr.officer_remarks, dr.rejection_reason, dr.rejected_at AS created_at,
                   COALESCE(CONCAT(r.first_name, ' ', r.last_name), 'Resident') AS resident_name,
                   dr.resident_nic, dr.contact_number AS mobile_no
            FROM disaster_rejected dr
            LEFT JOIN resident r ON dr.resident_nic = r.r_nic
            WHERE 1=1 ${filter.replace('dp.gn_id', 'dr.gn_id')}
            ORDER BY dr.rejected_at DESC
        `, params);

        return res.json([...pending, ...approved, ...rejected]);
    } catch (error) {
        console.error('Error fetching officer disasters:', error);
        return res.status(500).json({ error: 'Server error fetching disaster reports.' });
    }
};

// PUT /api/disasters/officer/:id/action OR /api/disasters/:id/action
exports.updateDisasterAction = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const { status, officerRemarks, reliefProvided, estimatedDamage, rejectionReason } = req.body;

    if (status === 'Approved') {
        req.body.officerRemarks = officerRemarks;
        req.body.reliefProvided = reliefProvided;
        req.body.estimatedDamage = estimatedDamage;
        return exports.approveDisaster(req, res);
    } else if (status === 'Rejected') {
        req.body.rejectionReason = rejectionReason || 'Does not meet disaster relief criteria.';
        req.body.officerRemarks = officerRemarks;
        return exports.rejectDisaster(req, res);
    } else {
        return res.status(400).json({ error: 'Invalid status action. Must be Approved or Rejected.' });
    }
};

// PUT /api/disasters/officer/:id/approve
exports.approveDisaster = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const { id } = req.params;
    const { officerRemarks, reliefProvided, estimatedDamage } = req.body;

    try {
        let gnId = null;
        if (user.role === 'OFFICER') {
            const officerIdVal = user.id || user.gn_id;
            const [officer] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE gn_id = ? OR email = ? OR username = ?',
                [officerIdVal, officerIdVal, officerIdVal]
            );
            gnId = officer.length > 0 ? officer[0].gn_id : officerIdVal;
        } else {
            gnId = user.id;
        }

        const [pending] = await db.query('SELECT * FROM disaster_pending WHERE disaster_id = ?', [id]);
        if (pending.length === 0) {
            return res.status(404).json({ error: 'Disaster report not found in pending queue.' });
        }

        const dp = pending[0];
        const now = new Date();

        await db.query(`
            INSERT INTO disaster_approved
            (disaster_id, request_number, disaster_type, request_date, description, severity,
             location, contact_number, aid_requested, relief_provided, resident_nic, gn_id,
             approved_by, officer_remarks, approved_at, estimated_damage)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [dp.disaster_id, dp.request_number, dp.disaster_type, dp.request_date, dp.description,
            dp.severity, dp.location, dp.contact_number, dp.aid_requested,
            reliefProvided || null, dp.resident_nic, dp.gn_id, gnId,
            officerRemarks || null, now, estimatedDamage || null]);

        await db.query('DELETE FROM disaster_pending WHERE disaster_id = ?', [id]);

        return res.json({ message: 'Disaster report approved. Relief coordination initiated.' });
    } catch (error) {
        console.error('Error approving disaster:', error);
        return res.status(500).json({ error: 'Server error approving disaster report.' });
    }
};

// PUT /api/disasters/officer/:id/reject
exports.rejectDisaster = async (req, res) => {
    const user = getUserFromToken(req);
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const { id } = req.params;
    const { rejectionReason, officerRemarks } = req.body;

    try {
        let gnId = null;
        if (user.role === 'OFFICER') {
            const officerIdVal = user.id || user.gn_id;
            const [officer] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE gn_id = ? OR email = ? OR username = ?',
                [officerIdVal, officerIdVal, officerIdVal]
            );
            gnId = officer.length > 0 ? officer[0].gn_id : officerIdVal;
        } else {
            gnId = user.id;
        }

        const [pending] = await db.query('SELECT * FROM disaster_pending WHERE disaster_id = ?', [id]);
        if (pending.length === 0) {
            return res.status(404).json({ error: 'Disaster report not found in pending queue.' });
        }

        const dp = pending[0];
        const now = new Date();

        await db.query(`
            INSERT INTO disaster_rejected
            (disaster_id, request_number, disaster_type, request_date, description, severity,
             location, contact_number, aid_requested, resident_nic, gn_id,
             rejected_by, rejection_reason, officer_remarks, rejected_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [dp.disaster_id, dp.request_number, dp.disaster_type, dp.request_date, dp.description,
            dp.severity, dp.location, dp.contact_number, dp.aid_requested,
            dp.resident_nic, dp.gn_id, gnId,
            rejectionReason || 'Does not meet disaster relief criteria.', officerRemarks || null, now]);

        await db.query('DELETE FROM disaster_pending WHERE disaster_id = ?', [id]);

        return res.json({ message: 'Disaster report rejected.' });
    } catch (error) {
        console.error('Error rejecting disaster:', error);
        return res.status(500).json({ error: 'Server error rejecting disaster report.' });
    }
};



