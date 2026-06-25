# ShepherdTech — MVP

A lean eCommerce platform for digital products and services for churches and pastors.
Built for Node.js/Express, designed to run on Replit.

## What's included

- `server/` — Express backend (products, orders, leads, service requests)
- `public/` — Front-end (landing page, product/checkout page, success page)
- `server/schema.sql` — Database schema (Postgres)
- `server/seed.js` — Placeholder products to get started
- `.env.example` — All environment variables you need

## Setup on Replit

1. **Import this project** into a new Replit (Node.js template), or upload these files directly.

2. **Add a Postgres database.** Easiest options:
   - Use Replit's built-in Postgres database (search "PostgreSQL" in the Replit tools/database tab), or
   - Create a free database at neon.tech and copy the connection string.

3. **Set your Secrets** (Replit's Secrets tab — do NOT put real keys in `.env` if your Repl is public):
   - `DATABASE_URL`
   - `PAYSTACK_SECRET_KEY` and `PAYSTACK_PUBLIC_KEY` (get from your Paystack dashboard)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL` (free tier from Brevo: brevo.com)
   - `APP_BASE_URL` (your Repl's public URL, e.g. `https://shepherdtech.yourname.repl.co`)

4. **Install dependencies:**
   ```
   npm install
   ```

5. **Create the database tables:**
   ```
   npm run db:init
   ```

6. **Add placeholder products (optional, to test):**
   ```
   node server/seed.js
   ```

7. **Start the server:**
   ```
   npm start
   ```

8. Visit your Repl's URL — you should see the ShepherdTech landing page with products loaded.

## Replacing placeholder products with real ones

Each product in the `products` table needs:
- A real `file_url` for digital products — upload your file to Replit Object Storage,
  Google Drive (with a public/shareable link), or any file host, and paste that link in.
- Accurate `price_usd` / `price_ngn`.

You can either:
- Edit directly in your database (Replit's database UI, or any Postgres client), or
- Add a simple admin route later (Phase 2) to manage this through a dashboard instead of SQL.

## What's NOT in this MVP (by design — Phase 2)

- Full shopping cart (multi-item checkout) — for now, each product has its own "Pay Now" button.
- User accounts/login — guest checkout via email is enough to validate demand.
- Lemon Squeezy/Gumroad integration for USD sales — start by listing your digital products
  there directly (their own hosted checkout pages), and link to them from your site.
  We'll wire up their webhooks into this same `orders` table once you're ready to unify everything.
- Physical product/dropshipping support — added once digital + services are validated.

## Next steps

1. Pick your first 3-4 real products/services to replace the placeholders.
2. Get Paystack test keys working end-to-end (use Paystack's test card numbers first).
3. Set up your Brevo (or similar) SMTP so delivery emails actually send.
4. Deploy and share the link with your existing network for your first sale.
