// Backend/src/controllers/otpController.js
// ============================================================
// Handles OTP generation, in-memory storage, email dispatch,
// and verification for the /api/request-otp and /api/verify-otp
// endpoints.
//
// In-memory store format:
//   otpCache[email] = { otp: '4890', expiresAt: Date }
//
// OTPs expire after OTP_TTL_MS milliseconds (default: 5 minutes).
// ============================================================

'use strict';

const crypto = require('crypto');
const { sendOtpEmail } = require('../utils/otpMailer');

// ──────────────────────────────────────────────────────────────
// In-memory OTP cache  (keyed by email)
// Shape: { [email]: { otp: string, expiresAt: number } }
// NOTE: This resets on server restart — use Redis for production.
// ──────────────────────────────────────────────────────────────
const otpCache = {};

/** TTL for each OTP in milliseconds */
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ──────────────────────────────────────────────────────────────
// Helper — generate a cryptographically random 4-digit numeric OTP
// ──────────────────────────────────────────────────────────────
function generateOtp() {
    // crypto.randomInt(min, max) — max is exclusive → range [1000, 9999]
    return String(crypto.randomInt(1000, 10000));
}

// ──────────────────────────────────────────────────────────────
// POST /api/request-otp
// Body: { email: string }
// ──────────────────────────────────────────────────────────────
exports.requestOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // ── Validation ──
        if (!email || typeof email !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'A valid email address is required.',
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.',
            });
        }

        // ── Generate & store OTP ──
        const otp = generateOtp();
        otpCache[normalizedEmail] = {
            otp,
            expiresAt: Date.now() + OTP_TTL_MS,
        };

        console.log(`🔑 [OTP] Generated for ${normalizedEmail}: ${otp}`);

        // ── Send email ──
        const { sent, previewUrl } = await sendOtpEmail(normalizedEmail, otp);

        // ── Response ──
        return res.status(200).json({
            success: true,
            message: `OTP sent successfully to ${normalizedEmail}. Please check your inbox.`,
            // Include Ethereal preview URL during development (omit in production)
            ...(previewUrl && process.env.NODE_ENV !== 'production'
                ? { previewUrl }
                : {}),
            // If email sending failed, inform the client so they can retry
            ...(sent ? {} : { warning: 'Email delivery failed. OTP is logged to the server console.' }),
        });
    } catch (error) {
        console.error('❌ [requestOtp] Unexpected error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while generating OTP.',
        });
    }
};

// ──────────────────────────────────────────────────────────────
// POST /api/verify-otp
// Body: { email: string, otp: string }
// ──────────────────────────────────────────────────────────────
exports.verifyOtp = (req, res) => {
    try {
        const { email, otp } = req.body;

        // ── Validation ──
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Both email and OTP are required.',
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const submittedOtp    = String(otp).trim();

        // ── Look up cache entry ──
        const cached = otpCache[normalizedEmail];

        if (!cached) {
            return res.status(400).json({
                success: false,
                message: 'No OTP was requested for this email. Please request a new OTP.',
            });
        }

        // ── Check expiry ──
        if (Date.now() > cached.expiresAt) {
            delete otpCache[normalizedEmail]; // clean up expired entry
            return res.status(400).json({
                success: false,
                message: 'Your OTP has expired. Please request a new one.',
            });
        }

        // ── Check value ──
        if (cached.otp !== submittedOtp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP. Please check the code and try again.',
            });
        }

        // ── Success — delete OTP so it cannot be reused ──
        delete otpCache[normalizedEmail];
        console.log(`✅ [OTP] Verified successfully for ${normalizedEmail}`);

        return res.status(200).json({
            success: true,
            message: 'OTP verified successfully! You are now authenticated.',
        });
    } catch (error) {
        console.error('❌ [verifyOtp] Unexpected error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while verifying OTP.',
        });
    }
};
