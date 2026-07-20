const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// ============================================================
// Public routes (no auth needed)
// ============================================================
router.get('/divisions', authController.getDivisions);
router.post('/register', authController.registerResident);
router.post('/login', authController.login);
router.post('/verify-2fa', authController.verify2FA);
router.post('/verify-registration', authController.verifyRegistration);
router.post('/resend-otp', authController.resendOTP);

// ============================================================
// Admin-only protected routes
// ============================================================

// Officer management
router.post('/register/officer', authenticateToken, requireAdmin, authController.registerOfficer);
router.get('/admin/officers', authenticateToken, requireAdmin, authController.getOfficers);
router.put('/admin/officers/:id/status', authenticateToken, requireAdmin, authController.updateOfficerStatus);
router.put('/admin/officers/:id', authenticateToken, requireAdmin, authController.updateOfficer);
router.delete('/admin/officers/:id', authenticateToken, requireAdmin, authController.deleteOfficer);

// Resident management
router.get('/admin/residents', authenticateToken, requireAdmin, authController.getResidents);
router.put('/admin/residents/:nic/status', authenticateToken, requireAdmin, authController.updateResidentStatus);
router.put('/admin/residents/:nic', authenticateToken, requireAdmin, authController.updateResident);
router.delete('/admin/residents/:nic', authenticateToken, requireAdmin, authController.deleteResident);

// Household management (Admin dashboard)
router.get('/admin/households', authenticateToken, requireAdmin, authController.getHouseholds);
router.put('/admin/households/:number', authenticateToken, requireAdmin, authController.updateHousehold);

// Single resident/officer lookup
router.get('/admin/residents/:nic', authenticateToken, requireAdmin, authController.getResidentByNic);
router.get('/admin/officers/:id', authenticateToken, requireAdmin, authController.getOfficerById);

// GN Division management (Admin dashboard)
router.get('/admin/divisions', authenticateToken, requireAdmin, authController.getAllDivisionsDetails);
router.post('/admin/divisions', authenticateToken, requireAdmin, authController.createDivision);
router.put('/admin/divisions/:id/status', authenticateToken, requireAdmin, authController.toggleDivisionStatus);
router.put('/admin/divisions/:id', authenticateToken, requireAdmin, authController.updateDivision);
router.delete('/admin/divisions/:id', authenticateToken, requireAdmin, authController.deleteDivision);

module.exports = router;
