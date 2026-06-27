// server/routes/orders.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
const pool = require('../db');
const { sendDeliveryEmail } = require('../email');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

// POST /api/orders/paystack/init
// Body: { productSlug, email, name }
router.post('/paystack/init', async (req, res) => {
  const { productSlug, email, name } = req.body;
  if (!productSlug || !email) {
    return res.status(400).json({ error: 'productSlug and email are required' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE slug = $1', [productSlug]);
    const product = rows[0];
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (!product.price_ngn) return res.status(400).json({ error: 'Product has no NGN price set' });

    const orderRef = uuidv4();

    await pool.query(
      `INSERT INTO orders (order_ref, product_id, customer_email, customer_name, amount, currency, payment_provider, status)
       VALUES ($1, $2, $3, $4, $5, 'NGN', 'paystack', 'pending')`,
      [orderRef, product.id, email, name || null, product.price_ngn]
    );

    // Paystack expects amount in kobo (lowest unit)
    const amountKobo = Math.round(Number(product.price_ngn) * 100);

    const psRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        reference: orderRef,
        callback_url: `${process.env.APP_BASE_URL}/order-success.html?ref=${orderRef}`
      })
    });

    const psData = await psRes.json();
    if (!psData.status) {
      return res.status(502).json({ error: 'Paystack initialization failed', detail: psData.message });
    }

    res.json({ authorization_url: psData.data.authorization_url, order_ref: orderRef });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

// GET /api/orders/paystack/verify/:reference
// Call this on your success page to confirm payment and trigger delivery.
router.get('/paystack/verify/:reference', async (req, res) => {
  const { reference } = req.params;
  try {
    const psRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
    });
    const psData = await psRes.json();

    if (!psData.status || psData.data.status !== 'success') {
      return res.status(400).json({ error: 'Payment not verified as successful' });
    }

    const orderResult = await pool.query(
      `UPDATE orders SET status = 'paid', payment_ref = $1 WHERE order_ref = $2 RETURNING *`,
      [psData.data.id, reference]
    );
    const order = orderResult.rows[0];
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [order.product_id]);
    const product = productResult.rows[0];

    // Deliver digital product via email
    if (product && product.type === 'digital' && product.file_url) {
      try {
        await sendDeliveryEmail({
          to: order.customer_email,
          name: order.customer_name,
          productTitle: product.title,
          downloadUrl: product.file_url
        });
        await pool.query(`UPDATE orders SET status = 'delivered', delivered_at = NOW() WHERE id = $1`, [order.id]);
      } catch (emailErr) {
        console.error('Email delivery failed but payment was confirmed:', emailErr.message);
      }
    }

    res.json({ success: true, order, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
