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

// 1. Log to server console
  console.log(message);

  // 2. Append to logs file
  try {
    const dir = path.dirname(logFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.appendFileSync(logFilePath, message + '\n');
    console.log(`✉️ Email log successfully written to: ${logFilePath}`);
  } catch (err) {
    console.error('Error writing to email log file:', err);
  }

  // 3. Optional real nodemailer SMTP sending if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      await transporter.sendMail({
        from: `"SmartGN Portal" <${process.env.SMTP_USER}>`,
        to: email,
        subject: subject,
        text: `Your SmartGN 6-digit OTP code is: ${otp}. Valid for 5 minutes.`
      });
      console.log(`✉️ Real email successfully sent to ${email} via SMTP.`);
    } catch (nodemailerError) {
      console.error('Nodemailer failed, fell back to console/file logging:', nodemailerError.message);
    }
  }

  return true;
};
