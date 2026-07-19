const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin, requireOfficerOrAdmin } = require('../middleware/auth');

// Public routes
router.get('/divisions', authController.getDivisions);
router.post('/register', authController.registerResident);
router.post('/login', authController.login);
router.post('/verify-2fa', authController.verify2FA);
router.post('/verify-registration', authController.verifyRegistration);
router.post('/resend-otp', authController.resendOTP);

// Admin-only protected routes
router.post('/register/officer', authenticateToken, requireAdmin, authController.registerOfficer);
router.get('/admin/officers', authenticateToken, requireAdmin, authController.getOfficers);
router.get('/admin/residents', authenticateToken, requireOfficerOrAdmin, authController.getResidents);
router.get('/admin/residents/:nic', authenticateToken, requireOfficerOrAdmin, authController.getResidentByNic);

router.put('/admin/officers/:id/status', authenticateToken, requireAdmin, authController.updateOfficerStatus);
router.put('/admin/residents/:nic/status', authenticateToken, requireAdmin, authController.updateResidentStatus);

router.delete('/admin/officers/:id', authenticateToken, requireAdmin, authController.deleteOfficer);
router.delete('/admin/residents/:nic', authenticateToken, requireAdmin, authController.deleteResident);

router.put('/admin/officers/:id', authenticateToken, requireAdmin, authController.updateOfficer);
router.put('/admin/residents/:nic', authenticateToken, requireAdmin, authController.updateResident);

module.exports = router;
