// Backend/src/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET appointment counts (pending & approved)
router.get('/residentcounts', appointmentController.getAppointmentCounts);

// GET all resident appointments (pending & approved only)
router.get('/rappointments', appointmentController.getAllResidentAppointments);

// POST - Book a new appointment
router.post('/book', appointmentController.bookAppointment);

// PUT - Cancel appointment
router.put('/:id/cancel', appointmentController.cancelAppointment);

// PUT - Update appointment
router.put('/:id/update', appointmentController.updateAppointment);

module.exports = router;