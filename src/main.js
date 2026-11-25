/* Point d'entrée : initialise chaque partie du site dans le même ordre que l'ancien index.html.
   Chaque partie est isolée : si l'une plante, les autres continuent (comme les anciens <script> séparés). */

/* polices hébergées avec le site (plus d'appel à Google Fonts) */
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource-variable/instrument-sans/wght.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles/main.css';

import { initInterface } from './ui/interface.js';
import { initExplorer } from './search/explorer.js';
import { initDrawer, openFiche } from './fiches/drawer.js';
import { initPalette } from './search/palette.js';
import { initProfils } from './ui/profils.js';
import { initLaunch } from './launch/launch.js';
import { initNav } from './ui/nav.js';
import { initCopilote } from './copilote/copilote.js';
import IPSA_DATA from './data/fiches.js';
import { search } from './search/engine.js';

const parts = [
  ['interface', initInterface],
  ['explorateur', initExplorer],
  ['fiches', initDrawer],
  ['palette', initPalette],
  ['profils', initProfils],
  ['lancement', initLaunch],
  ['navigation', initNav],
  ['Copilote', initCopilote],
];
for (const [name, init] of parts) {
  try { init(); } catch (err) { console.error(`[Cap sur l'IPSA] échec de « ${name} »`, err); }
}

/* scène 3D : Three.js (~600 ko) est chargé à part, après le reste.
   Le texte, la recherche et la navigation sont utilisables sans l'attendre. */
import('./scene/scene.js')
  .then((m) => m.initScene())
  .catch((err) => {
    console.error("[Cap sur l'IPSA] échec de « scène 3D »", err);
    document.body.classList.add('no-gl'); // même repli visuel qu'en l'absence de WebGL
  });

/* mêmes objets globaux qu'avant (utiles depuis la console) */
window.IPSA_DATA = IPSA_DATA;
window.IPSA_HUB = { search: (q) => search(q, '', ''), openFiche };
