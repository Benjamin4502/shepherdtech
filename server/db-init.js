// server/db-init.js
// Run once: `node server/db-init.js`
// Reads schema.sql and executes it against DATABASE_URL.
const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function init() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  console.log('Running schema.sql against database...');
  await pool.query(sql);
  console.log('Done. Tables created (or already existed).');
  await pool.end();
}

init().catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
