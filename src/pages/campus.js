/* Campus et vie étudiante : campus, international, associations, profils, galerie */
import { boot, lightBackground } from './common.js';
import { initProfils } from '../ui/profils.js';
boot([['profils', initProfils]]);
lightBackground();
