/**
 * Nebraska Football Silent Auction — Notification Backend
 * Email only (SendGrid) — SMS removed
 */

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const sgMail  = require('@sendgrid/mail');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.options('*', cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'auction@huskers-football.com';
const FROM_NAME  = process.env.FROM_NAME  || 'Nebraska Football Auction';

// ── HELPER: Send Email ──────────────────────────────────────
async function sendEmail(to, subject, htmlBody) {
  if (!to) return;
  return sgMail.send({
    to,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject,
    html: htmlBody
  });
}

// ── WINNER EMAIL TEMPLATE ───────────────────────────────────
function winnerEmailHtml(firstName, lastName, itemTitle, winningBid) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #1A1A1A; margin: 0; padding: 0; }
    .wrapper { max-width: 580px; margin: 0 auto; background: #242424; }
    .header { background: #E41C38; padding: 32px 40px; text-align: center; }
    .header h1 { color: #fff; font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin: 0; }
    .header p { color: rgba(255,255,255,0.8); font-size: 13px; margin: 6px 0 0; letter-spacing: 1px; }
    .body { padding: 40px; }
    .greeting { color: #fff; font-size: 20px; font-weight: 700; margin-bottom: 12px; }
    .body p { color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.7; margin-bottom: 16px; }
    .item-box { background: #1A1A1A; border-left: 4px solid #E41C38; padding: 20px 24px; margin: 24px 0; }
    .item-box .item-title { color: #E41C38; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
    .item-box .item-name { color: #fff; font-size: 18px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }
    .item-box .item-bid { color: #D4A843; font-size: 24px; font-weight: 800; }
    .payment-box { background: rgba(228,28,56,0.1); border: 1px solid rgba(228,28,56,0.3); padding: 20px 24px; margin: 24px 0; }
    .payment-box h3 { color: #E41C38; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
    .payment-box p { color: rgba(255,255,255,0.7); font-size: 13px; line-height: 1.7; margin: 0; }
    .payment-box strong { color: #fff; }
    .payment-box a { color: #E41C38; text-decoration: none; }
    .footer { padding: 24px 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); }
    .footer p { color: rgba(255,255,255,0.3); font-size: 11px; line-height: 1.6; margin: 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🏆 Congratulations!</h1>
      <p>Nebraska Football · Silent Auction 2026</p>
    </div>
    <div class="body">
      <div class="greeting">You won, ${firstName}!</div>
      <p>The Nebraska Football Silent Auction has closed and you are the winning bidder on the following item:</p>
      <div class="item-box">
        <div class="item-title">Winning Item</div>
        <div class="item-name">${itemTitle}</div>
        <div class="item-bid">$${Number(winningBid).toLocaleString()}</div>
      </div>
      <div class="payment-box">
        <h3>Payment Instructions</h3>
        <p>
          Please make your payment by <strong>check</strong>, payable to:<br><br>
          <strong>Matt Rhule Football Camps LLC</strong><br><br>
          To arrange delivery and coordinate your experience, contact:<br>
          <strong>Logan Holgorsen</strong> — <a href="tel:5318572638">(531) 857-2638</a>
        </p>
      </div>
      <p>Thank you for supporting Nebraska Football! Go Big Red. 🌽</p>
    </div>
    <div class="footer">
      <p>Nebraska Football · Matt Rhule Football Camps LLC<br>
      Questions? Contact Logan Holgorsen at (531) 857-2638</p>
    </div>
  </div>
</body>
</html>`;
}

// ── OUTBID EMAIL TEMPLATE ───────────────────────────────────
function outbidEmailHtml(firstName, itemTitle, yourBid, newHighBid) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #1A1A1A; margin: 0; padding: 0; }
    .wrapper { max-width: 580px; margin: 0 auto; background: #242424; }
    .header { background: #1A1A1A; border-bottom: 3px solid #E41C38; padding: 28px 40px; display: flex; align-items: center; gap: 16px; }
    .header-n { background: #E41C38; width: 48px; height: 48px; display: inline-flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800; color: #fff; }
    .header-title { color: #fff; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
    .header-sub { color: rgba(255,255,255,0.4); font-size: 11px; letter-spacing: 1px; margin-top: 2px; }
    .body { padding: 40px; }
    .greeting { color: #fff; font-size: 20px; font-weight: 700; margin-bottom: 12px; }
    .body p { color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.7; margin-bottom: 16px; }
    .bid-compare { display: flex; gap: 12px; margin: 24px 0; }
    .bid-box { flex: 1; padding: 16px; text-align: center; }
    .bid-box.yours { background: rgba(154,154,154,0.1); border: 1px solid rgba(154,154,154,0.2); }
    .bid-box.new { background: rgba(228,28,56,0.1); border: 1px solid rgba(228,28,56,0.3); }
    .bid-box .label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 6px; }
    .bid-box .amount { font-size: 22px; font-weight: 800; }
    .bid-box.yours .amount { color: #9A9A9A; }
    .bid-box.new .amount { color: #E41C38; }
    .cta { display: block; background: #E41C38; color: #fff; text-align: center; padding: 16px; text-decoration: none; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin: 24px 0; }
    .footer { padding: 24px 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); }
    .footer p { color: rgba(255,255,255,0.3); font-size: 11px; line-height: 1.6; margin: 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-n">N</div>
      <div>
        <div class="header-title">Nebraska Football Auction</div>
        <div class="header-sub">You've Been Outbid</div>
      </div>
    </div>
    <div class="body">
      <div class="greeting">You've been outbid, ${firstName}.</div>
      <p>Someone placed a higher bid on <strong style="color:#fff">${itemTitle}</strong>. Don't miss your chance to take it back!</p>
      <div class="bid-compare">
        <div class="bid-box yours">
          <div class="label">Your Bid</div>
          <div class="amount">$${Number(yourBid).toLocaleString()}</div>
        </div>
        <div class="bid-box new">
          <div class="label">New High Bid</div>
          <div class="amount">$${Number(newHighBid).toLocaleString()}</div>
        </div>
      </div>
      <a href="https://ccaniford.github.io/huskers-auction/auction.html" class="cta">Place a Higher Bid →</a>
      <p style="font-size:12px">The auction closes at 3:00 PM CT on June 24, 2026. Act fast!</p>
    </div>
    <div class="footer">
      <p>Nebraska Football · Matt Rhule Football Camps LLC<br>
      Questions? (531) 857-2638</p>
    </div>
  </div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════
//  ROUTES
// ═══════════════════════════════════════════════════════════

// POST /api/notify-winner
app.post('/api/notify-winner', async (req, res) => {
  const { toEmail, firstName, lastName, itemTitle, winningBid } = req.body;
  if (!toEmail || !firstName || !itemTitle || !winningBid) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const results = { email: null };
  const errors  = [];
  try {
    await sendEmail(
      toEmail,
      `🏆 You Won: ${itemTitle} — Nebraska Football Auction`,
      winnerEmailHtml(firstName, lastName, itemTitle, winningBid)
    );
    results.email = 'sent';
  } catch (e) {
    errors.push('Email failed: ' + e.message);
    results.email = 'failed';
  }
  console.log('[WINNER NOTIFY]', { toEmail, itemTitle, winningBid, results });
  res.json({ success: results.email === 'sent', results, errors });
});

// POST /api/notify-outbid
app.post('/api/notify-outbid', async (req, res) => {
  const { toEmail, firstName, itemTitle, yourBid, newHighBid } = req.body;
  if (!toEmail || !firstName || !itemTitle) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const results = { email: null };
  const errors  = [];
  try {
    await sendEmail(
      toEmail,
      `You've Been Outbid on "${itemTitle}" — Nebraska Football Auction`,
      outbidEmailHtml(firstName, itemTitle, yourBid, newHighBid)
    );
    results.email = 'sent';
  } catch (e) {
    errors.push('Email failed: ' + e.message);
    results.email = 'failed';
  }
  console.log('[OUTBID NOTIFY]', { toEmail, itemTitle, yourBid, newHighBid, results });
  res.json({ success: results.email === 'sent', results, errors });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    sendgrid: !!process.env.SENDGRID_API_KEY,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🌽 Nebraska Football Auction — Notify Server`);
  console.log(`   Listening on port ${PORT}`);
  console.log(`   SendGrid: ${process.env.SENDGRID_API_KEY ? '✓ Configured' : '✗ Missing env vars'}\n`);
});
