const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authenticateToken, requireOfficerOrAdmin } = require('../middleware/auth');

// Resident endpoints
router.post('/apply', authenticateToken, certificateController.submitCertificateRequest);
router.get('/resident', authenticateToken, certificateController.getResidentCertificates);

// Officer / Admin endpoints
router.get('/officer', authenticateToken, requireOfficerOrAdmin, certificateController.getOfficerCertificates);
router.get('/officer/:id', authenticateToken, requireOfficerOrAdmin, certificateController.getCertificateDetails);

// Action endpoints
router.put('/:id/action', authenticateToken, requireOfficerOrAdmin, certificateController.handleCertificateAction);

// Get certificate details by ID
router.get('/:id', authenticateToken, certificateController.getCertificateDetails);

module.exports = router;