// Backend/src/routes/announcementRoutes.js
const express = require('express');
const router = express.Router();
const officerController = require('../controllers/officerController');  // ✅ Changed from userController
const { authenticateToken } = require('../middleware/auth');

// Public feed for resident dashboard (no auth needed)
router.get('/feed', officerController.getPublicAnnouncementFeed);

// Officer gets own announcements
router.get('/officer', authenticateToken, officerController.getAnnouncements);

// Publish new announcement
router.post('/publish', authenticateToken, officerController.createAnnouncement);

// Update / delete (specific ID routes must come AFTER named routes)
router.put('/:id', authenticateToken, officerController.updateAnnouncement);
router.delete('/:id', authenticateToken, officerController.deleteAnnouncement);

module.exports = router;