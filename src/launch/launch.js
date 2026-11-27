/* ---------- Animation : lancement Ariane 6, phases de vol ----------
   Déclenchée par le bouton « Lancer » : le vol (près d'une heure) est condensé en DUR secondes.
   Pause, rejouer, phases cliquables, clavier (Espace, flèches). Sans animation si l'utilisateur l'a demandé. */
export function initLaunch(){
var sec=document.getElementById('lancement'),cv=document.getElementById('lcv');if(!sec||!cv)return;
var cx=cv.getContext('2d'),W=1,H=1,D=1;
var EV=[
  {t:-7,k:'H0 − 7 s',n:'Allumage du Vulcain 2.1',d:"Le moteur de l'étage principal s'allume en premier. L'ordinateur vérifie automatiquement ses paramètres avant d'autoriser le décollage."},
  {t:0,k:'H0',n:'Décollage',d:"Les deux boosters P120C s'allument et les bras cryotechniques se séparent. Les boosters fournissent environ 90 % de la poussée au décollage."},
  {t:70,k:'≈ H0 + 1 min',n:'Max Q',d:"Pression dynamique maximale : l'air exerce sa plus forte contrainte sur la structure. Sur la plupart des lanceurs, 60 à 80 s après le décollage, vers 11 à 14 km."},
  {t:136,k:'H0 + 2 min 16 s',n:'Séparation des boosters',d:"Leur poudre consommée, les deux P120C sont largués. L'étage principal continue seul avec son moteur Vulcain."},
  {t:219,k:'H0 + 3 min 39 s',n:'Largage de la coiffe',d:"Hors de l'atmosphère dense, la coiffe qui protégeait les satellites n'est plus utile : ses deux demi-coquilles s'écartent."},
  {t:455,k:'H0 + 7 min 35 s',n:'Extinction du Vulcain',d:"Fin de la poussée de l'étage principal, après plus de sept minutes de fonctionnement."},
  {t:461,k:'H0 + 7 min 41 s',n:"Séparation de l'étage supérieur",d:"L'étage principal se détache. Il ne reste que l'étage supérieur et sa charge utile."},
  {t:470,k:'H0 + 7 min 50 s',n:'Allumage du Vinci',d:"Le moteur cryotechnique de l'étage supérieur prend le relais pour viser l'orbite."},
  {t:1112,k:'H0 + 18 min 32 s',n:'Extinction du Vinci',d:"Fin de la première poussée : le lanceur est en orbite et entame une phase balistique, sans poussée."},
  {t:3390,k:'≈ H0 + 56 min',n:'Rallumage, puis satellites',d:"Première européenne : le Vinci se rallume en orbite. Les satellites sont ensuite déployés un par un."}
];
var AN=[[0,-10],[.05,-7],[.11,0],[.24,70],[.36,136],[.48,219],[.6,455],[.65,461],[.7,470],[.84,1112],[.94,3390],[1,3500]];
function tOf(p){for(var i=1;i<AN.length;i++)if(p<=AN[i][0]){var a=AN[i-1],b=AN[i],f=(p-a[0])/(b[0]-a[0]);return a[1]+(b[1]-a[1])*f;}return AN[AN.length-1][1];}
function cl(x,a,b){return Math.max(a,Math.min(b,x));}
function sm(a,b,x){var t=cl((x-a)/(b-a),0,1);return t*t*(3-2*t);}
function mix(a,b,f){return a+(b-a)*f;}
function mixC(c1,c2,f){return 'rgb('+Math.round(mix(c1[0],c2[0],f))+','+Math.round(mix(c1[1],c2[1],f))+','+Math.round(mix(c1[2],c2[2],f))+')';}
function fmtT(t){var s=t<0?'−':'+',a=Math.abs(Math.round(t)),h=Math.floor(a/3600),m=Math.floor(a%3600/60),ss=a%60;return s+(h?h+':':'')+(m<10?'0':'')+m+':'+(ss<10?'0':'')+ss;}
var steps=document.getElementById('l-steps');
steps.innerHTML=EV.map(function(e,k){return '<li><button type="button" data-ev="'+k+'"><b>'+fmtT(e.t)+'</b><span>'+e.n+'</span></button></li>';}).join('');
var lis=[].slice.call(steps.children),elT=document.getElementById('l-t'),elK=document.getElementById('l-k'),elN=document.getElementById('l-n'),elD=document.getElementById('l-d'),elB=document.getElementById('l-bar');
var stars=[];for(var i=0;i<260;i++)stars.push([Math.random(),Math.random(),Math.random()*1.4+.3,Math.random()]);
var clouds=[];for(i=0;i<14;i++)clouds.push([Math.random(),Math.random()*1.6,.4+Math.random()*.8]);
function resize(){D=Math.min(window.devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*D;cv.height=H*D;}
window.addEventListener('resize',resize);resize();
var cur=-2,T0=performance.now(); /* -2 : le texte du compte à rebours s'affiche dès le départ */

function ell(x,y,rx,ry,c){cx.beginPath();cx.ellipse(x,y,rx,ry,0,0,6.2832);cx.fillStyle=c;cx.fill();}
function flame(len,wid,col1,col2,flick){
  var g=cx.createLinearGradient(0,0,0,len);g.addColorStop(0,col1);g.addColorStop(.35,col2);g.addColorStop(1,'rgba(255,120,40,0)');
  cx.beginPath();cx.moveTo(-wid*.5,0);
  cx.quadraticCurveTo(-wid*(.9+flick*.2),len*.35,0,len);cx.quadraticCurveTo(wid*(.9+flick*.2),len*.35,wid*.5,0);cx.closePath();cx.fillStyle=g;cx.fill();
}
function body(x,y,w,h,nose,col){ /* cylindre vertical, y = bas, vers le haut négatif */
  var g=cx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,'#8d939e');g.addColorStop(.35,col||'#f4f5f7');g.addColorStop(.75,'#d4d8de');g.addColorStop(1,'#6c7280');
  cx.fillStyle=g;cx.beginPath();cx.moveTo(x-w/2,y);cx.lineTo(x-w/2,y-h);
  if(nose){cx.quadraticCurveTo(x-w/2,y-h-nose*.75,x,y-h-nose);cx.quadraticCurveTo(x+w/2,y-h-nose*.75,x+w/2,y-h);}
  else cx.lineTo(x+w/2,y-h);
  cx.lineTo(x+w/2,y);cx.closePath();cx.fill();
}
function draw(p,now){
  var t=tOf(p),tt=(now-T0)/1000,fl=Math.sin(tt*40)*.5+.5;
  var a=t<=0?0:1-Math.exp(-t/180);               /* altitude schématique 0..1 */
  cx.setTransform(D,0,0,D,0,0);
  /* ciel */
  var g=cx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,mixC([28,86,150],[2,4,10],sm(.05,.55,a)));
  g.addColorStop(1,mixC([150,200,235],[8,18,38],sm(.08,.6,a)));
  cx.fillStyle=g;cx.fillRect(0,0,W,H);
  var sa=sm(.35,.75,a);
  if(sa>0){for(var i=0;i<stars.length;i++){var s=stars[i];cx.globalAlpha=sa*(.4+.6*Math.abs(Math.sin(tt*.8+s[3]*9)));cx.fillStyle='#fff';cx.fillRect(s[0]*W,s[1]*H,s[2],s[2]);}cx.globalAlpha=1;}
  /* Terre courbe */
  var R=W*mix(14,.95,sm(.25,.95,a)),top=H*(.8+1.2*sm(0,.22,a)-1.24*sm(.3,.9,a));
  if(top<H*1.6){
    var ecx=W*.5,ecy=top+R;
    var hg=cx.createRadialGradient(ecx,ecy,R*.98,ecx,ecy,R*1.06);hg.addColorStop(0,'rgba(120,200,255,.55)');hg.addColorStop(1,'rgba(120,200,255,0)');
    cx.fillStyle=hg;cx.beginPath();cx.arc(ecx,ecy,R*1.06,0,6.2832);cx.fill();
    var eg=cx.createLinearGradient(0,top,0,top+Math.min(R,H));
    eg.addColorStop(0,a<.2?'#1f4a2c':'#2a6aa8');eg.addColorStop(.25,a<.2?'#0f2a1c':'#103866');eg.addColorStop(1,'#04101f');
    cx.fillStyle=eg;cx.beginPath();cx.arc(ecx,ecy,R,0,6.2832);cx.fill();
    if(a>.25){ /* nappes nuageuses vues d'en haut */
      cx.save();cx.beginPath();cx.arc(ecx,ecy,R,0,6.2832);cx.clip();cx.globalAlpha=.18*sm(.25,.6,a);
      for(i=0;i<9;i++){ell(ecx+(i-4)*R*.09,top+R*.02+(i%3)*R*.012,R*.05,R*.008,'#fff');}
      cx.restore();cx.globalAlpha=1;
    }
  }
  /* pas de tir */
  var gy=H*.82+(t>0?H*.004*Math.pow(t,1.9):0),padX=W*.6;
  if(gy<H*1.4){
    cx.fillStyle='#0b1f15';cx.fillRect(0,gy,W,H*2);
    cx.fillStyle='#16352a';for(i=0;i<40;i++){ell((i/40)*W+((i*37)%11),gy+4,W*.03,10,'#123024');}
    cx.fillStyle='#2b2f38';cx.fillRect(padX-W*.12,gy-6,W*.24,10);
    /* mâts paratonnerres */
    [-.1,.1,-.16,.16].forEach(function(o,k){var mx=padX+W*o*.9;cx.fillStyle='#3a404c';cx.fillRect(mx-2,gy-H*(k<2?.5:.42),4,H*(k<2?.5:.42));});
  }
  /* nuages traversés */
  var cy0=sm(0,.2,a)*H*3.2;
  if(a>.01&&a<.3){cx.globalAlpha=.85*(1-sm(.18,.3,a));for(i=0;i<clouds.length;i++){var c=clouds[i],y=(c[1]*H*1.6-H*1.2)+cy0;if(y>-60&&y<H+60){ell(c[0]*W,y,W*.12*c[2],22*c[2],'rgba(255,255,255,.75)');ell(c[0]*W+40,y-10,W*.08*c[2],18*c[2],'rgba(255,255,255,.6)');}}cx.globalAlpha=1;}

  /* fusée */
  var S=H*mix(.44,.3,sm(.5,1,a))*(W<700?.62:1),rx=W*(W<700?.55:.6);
  var ry=t<=0?gy:mix(gy,H*(W<700?.72:.62),sm(0,18,t));
  var pitch=t<8?0:(82*(1-Math.exp(-(t-8)/240)))*Math.PI/180;
  var shake=(t>-7&&t<20?1.6:0)+(t>55&&t<90?2.2*(1-Math.abs(t-72)/18):0);
  cx.save();cx.translate(rx+(Math.random()-.5)*shake,ry+(Math.random()-.5)*shake);cx.rotate(pitch);
  var cw=S*.075,bw=S*.055,bh=S*.36;
  var boosterOn=t>=0&&t<136,coreOn=t>=-7&&t<455,vinci=(t>=470&&t<1112)||t>3300;
  /* traînée de fumée (atmosphère) */
  if(t>0&&a<.4){
    var sg=cx.createLinearGradient(0,0,0,H*1.4);sg.addColorStop(0,'rgba(255,240,220,'+(.7*(1-sm(.15,.4,a)))+')');sg.addColorStop(1,'rgba(200,210,225,0)');
    cx.fillStyle=sg;cx.beginPath();cx.moveTo(-cw*2,S*.05);cx.lineTo(-cw*9-H*.2,H*1.6);cx.lineTo(cw*9+H*.2,H*1.6);cx.lineTo(cw*2,S*.05);cx.closePath();cx.fill();
  }
  var exp=1+2.4*sm(.2,.9,a); /* expansion du jet dans le vide */
  /* boosters */
  var sep=t>136?(t-136):0;
  [-1,1].forEach(function(sd){
    if(t>200)return;
    cx.save();
    if(sep>0){cx.translate(sd*(sep*1.6+sep*sep*.05)*S*.01,sep*sep*S*.0009);cx.rotate(sd*sep*.012);cx.globalAlpha=cl(1-sep/60,0,1);}
    var bx=sd*(cw/2+bw/2);
    if(boosterOn){cx.save();cx.translate(bx,0);cx.globalCompositeOperation='lighter';flame(S*.32*exp*(.9+fl*.15),bw*1.15,'rgba(255,255,230,1)','rgba(255,170,60,.9)',fl);cx.restore();}
    body(bx,-S*.02,bw,bh,bw*1.1,'#eef0f3');
    cx.fillStyle='#22262e';cx.fillRect(bx-bw/2,-S*.02-bh*.12,bw,bh*.04);
    cx.restore();
  });
  /* étage principal */
  var csep=t>461?(t-461):0;
  if(t<520){
    cx.save();if(csep>0){cx.translate(0,csep*S*.02+csep*csep*S*.0012);cx.globalAlpha=cl(1-csep/50,0,1);}
    if(coreOn){cx.save();cx.globalCompositeOperation='lighter';flame(S*.2*exp,cw*.62,'rgba(220,235,255,.95)','rgba(150,190,255,.55)',fl);
      for(var dm=1;dm<4;dm++){ell(0,S*.04*dm,cw*.16,cw*.08,'rgba(255,255,255,'+(.35/dm)+')');}cx.restore();}
    cx.fillStyle='#3b414d';cx.beginPath();cx.moveTo(-cw*.28,0);cx.lineTo(cw*.28,0);cx.lineTo(cw*.18,-S*.03);cx.lineTo(-cw*.18,-S*.03);cx.fill();
    body(0,-S*.025,cw,S*.5,0,'#f6f7f9');
    cx.fillStyle='#1d2129';cx.fillRect(-cw/2,-S*.525,cw,S*.02);
    cx.fillStyle='#ff5a1f';cx.fillRect(-cw/2,-S*.3,cw,S*.008);
    cx.restore();
  }
  /* étage supérieur + coiffe */
  var up=-S*.545;
  if(vinci){cx.save();cx.translate(0,up);cx.globalCompositeOperation='lighter';flame(S*.14*exp*(.9+fl*.1),cw*.4,'rgba(230,240,255,.95)','rgba(120,170,255,.5)',fl);cx.restore();}
  cx.fillStyle='#4a505c';cx.beginPath();cx.moveTo(-cw*.2,up);cx.lineTo(cw*.2,up);cx.lineTo(cw*.12,up-S*.03);cx.lineTo(-cw*.12,up-S*.03);cx.fill();
  body(0,up-S*.025,cw,S*.13,0,'#f2f3f5');
  var ft=t>219?(t-219):0,payY=up-S*.155;
  /* charge utile (visible après la coiffe) */
  if(ft>0){
    var dep=t>3300?(t-3300)/90:0;
    for(i=0;i<3;i++){cx.save();cx.translate((i-1)*cw*.32+(i-1)*dep*S*.08,payY-S*.04-i*S*.045-dep*S*.05*i);cx.fillStyle='#d4a640';cx.fillRect(-cw*.14,-S*.018,cw*.28,S*.036);cx.fillStyle='#24418a';cx.fillRect(-cw*.14-S*.03,-S*.004,S*.03,S*.008);cx.fillRect(cw*.14,-S*.004,S*.03,S*.008);cx.restore();}
  }
  [-1,1].forEach(function(sd){
    if(ft>40)return;
    cx.save();
    if(ft>0){cx.translate(sd*ft*S*.006,ft*ft*S*.0006);cx.rotate(sd*ft*.03);cx.globalAlpha=cl(1-ft/40,0,1);}
    var fg=cx.createLinearGradient(sd<0?-cw/2:0,0,sd<0?0:cw/2,0);fg.addColorStop(0,sd<0?'#9aa0aa':'#f4f5f7');fg.addColorStop(1,sd<0?'#f4f5f7':'#7a808c');
    cx.fillStyle=fg;cx.beginPath();cx.moveTo(0,payY);cx.lineTo(sd*cw/2,payY);cx.lineTo(sd*cw/2,payY-S*.17);
    cx.quadraticCurveTo(sd*cw/2,payY-S*.25,0,payY-S*.27);cx.closePath();cx.fill();
    cx.restore();
  });
  /* cône de vapeur au Max Q */
  var mq=t>52&&t<92?1-Math.abs(t-72)/20:0;
  if(mq>0){cx.globalAlpha=mq*.55;var vg=cx.createRadialGradient(0,-S*.32,cw*.4,0,-S*.25,cw*2.6);vg.addColorStop(0,'rgba(255,255,255,.9)');vg.addColorStop(1,'rgba(255,255,255,0)');cx.fillStyle=vg;cx.beginPath();cx.moveTo(0,-S*.4);cx.lineTo(-cw*2.6,-S*.18);cx.quadraticCurveTo(0,-S*.12,cw*2.6,-S*.18);cx.closePath();cx.fill();cx.globalAlpha=1;}
  cx.restore();
  /* lignes de vitesse */
  if(t>15&&a<.5){cx.strokeStyle='rgba(255,255,255,'+(.18*(1-sm(.3,.5,a)))+')';cx.lineWidth=1;for(i=0;i<16;i++){var lx=((i*97+tt*600)%W),ly=((i*53)%H);cx.beginPath();cx.moveTo(lx,ly);cx.lineTo(lx-Math.sin(pitch)*60,ly+Math.cos(pitch)*60);cx.stroke();}}
  /* HUD */
  var idx=-1;for(i=0;i<EV.length;i++)if(t>=EV[i].t-.5)idx=i;
  elT.textContent=fmtT(t);elB.style.width=(p*100)+'%';
  if(idx!==cur){cur=idx;
    if(idx<0){elK.textContent='Chronologie finale';elN.textContent='Compte à rebours';elD.textContent="Séquence automatique : les ergols sont à bord, le lanceur est sous contrôle de l'ordinateur.";}
    else{elK.textContent=EV[idx].k;elN.textContent=EV[idx].n;elD.textContent=EV[idx].d;}
    lis.forEach(function(li,k){li.className=k<idx?'done':(k===idx?'now':'');var b=li.firstChild;if(k===idx)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  }
}
/* ---------- lecture ---------- */
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var DUR=40,P=0,playing=false,raf=0,last=0;
var go=document.getElementById('l-go'),goT=document.getElementById('l-go-t'),prev=document.getElementById('l-prev'),next=document.getElementById('l-next'),replay=document.getElementById('l-replay');
/* position (0..1) du début de chaque phase : AN[k+1] correspond à EV[k] */
var PEV=EV.map(function(e,k){return AN[k+1][0];});
function phaseAt(p){var k=-1;for(var i=0;i<PEV.length;i++)if(p>=PEV[i]-1e-6)k=i;return k;}
function ui(){
  var label=playing?'Pause':(P>=1?'Rejouer':(P>0?'Reprendre':'Lancer'));
  if(reduce&&!playing)label=P>0?(P>=1?'Revoir le compte à rebours':'Phase suivante'):'Lancer';
  goT.textContent=label;
  go.classList.toggle('is-playing',playing);
  go.setAttribute('aria-pressed',String(playing));
  sec.classList.toggle('flying',P>0);
  prev.disabled=P<=0;next.disabled=P>=PEV[PEV.length-1];
}
function frame(now){
  var dt=Math.min(.25,(now-last)/1000);last=now; /* plafond : pas de saut après un gel */
  P=Math.min(1,P+dt/DUR);
  draw(P,now);
  if(P>=1){playing=false;raf=0;ui();return;}
  raf=requestAnimationFrame(frame);
}
function play(){
  if(reduce){stepTo(phaseAt(P)+1);return;}  /* pas d'animation continue : phase par phase */
  if(P>=1)P=0;
  playing=true;ui();last=performance.now();
  if(!raf)raf=requestAnimationFrame(frame);
}
function pause(){playing=false;if(raf){cancelAnimationFrame(raf);raf=0;}ui();}
function seek(p){P=Math.max(0,Math.min(1,p));draw(P,performance.now());ui();}
function stepTo(k){
  if(k>=PEV.length){if(reduce){pause();seek(0);}return;}
  if(k<0){seek(0);return;}
  seek(PEV[k]);
}
go.addEventListener('click',function(){playing?pause():play();});
replay.addEventListener('click',function(){pause();seek(0);if(!reduce)play();});
prev.addEventListener('click',function(){var k=phaseAt(P);pause();stepTo(P>PEV[Math.max(k,0)]+.004?k:k-1);});
next.addEventListener('click',function(){pause();stepTo(phaseAt(P)+1);});
steps.addEventListener('click',function(e){var b=e.target.closest('[data-ev]');if(!b)return;pause();stepTo(+b.getAttribute('data-ev'));});
/* clavier : Espace lance ou met en pause, flèches gauche et droite changent de phase */
document.addEventListener('keydown',function(e){
  if(e.ctrlKey||e.metaKey||e.altKey||document.body.classList.contains('locked'))return;
  var t=e.target,tag=(t.tagName||'').toLowerCase();
  if(tag==='input'||tag==='textarea'||t.isContentEditable||t.closest('.cp,#nav'))return;
  if(e.key===' '||e.key==='Spacebar'){if(tag==='button'||tag==='a'||tag==='summary')return;e.preventDefault();go.click();}
  else if(e.key==='ArrowRight'){e.preventDefault();next.click();}
  else if(e.key==='ArrowLeft'){e.preventDefault();prev.click();}
});
/* onglet caché : on met en pause */
document.addEventListener('visibilitychange',function(){if(document.hidden&&playing)pause();});
window.addEventListener('resize',function(){if(!playing)draw(P,performance.now());});

/* liste des phases : dépliée sur ordinateur, repliée sous l'animation sur mobile */
var list=document.getElementById('l-list'),mq=window.matchMedia('(max-width: 860px)');
function layout(){list.open=!mq.matches;}
layout();(mq.addEventListener?mq.addEventListener('change',layout):0);

draw(0,performance.now());ui();
}
