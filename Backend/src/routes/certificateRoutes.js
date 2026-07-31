// Certificate Routes implementation
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
router.put('/officer/:id/approve', authenticateToken, requireOfficerOrAdmin, (req, res) => {
    req.body.status = 'APPROVED';
    return certificateController.handleCertificateAction(req, res);
});
router.put('/officer/:id/reject', authenticateToken, requireOfficerOrAdmin, (req, res) => {
    req.body.status = 'REJECTED';
    return certificateController.handleCertificateAction(req, res);
});

// Common / Action endpoints
router.get('/:id', authenticateToken, certificateController.getCertificateDetails);
router.put('/:id/action', authenticateToken, requireOfficerOrAdmin, certificateController.handleCertificateAction);

router.get('/officer/stats', authenticateToken, requireOfficerOrAdmin, certificateController.getOfficerStats);

module.exports = router;