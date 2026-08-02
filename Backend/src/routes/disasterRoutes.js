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
// Combined action endpoint for frontend compatibility
router.put('/:id/action', authenticateToken, disasterController.handleDisasterAction);

module.exports = router;