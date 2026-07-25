// Backend/src/routes/officerRoutes.js
const express = require('express');
const router = express.Router();
const officerController = require('../controllers/officerController');
const { authenticateToken, requireOfficerOrAdmin } = require('../middleware/auth');

// ============================================================
// ALL ROUTES REQUIRE AUTHENTICATION AND OFFICER/ADMIN ROLE
// ============================================================

// ✅ Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(requireOfficerOrAdmin);

// ============================================================
// OFFICER PROFILE
// ============================================================
router.get('/profile', officerController.getOfficerProfile);
router.put('/profile', officerController.updateOfficerProfile);

// ============================================================
// OFFICER DASHBOARD
// ============================================================
router.get('/dashboard-stats', officerController.getOfficerDashboardStats);

module.exports = router;