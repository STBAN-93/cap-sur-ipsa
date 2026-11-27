/* ---------- fond des pages secondaires : ciel étoilé en canvas 2D ----------
   Remplace la scène Three.js (≈ 600 ko + textures du globe) hors de l'accueil.
   Trois couches d'étoiles avec une légère parallaxe au défilement ; dessin seulement
   quand la page défile ou change de taille (aucune boucle permanente). */
export function initStars() {
  var cv = document.getElementById('stars');
  if (!cv || !cv.getContext) return;
  var cx = cv.getContext('2d');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 1, H = 1, D = 1, stars = [], raf = 0;

  /* générateur pseudo-aléatoire fixe : le même ciel à chaque visite */
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  function build() {
    seed = 7; stars = [];
    var n = Math.round(Math.min(520, (W * H) / 2600));
    for (var i = 0; i < n; i++) {
      var layer = i % 3; // 0 : loin, 2 : proche
      stars.push({
        x: rnd() * W, y: rnd() * H * 1.6,
        r: (layer === 2 ? 1.25 : layer === 1 ? .85 : .55) * (.7 + rnd() * .6),
        a: .25 + rnd() * .6, k: [.03, .07, .13][layer],
        c: rnd() < .08 ? '255,179,127' : rnd() < .12 ? '111,214,255' : '236,231,220'
      });
    }
  }
  function resize() {
    D = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * D; cv.height = H * D;
    build(); draw();
  }
  function draw() {
    raf = 0;
    var y = reduce ? 0 : (window.scrollY || 0);
    cx.setTransform(D, 0, 0, D, 0, 0);
    cx.clearRect(0, 0, W, H);
    var span = H * 1.6;
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i], sy = ((s.y - y * s.k) % span + span) % span;
      if (sy > H + 2) continue;
      cx.globalAlpha = s.a;
      cx.fillStyle = 'rgb(' + s.c + ')';
      cx.beginPath(); cx.arc(s.x, sy, s.r, 0, 6.2832); cx.fill();
    }
    cx.globalAlpha = 1;
  }
  function req() { if (!raf) raf = requestAnimationFrame(draw); }
  window.addEventListener('resize', resize);
  if (!reduce) window.addEventListener('scroll', req, { passive: true });
  resize();
}
