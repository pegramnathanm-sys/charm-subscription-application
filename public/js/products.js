import { escHtml, formatPrice, freqLabel, showToast } from './utils.js';
import { addBubble, addTyping, removeTyping } from './chat.js';
import { addSubscription } from './subscriptions.js';

let currentQty = 1;
let currentFreq = 'monthly';

async function lookupProduct(productUrl) {
  const res = await fetch(`/api/products/lookup?url=${encodeURIComponent(productUrl)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const error = new Error(err.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = err;
    throw error;
  }
  return res.json();
}

function showProductCard(product) {
  addBubble('bot', 'Found it! Here\'s what I pulled up:');

  const name = product.name || 'Unknown Product';
  const price = formatPrice(product.price);
  const desc = product.description || '';
  const featuredImage = product.images?.find(i => i.isFeatured)?.url || product.images?.[0]?.url || null;

  currentQty = 1;
  currentFreq = 'monthly';

  const imgHtml = featuredImage
    ? `<img src="${featuredImage}" alt="${escHtml(name)}" style="width:100%;height:200px;object-fit:cover;display:block;">`
    : `<div class="product-img">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#ccc" stroke-width="1.5">
          <rect x="8" y="8" width="32" height="32" rx="4"/>
          <circle cx="18" cy="20" r="4"/>
          <path d="M8 34l10-10 6 6 6-8 10 12"/>
        </svg>
      </div>`;

  const chatArea = document.getElementById('chatArea');
  const row = document.createElement('div');
  row.className = 'bubble-row bot product-card-row';
  row.innerHTML = `
    <div class="bot-avatar">C</div>
    <div class="product-card" id="productCard">
      ${imgHtml}
      <div class="product-body">
        <div>
          <div class="product-name">${escHtml(name)}</div>
          <div class="product-price">${escHtml(price)}</div>
        </div>
        <div class="product-desc">${escHtml(desc)}</div>
        <div class="product-controls">
          <div class="control-row">
            <span class="control-label">Quantity</span>
            <div class="qty-selector">
              <button class="qty-btn" id="qtyMinus">−</button>
              <span class="qty-value" id="qtyVal">1</span>
              <button class="qty-btn" id="qtyPlus">+</button>
            </div>
          </div>
          <div class="control-row">
            <span class="control-label">Delivery</span>
            <select class="freq-select" id="freqSelect">
              <option value="one-time">One-time</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly" selected>Monthly</option>
            </select>
          </div>
        </div>
        <div class="product-actions">
          <button class="btn btn-secondary" id="buyNowBtn">Buy Now</button>
          <button class="btn btn-primary" id="subscribeBtn">Subscribe</button>
        </div>
      </div>
    </div>`;
  chatArea.appendChild(row);
  chatArea.scrollTop = chatArea.scrollHeight;

  document.getElementById('qtyMinus').addEventListener('click', () => {
    if (currentQty > 1) { currentQty--; document.getElementById('qtyVal').textContent = currentQty; }
  });
  document.getElementById('qtyPlus').addEventListener('click', () => {
    currentQty++;
    document.getElementById('qtyVal').textContent = currentQty;
  });
  document.getElementById('freqSelect').addEventListener('change', e => { currentFreq = e.target.value; });

  document.getElementById('buyNowBtn').addEventListener('click', () => {
    showToast('Order placed! 🎉');
    addBubble('bot', `Got it — one-time order for <strong>${currentQty}x ${escHtml(name)}</strong> placed!`);
  });

  document.getElementById('subscribeBtn').addEventListener('click', () => {
    if (currentFreq === 'one-time') { showToast('Select a recurring frequency to subscribe.'); return; }
    addSubscription({ name, price, frequency: currentFreq, qty: currentQty });
    showToast('Subscribed! ✓ Added to your subscriptions.');
    addBubble('bot', `You're now subscribed to <strong>${escHtml(name)}</strong> (${freqLabel(currentFreq)}). Manage it in Subscriptions.`);
  });
}

export function initBuyView() {
  const urlInput = document.getElementById('urlInput');
  const submitBtn = document.getElementById('submitBtn');

  async function handleSubmit() {
    const val = urlInput.value.trim();
    if (!val) return;
    urlInput.value = '';
    submitBtn.disabled = true;

    const welcome = document.getElementById('chatWelcome');
    if (welcome) welcome.remove();

    addBubble('user', escHtml(val));
    addTyping();

    try {
      const product = await lookupProduct(val);
      removeTyping();
      showProductCard(product);
    } catch (err) {
      removeTyping();
      const msg = err.status === 404
        ? "I couldn't find that product. Please check the URL and try again."
        : "Something went wrong fetching that product. Please try again.";
      addBubble('bot', msg);
    } finally {
      submitBtn.disabled = false;
    }
  }

  submitBtn.addEventListener('click', handleSubmit);
  urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSubmit(); });
}
