/* Hubcreate light / dark theme
   - Load in <head> WITHOUT defer so the theme is set before the page paints (no flash).
   - Remembers the visitor's choice; if none, follows their device setting. */
(function () {
  var KEY = 'preferred_theme';
  var root = document.documentElement;

  var LABELS = {
    en: { toDark: 'Switch to dark mode', toLight: 'Switch to light mode' },
    fr: { toDark: 'Passer en mode sombre', toLight: 'Passer en mode clair' }
  };

  function getSaved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) { /* ignore */ }
  }

  function systemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function currentTheme() {
    var saved = getSaved();
    return saved === 'dark' || saved === 'light' ? saved : systemTheme();
  }

  function swapLogos(theme) {
    document.querySelectorAll('img[data-logo-dark]').forEach(function (img) {
      if (!img.dataset.logoLight) img.dataset.logoLight = img.getAttribute('src');
      img.setAttribute('src', theme === 'dark' ? img.dataset.logoDark : img.dataset.logoLight);
    });
  }

  function updateButton(theme) {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var lang = (root.lang || 'en').slice(0, 2);
    var text = LABELS[lang] || LABELS.en;
    var label = theme === 'dark' ? text.toLight : text.toDark;
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    swapLogos(theme);
    updateButton(theme);
  }

  // Set the theme immediately (before first paint)
  root.setAttribute('data-theme', currentTheme());

  function buildButton() {
    if (document.getElementById('themeToggle')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'themeToggle';
    btn.className = 'theme-toggle';
    btn.innerHTML =
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="4"/>' +
        '<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

    var navList = document.querySelector('.nav ul');
    if (navList) {
      var li = document.createElement('li');
      li.appendChild(btn);
      var switcher = navList.querySelector('.lang-switcher');
      var switcherItem = switcher ? switcher.closest('li') : null;
      if (switcherItem) navList.insertBefore(li, switcherItem);
      else navList.appendChild(li);
    } else {
      // Fallback: floating button if a page has no nav list
      btn.classList.add('theme-toggle--floating');
      document.body.appendChild(btn);
    }

    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      save(next);
      apply(next);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildButton();
    apply(root.getAttribute('data-theme') || currentTheme());

    // Keep the button label in sync when the EN/FR switch changes <html lang>
    new MutationObserver(function () {
      updateButton(root.getAttribute('data-theme'));
    }).observe(root, { attributes: true, attributeFilter: ['lang'] });
  });

  // If the visitor never chose, follow the device setting live
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function () {
      if (!getSaved()) apply(systemTheme());
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
})();
