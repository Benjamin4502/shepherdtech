// server/routes/leads.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { sendLeadMagnetEmail } = require('../email');

// The free lead-magnet file should live in /public/downloads and be referenced here.
const LEAD_MAGNET_URL = process.env.LEAD_MAGNET_URL || '/downloads/free-sunday-bulletin-template.pdf';

// POST /api/leads
// Body: { email, name, source }
router.post('/', async (req, res) => {
  const { email, name, source } = req.body;
  if (!email) return res.status(400).json({ error: 'email is required' });

  try {
    await pool.query(
      `INSERT INTO leads (email, name, source) VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [email, name || null, source || 'lead_magnet']
    );

    await sendLeadMagnetEmail({
      to: email,
      downloadUrl: `${process.env.APP_BASE_URL}${LEAD_MAGNET_URL}`
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to capture lead' });
  }
});

module.exports = router;
