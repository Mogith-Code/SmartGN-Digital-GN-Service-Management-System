// Backend/src/routes/residentRoutes.js
const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const { authenticateToken } = require('../middleware/auth');

// ✅ All routes require authentication
router.use(authenticateToken);

// ============================================================
// PROFILE & GN OFFICER
// ============================================================
router.get('/profile', authenticateToken, residentController.getProfile);
router.put('/profile', authenticateToken, residentController.updateProfile);
router.get('/gn-officer', authenticateToken, residentController.getAssignedGnOfficer);

// ============================================================
// DASHBOARD STATS
// ============================================================
router.get('/dashboard-stats', authenticateToken, residentController.getDashboardStats);

// ============================================================
// FAMILY MEMBERS
// ============================================================
router.get('/family', authenticateToken, residentController.getFamilyMembers);
router.post('/family', authenticateToken, residentController.addFamilyMember);
router.put('/family/:id', authenticateToken, residentController.updateFamilyMember);
router.delete('/family/:id', authenticateToken, residentController.deleteFamilyMember);

// ============================================================
// HOUSEHOLD
// ============================================================
router.get('/household', authenticateToken, residentController.getHousehold);
router.put('/household', authenticateToken, residentController.updateHousehold);

// ============================================================
// ANNOUNCEMENTS (For residents)
// ============================================================
router.get('/announcements', authenticateToken, residentController.getAnnouncements);



module.exports = router;