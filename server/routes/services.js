// server/routes/services.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/services/request
// Body: { name, email, churchName, serviceType, budgetRange, details }
router.post('/request', async (req, res) => {
  const { name, email, churchName, serviceType, budgetRange, details } = req.body;
  if (!name || !email || !serviceType) {
    return res.status(400).json({ error: 'name, email, and serviceType are required' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO service_requests (name, email, church_name, service_type, budget_range, details)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, churchName || null, serviceType, budgetRange || null, details || null]
    );
    // Optional: trigger a notification email to yourself here using server/email.js
    res.json({ success: true, request: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit service request' });
  }
});

// GET /api/services/requests - admin view of all requests
router.get('/requests', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM service_requests ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load requests' });
  }
});

module.exports = router;
