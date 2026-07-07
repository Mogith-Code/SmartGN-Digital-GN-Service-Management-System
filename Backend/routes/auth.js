const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/divisions', authController.getDivisions);
router.post('/register', authController.registerResident);
router.post('/login', authController.login);