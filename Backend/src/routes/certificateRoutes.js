// Certificate Routes implementation
const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authenticateToken, requireOfficerOrAdmin } = require('../middleware/auth');