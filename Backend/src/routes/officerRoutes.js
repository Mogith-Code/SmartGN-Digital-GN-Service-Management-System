// User Routes placeholder
const express = require('express');
const router = express.Router();
const officerController = require('../controllers/officerController');

// PROFILE
// ============================================================
router.get('/profile', officerController.getOfficerProfile);

module.exports = router;
