export function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function showToast(msg) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.id = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

export function formatPrice(price) {
  if (!price) return '';
  const amount = price.amountSubunits / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode || 'USD',
  }).format(amount);
}

export function freqLabel(f) {
  return { weekly: 'Weekly', biweekly: 'Bi-weekly', monthly: 'Monthly' }[f] || f;
}

export function nextDelivery(freqKey, offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
