// Translation Dictionary for English and French
const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.portfolio": "Portfolio",
    "nav.services": "Services",
    "nav.about": "About me",
    "nav.contact": "Contact",

    // Hero Section
    "hero.tag": "GRAPHIC DESIGN · BRANDING · WEB",
    "hero.title": "Flyers, logos and websites people notice.",
    "hero.text": "I'm Hubert, founder of Hubcreate. I design event flyers, brand identities and websites for businesses and organizers who want to stand out.",
    "hero.btn1": "See my work",
    "hero.btn2": "Start a project",

    // Services Section
    "services.tag": "SERVICES",
    "services.title": "What I make",
    "services.s1.title": "Flyers and posters",
    "services.s1.text": "Event flyers, social media posts and posters that get attention and fill the room.",
    "services.s2.title": "Logos and branding",
    "services.s2.text": "Logos, colors and lettering that make your brand easy to recognize.",
    "services.s3.title": "Websites",
    "services.s3.text": "Responsive sites designed in Figma and built with HTML, CSS and JavaScript.",

    // CTA Section
    "cta.title": "Have a project in mind?",
    "cta.text": "Fill in the short form and I'll get back to you.",
    "cta.btn": "Tell me about your project",

    // Footer
    "footer.rights": "© 2026 Hubcreate. All rights reserved.",

    // Image Alt texts
    "alt.img1": "Level Party event flyer with a yellow and orange design",
    "alt.img2": "Well Day event flyer for a community day on 30 July",
    "alt.img3": "Ole Readyaa event flyer with bold yellow lettering"
  },
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.portfolio": "Portfolio",
    "nav.services": "Services",
    "nav.about": "À propos",
    "nav.contact": "Contact",

    // Hero Section
    "hero.tag": "GRAPHISME · BRANDING · WEB",
    "hero.title": "Des flyers, logos et sites web qui se font remarquer.",
    "hero.text": "Je suis Hubert, fondateur de Hubcreate. Je conçois des flyers d'événements, des identités de marque et des sites web pour les entreprises et organisateurs qui souhaitent se démarquer.",
    "hero.btn1": "Voir mes réalisations",
    "hero.btn2": "Lancer un projet",

    // Services Section
    "services.tag": "SERVICES",
    "services.title": "Ce que je crée",
    "services.s1.title": "Flyers et affiches",
    "services.s1.text": "Flyers événementiels, visuels pour réseaux sociaux et affiches qui attirent l'attention et remplissent vos événements.",
    "services.s2.title": "Logos et identité visuelle",
    "services.s2.text": "Logos, palettes de couleurs et typographies qui rendent votre marque rapidement reconnaissable.",
    "services.s3.title": "Sites web",
    "services.s3.text": "Sites web adaptatifs conçus sur Figma et développés en HTML, CSS et JavaScript.",

    // CTA Section
    "cta.title": "Un projet en tête ?",
    "cta.text": "Remplissez ce court formulaire et je vous recontacterai rapidement.",
    "cta.btn": "Parlez-moi de votre projet",

    // Footer
    "footer.rights": "© 2026 Hubcreate. Tous droits réservés.",

    // Image Alt texts
    "alt.img1": "Flyer d'événement Level Party avec un design jaune et orange",
    "alt.img2": "Flyer d'événement Well Day pour une journée communautaire",
    "alt.img3": "Flyer d'événement Ole Readyaa avec un typographie jaune audacieuse"
  }
};

// Main function to update all elements on the page
function updatePageTranslations(lang) {
  const currentLangDict = translations[lang];
  if (!currentLangDict) return;

  // 1. Translate elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (currentLangDict[key]) {
      element.textContent = currentLangDict[key];
    }
  });

  // 2. Translate image alt attributes with data-i18n-alt
  document.querySelectorAll('[data-i18n-alt]').forEach(element => {
    const key = element.getAttribute('data-i18n-alt');
    if (currentLangDict[key]) {
      element.setAttribute('alt', currentLangDict[key]);
    }
  });

  // 3. Update the html lang attribute
  document.documentElement.setAttribute('lang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
  const langBtns = document.querySelectorAll('.lang-btn');

  function setLanguage(lang) {
    // Toggle active styles on EN/FR buttons
    langBtns.forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });

    // Save language choice in browser cache
    localStorage.setItem('preferred_lang', lang);

    // Apply translations to content
    updatePageTranslations(lang);
  }

  // Handle language switch clicks
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      setLanguage(selectedLang);
    });
  });

  // Default to saved language or English
  const initialLang = localStorage.getItem('preferred_lang') || 'en';
  setLanguage(initialLang);
});
