/* ---------- profils « tout le monde a sa place » ---------- */
import { esc } from '../utils.js';

export function initProfils(){
var P=[
 {k:'Le cœur du cursus',n:'Ingénieur aéronautique et spatial',d:"Cinq ans pour concevoir avions, lanceurs, satellites et drones, avec des cours d'aéro dès la première année et dix majeures pour se spécialiser.",q:"Métiers cités par l'école : propulsion, intégration satellites, essais en vol ou spatiaux, calcul de structures, mécanique spatiale.",
  s:[['À l\'école','Majeures Propulsion, Espace lanceurs et satellites, Cellules, Systèmes autonomes…'],['En association','AÉRO IPSA conçoit des fusées expérimentales avec le CNES, IPL des moteurs à ergols liquides.'],['Après','85 % des diplômés travaillent dans l\'aéronautique et le spatial.']]},
 {k:'Dans le cockpit',n:'Pilote',d:"Pour ceux qui veulent voler, l'école a noué un partenariat avec le centre de formation Aéropyrénées, qui prépare l'ATPL, la licence indispensable pour devenir pilote de ligne.",q:"Exemple publié par l'école : un diplômé de la promo 2007 est devenu pilote de Boeing 787.",
  s:[['En association','MACH 0.1 (Paris) aide à préparer le BIA, Ips\'Airclub (Toulouse) prépare au BIA et fait de la simulation de vol, IPSA Flight construit des simulateurs.'],['Le plus','Un ingénieur pilote comprend l\'avion de l\'intérieur : essais en vol, opérations aériennes.'],['Après','Formation ATPL avec Aéropyrénées, ou métiers d\'ingénieur opérations aériennes.']]},
 {k:'Dans la tour',n:'Contrôleur aérien',d:"Les contrôleurs aériens (ICNA) sont formés par l'ENAC après un concours de niveau bac+2 scientifique. La prépa intégrée apporte ce socle en maths, physique et anglais.",q:"Pour le concours IESSA, la notice 2026 de l'ENAC cite la 2e année de prépa intégrée. Pour l'ICNA, vérifie les conditions exactes sur enac.fr.",
  s:[['À l\'école','Aéro 1 et 2 : fondamentaux scientifiques, culture aéronautique, anglais.'],['Compétences','Gestion de systèmes complexes, sécurité aérienne, travail sous pression.'],['Après','Concours de l\'ENAC, ou ingénieur dans la navigation aérienne et les aéroports.']]},
 {k:'Dans les airs, sans pilote',n:'Drones et systèmes autonomes',d:"Le Bachelor propose une spécialisation Drones avec un certificat de pilote de drones, et le cycle ingénieur une majeure Systèmes aéronautiques autonomes.",q:"Métiers cités par l'école : opérateur ou pilote de drones, assistant ingénieur en conception de drones.",
  s:[['À l\'école','Bachelor Drones ou IA, majeure Systèmes aéronautiques autonomes, MSc Autonomous Aerospace Systems.'],['En association','HEL\'IPS relève des défis de drones, IPSA\'VISIONARY mène des projets de drones à Toulouse.'],['Après','Opérateur de drones, conception de drones, chef de projet en systèmes embarqués.']]},
 {k:'Derrière l\'écran',n:'Cyber, data et IA',d:"Sécuriser un avion ou un satellite, exploiter ses données : la majeure Cyber, data et IA, le MSc Aéro IA et cybersécurité (Paris) et le MSc Space Data (Toulouse).",q:"Modules cités : cybersécurité des satellites, pentest, filtre de Kalman, réseaux de neurones profonds.",
  s:[['À l\'école','Majeure Cyber, data et IA (10 ECTS), MSc en alternance.'],['En association','SCRYPT forme à la programmation et à l\'informatique.'],['Après','Sécurité des systèmes embarqués et industriels, données spatiales.']]},
 {k:'Son propre projet',n:'Entrepreneur',d:"Le programme IPSTARTUP accompagne de l'idée au lancement, avec le statut étudiant-entrepreneur et des incubateurs partenaires dont ESA BIC.",q:"Des start-up nées à l'école : Opus Aerospace, Sirius Space Services, Andromach.",
  s:[['Phase 1','Boarding : l\'idée, les campagnes « Pitch your idea! ».'],['Phase 2','Booster : coaching, prototype, levée de fonds.'],['Phase 3','Orbit : lancement et réseau IPSTARTUP Club.']],link:'carrieres.html#startup'},
 {k:'Études et performance',n:'Sport de haut niveau',d:"Les jumelles Charlotte et Laura Tremble, nageuses artistiques françaises, sont rattachées par Wikipédia à la promotion IPSA 2025.",q:"Les bureaux des sports de Paris et Toulouse engagent les étudiants dans les championnats universitaires.",
  s:[['Au quotidien','Plus de 90 associations, dont des dizaines de clubs sportifs sur les campus.'],['Exemple','Le parcours des sœurs Tremble, entre bassin et école d\'ingénieurs.'],['Le plus','Rigueur, résistance et esprit d\'équipe, recherchés par les recruteurs.']]}
];
var tabs=[].slice.call(document.querySelectorAll('.prof-tabs button')),body=document.getElementById('prof-body');if(!body)return;
function show(i){
  var p=P[i];
  tabs.forEach(function(b,k){b.setAttribute('aria-selected',String(k===i));b.tabIndex=k===i?0:-1;});
  body.innerHTML='<div class="pb-main"><span class="eyebrow" style="margin:0">'+esc(p.k)+'</span><h3>'+esc(p.n)+'</h3><p>'+esc(p.d)+'</p><p class="q">'+esc(p.q)+'</p>'+(p.link?'<p style="margin-top:14px"><a class="btn" href="'+p.link+'">Voir l\'entrepreneuriat</a></p>':'')+'</div>'+
    '<div class="pb-path">'+p.s.map(function(s,k){return '<div data-k="0'+(k+1)+'"><b>'+esc(s[0])+'</b><span>'+esc(s[1])+'</span></div>';}).join('')+'</div>';
}
tabs.forEach(function(b,i){
  b.addEventListener('click',function(){show(i);});
  b.addEventListener('keydown',function(e){var j=i;if(e.key==='ArrowRight')j=(i+1)%tabs.length;else if(e.key==='ArrowLeft')j=(i-1+tabs.length)%tabs.length;else return;e.preventDefault();tabs[j].focus();show(j);});
});
show(0);
}
