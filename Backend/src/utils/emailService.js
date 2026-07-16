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

exports.sendOTP = async (email, otp, purpose) => {
  const subject = `SmartGN - Two-Factor Authentication OTP (${purpose})`;
  const message = `
=============================================================
To: ${email}
Subject: ${subject}
Date: ${new Date().toLocaleString()}
-------------------------------------------------------------
Your 6-digit OTP verification code is:

                     [ ${otp} ]

This code is valid for 5 minutes.
Please enter this code on the SmartGN portal to proceed.
Do not share this code with anyone.
=============================================================
`;
