// Backend/src/routes/otpRoutes.js
// ============================================================
// Defines the two public OTP API endpoints:
//   POST /api/request-otp  → generate + email OTP
//   POST /api/verify-otp   → validate submitted OTP
// These routes require no authentication — the OTP itself IS
// the authentication factor.
// ============================================================

'use strict';

const express    = require('express');
const router     = express.Router();
const otpCtrl    = require('../controllers/otpController');

// POST /api/request-otp
// Body: { email: string }
router.post('/request-otp', otpCtrl.requestOtp);

// POST /api/verify-otp
// Body: { email: string, otp: string }
router.post('/verify-otp', otpCtrl.verifyOtp);

module.exports = router;
