import { escHtml, freqLabel, showToast, nextDelivery } from './utils.js';

let subscriptions = [
  { id: 1, name: 'AG1 Athletic Greens',    price: '$79.00', frequency: 'monthly',  qty: 1, status: 'active', nextDate: nextDelivery('monthly', 28) },
  { id: 2, name: 'Hims Daily Vitamins',    price: '$34.00', frequency: 'biweekly', qty: 2, status: 'active', nextDate: nextDelivery('biweekly', 14) },
  { id: 3, name: 'Soylent Complete Powder', price: '$55.00', frequency: 'weekly',   qty: 1, status: 'paused', nextDate: nextDelivery('weekly', 7) },
];
let nextId = 4;

export function addSubscription(item) {
  const freqDays = { weekly: 7, biweekly: 14, monthly: 28 };
  subscriptions.unshift({
    id: nextId++,
    name: item.name,
    price: item.price,
    frequency: item.frequency,
    qty: item.qty,
    status: 'active',
    nextDate: nextDelivery(item.frequency, freqDays[item.frequency] || 28),
  });
  renderSubscriptions();
}

export function renderSubscriptions() {
  const list = document.getElementById('subList');
  if (!list) return;
  if (subscriptions.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <div class="empty-title">No active subscriptions yet</div>
        <div class="empty-desc">Go to Buy and subscribe to a product to get started.</div>
      </div>`;
    return;
  }
  list.innerHTML = subscriptions.map(s => `
    <div class="sub-card" id="sub-${s.id}">
      <div class="sub-card-top">
        <div class="sub-card-info">
          <div class="sub-name">${escHtml(s.name)}</div>
          <div class="sub-meta">${s.price} &middot; Qty ${s.qty} &middot; ${freqLabel(s.frequency)}</div>
        </div>
        <span class="status-badge ${s.status === 'active' ? 'badge-active' : 'badge-paused'}">${s.status}</span>
      </div>
      <div class="sub-card-footer">
        <span class="sub-next-delivery">Next delivery: ${s.nextDate}</span>
        <div class="sub-actions">
          <select class="sub-freq-edit" data-action="editFreq" data-id="${s.id}">
            <option value="weekly"   ${s.frequency==='weekly'   ?'selected':''}>Weekly</option>
            <option value="biweekly" ${s.frequency==='biweekly' ?'selected':''}>Bi-weekly</option>
            <option value="monthly"  ${s.frequency==='monthly'  ?'selected':''}>Monthly</option>
          </select>
          <button class="sub-btn" data-action="togglePause" data-id="${s.id}">${s.status === 'active' ? 'Pause' : 'Resume'}</button>
          <button class="sub-btn danger" data-action="cancelSub" data-id="${s.id}">Cancel</button>
        </div>
      </div>
    </div>`).join('');
}

function togglePause(id) {
  const s = subscriptions.find(x => x.id === id);
  if (s) { s.status = s.status === 'active' ? 'paused' : 'active'; renderSubscriptions(); }
}

function cancelSub(id) {
  if (!confirm('Cancel this subscription?')) return;
  subscriptions = subscriptions.filter(x => x.id !== id);
  renderSubscriptions();
  showToast('Subscription cancelled.');
}

function editFreq(id, val) {
  const s = subscriptions.find(x => x.id === id);
  if (s) { s.frequency = val; renderSubscriptions(); }
}

export function initSubscriptions() {
  const list = document.getElementById('subList');

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.dataset.action === 'togglePause') togglePause(id);
    if (btn.dataset.action === 'cancelSub') cancelSub(id);
  });

  list.addEventListener('change', (e) => {
    const sel = e.target.closest('[data-action="editFreq"]');
    if (!sel) return;
    editFreq(Number(sel.dataset.id), sel.value);
  });

  renderSubscriptions();
}
