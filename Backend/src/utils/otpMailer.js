// Backend/src/utils/otpMailer.js
// ============================================================
// Dedicated Nodemailer utility for sending 4-digit OTP emails.
// Uses Gmail SMTP with credentials from .env (EMAIL_USER / EMAIL_PASS).
// If no credentials are configured, falls back to an Ethereal
// test account so development always works without a real inbox.
// ============================================================

'use strict';

const nodemailer = require('nodemailer');

// ──────────────────────────────────────────────
// Cached transporter (singleton per process)
// ──────────────────────────────────────────────
let _transporter = null;

/**
 * Returns (and caches) a Nodemailer transporter.
 *  • If EMAIL_USER + EMAIL_PASS are set → real Gmail SMTP
 *  • Otherwise                          → Ethereal test account
 */
async function getTransporter() {
    if (_transporter) return _transporter;

    const user = (process.env.EMAIL_USER || '').trim();
    const pass = (process.env.EMAIL_PASS || '').trim();

    if (user && pass) {
        // ── Real Gmail SMTP (uses an App Password, NOT your normal Gmail password) ──
        console.log(`📧 [OTP Mailer] Using Gmail SMTP → ${user}`);
        _transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass },
        });
    } else {
        // ── Fallback: Ethereal preview emails (great for dev / CI) ──
        console.log('⏳ [OTP Mailer] No EMAIL_USER/PASS set. Creating Ethereal test account...');
        try {
            const testAccount = await nodemailer.createTestAccount();
            console.log(`✅ [OTP Mailer] Ethereal account ready → ${testAccount.user}`);
            _transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: { user: testAccount.user, pass: testAccount.pass },
            });
        } catch (err) {
            console.error('❌ [OTP Mailer] Could not create Ethereal account:', err.message);
            _transporter = null;
        }
    }

    return _transporter;
}

// ──────────────────────────────────────────────
// HTML email template
// ──────────────────────────────────────────────
function buildOtpHtml(otp, email) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#F0F4FF;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4FF;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:20px;overflow:hidden;
                      box-shadow:0 8px 32px rgba(27,54,93,0.12);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1B365D 0%,#005BBD 100%);
                       padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
                🔐 SmartGN Portal
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">
                Secure One-Time Password
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;color:#64748b;font-size:13px;text-transform:uppercase;
                         letter-spacing:1px;font-weight:600;">Verification Request</p>
              <h2 style="margin:0 0 20px;color:#1E293B;font-size:20px;">
                Your One-Time Password
              </h2>
              <p style="margin:0 0 28px;color:#475569;font-size:15px;line-height:1.7;">
                Hello,<br/>
                Someone (hopefully you!) requested an OTP for
                <strong style="color:#1B365D;">${email}</strong>.<br/>
                Use the code below to complete your verification:
              </p>

              <!-- OTP Box -->
              <div style="text-align:center;margin-bottom:28px;">
                <div style="display:inline-block;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);
                            border:2px solid #BFDBFE;border-radius:16px;
                            padding:22px 40px;">
                  <span style="font-size:48px;font-weight:900;letter-spacing:16px;
                               color:#1B365D;font-family:monospace;">${otp}</span>
                </div>
              </div>

              <!-- Warning -->
              <div style="background:#FEF9EC;border-left:4px solid #F59E0B;
                          border-radius:8px;padding:14px 18px;margin-bottom:28px;">
                <p style="margin:0;color:#92400E;font-size:13px;line-height:1.6;">
                  ⏰ <strong>This OTP expires in 5 minutes.</strong><br/>
                  Do <strong>NOT</strong> share this code with anyone — SmartGN staff will never ask for your OTP.
                </p>
              </div>

              <p style="margin:0;color:#94a3b8;font-size:13px;">
                If you did not request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;padding:20px 40px;text-align:center;
                       border-top:1px solid #E2E8F0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                © ${new Date().getFullYear()} SmartGN Digital GN Services · All rights reserved<br/>
                This is an automated security notification — please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ──────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────

/**
 * Sends a 4-digit OTP to the specified email address.
 *
 * @param {string} toEmail   - Recipient email address
 * @param {string} otp       - 4-digit OTP string
 * @returns {Promise<{ sent: boolean, previewUrl: string|null }>}
 */
exports.sendOtpEmail = async (toEmail, otp) => {
    const transporter = await getTransporter();
    const senderEmail = (process.env.EMAIL_USER || '').trim() || 'noreply@smartgn.lk';

    const mailOptions = {
        from: `"SmartGN Digital Services" <${senderEmail}>`,
        to: toEmail,
        subject: '🔐 Your SmartGN OTP Verification Code',
        text: `Your SmartGN OTP is: ${otp}. It is valid for 5 minutes. Do not share it.`,
        html: buildOtpHtml(otp, toEmail),
    };

    // Always print to console for dev visibility
    console.log(`\n📧 [OTP Mailer] ─────────────────────────`);
    console.log(`   TO  : ${toEmail}`);
    console.log(`   OTP : [ ${otp} ]`);
    console.log(`   TIME: ${new Date().toLocaleString()}`);
    console.log(`──────────────────────────────────────────\n`);

    if (!transporter) {
        console.warn('⚠️ [OTP Mailer] No transporter available — OTP logged to console only.');
        return { sent: false, previewUrl: null };
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ [OTP Mailer] Email dispatched → Message-ID: ${info.messageId}`);

        // Ethereal preview URL (only populated for test accounts)
        const previewUrl = nodemailer.getTestMessageUrl
            ? nodemailer.getTestMessageUrl(info)
            : null;

        if (previewUrl) {
            console.log(`🔗 [OTP Mailer] Preview URL: ${previewUrl}`);
        }

        return { sent: true, previewUrl: previewUrl || null };
    } catch (err) {
        console.error(`❌ [OTP Mailer] Failed to send email:`, err.message);
        return { sent: false, previewUrl: null };
    }
};
