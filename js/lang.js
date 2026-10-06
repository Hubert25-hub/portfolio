// Universal Translation Dictionary for All Pages
const i18nData = {
  en: {
    // Shared Header & Navigation
    "nav.home": "Home",
    "nav.portfolio": "Portfolio",
    "nav.services": "Services",
    "nav.about": "About me",
    "nav.contact": "Contact",

    // Home Page (index.html)
    "hero.tag": "GRAPHIC DESIGN · BRANDING · WEB",
    "hero.title": "Flyers, logos and websites people notice.",
    "hero.text": "I'm Hubert, founder of Hubcreate. I design event flyers, brand identities and websites for businesses and organizers who want to stand out.",
    "hero.btn1": "See my work",
    "hero.btn2": "Start a project",
    "services.tag": "SERVICES",
    "services.title": "What I make",
    "services.s1.title": "Flyers and posters",
    "services.s1.text": "Event flyers, social media posts and posters that get attention and fill the room.",
    "services.s2.title": "Logos and branding",
    "services.s2.text": "Logos, colors and lettering that make your brand easy to recognize.",
    "services.s3.title": "Websites",
    "services.s3.text": "Responsive sites designed in Figma and built with HTML, CSS and JavaScript.",

    // Portfolio Page (Portfolio.html)
    "portfolio.tag": "PORTFOLIO",
    "portfolio.title": "Selected Work",
    "portfolio.text": "A showcase of event flyers, brand identities, and web design projects.",

    // Services Page (service.html)
    "servicePage.tag": "SERVICES & PRICING",
    "servicePage.title": "Let's build something great",
    "servicePage.text": "Explore my design and development services tailored to your brand.",

    // About Me Page (Aboutme.html)
    "about.tag": "ABOUT ME",
    "about.title": "Hi, I'm Hubert",
    "about.text": "Founder of Hubcreate. I help brands and event organizers stand out with powerful designs.",

    // Shared Call To Action (CTA)
    "cta.title": "Have a project in mind?",
    "cta.text": "Fill in the short form and I'll get back to you.",
    "cta.btn": "Tell me about your project",

    // Shared Footer
    "footer.rights": "© 2026 Hubcreate. All rights reserved.",

    // Image Alts
    "alt.img1": "Level Party event flyer with a yellow and orange design",
    "alt.img2": "Well Day event flyer for a community day on 30 July",
    "alt.img3": "Ole Readyaa event flyer with bold yellow lettering"
  },
  fr: {
    // Shared Header & Navigation
    "nav.home": "Accueil",
    "nav.portfolio": "Portfolio",
    "nav.services": "Services",
    "nav.about": "À propos",
    "nav.contact": "Contact",

    // Home Page (index.html)
    "hero.tag": "GRAPHISME · BRANDING · WEB",
    "hero.title": "Des flyers, logos et sites web qui se font remarquer.",
    "hero.text": "Je suis Hubert, fondateur de Hubcreate. Je conçois des flyers d'événements, des identités de marque et des sites web pour les entreprises et organisateurs qui souhaitent se démarquer.",
    "hero.btn1": "Voir mes réalisations",
    "hero.btn2": "Lancer un projet",
    "services.tag": "SERVICES",
    "services.title": "Ce que je crée",
    "services.s1.title": "Flyers et affiches",
    "services.s1.text": "Flyers événementiels, visuels pour réseaux sociaux et affiches qui attirent l'attention et remplissent vos événements.",
    "services.s2.title": "Logos et identité visuelle",
    "services.s2.text": "Logos, palettes de couleurs et typographies qui rendent votre marque rapidement reconnaissable.",
    "services.s3.title": "Sites web",
    "services.s3.text": "Sites web adaptatifs conçus sur Figma et développés en HTML, CSS et JavaScript.",

    // Portfolio Page (Portfolio.html)
    "portfolio.tag": "PORTFOLIO",
    "portfolio.title": "Mes Réalisations",
    "portfolio.text": "Une sélection de mes récents projets de flyers, logos et création web.",

    // Services Page (service.html)
    "servicePage.tag": "SERVICES & TARIFS",
    "servicePage.title": "Donnons vie à vos projets",
    "servicePage.text": "Découvrez mes prestations de design et développement sur-mesure.",

    // About Me Page (Aboutme.html)
    "about.tag": "À PROPOS",
    "about.title": "Bonjour, je suis Hubert",
    "about.text": "Fondateur de Hubcreate. J'aide les marques et les organisateurs à se démarquer grâce à un design impactant.",

    // Shared Call To Action (CTA)
    "cta.title": "Un projet en tête ?",
    "cta.text": "Remplissez ce court formulaire et je vous recontacterai rapidement.",
    "cta.btn": "Parlez-moi de votre projet",

    // Shared Footer
    "footer.rights": "© 2026 Hubcreate. Tous droits réservés.",

    // Image Alts
    "alt.img1": "Flyer d'événement Level Party avec un design jaune et orange",
    "alt.img2": "Flyer d'événement Well Day pour une journée communautaire",
    "alt.img3": "Flyer d'événement Ole Readyaa avec une typographie jaune audacieuse"
  }
};

// Applies translation to elements present on the current page
function applyTranslations(lang) {
  const dictionary = i18nData[lang];
  if (!dictionary) return;

  // Translate text elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (dictionary[key]) {
      element.textContent = dictionary[key];
    }
  });

  // Translate image alt attributes with data-i18n-alt
  document.querySelectorAll('[data-i18n-alt]').forEach(element => {
    const key = element.getAttribute('data-i18n-alt');
    if (dictionary[key]) {
      element.setAttribute('alt', dictionary[key]);
    }
  });

  document.documentElement.lang = lang;
}

// Language Switcher Logic
function initLangSwitcher() {
  const langBtns = document.querySelectorAll('.lang-btn');

  function setLanguage(lang) {
    // Highlight active state on buttons if switcher exists on the page
    langBtns.forEach(btn => {
      const isSelected = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });

    // Save choice to browser local storage across pages
    localStorage.setItem('preferred_lang', lang);

    // Apply translation to current page elements
    applyTranslations(lang);
  }

  // Handle button click event
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLang = btn.getAttribute('data-lang');
      setLanguage(targetLang);
    });
  });

  // Automatically read saved preference or default to 'en'
  const savedLanguage = localStorage.getItem('preferred_lang') || 'en';
  setLanguage(savedLanguage);
}

// Safely execute when page DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLangSwitcher);
} else {
  initLangSwitcher();
}
