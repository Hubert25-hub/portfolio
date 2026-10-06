/* Hubcreate: English / French switch
   English is the default text written in each HTML page.
   French texts live here, matched by the data-i18n key. */
(function () {
  var FR = {
    "meta.title": "Hubcreate | Hubert – Graphiste et développeur web",
    "meta.desc": "Flyers d'événements, logos, identité visuelle et sites web par Hubert chez Hubcreate. Découvrez mes réalisations et lançons votre projet.",

    "nav.home": "Accueil",
    "nav.portfolio": "Réalisations",
    "nav.services": "Services",
    "nav.about": "À propos",
    "nav.contact": "Contact",

    "hero.tag": "GRAPHISME · IDENTITÉ VISUELLE · WEB",
    "hero.title": "Des flyers, logos et sites web qui se remarquent.",
    "hero.text": "Je suis Hubert, fondateur de Hubcreate. Je crée des flyers d'événements, des identités visuelles et des sites web pour les entreprises et les organisateurs qui veulent se démarquer.",
    "hero.btn1": "Voir mes réalisations",
    "hero.btn2": "Démarrer un projet",

    "alt.img1": "Flyer de l'événement Level Party au design jaune et orange",
    "alt.img2": "Flyer de l'événement Well Day, une journée communautaire le 30 juillet",
    "alt.img3": "Flyer de l'événement Ole Readyaa avec de grandes lettres jaunes",

    "services.tag": "SERVICES",
    "services.title": "Ce que je crée",
    "services.s1.title": "Flyers et affiches",
    "services.s1.text": "Des flyers d'événements, des publications pour les réseaux sociaux et des affiches qui attirent l'attention et remplissent la salle.",
    "services.s2.title": "Logos et identité visuelle",
    "services.s2.text": "Des logos, des couleurs et des typographies qui rendent votre marque facile à reconnaître.",
    "services.s3.title": "Sites web",
    "services.s3.text": "Des sites adaptés à tous les écrans, conçus dans Figma et développés en HTML, CSS et JavaScript.",

    "cta.title": "Un projet en tête ?",
    "cta.text": "Remplissez le court formulaire et je vous réponds rapidement.",
    "cta.btn": "Parlez-moi de votre projet",

    "footer.rights": "© 2026 Hubcreate. Tous droits réservés."
  };

  var metaDesc = document.querySelector('meta[name="description"]');
  var original = { title: document.title, desc: metaDesc ? metaDesc.content : "" };

  function apply(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (el.dataset.en === undefined) el.dataset.en = el.textContent;
      var fr = FR[el.dataset.i18n];
      el.textContent = (lang === "fr" && fr) ? fr : el.dataset.en;
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      if (el.dataset.enAlt === undefined) el.dataset.enAlt = el.alt;
      var fr = FR[el.dataset.i18nAlt];
      el.alt = (lang === "fr" && fr) ? fr : el.dataset.enAlt;
    });

    document.title = (lang === "fr" && FR["meta.title"]) ? FR["meta.title"] : original.title;
    if (metaDesc) metaDesc.content = (lang === "fr" && FR["meta.desc"]) ? FR["meta.desc"] : original.desc;

    var btn = document.getElementById("langToggle");
    if (btn) btn.textContent = lang === "fr" ? "EN" : "FR";

    try { localStorage.setItem("lang", lang); } catch (e) {}
  }

  function startLang() {
    var fromUrl = new URLSearchParams(location.search).get("lang");
    if (fromUrl === "fr" || fromUrl === "en") return fromUrl;
    try {
      var saved = localStorage.getItem("lang");
      if (saved === "fr" || saved === "en") return saved;
    } catch (e) {}
    return (navigator.language || "en").toLowerCase().indexOf("fr") === 0 ? "fr" : "en";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("langToggle");
    if (btn) btn.addEventListener("click", function () {
      apply(document.documentElement.lang === "fr" ? "en" : "fr");
    });
    apply(startLang());
  });
})();
