// Appointment Routes placeholder
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET appointment counts (pending & approved)
router.get('/residentcounts', appointmentController.getAppointmentCounts );

// GET all resident appointments (pending & approved only)
router.get('/rappointments', appointmentController.getAllResidentAppointments);

// POST - Book a new appointment
router.post('/book', appointmentController.bookAppointment);




module.exports = router;


