// server/db.js
// Single shared Postgres connection pool.
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode')
    ? undefined
    : { rejectUnauthorized: false } // needed for most hosted Postgres (Neon, Replit DB)
});

pool.on('error', (err) => {
  console.error('Unexpected Postgres pool error:', err);
});

module.exports = pool;
