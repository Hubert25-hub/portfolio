document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.getElementById('viewer');
  if (!dialog) return;

  const img = document.getElementById('viewerImg');
  const title = document.getElementById('viewerTitle');
  const desc = document.getElementById('viewerDesc');
  const count = document.getElementById('viewerCount');
  const closeBtn = document.getElementById('viewerClose');
  const prevBtn = document.getElementById('viewerPrev');
  const nextBtn = document.getElementById('viewerNext');
  const buttons = Array.from(document.querySelectorAll('.gallery .card button'));

  let currentIndex = 0;

  function updateLightbox(index) {
    currentIndex = index;
    const btn = buttons[currentIndex];
    const cardImg = btn.querySelector('img');
    const titleEl = btn.querySelector('.title');

    img.src = cardImg.src;
    img.alt = cardImg.alt;
    
    // Get title string
    title.textContent = titleEl ? titleEl.textContent : btn.dataset.title;
    
    // Get translated description dynamically
    const currentLang = localStorage.getItem('preferred_lang') || 'en';
    const descKey = btn.getAttribute('data-i18n-desc');
    
    if (descKey && typeof i18nData !== 'undefined' && i18nData[currentLang] && i18nData[currentLang][descKey]) {
      desc.textContent = i18nData[currentLang][descKey];
    } else {
      desc.textContent = btn.dataset.description || '';
    }

    count.textContent = `${currentIndex + 1} / ${buttons.length}`;
  }

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      updateLightbox(index);
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', 'true');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      updateLightbox(newIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % buttons.length;
      updateLightbox(newIndex);
    });
  }

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    }
  });
});
