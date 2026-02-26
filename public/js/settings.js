import { showToast } from './utils.js';

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}

export function initSettings() {
  const darkToggle = document.getElementById('darkModeToggle');

  // Restore saved preference
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    darkToggle.checked = true;
    applyTheme(true);
  }

  darkToggle.addEventListener('change', () => {
    const dark = darkToggle.checked;
    applyTheme(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });

  document.querySelector('.settings-save-btn').addEventListener('click', () => {
    showToast('Settings saved ✓');
  });
}
