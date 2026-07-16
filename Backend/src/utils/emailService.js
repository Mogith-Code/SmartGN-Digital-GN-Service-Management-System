const fs = require('fs');
const path = require('path');

// We'll write to a local log file so developers/users can easily view sent emails
const logFilePath = path.join(__dirname, '../../../sent_emails.log');

/**
 * Sends a 6-digit OTP code to the specified email address
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP code
 * @param {string} purpose - Purpose of OTP ('registration' or 'login')
 * @returns {Promise<boolean>}
 */

