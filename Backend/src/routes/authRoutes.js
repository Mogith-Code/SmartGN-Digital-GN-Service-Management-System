// Backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin, requireOfficerOrAdmin } = require('../middleware/auth');

// ============================================================
// PUBLIC ROUTES (No authentication required)
// ============================================================

// Get divisions (only names for registration form)
router.get('/divisions', authController.getDivisions);

// Get all divisions with pagination and search (optimized for admin dashboard)
router.get('/divisions/all', authController.getAllDivisions);

// Resident registration
router.post('/register', authController.registerResident);

// Login
router.post('/login', authController.login);

// Verify 2FA code
router.post('/verify-2fa', authController.verify2FA);

// Verify registration OTP
router.post('/verify-registration', authController.verifyRegistration);

// Resend OTP code
router.post('/resend-otp', authController.resendOTP);

// ============================================================
// ADMIN ONLY ROUTES - OFFICER MANAGEMENT
// ============================================================

// Register a new GN Officer (Admin only)
router.post('/register/officer', authenticateToken, requireAdmin, authController.registerOfficer);

// Get all officers
router.get('/admin/officers', authenticateToken, requireAdmin, authController.getOfficers);

// Get a specific officer by ID
router.get('/admin/officers/:id', authenticateToken, requireAdmin, authController.getOfficerById);

// Update an officer's details
router.put('/admin/officers/:id', authenticateToken, requireAdmin, authController.updateOfficer);

// Update an officer's status (Active/Suspended)
router.put('/admin/officers/:id/status', authenticateToken, requireAdmin, authController.updateOfficerStatus);

// Delete an officer account
router.delete('/admin/officers/:id', authenticateToken, requireAdmin, authController.deleteOfficer);

// ============================================================
// ADMIN ONLY ROUTES - RESIDENT MANAGEMENT
// ============================================================

// Get all residents
router.get('/admin/residents', authenticateToken, requireAdmin, authController.getResidents);

// Update a resident's details
router.put('/admin/residents/:nic', authenticateToken, requireAdmin, authController.updateResident);

// Update a resident's status (Active/Suspended)
router.put('/admin/residents/:nic/status', authenticateToken, requireAdmin, authController.updateResidentStatus);

// Delete a resident account
router.delete('/admin/residents/:nic', authenticateToken, requireAdmin, authController.deleteResident);

// ============================================================
// ADMIN ONLY ROUTES - HOUSEHOLD MANAGEMENT
// ============================================================

// Get all households
router.get('/admin/households', authenticateToken, requireAdmin, authController.getHouseholds);

// Update a household's details
router.put('/admin/households/:number', authenticateToken, requireAdmin, authController.updateHousehold);

// ============================================================
// ADMIN ONLY ROUTES - GN DIVISION MANAGEMENT
// ============================================================

// Get all divisions with full details (Admin only)
router.get('/admin/divisions', authenticateToken, requireAdmin, authController.getAllDivisionsDetails);

// Create a new GN Division
router.post('/admin/divisions', authenticateToken, requireAdmin, authController.createDivision);

// Update a GN Division
router.put('/admin/divisions/:id', authenticateToken, requireAdmin, authController.updateDivision);

// Toggle GN Division status (Active/Inactive)
router.put('/admin/divisions/:id/status', authenticateToken, requireAdmin, authController.toggleDivisionStatus);

// Delete a GN Division
router.delete('/admin/divisions/:id', authenticateToken, requireAdmin, authController.deleteDivision);

// ============================================================
// OFFICER & ADMIN ACCESSIBLE ROUTES (View only)
// ============================================================

// Get a single resident by NIC (Officers can view resident profiles)
router.get('/admin/residents/:nic', authenticateToken, requireOfficerOrAdmin, authController.getResidentByNic);

// Get a resident's family members (Officers can view family members)
router.get('/admin/residents/:nic/family', authenticateToken, requireOfficerOrAdmin, authController.getResidentFamily);

module.exports = router;