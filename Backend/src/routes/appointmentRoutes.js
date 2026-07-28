// Appointment Routes placeholder
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET appointment counts (pending & approved)
router.get('/residentcounts', appointmentController.getAppointmentCounts);
module.exports = router;
