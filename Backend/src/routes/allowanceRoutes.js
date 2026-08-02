const express = require('express');
const router = express.Router();
const allowanceController = require('../controllers/allowanceController');
const { authenticateToken, requireOfficerOrAdmin } = require('../middleware/auth');

// Resident endpoints
router.post('/apply', authenticateToken, allowanceController.createAllowanceApplication);
router.get('/resident', authenticateToken, allowanceController.getResidentAllowances);

// Officer / Admin endpoints
router.get('/officer', authenticateToken, requireOfficerOrAdmin, allowanceController.getOfficerAllowances);
router.put('/:id/status', authenticateToken, requireOfficerOrAdmin, allowanceController.updateAllowanceStatus);
router.post('/:id/disburse', authenticateToken, requireOfficerOrAdmin, allowanceController.disburseAllowance);

// Stats endpoint
router.get('/stats', authenticateToken, allowanceController.getAllowanceStats);

module.exports = router;
