/* Hubcreate — effets (ajoutés 2026-11-18)
   01 curseur personnalisé · 02 boutons magnétiques · 03 révélation au
   défilement · 04 transition de page · 05 titre décodage (accueil).
   Tout est désactivé si l'utilisateur préfère réduire les animations. */
(function () {
  "use strict";
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  document.documentElement.classList.add("hc-fx");

  /* ---------- 04 · Transition de page (panneau Ink) ---------- */
  var wipe = document.createElement("div");
  wipe.id = "hcWipe";
  wipe.setAttribute("aria-hidden", "true");
  document.body.appendChild(wipe);
  var wipePending = false;
  try { wipePending = sessionStorage.getItem("hc-wipe") === "1"; } catch (e) { /* ignore */ }
  if (wipePending) {
    try { sessionStorage.removeItem("hc-wipe"); } catch (e) { /* ignore */ }
    wipe.classList.add("wipe-instant");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wipe.classList.remove("wipe-instant");
        wipe.classList.add("wipe-exit");
        setTimeout(function () { wipe.classList.remove("wipe-exit"); }, 560);
      });
    });
  }
  window.addEventListener("pageshow", function () {
    wipe.classList.remove("wipe-cover", "wipe-exit", "wipe-instant");
    wipe.style.transform = "";
  });
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    if (a.target && a.target !== "_self") return;
    if (a.classList.contains("logo-link")) return; /* porte discrète du suivi : gérée par son propre script */
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#") return;
    var url;
    try { url = new URL(href, window.location.href); } catch (err) { return; }
    if (url.origin !== window.location.origin) return;
    if (!/\.html$/i.test(url.pathname) && url.pathname !== "/" && !/\/$/.test(url.pathname)) return;
    if (url.pathname === window.location.pathname) return;
    e.preventDefault();
    try { sessionStorage.setItem("hc-wipe", "1"); } catch (err) { /* ignore */ }
    wipe.classList.add("wipe-cover");
    setTimeout(function () { window.location.href = url.href; }, 470);
  });

  /* ---------- 01 · Curseur personnalisé ---------- */
  if (finePointer) {
    var dot = document.createElement("div");
    dot.className = "hc-cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    var ring = document.createElement("div");
    ring.className = "hc-cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add("hc-cursor-on");
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + (mx - 3) + "px," + (my - 3) + "px)";
    }, { passive: true });
    (function follow() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      var half = ring.classList.contains("is-active") ? 29 : 17;
      ring.style.transform = "translate(" + (rx - half) + "px," + (ry - half) + "px)";
      requestAnimationFrame(follow);
    })();
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest && e.target.closest("a, button, input, textarea, select, label, [data-viewer], .ptab")) {
        ring.classList.add("is-active");
      }
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest && e.target.closest("a, button, input, textarea, select, label, [data-viewer], .ptab")) {
        ring.classList.remove("is-active");
      }
    });
    document.addEventListener("mouseleave", function () {
      dot.style.transform = "translate(-100px,-100px)";
      mx = -100; my = -100;
    });
  }

  /* ---------- 02 · Boutons magnétiques ---------- */
  if (finePointer) {
    document.querySelectorAll(".hero2-cta, .about2-email-btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transition = "transform .18s ease-out";
        btn.style.transform = "translate(" + (x * 0.28).toFixed(1) + "px," + (y * 0.28).toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transition = "transform .5s cubic-bezier(.2,.8,.3,1.35)";
        btn.style.transform = "";
        setTimeout(function () { btn.style.transition = ""; }, 520);
      });
    });
  }

  /* ---------- 03 · Révélation au défilement ---------- */
  var revealSelectors = ".home-promo, .home-mascot, .svc-title, .about2-edu, .about2-lang, .about2-tools, .about2-form-title";
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(revealSelectors));
  revealEls.forEach(function (el) { el.setAttribute("data-reveal", ""); });
  if ("IntersectionObserver" in window && revealEls.length) {
    var seen = new WeakMap();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = revealEls.filter(function (s) { return s.parentNode === el.parentNode; });
        var idx = siblings.indexOf(el);
        el.style.transitionDelay = (Math.max(0, idx) * 80) + "ms";
        el.classList.add("revealed");
        io.unobserve(el);
        seen.set(el, true);
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("revealed"); });
  }

  /* ---------- 05 · Titre décodage (accueil seulement) ---------- */
  var word = document.querySelector(".hero2-word");
  if (word) {
    var textNode = null;
    for (var i = 0; i < word.childNodes.length; i++) {
      if (word.childNodes[i].nodeType === 3 && word.childNodes[i].textContent.trim()) { textNode = word.childNodes[i]; break; }
    }
    if (textNode) {
      var original = textNode.textContent;
      var letters = original.split("");
      var spans = letters.map(function (ch) {
        var s = document.createElement("span");
        s.textContent = ch;
        word.insertBefore(s, textNode);
        return s;
      });
      word.removeChild(textNode);
      var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&";
      var locked = 0;
      var started = false;
      function scrambleTick() {
        spans.forEach(function (s, idx) {
          if (idx < locked) { s.textContent = letters[idx]; }
          else { s.textContent = GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length)); }
        });
      }
      function startDecode() {
        if (started) return; started = true;
        var iv = setInterval(scrambleTick, 50);
        var lock = setInterval(function () {
          locked++;
          if (locked >= letters.length) {
            clearInterval(lock);
            clearInterval(iv);
            spans.forEach(function (s, idx) { s.textContent = letters[idx]; });
            setTimeout(function () {
              var restored = document.createTextNode(original);
              word.insertBefore(restored, spans[0]);
              spans.forEach(function (s) { s.remove(); });
            }, 350);
          }
        }, 115);
      }
      /* Après l'écran d'ouverture s'il est affiché, sinon rapidement. */
      if (document.documentElement.classList.contains("intro-on")) {
        var waitIntro = setInterval(function () {
          if (!document.getElementById("hcIntro")) { clearInterval(waitIntro); setTimeout(startDecode, 150); }
        }, 200);
        setTimeout(function () { clearInterval(waitIntro); startDecode(); }, 4500);
      } else {
        setTimeout(startDecode, 350);
      }
    }
  }
})();
