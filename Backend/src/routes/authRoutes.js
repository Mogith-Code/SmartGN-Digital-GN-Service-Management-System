// Backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin, requireOfficerOrAdmin } = require('../middleware/auth');

// ============================================================
// PUBLIC ROUTES (No authentication required)
// ============================================================
router.get('/divisions', authController.getDivisions);
router.post('/register', authController.registerResident);
router.post('/login', authController.login);
router.post('/verify-2fa', authController.verify2FA);
router.post('/verify-registration', authController.verifyRegistration);
router.post('/resend-otp', authController.resendOTP);
router.post('/forgot-password', authController.forgotPassword);

// ============================================================
// ADMIN ONLY ROUTES - OFFICER MANAGEMENT
// ============================================================
router.post('/register/officer', authenticateToken, requireAdmin, authController.registerOfficer);
router.get('/admin/officers', authenticateToken, requireAdmin, authController.getOfficers);
router.get('/admin/officers/:id', authenticateToken, requireAdmin, authController.getOfficerById);
router.put('/admin/officers/:id', authenticateToken, requireAdmin, authController.updateOfficer);
router.put('/admin/officers/:id/status', authenticateToken, requireAdmin, authController.updateOfficerStatus);
router.delete('/admin/officers/:id', authenticateToken, requireAdmin, authController.deleteOfficer);

// ============================================================
// ADMIN ONLY ROUTES - RESIDENT MANAGEMENT
// ============================================================
router.get('/admin/residents', authenticateToken, requireAdmin, authController.getResidents);
router.put('/admin/residents/:nic', authenticateToken, requireAdmin, authController.updateResident);
router.put('/admin/residents/:nic/status', authenticateToken, requireAdmin, authController.updateResidentStatus);
router.delete('/admin/residents/:nic', authenticateToken, requireAdmin, authController.deleteResident);

// ============================================================
// ADMIN ONLY ROUTES - HOUSEHOLD MANAGEMENT
// ============================================================
router.get('/admin/households', authenticateToken, requireAdmin, authController.getHouseholds);
router.put('/admin/households/:number', authenticateToken, requireAdmin, authController.updateHousehold);

// ============================================================
// ADMIN ONLY ROUTES - GN DIVISION MANAGEMENT
// ============================================================
router.get('/admin/divisions', authenticateToken, requireAdmin, authController.getAllDivisionsDetails);
router.post('/admin/divisions', authenticateToken, requireAdmin, authController.createDivision);
router.put('/admin/divisions/:id', authenticateToken, requireAdmin, authController.updateDivision);
router.put('/admin/divisions/:id/status', authenticateToken, requireAdmin, authController.toggleDivisionStatus);
router.delete('/admin/divisions/:id', authenticateToken, requireAdmin, authController.deleteDivision);

// ============================================================
// OFFICER & ADMIN ACCESSIBLE ROUTES (View only)
// ============================================================
// Single resident lookup (Officers can view resident profiles)
router.get('/admin/residents/:nic', authenticateToken, requireOfficerOrAdmin, authController.getResidentByNic);
// Single resident family fetch (Officers can view family members)
router.get('/admin/residents/:nic/family', authenticateToken, requireOfficerOrAdmin, authController.getResidentFamily);

module.exports = router;