// Backend/src/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Resident routes
router.get('/residentcounts', appointmentController.getAppointmentCounts);
router.get('/rappointments', appointmentController.getAllResidentAppointments);
router.post('/book', appointmentController.bookAppointment);
router.put('/:id/cancel', appointmentController.cancelAppointment);
router.put('/:id/update', appointmentController.updateAppointment);

// Officer routes
router.get('/officercounts', appointmentController.getOfficerAppointmentCounts);
router.get('/officerappointments', appointmentController.getOfficerAppointments);

// ✅ Add approve and reject routes
router.put('/:id/approve', appointmentController.approveAppointment);
router.put('/:id/reject', appointmentController.rejectAppointment);

module.exports = router;