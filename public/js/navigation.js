export function initNavigation(onViewChange) {
  const navItems = document.querySelectorAll('.nav-item[data-view]');
  const views = document.querySelectorAll('.view');
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  function switchView(viewId) {
    navItems.forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewId));
    views.forEach(v => v.classList.toggle('active', v.id === 'view-' + viewId));
    if (onViewChange) onViewChange(viewId);
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  }

  navItems.forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  hamburger.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    overlay.classList.toggle('visible', isOpen);
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  });
}
