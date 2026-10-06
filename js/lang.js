document.addEventListener('DOMContentLoaded', () => {
  const langBtns = document.querySelectorAll('.lang-btn');

  function setLanguage(lang) {
    // 1. Toggle button active states and accessibility tags
    langBtns.forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });

    // 2. Save choice locally so it remembers user preference
    localStorage.setItem('preferred_lang', lang);

    // 3. Call your existing translation function (if present)
    if (typeof updatePageTranslations === 'function') {
      updatePageTranslations(lang);
    }
  }

  // Event Listeners for Switcher Buttons
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      setLanguage(selectedLang);
    });
  });

  // Load user saved language preference or default to 'en'
  const initialLang = localStorage.getItem('preferred_lang') || 'en';
  setLanguage(initialLang);
});
