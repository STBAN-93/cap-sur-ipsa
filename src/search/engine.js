/* ---------- moteur de recherche de la base de connaissances ---------- */
import D from '../data/fiches.js';
import { norm, esc } from '../utils.js';

var F=D.fiches,CAT={};D.cats.forEach(function(c){CAT[c[0]]=c[1];});
var byId={};F.forEach(function(f){byId[f.id]=f;});
var SYN={prof:"enseignant",profs:"enseignants",professeur:"enseignant",asso:"association",assos:"associations",club:"association",prix:"distinction",classement:"classement",cout:"frais",couts:"frais",tarif:"frais",argent:"frais",logement:"logement",appart:"logement",alternant:"alternance",apprenti:"apprentissage",erasmus:"international",etranger:"international",fusee:"fusee",fusees:"fusee",rocket:"fusee",satellite:"satellites",drone:"drones",ia:"intelligence artificielle",cyber:"cybersecurite",paris:"ivry",stage:"stages",majeur:"majeure",spe:"majeure",specialisation:"majeure",matiere:"enseignements",matieres:"enseignements",cours:"enseignements",cursus:"programme",bachelor:"bachelor"};
var STOP={le:1,la:1,les:1,de:1,des:1,du:1,un:1,une:1,et:1,en:1,a:1,au:1,aux:1,l:1,d:1,pour:1,sur:1,est:1,quel:1,quelle:1,quels:1,quelles:1,comment:1,ou:1,y:1,il:1,on:1,ce:1,qui:1,que:1,avec:1,dans:1,ipsa:1};
F.forEach(function(f){
  f._t=norm(f.t);f._tw=f._t.split(/[^a-z0-9+]+/).filter(Boolean);
  f._g=f.tags.map(norm).concat(norm(CAT[f.cat])).concat(f.camp.map(norm));
  f._gw=f._g.join(" ").split(/[^a-z0-9+]+/).filter(Boolean);
  f._x=norm(f.x+" "+f.f.join(" "));
});
function lev1(a,b){ /* distance d'édition <= 1 ? */
  if(a===b)return true;var la=a.length,lb=b.length;if(Math.abs(la-lb)>1)return false;
  var i=0,j=0,e=0;while(i<la&&j<lb){if(a[i]===b[j]){i++;j++;continue;}if(++e>1)return false;if(la>lb)i++;else if(lb>la)j++;else{i++;j++;}}
  return e+(la-i)+(lb-j)<=1;
}
function tokens(q){
  return norm(q).split(/[^a-z0-9+]+/).filter(function(w){return w&&!STOP[w];});
}
function scoreTok(f,w){
  var s=0,alt=SYN[w];
  function one(w){
    var r=0;
    if(f._tw.indexOf(w)>=0)r+=10;else if(f._tw.some(function(t){return t.indexOf(w)===0;}))r+=7;else if(f._t.indexOf(w)>=0)r+=4;
    if(f._gw.indexOf(w)>=0)r+=6;else if(f._gw.some(function(t){return t.indexOf(w)===0;}))r+=4;
    if(f._x.indexOf(w)>=0)r+=w.length>2?2:.5;
    if(!r&&w.length>=5){if(f._tw.some(function(t){return lev1(t,w);}))r+=5;else if(f._gw.some(function(t){return lev1(t,w);}))r+=3;}
    return r;
  }
  s=one(w);if(alt&&alt!==w)s=Math.max(s,one(norm(alt).split(" ")[0])*.9);
  return s;
}
function search(q,cat,camp){
  var ws=tokens(q),out=[];
  F.forEach(function(f){
    if(cat&&f.cat!==cat)return;
    if(camp&&f.camp.indexOf(camp)<0)return;
    if(!ws.length){out.push({f:f,s:(f.feat?2:0)+(f.cat==="asso"?-1:0)});return;}
    var s=0,miss=0;
    ws.forEach(function(w){var k=scoreTok(f,w);if(k)s+=k;else miss++;});
    if(!s)return;
    if(miss)s=s*(.35/miss); /* une requête où tous les mots matchent passe devant */
    if(f.feat)s+=.5;
    out.push({f:f,s:s,miss:miss});
  });
  out.sort(function(a,b){return b.s-a.s||a.f.t.localeCompare(b.f.t,"fr");});
  if(ws.length){var full=out.filter(function(r){return !r.miss;});if(full.length)out=full.concat(out.filter(function(r){return r.miss;}).slice(0,6));}
  return {list:out.map(function(r){return r.f;}),ws:ws};
}
function hl(text,ws){
  var t=esc(text);if(!ws||!ws.length)return t;
  var n=norm(text),marks=[];
  ws.forEach(function(w){if(w.length<2)return;var i=0;while((i=n.indexOf(w,i))>=0){marks.push([i,i+w.length]);i+=w.length;}});
  if(!marks.length)return t;
  marks.sort(function(a,b){return a[0]-b[0];});
  var res="",pos=0;marks.forEach(function(m){if(m[0]<pos)return;res+=esc(text.slice(pos,m[0]))+"<mark>"+esc(text.slice(m[0],m[1]))+"</mark>";pos=m[1];});
  return res+esc(text.slice(pos));
}
function excerpt(f,ws){
  var x=f.x;if(!ws.length)return x;
  var n=norm(x),i=-1;ws.some(function(w){i=n.indexOf(w);return i>=0;});
  if(i<60)return x;var st=x.lastIndexOf(" ",i-40);return "… "+x.slice(st+1);
}


export { D, F, CAT, byId, tokens, search, hl, excerpt };
