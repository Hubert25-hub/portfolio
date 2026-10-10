/* Hero collage scroll-tilt (added 2026-10-10). Respects reduced-motion. */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.collage img'));
  var base = [-5, 4, -1];
  var ticking = false;
  function update() {
    ticking = false;
    var max = document.body.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    imgs.forEach(function (img, i) {
      var sway = Math.sin(p * Math.PI * 2 + i * 2.1) * 10;
      img.style.rotate = (base[i] + sway).toFixed(2) + 'deg';
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();