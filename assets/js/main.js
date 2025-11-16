// Shared interactions for BearrSubstation
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('bearr-theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  // Initialize theme
  if (stored === 'light' || (!stored && prefersLight)) {
    root.setAttribute('data-theme', 'light');
  }

  toggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('bearr-theme', next);
  });

  // Search filter
  const input = document.getElementById('search-input');
  const list = document.getElementById('catalog-list');
  const empty = document.getElementById('empty-state');

  function normalize(s) { return (s || '').toLowerCase().trim(); }

  input?.addEventListener('input', (e) => {
    const q = normalize(e.target.value);
    let matches = 0;
    list.querySelectorAll('.item').forEach(li => {
      const text = normalize(li.textContent);
      const tags = normalize(li.getAttribute('data-tags'));
      const visible = !q || text.includes(q) || tags.includes(q);
      li.style.display = visible ? '' : 'none';
      if (visible) matches++;
    });
    empty.classList.toggle('hidden', matches !== 0);
  });

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Placeholder email signup (no backend yet)
document.getElementById('signup-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('email');
  if (!email.checkValidity()) {
    email.reportValidity();
    return;
  }
  alert('Thanks! We will notify you when new tools are available.');
  this.reset();
});


// Mobile menu toggle
(function () {
  const btn = document.getElementById('menuToggle');
  const nav = document.getElementById('primary-nav');
  if (!btn || !nav) return;

  function closeMenu() {
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
  function openMenu() {
    nav.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }

  btn.addEventListener('click', () => {
    const open = nav.classList.contains('open');
    open ? closeMenu() : openMenu();
  });

  // Close when clicking a link or outside
  nav.addEventListener('click', (e) => {
    if (e.target.closest('.nav-link')) closeMenu();
  });
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Reset on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 860) closeMenu();
  });
})();

// --- Clickable cards & sublist items ---
(function () {
  try {
    var cards = document.querySelectorAll('.card');
    cards.forEach(function(card){
      var titleLink = card.querySelector('.card-title');
      if (!titleLink) return;
      // Make entire card clickable
      card.setAttribute('role','link');
      card.setAttribute('tabindex','0');
      var navigate = function(){ window.location.href = titleLink.getAttribute('href'); };
      card.addEventListener('click', function(e){
        // don't hijack clicks on actual links/buttons/inputs inside
        if (e.target.closest('a, button, input, label, select, textarea')) return;
        navigate();
      });
      card.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(); }
      });
      // Make each sublist line clickable too
      var lines = card.querySelectorAll('.mini li');
      lines.forEach(function(li){
        li.setAttribute('role','link');
        li.setAttribute('tabindex','0');
        li.addEventListener('click', function(){ navigate(); });
        li.addEventListener('keydown', function(e){
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(); }
        });
      });
    });
  } catch (e) { /* no-op */ }
})();
