const chatArea = document.getElementById('chatArea');

export function addBubble(type, html) {
  const row = document.createElement('div');
  row.className = 'bubble-row ' + type;
  if (type === 'bot') {
    row.innerHTML = `<div class="bot-avatar">C</div><div class="bubble">${html}</div>`;
  } else {
    row.innerHTML = `<div class="bubble">${html}</div>`;
  }
  chatArea.appendChild(row);
  chatArea.scrollTop = chatArea.scrollHeight;
  return row;
}

export function addTyping() {
  const row = document.createElement('div');
  row.className = 'bubble-row bot';
  row.id = 'typingRow';
  row.innerHTML = `<div class="bot-avatar">C</div>
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  chatArea.appendChild(row);
  chatArea.scrollTop = chatArea.scrollHeight;
}

export function removeTyping() {
  const el = document.getElementById('typingRow');
  if (el) el.remove();
}
