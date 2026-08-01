// disasterRoutes.js
const express = require('express');
const router = express.Router();
const disasterController = require('../controllers/disasterController');
const { authenticateToken } = require('../middleware/auth');

// Resident routes
router.post('/report', authenticateToken, disasterController.submitDisasterReport);
router.get('/resident', authenticateToken, disasterController.getResidentDisasters);

// Officer / Admin routes
router.get('/officer', authenticateToken, disasterController.getOfficerDisasters);
router.put('/officer/:id/approve', authenticateToken, disasterController.approveDisaster);
router.put('/officer/:id/reject', authenticateToken, disasterController.rejectDisaster);
router.put('/officer/:id/action', authenticateToken, disasterController.updateDisasterAction);
router.put('/:id/action', authenticateToken, disasterController.updateDisasterAction);

module.exports = router;

