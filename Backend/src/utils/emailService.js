// Backend/src/utils/emailService.js
const fs = require('fs');
const path = require('path');

let nodemailer;
try {
    nodemailer = require('nodemailer');
} catch (e) {
    console.warn('⚠️ Nodemailer package not available. Installing or setting up fallback email logging.');
}

const logFilePath = path.join(__dirname, '../../../sent_emails.log');

/**
 * Creates a Nodemailer transporter.
 * Uses real SMTP credentials if configured in .env, otherwise creates an Ethereal web mail account.
 */
let cachedSmtpTransporter = null;
let cachedEtherealTransporter = null;

async function getTransporter() {
    if (!nodemailer) return null;

    const user = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : '';
    const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : '';

    // 1. Use real SMTP credentials from .env if provided
    if (user !== '' && pass !== '') {
        if (!cachedSmtpTransporter) {
            console.log(`📧 Direct SMTP Transport configured for: ${user}`);
            cachedSmtpTransporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                secure: process.env.SMTP_SECURE === 'true',
                auth: { user, pass },
                tls: { rejectUnauthorized: false }
            });
        }
        return cachedSmtpTransporter;
    }

    // 2. Fallback: Create Ethereal test account automatically for real web email previews
    if (cachedEtherealTransporter) return cachedEtherealTransporter;

    try {
        console.log('⏳ Creating Ethereal Test Account for email previews...');
        const testAccount = await nodemailer.createTestAccount();
        console.log('✅ Created Ethereal Test Account:', testAccount.user);
        
        cachedEtherealTransporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        return cachedEtherealTransporter;
    } catch (err) {
        console.error('Could not create Ethereal test account:', err.message);
        return null;
    }
}

/**
 * Sends a 6-digit OTP code to the recipient email address
 */
exports.sendOTP = async (email, otp, purpose = 'Verification') => {
    const subject = `SmartGN - Your 6-Digit OTP Code (${purpose})`;
    
    // Clean, professional HTML template for the recipient's inbox
    const htmlMessage = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 25px; border-b: 2px solid #f1f5f9; pb: 15px;">
            <h1 style="color: #1B365D; margin: 0; font-size: 24px; font-weight: 700;">SmartGN Digital Portal</h1>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Government Service Management System - Sri Lanka</p>
        </div>
        <div style="background-color: #F8FAFC; border-left: 4px solid #005BBD; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
            <h2 style="color: #1E293B; font-size: 18px; margin-top: 0;">Two-Factor Verification Code</h2>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Hello,<br/>
                Your 6-digit OTP verification code for <strong>${purpose}</strong> is:
            </p>
            <div style="text-align: center; margin: 25px 0;">
                <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #1B365D; background-color: #E2E8F0; padding: 14px 28px; border-radius: 10px; display: inline-block; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
                    ${otp}
                </span>
            </div>
            <p style="color: #64748b; font-size: 13px; margin-bottom: 0;">
                ⏰ This code is valid for <strong>5 minutes</strong>. Do not share this code with anyone.
            </p>
        </div>
        <div style="text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 15px;">
            <p>This is an automated security notification from SmartGN. Please do not reply to this email.</p>
            <p style="margin-top: 4px;">© ${new Date().getFullYear()} SmartGN Digital GN Services. All rights reserved.</p>
        </div>
    </div>
    `;

    const textMessage = `SmartGN Portal - Your OTP code for ${purpose} is: ${otp}. Valid for 5 minutes.`;

    // 1. Log to console and sent_emails.log
    const logEntry = `
=============================================================
TO: ${email}
SUBJECT: ${subject}
DATE: ${new Date().toLocaleString()}
OTP CODE: [ ${otp} ]
=============================================================`;
    console.log(logEntry);

    try {
        const dir = path.dirname(logFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.appendFileSync(logFilePath, logEntry + '\n');
    } catch (err) {
        console.error('Error logging email to file:', err.message);
    }

    // 2. Dispatch real email via Nodemailer
    try {
        const transporter = await getTransporter();
        if (transporter) {
            const senderEmail = process.env.SMTP_USER || 'no-reply@smartgn.gov.lk';
            const info = await transporter.sendMail({
                from: `"SmartGN Digital Services" <${senderEmail}>`,
                to: email,
                subject: subject,
                text: textMessage,
                html: htmlMessage
            });

            console.log(`✉️ Email dispatched to ${email} (Message ID: ${info.messageId})`);

            if (nodemailer && nodemailer.getTestMessageUrl) {
                const previewUrl = nodemailer.getTestMessageUrl(info);
                if (previewUrl) {
                    console.log(`🔗 Click to view delivered email online: ${previewUrl}`);
                }
            }
        }
    } catch (error) {
        console.error(`❌ Error delivering email to ${email}:`, error.message);
    }

    return true;
};
