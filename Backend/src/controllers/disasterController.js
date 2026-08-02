const db = require('../config/database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'smartgn_jwt_secret_key_987654321';

const getUserFromToken = (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;
    try { 
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded; 
    } catch { 
        return null; 
    }
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

    const { disasterType, description, severity, location, contact, aidRequested } = req.body;

    if (!disasterType || !description || !location || !contact) {
        return res.status(400).json({ error: 'disasterType, description, location, and contact are required.' });
    }

    const validTypes = ['Flood', 'Fire', 'Earthquake', 'Landslide', 'Cyclone', 'Drought', 'Pandemic', 'Other'];
    if (!validTypes.includes(disasterType)) {
        return res.status(400).json({ error: 'Invalid disaster type.' });
    }

    const severityMap = {
        'low severity': 'LOW', 'medium severity': 'MEDIUM',
        'high severity': 'HIGH', 'critical severity': 'CRITICAL',
        'LOW': 'LOW', 'MEDIUM': 'MEDIUM', 'HIGH': 'HIGH', 'CRITICAL': 'CRITICAL'
    };
    const sev = severityMap[severity] || 'MEDIUM';

    try {
        const residentNic = user.id;

        // Get resident's division and find GN officer
        const [residentRows] = await db.query(`
            SELECT r.division_id
            FROM resident r
            WHERE r.r_nic = ?
        `, [residentNic]);

        let gnId = null;
        if (residentRows.length > 0) {
            const [officerRows] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE division_id = ? AND status = "Active" LIMIT 1',
                [residentRows[0].division_id]
            );
            gnId = officerRows.length > 0 ? officerRows[0].gn_id : null;
        }

        if (!gnId) {
            return res.status(400).json({ error: 'No GN officer assigned to your division. Please contact your GN office.' });
        }

        const requestNumber = generateRequestNumber();
        const today = new Date().toISOString().split('T')[0];

        await db.query(`
            INSERT INTO disaster_pending
            (request_number, disaster_type, request_date, description, severity,
             location, contact_number, aid_requested, resident_nic, gn_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [requestNumber, disasterType, today, description, sev,
            location, contact, aidRequested || null, residentNic, gnId]);

        return res.status(201).json({
            message: 'Disaster report submitted successfully. The Grama Niladhari division has been notified.',
            requestNumber
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

    const nic = user.id;

    try {
        const [pending] = await db.query(`
            SELECT disaster_id AS disaster_request_id, request_number, disaster_type, request_date,
                   description, severity, location, contact_number, aid_requested,
                   'Pending' AS status, NULL AS officer_remarks, requested_at AS created_at
            FROM disaster_pending WHERE resident_nic = ?
        `, [nic]);

        const [approved] = await db.query(`
            SELECT disaster_id AS disaster_request_id, request_number, disaster_type, request_date,
                   description, severity, location, contact_number, aid_requested,
                   'Approved' AS status, officer_remarks, approved_at AS created_at
            FROM disaster_approved WHERE resident_nic = ?
        `, [nic]);

        const [rejected] = await db.query(`
            SELECT disaster_id AS disaster_request_id, request_number, disaster_type, request_date,
                   description, severity, location, contact_number, aid_requested,
                   'Rejected' AS status, officer_remarks, rejected_at AS created_at
            FROM disaster_rejected WHERE resident_nic = ?
        `, [nic]);

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
        
        // Get the officer's GN ID
        if (user.role === 'OFFICER') {
            // Try different possible field names from JWT
            const officerIdentifier = user.gn_id || user.officerId || user.id;
            
            // Verify the officer exists and get their gn_id
            const [officer] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE gn_id = ? OR username = ?',
                [officerIdentifier, officerIdentifier]
            );
            
            if (officer.length === 0) {
                return res.status(404).json({ error: 'Officer not found. Please contact support.' });
            }
            gnId = officer[0].gn_id;
        }

        const filter = gnId ? 'AND dp.gn_id = ?' : '';
        const params = gnId ? [gnId] : [];

        const [pending] = await db.query(`
            SELECT dp.disaster_id AS disaster_request_id, dp.request_number, dp.disaster_type, dp.request_date,
                   dp.description, dp.severity, dp.location, dp.contact_number, dp.aid_requested,
                   'Pending' AS status, NULL AS officer_remarks, dp.requested_at AS created_at,
                   CONCAT(r.first_name, ' ', r.last_name) AS resident_name,
                   r.r_nic AS resident_nic, r.mobile_no
            FROM disaster_pending dp
            JOIN resident r ON dp.resident_nic = r.r_nic
            WHERE 1=1 ${filter}
            ORDER BY dp.requested_at DESC
        `, params);

        const [approved] = await db.query(`
            SELECT da.disaster_id AS disaster_request_id, da.request_number, da.disaster_type, da.request_date,
                   da.description, da.severity, da.location, da.contact_number, da.aid_requested,
                   'Approved' AS status, da.officer_remarks, da.approved_at AS created_at,
                   CONCAT(r.first_name, ' ', r.last_name) AS resident_name,
                   r.r_nic AS resident_nic, r.mobile_no
            FROM disaster_approved da
            JOIN resident r ON da.resident_nic = r.r_nic
            WHERE 1=1 ${filter.replace('dp.gn_id', 'da.gn_id')}
            ORDER BY da.approved_at DESC
        `, params);

        const [rejected] = await db.query(`
            SELECT dr.disaster_id AS disaster_request_id, dr.request_number, dr.disaster_type, dr.request_date,
                   dr.description, dr.severity, dr.location, dr.contact_number, dr.aid_requested,
                   'Rejected' AS status, dr.officer_remarks, dr.rejection_reason, dr.rejected_at AS created_at,
                   CONCAT(r.first_name, ' ', r.last_name) AS resident_name,
                   r.r_nic AS resident_nic, r.mobile_no
            FROM disaster_rejected dr
            JOIN resident r ON dr.resident_nic = r.r_nic
            WHERE 1=1 ${filter.replace('dp.gn_id', 'dr.gn_id')}
            ORDER BY dr.rejected_at DESC
        `, params);

        return res.json([...pending, ...approved, ...rejected]);
    } catch (error) {
        console.error('Error fetching officer disasters:', error);
        return res.status(500).json({ error: 'Server error fetching disaster reports.' });
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
        // Get officer's gn_id
        let gnId = null;
        if (user.role === 'OFFICER') {
            const officerIdentifier = user.gn_id || user.officerId || user.id;
            const [officer] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE gn_id = ? OR username = ?',
                [officerIdentifier, officerIdentifier]
            );
            if (officer.length === 0) {
                return res.status(404).json({ error: 'Officer not found.' });
            }
            gnId = officer[0].gn_id;
        } else {
            gnId = user.id;
        }

        // Get the pending disaster
        const [pending] = await db.query('SELECT * FROM disaster_pending WHERE disaster_id = ?', [id]);
        if (pending.length === 0) {
            return res.status(404).json({ error: 'Disaster report not found in pending queue.' });
        }

        const dp = pending[0];
        const now = new Date();

        // Move to approved table
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

        // Delete from pending
        await db.query('DELETE FROM disaster_pending WHERE disaster_id = ?', [id]);

        return res.json({ 
            message: 'Disaster report approved. Relief coordination initiated.',
            disasterId: dp.disaster_id,
            status: 'approved'
        });
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
        // Get officer's gn_id
        let gnId = null;
        if (user.role === 'OFFICER') {
            const officerIdentifier = user.gn_id || user.officerId || user.id;
            const [officer] = await db.query(
                'SELECT gn_id FROM grama_niladhari WHERE gn_id = ? OR username = ?',
                [officerIdentifier, officerIdentifier]
            );
            if (officer.length === 0) {
                return res.status(404).json({ error: 'Officer not found.' });
            }
            gnId = officer[0].gn_id;
        } else {
            gnId = user.id;
        }

        // Get the pending disaster
        const [pending] = await db.query('SELECT * FROM disaster_pending WHERE disaster_id = ?', [id]);
        if (pending.length === 0) {
            return res.status(404).json({ error: 'Disaster report not found in pending queue.' });
        }

        const dp = pending[0];
        const now = new Date();

        // Move to rejected table
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

        // Delete from pending
        await db.query('DELETE FROM disaster_pending WHERE disaster_id = ?', [id]);

        return res.json({ 
            message: 'Disaster report rejected.',
            disasterId: dp.disaster_id,
            status: 'rejected'
        });
    } catch (error) {
        console.error('Error rejecting disaster:', error);
        return res.status(500).json({ error: 'Server error rejecting disaster report.' });
    }
};

// Combined action endpoint for frontend compatibility
exports.handleDisasterAction = async (req, res) => {
    const { id } = req.params;
    const { status, severity, officerRemarks } = req.body;

    // Map the action to approve or reject based on status
    if (status === 'Approved' || status === 'Relief Approved' || status === 'Aid Dispatched' || status === 'Resolved') {
        req.body.officerRemarks = officerRemarks;
        return exports.approveDisaster(req, res);
    } else if (status === 'Rejected') {
        req.body.rejectionReason = officerRemarks || 'Disaster report does not meet relief criteria.';
        req.body.officerRemarks = officerRemarks;
        return exports.rejectDisaster(req, res);
    } else {
        return res.status(400).json({ error: 'Invalid action status. Use Approved or Rejected.' });
    }
};