/* Lancement : animation Ariane 6 déclenchée par le bouton « Lancer » */
import { boot, lightBackground } from './common.js';
import { initLaunch } from '../launch/launch.js';
boot([['lancement', initLaunch]]);
lightBackground();
