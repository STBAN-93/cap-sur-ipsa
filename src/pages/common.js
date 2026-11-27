/* Socle commun à toutes les pages : polices, styles, menu, recherche Ctrl+K, fiches, Copilote.
   Chaque partie est isolée : si l'une plante, les autres continuent. */

/* polices hébergées avec le site (plus d'appel à Google Fonts) */
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource-variable/instrument-sans/wght.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '../styles/main.css';

import { initInterface } from '../ui/interface.js';
import { initDrawer, openFiche } from '../fiches/drawer.js';
import { initPalette } from '../search/palette.js';
import { initNav } from '../ui/nav.js';
import { initCopilote } from '../copilote/copilote.js';
import IPSA_DATA from '../data/fiches.js';
import { search } from '../search/engine.js';

export function run(parts) {
  for (const [name, init] of parts) {
    try { init(); } catch (err) { console.error(`[Cap sur l'IPSA] échec de « ${name} »`, err); }
  }
}

/* pageParts : parties propres à la page, lancées avant la palette (qui peut s'appuyer dessus) */
export function boot(pageParts = []) {
  run([
    ['navigation', initNav],
    ['interface', initInterface],
    ['fiches', initDrawer],
    ...pageParts,
    ['palette', initPalette],
    ['Copilote', initCopilote],
  ]);
  settleHash();
  /* mêmes objets globaux qu'avant (utiles depuis la console) */
  window.IPSA_DATA = IPSA_DATA;
  window.IPSA_HUB = { search: (q) => search(q, '', ''), openFiche };
}

/* arrivée sur page.html#section : le navigateur défile vers la section avant que les polices
   soient chargées, puis la mise en page bouge. On recale la section une fois la page prête,
   sauf si le visiteur a déjà commencé à défiler lui-même. */
function settleHash() {
  var id = decodeURIComponent(location.hash.slice(1));
  if (!id || id.indexOf('/') >= 0) return; // #fiche/… et #globe/… ont leur propre traitement
  var el = document.getElementById(id);
  if (!el) return;
  var touched = false;
  var mark = function () { touched = true; };
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) { addEventListener(t, mark, { once: true, passive: true }); });
  var fix = function () {
    if (touched) return;
    var want = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    if (Math.abs(el.getBoundingClientRect().top - want) > 4) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  };
  var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  ready.then(function () { setTimeout(fix, 700); }); // après la fin du défilement doux
  addEventListener('load', function () { setTimeout(fix, 900); }, { once: true });
}

/* fond étoilé léger des pages secondaires (pas de Three.js) */
export function lightBackground() {
  return import('../bg/stars.js').then((m) => m.initStars())
    .catch((err) => console.error("[Cap sur l'IPSA] échec du « fond étoilé »", err));
}
