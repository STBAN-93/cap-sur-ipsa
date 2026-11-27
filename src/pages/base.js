/* Base de connaissances : recherche, filtres, fiches */
import { boot, lightBackground } from './common.js';
import { initExplorer } from '../search/explorer.js';
boot([['explorateur', initExplorer]]);
lightBackground();
