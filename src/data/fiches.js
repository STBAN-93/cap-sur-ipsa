/* Base de connaissances « Cap sur l'IPSA ».
   Chaque fiche renvoie à ses sources. Données compilées le 20/11/2026 à partir de pages et brochures publiques.
   Aucune fiche ne nomme d'élève ou d'enseignant. */
const IPSA_DATA=(function(){
var DATE="20/11/2026";
var S={
 plaq_ing:["Plaquette Ingénieur IPSA 2026-2027","https://www.ipsa.fr/wp-content/uploads/2025/10/IPSA-26-PLAQUETTE-INGENIEUR.pdf"],
 broch_inst:["Brochure institutionnelle IPSA 2026","https://www.ipsa.fr/wp-content/uploads/2025/10/IPSA-2026-BROCHURE-INSTITUTIONNELLE-BD.pdf"],
 broch_inst25:["Brochure institutionnelle IPSA 2025-2026","https://ipsa.fr/wp-content/uploads/IPSA-BROCHURE-INSTIT-A4-2025-2026-FEV25.pdf"],
 plaq_bach:["Plaquette Bachelor IPSA 2026","https://www.ipsa.fr/wp-content/uploads/2025/10/IPSA-26-PLAQUETTE-BACHELOR-.pdf"],
 plaq_msc:["Plaquette MSc IPSA 2026-2027","https://www.ipsa.fr/wp-content/uploads/2025/10/IPSA-26-PLAQUETTE-MSc.pdf"],
 plaq_ent:["Plaquette Relations entreprises IPSA 2026-2027","https://www.ipsa.fr/wp-content/uploads/2025/11/IPSA-PLAQUETTE-RELATIONS-ENTREPRISES-VDEF-BD.pdf"],
 broch_ent:["Brochure Entreprises IPSA 2025-2026","https://www.ipsa.fr/wp-content/uploads/IPSA-BROCHURE-ENTREPRISES-8-PAGES-210x270-2025-2026-1.pdf"],
 broch_gen:["Brochure générale IPSA 2024-2025","https://www.ipsa.fr/wp-content/uploads/IPSA-BROCHURE-GENERALE-280X230-2024-2025-V2-BD-2.pdf"],
 assos:["ipsa.fr : associations étudiantes","https://www.ipsa.fr/en/?p=9773"],
 assoc_page:["ipsa.fr : vie associative","https://www.ipsa.fr/en/student-life/association/"],
 under:["ipsa.fr : programme Aéro 1 à 3","https://ipsa.fr/?p=10684"],
 spe_space:["ipsa.fr : majeure Espace, lanceurs et satellites","https://www.ipsa.fr/en/?p=9729"],
 spe_cyber:["ipsa.fr : majeure Cyber, data et IA","https://www.ipsa.fr/en/?p=9731"],
 univ:["ipsa.fr : universités partenaires","https://www.ipsa.fr/en/?p=9836"],
 dd:["ipsa.fr : doubles diplômes internationaux","https://www.ipsa.fr/en/?p=9752"],
 dd2:["ipsa.fr : ouverture internationale","https://www.ipsa.fr/en/?p=9750"],
 cansat:["ipsa.fr : projets spatiaux étudiants","https://www.ipsa.fr/en/?p=9779"],
 hist:["ipsa.fr : repères historiques","https://www.ipsa.fr/en/?p=9693"],
 campusfr:["Campus France : fiche IPSA (nov. 2024)","https://ressources.campusfrance.org/pratique/etablissements/fr/ing_ipsa_fr.pdf"],
 etud:["L'Étudiant : fiche IPSA","https://www.letudiant.fr/fiches/etudes/fiche/ipsa-2.html"],
 onisep:["ONISEP : diplôme d'ingénieur IPSA, Ivry","https://www.onisep.fr/ressources/structures-enseignement/ile-de-france/val-de-marne/institut-polytechnique-des-sciences-avancees-campus-d-ivry-sur-seine/diplome-d-ingenieur-de-l-institut-polytechnique-des-sciences-avancees"],
 livret:["Livret logement et banques IPSA 2026-2027","https://www.ipsa.fr/wp-content/uploads/2026/07/Livret-financement-rentree-26-27-vd.pdf"],
 super:["Planète Sciences : rapport du projet SUPER (IPSA Space Systems)","https://www.planete-sciences.org/espace/scae/doc/3673"],
 express:["L'Express Éducation : diplôme ingénieur IPSA","https://lexpress-education.com/ecole/ipsa/programme/diplome-ingenieur-aeronautique-et-spatial/"],
 fact:["IPSA : factsheet internationale (mars 2025)","https://www.ipsa.fr/wp-content/uploads/2025/07/20250312_Factsheet_IPSA.pdf"],
 insert23:["ipsa.fr : insertion professionnelle, promo 2023","https://www.ipsa.fr/?p=1282"],
 psup25:["Rapport public Parcoursup 2025, section classique (IPSA)","https://www.ipsa.fr/wp-content/uploads/2025/10/RAPPORTS-PUBLICS-SECTION-CLASSIQUE.pdf"],
 etud_aero26:["L'Étudiant : top 10 des écoles d'ingénieurs aéronautique et aérospatial 2026","https://www.letudiant.fr/etudes/ecole-ingenieur/classement-des-ecoles-d-ingenieurs-le-top-10-des-ecoles-d-aeronautique-et-aerospatial.html"],
 etud_avis:["L'Étudiant : avis sur l'IPSA Ivry-sur-Seine","https://www.letudiant.fr/palmares/palmares-des-ecoles-d-ingenieurs/ipsa-ivry-sur-seine.html"],
 diplomeo:["Diplomeo : avis IPSA Paris","https://diplomeo.com/etablissement-ipsa_paris_ecole_d_ingenieurs_de_l_air_de_l_espace_et_des_mobilites-4573"],
 diplomeo_tls:["Diplomeo : avis IPSA Toulouse","https://diplomeo.com/avis-ipsa_toulouse_ecole_d_ingenieurs_de_l_air_de_l_espace_et_des_mobilites-4572"],
 wiki_fr:["Wikipédia : Institut polytechnique des sciences avancées","https://fr.wikipedia.org/wiki/Institut_polytechnique_des_sciences_avanc%C3%A9es"],
 wiki_boullier:["Wikipédia : Éric Boullier","https://fr.wikipedia.org/wiki/%C3%89ric_Boullier"],
 wiki_jsc:["Wikipédia : Julien Simon-Chautemps","https://fr.wikipedia.org/wiki/Julien_Simon-Chautemps"],
 wiki_bdr:["Wikipédia : Cyril Bourlon de Rouvre","https://fr.wikipedia.org/wiki/Cyril_Bourlon_de_Rouvre"],
 entre:["ipsa.fr : entrepreneuriat (IPSTARTUP)","https://www.ipsa.fr/en/?p=9756"],
 cnes_a6:["CNES : vol inaugural d'Ariane 6, chronologie","https://cnes.fr/actualites/vol-inaugural-dariane-6-etapes-de-chronologie-de-lancement"],
 esa_a6:["ESA : Ariane 6, point de situation post-lancement","https://www.esa.int/Space_in_Member_States/France/Ariane_6_Point_de_situation_conjoint_post_lancement"],
 enac_iessa:["ENAC : notice du concours IESSA 2026","https://concours.enac.fr/concours/c13607/N_fr_NOTICE_IESSA_2026.pdf"],
 etud_icna:["L'Étudiant : devenir contrôleur aérien (ENAC)","https://www.letudiant.fr/etudes/devenez-controleur-aerien-et-plongez-au-coeur-des-operations.html"],
 wiki_tremble:["Wikipédia : Charlotte et Laura Tremble","https://fr.wikipedia.org/wiki/Laura_Tremble"]
};
var CATS=[
 ["prog","Programmes"],["maj","Majeures"],["mat","Enseignements"],["camp","Campus"],["asso","Associations"],
 ["intl","International"],["hist","Histoire"],["dist","Distinctions"],["adm","Admission et coûts"],["res","Réseau et diplômés"],["vie","Vie étudiante"],["chif","Chiffres"]
];
var F=[];
function add(id,cat,t,x,o){o=o||{};F.push({id:id,cat:cat,t:t,x:x,tags:o.tags||[],camp:o.camp||[],src:o.src||[],f:o.f||[],c:!!o.c,feat:!!o.feat,ci:o.ci});}

/* ---------------- Programmes ---------------- */
add("prog-ingenieur","prog","Cycle ingénieur IPSA, 5 ans","Programme grande école d'ingénieurs en 5 ans : deux ans de prépa intégrée (Aéro 1 et 2) puis trois ans de cycle ingénieur (Aéro 3 à 5). Le diplôme d'ingénieur est contrôlé par la CTI. La brochure 2026 annonce un semestre d'études à l'international, 10 majeures de spécialisation et plus de 70 doubles diplômes.",{tags:["ingenieur","5 ans","cti","diplome","aero 1","aero 5","grande ecole"],camp:["Paris-Ivry","Toulouse","Lyon"],src:["plaq_ing","broch_inst"],f:["Apprentissage possible dès la 1re année du cycle ingénieur","Parcours anglophone possible à Paris-Ivry","Rentrée décalée possible"],feat:true});
add("prog-prepa","prog","Prépa intégrée : Aéro 1 et Aéro 2","Les deux premières années du cursus donnent les fondamentaux scientifiques et des cours d'aéronautique dès la première année. Une rentrée décalée est possible en 1re année à Paris, avec un « Aéro Prim » qui condense les cours d'Aéro 1 de février à juillet.",{tags:["prepa","aero 1","aero 2","premiere annee","rentree decalee","fondamentaux","cycle preparatoire"],camp:["Paris-Ivry","Toulouse","Lyon"],src:["broch_ent","plaq_ing","express"],feat:true});
add("prog-aero3","prog","Aéro 3 : choisir une filière","Le premier semestre du cycle ingénieur est un tronc commun. À l'entrée en cycle ingénieur, on choisit entre deux filières : véhicules aérospatiaux ou systèmes aérospatiaux. Cette filière oriente ensuite le choix de la majeure.",{tags:["aero 3","filiere","vehicules aerospatiaux","systemes aerospatiaux","tronc commun","pre-majeure"],src:["under","onisep"]});
add("prog-stages","prog","Les stages du cursus ingénieur","Aéro 1 : stage facultatif d'1 mois. Aéro 2 : stage obligatoire de 2 mois (stage technicien). Aéro 3 : stage facultatif de 2 mois. Aéro 4 : stage de 4 mois (assistant ingénieur). Aéro 5 : stage de fin d'études de 6 mois.",{tags:["stage","stages","technicien","assistant ingenieur","fin d'etudes","pfe","duree"],src:["under","broch_ent","plaq_ing"],feat:true,c:true});
add("prog-bachelor","prog","Bachelor Aéronautique, 3 ans","Cursus en 3 ans, titre RNCP de niveau 6, avec deux spécialisations : Drones (certificat de pilote de drones avec Prepa-Drone) ou Intelligence artificielle (certificat avec l'EPITA). Stage de 1 mois après la 1re année, 4 mois après la 2e ; la 3e année peut se faire en apprentissage (2 semaines à l'école, 2 en entreprise).",{tags:["bachelor","rncp","drones","intelligence artificielle","b1","b2","b3","bac+3"],camp:["Paris-Ivry","Toulouse","Lyon"],src:["plaq_bach"],f:["Enseignements de 1re année : culture aéronautique et spatiale, mathématiques, introduction à la décarbonation, sciences du vol, électronique, mécanique"],feat:true});
add("prog-msc-aia","prog","MSc Aéro, IA et cybersécurité","Master of Science en 2 ans, en alternance : 1 semaine à l'école, 3 semaines en entreprise. Il forme à tirer parti des systèmes embarqués et intelligents tout en préservant leur cybersécurité. Titre RNCP de niveau 7. Modules cités : en M1 systèmes aérospatiaux, cyber-risque, sécurité des systèmes d'exploitation, big data et IA ; en M2 sécurité des systèmes embarqués et industriels, cybersécurité des satellites, IA et cybersécurité, pentest.",{tags:["msc","alternance","ia","cybersecurite","aero ia cyber","rncp 7","bac+5"],camp:["Paris-Ivry"],src:["plaq_msc","plaq_ent"]});
add("prog-msc-space","prog","MSc Space Data","Master of Science en 2 ans d'alternance consacré aux données du spatial. Proposé sur le campus de Toulouse. Titre RNCP de niveau 7.",{tags:["msc","space data","alternance","toulouse","donnees","rncp 7"],camp:["Toulouse"],src:["plaq_msc","plaq_ent","etud"]});
add("prog-msc-prop","prog","MSc Aerospace Propulsion","Programme de niveau master enseigné en anglais, consacré à la propulsion aérospatiale, à Paris. Les frais indicatifs 2024-2025 sont de 12 595 € par année selon Campus France.",{tags:["msc","propulsion","anglais","english","master","international"],camp:["Paris-Ivry"],src:["etud","campusfr"],c:true});
add("prog-msc-aas","prog","MSc Autonomous Aerospace Systems","Programme d'expertise de niveau master sur les systèmes aérospatiaux autonomes. Les documents de l'école indiquent un stage de 5 mois en M1 pour ce programme et pour l'Aerospace Propulsion. Détails et campus à vérifier sur ipsa.fr.",{tags:["msc","autonomous","systemes autonomes","drones","master","m1"],src:["plaq_ent","plaq_msc"],c:true});
add("prog-mba","prog","MBA Ingénieur d'affaires aéronautique et spatial","MBA de 2 ans en alternance, titre RNCP de niveau 7, qui relie la technique et le business. Il est proposé à Paris, en partenariat avec l'ISG selon Campus France.",{tags:["mba","ingenieur d'affaires","alternance","business","isg","rncp 7","commercial"],camp:["Paris-Ivry"],src:["plaq_ent","campusfr"],c:true});
add("prog-alternance","prog","Alternance et apprentissage","L'apprentissage est possible dès l'entrée en cycle ingénieur. Le rythme dépend du programme : par exemple 1 semaine d'école pour 3 semaines en entreprise pour les MSc et le MBA, 2 semaines/2 semaines en 3e année de Bachelor. L'école annonce plus de 800 entreprises partenaires.",{tags:["alternance","apprentissage","entreprise","contrat","rythme","800 entreprises"],src:["etud","plaq_ing","plaq_ent","plaq_bach"],feat:true,c:true});
add("prog-anglophone","prog","Parcours anglophone","À Paris, le programme des trois premières années peut se suivre en français ou en anglais. Toulouse et Lyon enseignent en français uniquement. Le diplôme d'ingénieur est présenté comme possible en anglais auprès des étudiants étrangers.",{tags:["anglais","english","anglophone","international","paris","section anglophone"],camp:["Paris-Ivry"],src:["under","express","campusfr"]});

/* ---------------- Majeures ---------------- */
var MJ="La brochure 2026 annonce 10 majeures ; L'Étudiant et L'Express en comptent 9. La liste et les campus évoluent : vérifier sur ipsa.fr.";
add("maj-propulsion","maj","Majeure Propulsion aérospatiale","Majeure de propulsion aéronautique et spatiale, proposée à Paris-Ivry et à Toulouse selon la brochure 2026. "+MJ,{tags:["propulsion","moteurs","combustion","lanceurs","fusees","a4","a5"],camp:["Paris-Ivry","Toulouse"],src:["broch_inst","broch_inst25"],c:true});
add("maj-cellules","maj","Majeure Cellules aéronautiques","Majeure consacrée aux cellules aéronautiques, proposée à Paris-Ivry. "+MJ,{tags:["cellules","avion","structures","aerodynamique","conception","a4","a5"],camp:["Paris-Ivry"],src:["broch_inst","onisep"],c:true});
add("maj-espace","maj","Majeure Espace, lanceurs et satellites","Majeure de 10 ECTS et 149 heures. Les enseignements cités par l'école : systèmes de propulsion spatiale (26 h), propulsion électrique et nucléaire pour véhicules spatiaux (34 h), conception de lanceurs et de satellites (44 h), prototypage de satellites (7 h), télécommunications spatiales (22 h).",{tags:["espace","lanceurs","satellites","spatial","propulsion spatiale","cubesat","a4","a5"],camp:["Paris-Ivry","Toulouse"],src:["spe_space","onisep"],f:["10 ECTS","149 heures d'enseignement de spécialité"],feat:true});
add("maj-spatiaux","maj","Majeure Systèmes spatiaux","Ingénierie des lanceurs et des satellites, calcul d'orbites, conception de missions spatiales. "+MJ,{tags:["systemes spatiaux","orbites","missions","satellites","lanceurs","a4"],camp:["Paris-Ivry","Toulouse"],src:["broch_inst25","campusfr"],c:true});
add("maj-cyber","maj","Majeure Cyber, data et IA","Majeure de 10 ECTS. Enseignements cités : cybersécurité (20 h), systèmes déterministes et observateurs stochastiques avec filtre de Kalman (34 h), réseaux de neurones profonds (18 h), conception de systèmes et prototypage rapide (24 h).",{tags:["cyber","cybersecurite","data","ia","intelligence artificielle","kalman","deep learning","a4","a5"],camp:["Paris-Ivry"],src:["spe_cyber","campusfr"],f:["10 ECTS"],feat:true});
add("maj-embarques","maj","Majeure Systèmes embarqués et télécommunications","Majeure en systèmes embarqués et télécommunications, citée dans les brochures 2025-2026 et par Campus France. "+MJ,{tags:["embarques","telecommunications","electronique","temps reel","radio","a4"],camp:["Paris-Ivry","Toulouse"],src:["broch_inst25","campusfr"],c:true});
add("maj-autonomes","maj","Majeure Systèmes aéronautiques autonomes","Majeure en systèmes aéronautiques autonomes. Selon l'ONISEP, elle est proposée à Ivry, en temps plein uniquement. Le rythme alternant varie selon le programme.",{tags:["autonomes","drones","guidage","navigation","pilotage automatique","a4","a5"],camp:["Paris-Ivry"],src:["onisep","broch_ent","campusfr"],c:true});
add("maj-mpi","maj","Majeure Management de projets industriels","Majeure de management des projets industriels. Mentionnée comme majeure à Paris dans la brochure 2026.",{tags:["management","projets industriels","gestion de projet","a4"],camp:["Paris-Ivry"],src:["broch_inst","campusfr"],c:true});
add("maj-mli","maj","Majeure Management de la logistique intégrée","Majeure de management de la logistique intégrée. Mentionnée comme majeure à Paris dans la brochure 2026.",{tags:["management","logistique","mco","maintien","a4"],camp:["Paris-Ivry"],src:["broch_inst","campusfr"],c:true});

/* ---------------- Enseignements ---------------- */
add("mat-structure","mat","Comment se répartissent les enseignements","Dans le programme Aéro 1 à 3, environ trois quarts des enseignements sont scientifiques et techniques (sciences fondamentales, physique, sciences de l'ingénieur, aéronautique et spatial). Le dernier quart est général et professionnel : humanités et éthique, connaissance de l'entreprise, langues. Chaque semestre vaut 30 ECTS, soit 180 ECTS sur les trois ans.",{tags:["matieres","enseignements","ects","repartition","programme","cours","sciences","humanites"],src:["under"],f:["30 ECTS par semestre","180 ECTS pour Aéro 1 à 3"],feat:true});
add("mat-aero","mat","Aéronautique et spatial","Culture aéronautique et spatiale, sciences du vol, introduction à la décarbonation : le cœur de métier est enseigné dès la première année du Bachelor. Le cycle ingénieur annonce aussi des cours d'aéro dès la 1re année.",{tags:["aeronautique","spatial","culture aero","sciences du vol","decarbonation","avion","aero"],src:["plaq_bach","broch_inst"],feat:true});
add("mat-langues","mat","Langues et sciences humaines","Humanités et éthique, connaissance de l'entreprise et langues forment environ un quart du programme d'Aéro 1 à 3. Le parcours anglophone existe à Paris.",{tags:["anglais","langues","humanites","ethique","entreprise","toeic","piscine d'anglais","sciences humaines"],src:["under"]});
add("mat-piscines","mat","Les piscines de rentrée","Le cursus s'ouvre sur des semaines intensives de remise à niveau (anglais, mathématiques, physique) avant le rythme normal des semestres. Le détail varie chaque année : voir le programme de rentrée de l'école.",{tags:["piscine","piscines","rentree","anglais","maths","physique","remise a niveau"],src:["under"],c:true});
add("mat-intervenants","mat","Qui enseigne à l'IPSA ?","Ce site ne publie pas d'annuaire d'enseignants : les noms et rattachements officiels sont sur ipsa.fr.",{tags:["profs","professeurs","enseignants","intervenants","departement","equipe pedagogique","professionnels"],src:["under"],feat:true});

/* ---------------- Campus ---------------- */
add("camp-ivry","camp","Campus de Paris-Ivry","63 boulevard de Brandebourg, 94200 Ivry-sur-Seine. Parcours francophone et anglophone, cycle ingénieur, Bachelor, MSc et MBA. Admissions : admissions_ivry@ipsa.fr, +33 (0)1 84 07 15 32.",{tags:["ivry","paris","campus","adresse","admissions"],camp:["Paris-Ivry"],src:["plaq_msc","hist"],feat:true,ci:0});
add("camp-toulouse","camp","Campus de Toulouse","81 avenue de Grande Bretagne, 31300 Toulouse. Ouvert en 2007, proposé pour le cycle ingénieur en français, le Bachelor et le MSc Space Data. Admissions : admissions_toulouse@ipsa.fr, +33 (0)5 67 70 67 15.",{tags:["toulouse","campus","adresse","admissions","space data","occitanie"],camp:["Toulouse"],src:["plaq_msc","hist"],ci:1});
add("camp-lyon","camp","Campus de Lyon","16 rue Jean-Marie Leclair, 69009 Lyon. La première année du cycle préparatoire y accueille ses étudiants depuis la rentrée 2025. Admissions : admissions_lyon@ipsa.fr, +33 (0)4 28 29 17 87.",{tags:["lyon","campus","adresse","admissions","nouveau","auvergne rhone alpes"],camp:["Lyon"],src:["plaq_msc","express","campusfr"],ci:2});

/* ---------------- Histoire ---------------- */
add("hist-1961","hist","1961 : création de l'école","L'IPSA est fondée en 1961, à Paris, par trois passionnés d'aéronautique, ingénieurs du secteur.",{tags:["1961","fondation","creation","histoire","origine"],src:["broch_inst25"]});
add("hist-2007","hist","2007 : ouverture du campus de Toulouse","Le campus toulousain ouvre en 2007, dans une métropole de l'aéronautique et du spatial.",{tags:["2007","toulouse","campus","histoire"],camp:["Toulouse"],src:["broch_gen"]});
add("hist-2009","hist","2009 : pôle Aerospace Valley et arrivée à Ivry","L'IPSA rejoint le pôle de compétitivité mondial Aerospace Valley (aéronautique, espace, systèmes embarqués) et s'installe à Ivry-sur-Seine.",{tags:["2009","aerospace valley","ivry","pole de competitivite","histoire"],camp:["Paris-Ivry"],src:["hist"]});

add("hist-1961","hist","1961 : création de l'école","L'IPSA est fondée à Paris en 1961. Les premiers diplômés sortent en 1965.",{tags:["1961","1965","fondation","creation","histoire","origine"],src:["hist"]});
add("hist-1999","hist","1999 : arrivée dans le groupe IONIS","L'école rejoint le groupe IONIS et s'installe au Kremlin-Bicêtre.",{tags:["1999","ionis","kremlin-bicetre","histoire"],src:["hist"]});
add("hist-2007","hist","2007 : ouverture du campus de Toulouse","Le campus toulousain ouvre en 2007, dans une métropole de l'aéronautique et du spatial.",{tags:["2007","toulouse","campus","histoire"],camp:["Toulouse"],src:["hist"]});
add("hist-2009","hist","2009 : Aerospace Valley et installation à Ivry","L'IPSA rejoint le pôle de compétitivité Aerospace Valley et s'installe à Ivry-sur-Seine.",{tags:["2009","aerospace valley","ivry","pole de competitivite","histoire"],camp:["Paris-Ivry"],src:["hist"]});
add("hist-2011","hist","2011 : les 50 ans de l'école","L'IPSA fête ses 50 ans en 2011.",{tags:["2011","50 ans","anniversaire","histoire"],src:["hist"]});
add("hist-2017","hist","2017 : création du Bachelor","L'école lance son Bachelor Aéronautique en 3 ans, d'abord en français.",{tags:["2017","bachelor","histoire"],src:["hist"]});
add("hist-2021","hist","2021 : les 60 ans de l'école","L'IPSA fête ses 60 ans en 2021.",{tags:["2021","60 ans","anniversaire","histoire"],src:["hist"]});
add("hist-2023","hist","2023 : membre de la Conférence des grandes écoles","L'IPSA rejoint la Conférence des grandes écoles (CGE) en 2023.",{tags:["2023","cge","conference des grandes ecoles","histoire"],src:["hist"]});
add("hist-2025","hist","2025 : ouverture du campus de Lyon","Annoncé en 2024 pour la rentrée 2025, le campus de Lyon accueille la première année du cycle préparatoire. L'école compte alors trois campus.",{tags:["2025","2024","lyon","ouverture","campus","histoire"],camp:["Lyon"],src:["hist","express"]});

/* ---------------- Distinctions ---------------- */
add("dist-cti","dist","Diplôme d'ingénieur habilité CTI","Le diplôme d'ingénieur IPSA est délivré sous le contrôle de la Commission des Titres d'Ingénieur, comme dans toutes les écoles d'ingénieurs françaises classées par L'Étudiant.",{tags:["cti","habilitation","diplome","ingenieur","reconnaissance"],src:["plaq_ing"],feat:true});
add("dist-classement-etudiant","dist","Classement L'Étudiant 2025 : top 3 de l'insertion","La brochure 2026 de l'école indique qu'en février 2025, l'IPSA est entrée dans le top 3 des écoles d'ingénieurs post-bac en aéronautique et spatial pour l'insertion professionnelle selon L'Étudiant. Une page anglaise du site de l'école attribue un résultat voisin à L'Usine Nouvelle 2025 : l'attribution est à confirmer.",{tags:["classement","l'etudiant","insertion","top 3","post-bac","palmares"],src:["broch_inst"],c:true,feat:true});
add("dist-cansat","dist","CanSat France 2024 : 2e place","Le CanSat « Whaitiri » de l'association AéroIPSA a pris la 2e place à CanSat France 2024.",{tags:["cansat","2024","competition","aeroipsa","prix","podium"],src:["cansat"]});
add("dist-cspace","dist","C'Space 2023 : six projets et deux prix","L'association AéroIPSA a présenté six projets au C'Space 2023 (fusées expérimentales et CanSat) et a remporté deux prix, d'après la page de vie associative de l'école.",{tags:["c'space","cspace","2023","fusees","cansat","aeroipsa","prix","planete sciences"],src:["assoc_page"]});
add("dist-super","dist","Projet SUPER : fusée supersonique expérimentale","Projet d'IPSA Space Systems lancé au C'Space 2023, démarré à la rentrée 2021-2022. La fusée pèse 9,2 kg propulseur vide et embarque une expérience de contrôle de traînée par aérofreins, avec une redescente sous parachute d'environ 3 minutes 51.",{tags:["super","fusee","supersonique","aerofreins","ipsa space systems","c'space","projet"],src:["super"]});
add("dist-vols","dist","Vols réalisés par les projets de fusée","Selon la page de présentation d'AéroIPSA, cinq projets ont accompli des vols nominaux. Un seul, la fusée Eole, a effectué un vol balistique, avec des données récupérées jugées prometteuses.",{tags:["vols","fusee","eole","aeroipsa","ballistique","projets spatiaux"],src:["cansat"],c:true});

/* ---------------- International ---------------- */
add("intl-universites","intl","120 universités partenaires et un semestre à l'étranger","L'école annonce plus de 120 universités partenaires et un semestre d'études à l'international dans le cycle ingénieur. Les destinations couvrent l'Afrique, les deux Amériques, l'Asie, l'Europe et l'Océanie.",{tags:["international","universites","partenaires","semestre","echange","etranger","erasmus"],src:["plaq_ing","univ","campusfr"],feat:true});
add("intl-partenaires","intl","Exemples d'universités partenaires","Hochschule Bremen (double diplôme à forte orientation projet), HM Hochschule München, Royal Melbourne Institute of Technology (Australie), Fachhochschule Wiener Neustadt (Autriche), British Columbia Institute of Technology (Canada), Nanjing University of Aeronautics and Astronautics et Northwestern Polytechnical University (Chine), Vilnius Gediminas Technical University (Lituanie), Benemérita Universidad Autónoma de Puebla et Universidad de las Américas Puebla (Mexique).",{tags:["partenaires","bremen","munich","melbourne","vienne","canada","chine","lituanie","mexique","universites"],src:["univ"]});
add("intl-doubles","intl","Doubles diplômes","La brochure 2026 annonce plus de 70 doubles diplômes ; la page internationale de l'école en cite plus de 40. Exemples publiés : Cranfield University (Angleterre) et Universidade de São Paulo (Brésil) en mécatronique automobile ; un témoignage publié mentionne aussi un double diplôme avec CentraleSupélec.",{tags:["double diplome","doubles diplomes","cranfield","sao paulo","centralesupelec","mecatronique","international"],src:["dd","dd2","campusfr"],c:true,feat:true});
add("intl-entrants","intl","Étudiants étrangers : cours de français et summer school","Environ 10 % des étudiants viennent de l'étranger selon Campus France. Les étudiants internationaux ont des cours de français langue étrangère, une association dédiée, et l'école propose une Summer School (3 200 € indicatifs).",{tags:["etudiants etrangers","fle","francais","summer school","incoming","international students"],src:["campusfr"],c:true});
add("intl-contact","intl","Service international","Contact officiel : international@ipsa.fr, +33 (0)1 84 07 15 00.",{tags:["contact","international","office","relations internationales"],src:["fact","dd"]});

/* ---------------- Admission et coûts ---------------- */
add("adm-paralleles","adm","Admissions parallèles","Selon l'ONISEP (2026), on peut entrer en 1re année du cycle ingénieur avec un bac+3 et en 2e année avec un bac+4, à temps plein, avec un nombre de places limité selon le niveau des candidats.",{tags:["admission","parallele","bac+3","bac+4","places","passerelle"],src:["onisep"],c:true});
add("adm-frais","adm","Frais de scolarité indicatifs","Campus France (nov. 2024) indique, à titre indicatif : 12 500 € par année pour le diplôme d'ingénieur, 12 595 € par année pour le MSc Aerospace Propulsion, 3 200 € pour la Summer School. Les tarifs en vigueur sont publiés par l'école.",{tags:["frais","tarif","cout","prix","scolarite","budget","12500","argent"],src:["campusfr"],c:true,feat:true});
add("adm-logement","adm","Se loger : partenaires de l'école","Le livret 2026-2027 présente des partenaires logement : Studapart, Adele, Cardinal, Baya Immo, Logifac et Gestetud, pour Paris-Ivry, Toulouse et Lyon. Le même livret liste des banques partenaires : Crédit Mutuel, LCL, BNP Paribas et CIC.",{tags:["logement","studapart","adele","cardinal","baya immo","logifac","gestetud","residence","loyer"],src:["livret"],feat:true});
add("adm-contacts","adm","Contacts d'admission par campus","Paris-Ivry : admissions_ivry@ipsa.fr, +33 (0)1 84 07 15 32. Toulouse : admissions_toulouse@ipsa.fr, +33 (0)5 67 70 67 15. Lyon : admissions_lyon@ipsa.fr, +33 (0)4 28 29 17 87.",{tags:["contact","admission","email","telephone","ivry","toulouse","lyon"],src:["plaq_msc"]});

/* ---------------- Vie étudiante ---------------- */
add("vie-assos","vie","Plus de 90 associations étudiantes","Sur les trois campus, l'école recense plus de 90 associations : projets techniques, culture, sport et loisirs, humanitaire. La liste détaillée de cette base en reprend environ 85.",{tags:["associations","assos","clubs","vie associative","bde","90"],src:["plaq_ing","assos"],feat:true});
add("vie-bde","vie","BDE, le bureau des élèves","Le BDE anime la vie étudiante à Paris et à Toulouse : week-ends d'intégration, soirées et Gala.",{tags:["bde","bureau des eleves","soirees","gala","integration"],camp:["Paris-Ivry","Toulouse"],src:["assos"]});

/* ---------------- Chiffres ---------------- */
add("chif-effectifs","chif","3 200 étudiants et plus de 5 500 diplômés","La plaquette 2026-2027 annonce 3 200 étudiants sur trois campus et plus de 5 500 diplômés. L'école a plus de 60 ans d'existence.",{tags:["etudiants","diplomes","effectifs","chiffres","alumni","anciens"],src:["plaq_ing","broch_inst"],feat:true});
add("chif-insertion","chif","Insertion : 100 % à 2 mois, 85 % dans l'aéro et le spatial","Chiffres annoncés par l'école : 100 % d'insertion professionnelle deux mois après la sortie des études, et 85 % des diplômés en poste dans le secteur aéronautique et spatial.",{tags:["insertion","emploi","salaire","debouches","embauche","metiers"],src:["plaq_ing","plaq_ent"],c:true,feat:true});
add("chif-secteurs","chif","Secteurs d'emploi des diplômés (ONISEP)","Fiche ONISEP du diplôme d'ingénieur : aéronautique et spatial 85 %, ingénierie et services aux entreprises 8 %, défense 7 %. Environ 9 % des diplômés sont embauchés à l'étranger.",{tags:["secteurs","defense","ingenierie","etranger","debouches","onisep","emploi"],src:["onisep"],c:true});

/* ---------------- v3 : insertion, classements, avis, réseau ---------------- */
add("chif-promo2024","chif","Promo 2024 : 44 000 € de salaire médian","406 diplômés, dont 23 % de femmes et 20 % de doubles diplômés. Salaire médian brut annuel sans primes en France : 44 000 €. 100 % en poste 2 mois après la sortie des études, 96,3 % en CDI, tous cadres ou assimilés, 50 % embauchés à la suite de leur stage.",{tags:["salaire","insertion","promo 2024","cdi","emploi","debouches","remuneration"],src:["broch_inst"],c:true,feat:true});
add("chif-secteurs-2023","chif","Secteurs d'emploi, promo 2023","Aéronautique et transport aérien 49 %, spatial 16 %, défense 10 %, ingénierie et services 8 %, informatique 4 %, automobile, ferroviaire et naval 4 %, énergie 3 %, électronique et télécoms 1 %. Salaire médian 42 000 € pour cette promotion.",{tags:["secteurs","defense","spatial","aeronautique","promo 2023","debouches"],src:["insert23"],c:true});
add("res-recruteurs","res","Premiers recruteurs des diplômés","Promo 2023 : Safran 10 %, Thales 7 %, Airbus 6 %, Air France 5 %. Lieu de travail : Île-de-France 60 %, Occitanie 30 %, PACA 6 %, étranger 8 %. Parmi les autres employeurs cités : ArianeGroup, l'Armée de l'Air et de l'Espace, ATR, Aéroports de Paris, Alstom.",{tags:["recruteurs","safran","thales","airbus","air france","employeurs","entreprises","ou travaillent"],src:["insert23"],c:true,feat:true});
add("res-boullier","res","Éric Boullier, promo 1999","Directeur de l'écurie Lotus F1 de 2010 à 2013, puis directeur de la compétition de McLaren de 2014 à 2018. Il a ensuite dirigé le Grand Prix de France de F1.",{tags:["alumni","ancien eleve","formule 1","f1","mclaren","lotus","personnalite"],src:["wiki_boullier","wiki_fr"]});
add("res-jsc","res","Julien Simon-Chautemps, promo 2002","Ingénieur de course en Formule 1 de 2007 à 2022 (Renault et Lotus, puis Sauber et Alfa Romeo), notamment auprès de Kimi Räikkönen. Fondateur de JSC7 Engineering, consultant pour Canal+ et F1 TV.",{tags:["alumni","ancien eleve","formule 1","f1","ingenieur de course","personnalite"],src:["wiki_jsc","wiki_fr"]});
add("res-bdr","res","Cyril Bourlon de Rouvre, promo 1965","Homme d'affaires et homme politique, propriétaire de l'écurie de F1 Ligier et maire de Chaumont de 1989 à 1995. Diplômé de l'école quand elle s'appelait Institut polytechnique des sciences appliquées.",{tags:["alumni","ancien eleve","ligier","politique","personnalite"],src:["wiki_bdr","wiki_fr"]});
add("res-tremble","res","Charlotte et Laura Tremble, promo 2025","Jumelles, nageuses artistiques françaises. Wikipédia les rattache à la promotion IPSA 2025.",{tags:["alumni","sport de haut niveau","natation artistique","personnalite"],src:["wiki_tremble","wiki_fr"]});
add("dist-etudiant-2026","dist","L'Étudiant 2026 : 3e école d'ingénieurs en aéronautique et aérospatial","Dans le classement 2026 de L'Étudiant (plus de 170 écoles), l'IPSA occupe la 3e place du top 10 des écoles spécialisées en aéronautique et aérospatial.",{tags:["classement","l'etudiant","2026","aeronautique","palmares","rang"],src:["etud_aero26"],feat:true});
add("adm-parcoursup-2025","adm","Parcoursup 2025 : candidats, places et taux d'accès","Bac général, section francophone, phase principale au 10 juillet 2025. Paris : 3 439 candidats, 220 places, taux d'accès calculé 72,7 %. Toulouse : 2 815 candidats, 130 places, 53,2 %. Lyon : 2 717 candidats, 50 places, 56,3 %. Taux calculé ici : candidats en position de recevoir une proposition sur candidats ayant confirmé le vœu.",{tags:["parcoursup","taux d'acces","selectivite","places","candidats","concours advance","admission"],camp:["Paris-Ivry","Toulouse","Lyon"],src:["psup25"],c:true,feat:true});
add("vie-avis","vie","Avis des étudiants en ligne","L'Étudiant : 4,6/5 sur 23 avis certifiés (campus d'Ivry). Diplomeo, Paris : 4,27/5 sur 11 avis (cours 4,2, ambiance 4,5, locaux 3,9, intégration pro 4,4). Diplomeo, Toulouse : 4,5/5 sur 2 avis. Peu d'avis et certains anciens : une tendance, pas une mesure.",{tags:["avis","note","etudiants","ambiance","locaux","satisfaction","diplomeo"],src:["etud_avis","diplomeo","diplomeo_tls"],c:true});

add("res-pilote","res","Devenir pilote après l'IPSA","L'école a noué un partenariat avec le centre de formation Aéropyrénées : les étudiants qui veulent devenir pilotes peuvent y suivre la formation à l'ATPL, la licence indispensable au métier de pilote de ligne.",{tags:["pilote","atpl","aeropyrenees","pilote de ligne","voler","avion"],src:["plaq_ing"],c:true,feat:true});
add("res-controleur","res","Contrôleur aérien : la voie de l'ENAC","Les contrôleurs aériens (ICNA) sont recrutés par l'ENAC sur concours de niveau bac+2 scientifique. La notice 2026 du concours IESSA, autre voie de l'ENAC, cite explicitement la 2e année de prépa intégrée. Conditions exactes à vérifier chaque année sur enac.fr.",{tags:["controleur aerien","icna","enac","iessa","navigation aerienne","concours"],src:["etud_icna","enac_iessa"],c:true});
add("res-ipstartup","res","Entrepreneuriat : le programme IPSTARTUP","Trois phases : Boarding, Booster, Orbit, de l'idée au lancement avec suivi après la création. Statut national étudiant-entrepreneur (emploi du temps aménagé, ECTS, projet comptant comme stage), PÉPITE PEIPS Paris-Saclay et Ecrin Toulouse, incubateurs partenaires Incuballiance, ESA BIC et Suricub. Start-up issues de l'école : Opus Aerospace, Andromach, Sirius Space Services.",{tags:["entrepreneuriat","startup","start-up","incubateur","esa bic","pepite","etudiant-entrepreneur","creer son entreprise"],src:["entre"],feat:true});
add("mat-ariane6","mat","Les phases de vol d'Ariane 6 (vol VA262)","Allumage du Vulcain 2.1 à H0 − 7 s, décollage à H0, séparation des boosters à 2 min 16 s, largage de la coiffe à 3 min 39 s, extinction du Vulcain à 7 min 35 s, séparation de l'étage supérieur à 7 min 41 s, allumage du Vinci à 7 min 50 s. Le Vinci s'est rallumé en orbite après 56 minutes, une première européenne.",{tags:["ariane 6","lanceur","max q","phases de vol","vinci","vulcain","boosters","coiffe","lancement"],src:["cnes_a6","esa_a6"]});

/* ---------------- Associations ---------------- */
var A=[
 ["AÉRO IPSA|Technique|Conçoit et construit des fusées expérimentales avec le CNES|Paris"],
 ["IPSA Flight|Technique|Conçoit des simulateurs de vol|Paris, Toulouse, Lyon"],
 ["I-TECH|Technique|Impression 3D et systèmes mécaniques automatisés|Paris"],
 ["IPSA AERO RC|Technique|Construit et pilote des avions radiocommandés|Paris"],
 ["IPSA ONE|Technique|Développe un propulseur pour CubeSat|Paris"],
 ["MACH 0.1|Technique|Pilotage aéronautique et aide à la préparation du BIA|Paris"],
 ["IPSA Novation|Technique|Construit un véhicule pour le Shell Eco-marathon|Paris"],
 ["BDD IPSA|Technique|Développement durable, animé par des éco-délégués|Paris"],
 ["IPL (Innovative Propulsion Laboratory)|Technique|Moteurs-fusées à ergols liquides, partenaire du projet PERSEUS du CNES|Paris"],
 ["SCRYPT|Technique|Formation à la programmation et à l'informatique|Paris"],
 ["IPS'AIRSHIP|Technique|Conçoit un dirigeable pour la compétition LIFT|Paris"],
 ["IPS'OLAIRE|Technique|Crée un planeur autonome rechargé à l'énergie solaire|Paris"],
 ["IPS'AIRCRAFT|Technique|Assemble un ULM Sherwood Ranger|Paris"],
 ["EVOLUTEK|Technique|Robotique, association commune avec l'EPITA et Epitech|Paris, Toulouse"],
 ["HEL'IPS|Technique|Défis de drones|Paris"],
 ["IPS'AUTO CLUB|Technique|Restauration de voitures anciennes et événements automobiles|Paris"],
 ["IPSA VEGA|Technique|Astronomie et astrophotographie|Paris"],
 ["IPSA SPACE SYSTEMS|Technique|Fusées expérimentales, projet PERSEUS du CNES|Paris"],
 ["Envair'gure|Technique|Conçoit un simulateur de planeur|Toulouse"],
 ["Ips'Airclub|Technique|Passionnés d'aviation : BIA, visites, simulation de vol|Toulouse"],
 ["IPSA Retro|Technique|Restaure des avions historiques|Toulouse"],
 ["IPS'AERO|Technique|Aéromodélisme|Toulouse"],
 ["IPSA Rocket|Technique|Projets de fusées et de ballons stratosphériques|Toulouse"],
 ["AEROSIM|Technique|Conçoit un simulateur de vol|Toulouse"],
 ["IpsAstro|Technique|Sorties d'astrophotographie avec un télescope Dobson|Toulouse"],
 ["IPS'Salle Méca|Technique|Atelier de CAO, impression 3D et usinage|Toulouse"],
 ["SPACE EXPERIENCES|Technique|Expériences de support-vie pour vaisseaux lunaires et martiens|Toulouse"],
 ["IPSA'VISIONARY|Technique|Projets techniques, surtout autour des drones|Toulouse"],
 ["SPACE LEARN|Technique|Traitement de données, code, rapports et modélisation|Toulouse"],
 ["Dreamage|Culture|Photo et vidéo des événements, documentaires|Paris"],
 ["BDA (Bureau des Arts)|Culture|Fédère danse, arts visuels et musique|Paris"],
 ["CAV'IPS|Culture|Œnologie et gastronomie française|Paris"],
 ["IPSA POKER|Culture|Poker|Paris"],
 ["GAMING OFFICE|Culture|Jeux de société et compétitions d'e-sport|Paris"],
 ["GEOPOL'IPS|Culture|Journalisme, géopolitique et débat|Paris"],
 ["ON AIR IPSA|Culture|Groupe de musique, membre du BDA|Paris"],
 ["IPSA VOX|Culture|Éloquence et négociation|Paris"],
 ["125 BPM|Culture|Association de DJ|Paris"],
 ["AeroDance|Culture|Groupe de danse, membre du BDA|Paris"],
 ["Stell'Art|Culture|Ateliers d'arts visuels, membre du BDA|Paris"],
 ["IPSA MUSIC|Culture|Cours d'instruments et concerts|Toulouse"],
 ["IPSA BOWLING|Culture|Sorties bowling|Toulouse"],
 ["PHOTOSPHERE|Culture|Photo, vidéo et spotting d'avions|Toulouse"],
 ["IPS'ART|Culture|Dessin et peinture|Toulouse"],
 ["IPSA CHESS|Culture|Tournois d'échecs|Toulouse"],
 ["IPSARCADE|Culture|Tournois de jeux en ligne|Toulouse"],
 ["IPS'airsoft|Sport et loisirs|Séances et sorties d'airsoft|Paris"],
 ["BOULIP'S|Sport et loisirs|Pétanque et jeux de plein air|Paris"],
 ["IPSA Para|Sport et loisirs|Séances de soufflerie et de parachutisme|Paris"],
 ["BDS (Bureau des Sports)|Sport et loisirs|Championnats universitaires et sports collectifs|Paris, Toulouse"],
 ["IPSA Wax|Sport et loisirs|Wakeboard et surf|Paris"],
 ["IPSA Kart|Sport et loisirs|Karting et courses, comme les 24H ESSEC|Paris, Toulouse"],
 ["TAKE-OFF IPSA|Sport et loisirs|Basket|Paris"],
 ["IPSA DIVE|Sport et loisirs|Plongée de loisir|Paris"],
 ["FC IPSA|Sport et loisirs|Football|Paris, Toulouse"],
 ["ROCKETS IPSA|Sport et loisirs|Football américain|Paris"],
 ["IPSA HANDBALL|Sport et loisirs|Handball|Paris"],
 ["IPS'AVALANCHE|Sport et loisirs|Ski|Paris"],
 ["IPSA JUDO|Sport et loisirs|Judo|Paris"],
 ["IPSA SWIM|Sport et loisirs|Natation|Paris"],
 ["IPSA POM POM GIRLS|Sport et loisirs|Cheerleading|Paris"],
 ["IPSA XV PARIS|Sport et loisirs|Rugby|Paris"],
 ["VOILIP'S|Sport et loisirs|Voile|Paris"],
 ["Volley IPSA|Sport et loisirs|Volley-ball|Paris"],
 ["IPSA F1|Sport et loisirs|Projet de simulateur F1 et événements|Paris"],
 ["IPSA Racing Team|Sport et loisirs|Formula Student et monoplace électrique|Paris"],
 ["IPSA Boxing|Sport et loisirs|Boxe|Toulouse"],
 ["IPSA Running & Hiking|Sport et loisirs|Course à pied et sorties en montagne|Toulouse"],
 ["IPSA GLISS|Sport et loisirs|Patinage et semaine de ski|Toulouse"],
 ["IPS'HANDBALL|Sport et loisirs|Handball|Toulouse"],
 ["IPS'ARMY|Sport et loisirs|Sorties airsoft et paintball|Toulouse"],
 ["IPSA CHEERDANCE|Sport et loisirs|Cheerleading|Toulouse"],
 ["TEN'IPSA|Sport et loisirs|Tennis|Toulouse"],
 ["IPSA Climbing|Sport et loisirs|Escalade|Toulouse"],
 ["IPS'SWIM|Sport et loisirs|Natation|Toulouse"],
 ["IPS'AVIRON|Sport et loisirs|Aviron|Toulouse"],
 ["IPSA Basket|Sport et loisirs|Basket|Toulouse"],
 ["IPSA Volleyball|Sport et loisirs|Volley-ball|Toulouse"],
 ["IPSA BAD|Sport et loisirs|Badminton|Toulouse"],
 ["IPSA FUSTAL|Sport et loisirs|Futsal|Toulouse"],
 ["IPS'ULTRA|Sport et loisirs|Association de supporters|Toulouse"],
 ["IPSA PETANQUE|Sport et loisirs|Pétanque|Toulouse"],
 ["IPSA RUGBY|Sport et loisirs|Rugby|Toulouse"],
 ["STUD'Act|Humanitaire|Relie les étudiants à des associations humanitaires par des actions de solidarité locales|Paris, Toulouse"]
];
function slug(s){return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");}
A.forEach(function(r){
  var p=r[0].split("|"),name=p[0],kind=p[1],desc=p[2],camp=p[3].split(", ");
  var tags=[kind.toLowerCase(),"association","asso","club"].concat(camp.map(function(c){return c.toLowerCase();}));
  add("asso-"+slug(name),"asso",name,desc+". Association "+kind.toLowerCase()+", campus : "+p[3]+".",{tags:tags,camp:camp.map(function(c){return c==="Paris"?"Paris-Ivry":c;}),src:["assos"]});
});

return {date:DATE,src:S,cats:CATS,fiches:F};
})();

export default IPSA_DATA;
