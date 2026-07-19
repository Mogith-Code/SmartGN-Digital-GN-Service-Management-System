// Backend/src/routes/residentRoutes.js
const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// ============================================================
// DASHBOARD STATS
// ============================================================
router.get('/dashboard-stats', residentController.getDashboardStats);

// ============================================================
// PROFILE
// ============================================================
router.get('/profile', residentController.getProfile);
router.put('/profile', residentController.updateProfile);

// ============================================================
// FAMILY MEMBERS
// ============================================================
router.get('/family', residentController.getFamilyMembers);
router.post('/family', residentController.addFamilyMember);
router.put('/family/:id', residentController.updateFamilyMember);
router.delete('/family/:id', residentController.deleteFamilyMember);

// ============================================================
// HOUSEHOLD
// ============================================================
router.get('/household', residentController.getHousehold);
router.put('/household', residentController.updateHousehold);

// ============================================================
// ANNOUNCEMENTS (For residents)
// ============================================================
router.get('/announcements', residentController.getAnnouncements);

module.exports = router;