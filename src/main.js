/* Point d'entrée : initialise chaque partie du site dans le même ordre que l'ancien index.html.
   Chaque partie est isolée : si l'une plante, les autres continuent (comme les anciens <script> séparés). */
import './styles/main.css';

import { initInterface } from './ui/interface.js';
import { initScene } from './scene/scene.js';
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
  ['scène 3D', initScene],
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

/* mêmes objets globaux qu'avant (utiles depuis la console) */
window.IPSA_DATA = IPSA_DATA;
window.IPSA_HUB = { search: (q) => search(q, '', ''), openFiche };
