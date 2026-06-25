// public/js/main.js

async function loadProducts() {
  const grid = document.getElementById('productGrid');
  try {
    const res = await fetch('/api/products');
    const products = await res.json();

    if (!products.length) {
      grid.innerHTML = '<p style="text-align:center;color:#888;">New products coming soon.</p>';
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="product-card">
        <h3>${p.title}</h3>
        <p>${p.short_pitch || ''}</p>
        <p class="price">${p.price_usd ? '$' + p.price_usd : ''} ${p.price_ngn ? '/ ₦' + p.price_ngn : ''}</p>
        <a class="btn" href="/product.html?slug=${p.slug}">View ${p.type === 'service' ? 'Service' : 'Product'}</a>
      </div>
    `).join('');
  } catch (err) {
    grid.innerHTML = '<p style="text-align:center;color:#c00;">Could not load products right now.</p>';
  }
}

document.getElementById('leadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('leadEmail').value;
  const msg = document.getElementById('leadMessage');
  msg.textContent = 'Sending...';

  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'lead_magnet' })
    });
    const data = await res.json();
    msg.textContent = data.success
      ? 'Check your email — your free template is on the way!'
      : 'Something went wrong. Please try again.';
  } catch (err) {
    msg.textContent = 'Something went wrong. Please try again.';
  }
});

loadProducts();
