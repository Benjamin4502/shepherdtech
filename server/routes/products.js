// server/routes/products.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/products - list all active products
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, slug, title, type, price_usd, price_ngn, short_pitch, thumbnail_url FROM products WHERE is_active = TRUE ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

// GET /api/products/:slug - single product detail
router.get('/:slug', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM products WHERE slug = $1 AND is_active = TRUE',
      [req.params.slug]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load product' });
  }
});

module.exports = router;
