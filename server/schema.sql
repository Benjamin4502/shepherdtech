-- ShepherdTech MVP Schema
-- Run this once against your Replit/Neon Postgres database.

CREATE TABLE IF NOT EXISTS products (
  id              SERIAL PRIMARY KEY,
  slug            VARCHAR(120) UNIQUE NOT NULL,      -- e.g. "ai-prompt-pack-pastors"
  title           VARCHAR(200) NOT NULL,
  type            VARCHAR(20) NOT NULL CHECK (type IN ('digital', 'service', 'physical')),
  price_usd       NUMERIC(10,2),                     -- price in USD (digital/intl)
  price_ngn       NUMERIC(12,2),                      -- price in NGN (local)
  description     TEXT,
  short_pitch     VARCHAR(280),                       -- one-liner for cards/listings
  file_url        TEXT,                               -- signed/expiring download link (digital only)
  thumbnail_url   TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id              SERIAL PRIMARY KEY,
  order_ref       VARCHAR(64) UNIQUE NOT NULL,        -- our own reference, e.g. UUID
  product_id      INTEGER REFERENCES products(id),
  customer_email  VARCHAR(255) NOT NULL,
  customer_name   VARCHAR(200),
  amount          NUMERIC(10,2) NOT NULL,
  currency        VARCHAR(10) NOT NULL,                -- 'USD' or 'NGN'
  payment_provider VARCHAR(20) NOT NULL,                -- 'paystack', 'lemonsqueezy', 'gumroad'
  payment_ref     VARCHAR(120),                         -- provider's transaction id
  status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','delivered')),
  delivered_at    TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id              SERIAL PRIMARY KEY,
  email           VARCHAR(255) UNIQUE NOT NULL,
  name            VARCHAR(200),
  source          VARCHAR(100),                         -- 'lead_magnet', 'checkout', 'manual'
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_requests (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(200) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  church_name     VARCHAR(200),
  service_type    VARCHAR(100) NOT NULL,                -- 'website_design','seo','chatbot','social_media','consulting'
  budget_range    VARCHAR(50),
  details         TEXT,
  status          VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new','contacted','in_progress','completed','declined')),
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
