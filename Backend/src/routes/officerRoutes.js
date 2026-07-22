// User Routes placeholder
const express = require('express');
const router = express.Router();
const officerController = require('../controllers/officerController');

// PROFILE
// ============================================================
router.get('/profile', officerController.getOfficerProfile);

router.get('/dashboard-stats', officerController.getOfficerDashboardStats);

module.exports = router;
