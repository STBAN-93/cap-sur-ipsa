/* Accueil : scène 3D complète (Three.js chargé à part, après le reste) */
import { boot } from './common.js';

boot();

/* #globe/<n> : arrivée depuis « Voir sur le globe » d'une autre page */
var m = /^#globe\/(\d)$/.exec(location.hash);
var wanted = m ? +m[1] : -1;
if (wanted >= 0) {
  var g = document.getElementById('globe');
  if (g) g.scrollIntoView({ block: 'start' });
}

/* le texte, la recherche et la navigation sont utilisables sans attendre la scène */
import('../scene/scene.js')
  .then((mod) => {
    mod.initScene();
    if (wanted >= 0) {
      var b = document.querySelector('.campus[data-i="' + wanted + '"]');
      if (b && b.getAttribute('aria-pressed') !== 'true') b.click();
      try { history.replaceState(null, '', location.pathname + location.search + '#globe'); } catch (e) {}
    }
  })
  .catch((err) => {
    console.error("[Cap sur l'IPSA] échec de « scène 3D »", err);
    document.body.classList.add('no-gl'); // même repli visuel qu'en l'absence de WebGL
  });
