// server/seed.js
// Run once: `node server/seed.js`
// Inserts placeholder products so the site isn't empty. Replace with real assets later.
const pool = require('./db');

const products = [
  {
    slug: 'ai-prompt-pack-pastors',
    title: 'AI Prompt Pack for Pastors',
    type: 'digital',
    price_usd: 9,
    price_ngn: 5000,
    short_pitch: '50+ ready-to-use AI prompts for sermon prep, social posts, and newsletters.',
    description: 'A curated collection of prompts to help you use AI tools faster and more effectively in ministry work.',
    file_url: 'PLACEHOLDER_REPLACE_WITH_SIGNED_URL'
  },
  {
    slug: 'sunday-bulletin-templates',
    title: 'Sunday Bulletin Template Pack (Canva)',
    type: 'digital',
    price_usd: 7,
    price_ngn: 4000,
    short_pitch: '10 editable Canva templates for weekly church bulletins.',
    description: 'Professionally designed, easy-to-edit Canva bulletin templates in classic and modern styles.',
    file_url: 'PLACEHOLDER_REPLACE_WITH_SIGNED_URL'
  },
  {
    slug: 'church-website-design',
    title: 'Church Website in 7 Days',
    type: 'service',
    price_usd: 150,
    price_ngn: 90000,
    short_pitch: 'A full church website built and launched within a week.',
    description: 'We design and build a modern, mobile-friendly church website for your congregation, including hosting setup.'
  },
  {
    slug: 'whatsapp-chatbot-setup',
    title: 'WhatsApp Chatbot Setup for Churches',
    type: 'service',
    price_usd: 80,
    price_ngn: 50000,
    short_pitch: 'An AI-powered WhatsApp assistant for your church, set up and configured for you.',
    description: 'We configure a custom WhatsApp chatbot that can answer member questions, share service times, and more.'
  }
];

async function seed() {
  for (const p of products) {
    await pool.query(
      `INSERT INTO products (slug, title, type, price_usd, price_ngn, short_pitch, description, file_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (slug) DO NOTHING`,
      [p.slug, p.title, p.type, p.price_usd, p.price_ngn, p.short_pitch, p.description, p.file_url || null]
    );
  }
  console.log('Seeded products.');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
