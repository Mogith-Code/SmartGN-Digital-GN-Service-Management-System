// announcementRoutes.js — Matches frontend API calls exactly
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Public feed for resident dashboard (no auth needed for public announcements)
router.get('/feed', userController.getPublicAnnouncementFeed);

// Officer gets own announcements
router.get('/officer', authenticateToken, userController.getAnnouncements);

// Publish new announcement
router.post('/publish', authenticateToken, userController.createAnnouncement);

// Update / delete (specific ID routes must come AFTER named routes)
router.put('/:id', authenticateToken, userController.updateAnnouncement);
router.delete('/:id', authenticateToken, userController.deleteAnnouncement);

module.exports = router;
