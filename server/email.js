// server/email.js
require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendDeliveryEmail({ to, name, productTitle, downloadUrl }) {
  const html = `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color:#7a1f2b;">Thank you, ${name || 'friend'}!</h2>
      <p>Your purchase of <strong>${productTitle}</strong> is ready.</p>
      <p>
        <a href="${downloadUrl}" style="background:#7a1f2b;color:#fff;padding:12px 20px;
        text-decoration:none;border-radius:6px;display:inline-block;">
          Download Your Resource
        </a>
      </p>
      <p style="color:#666;font-size:13px;">This link will expire in 7 days. If you have any trouble,
      reply to this email and we'll help directly.</p>
      <p style="margin-top:30px;">In His service,<br/>ShepherdTech Team</p>
    </div>`;

  return resend.emails.send({
    from: process.env.FROM_EMAIL,
    to,
    subject: `Your ${productTitle} is ready`,
    html
  });
}

async function sendLeadMagnetEmail({ to, downloadUrl }) {
  const html = `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color:#7a1f2b;">Here's your free resource</h2>
      <p>Thanks for joining the ShepherdTech community. Here is your free download:</p>
      <p>
        <a href="${downloadUrl}" style="background:#7a1f2b;color:#fff;padding:12px 20px;
        text-decoration:none;border-radius:6px;display:inline-block;">
          Get Your Free Resource
        </a>
      </p>
      <p style="margin-top:20px;">Over the next few days, I'll share a few more tools that help
      churches like yours save time and reach more people. — Revd. Benjamin</p>
    </div>`;

  return resend.emails.send({
    from: process.env.FROM_EMAIL,
    to,
    subject: 'Your free ShepherdTech resource',
    html
  });
}

module.exports = { sendDeliveryEmail, sendLeadMagnetEmail };
