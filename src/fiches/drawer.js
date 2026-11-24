/* ---------- fiche détaillée ---------- */
import { $, esc } from '../utils.js';
import { D, F, CAT, byId } from '../search/engine.js';

var dr=null,drb=null,lastFocus=null;
function related(f){
  return F.filter(function(o){return o!==f;}).map(function(o){
    var s=(o.cat===f.cat?2:0);o.tags.forEach(function(t){if(f.tags.indexOf(t)>=0)s+=1.5;});
    o.camp.forEach(function(c){if(f.camp.indexOf(c)>=0)s+=.3;});if(o.cat==="asso"&&f.cat!=="asso")s-=1;return {o:o,s:s};
  }).filter(function(r){return r.s>=2;}).sort(function(a,b){return b.s-a.s;}).slice(0,5).map(function(r){return r.o;});
}
function openFiche(id,from){
  var f=byId[id];if(!f)return;
  if(from)lastFocus=from;else if(!dr.classList.contains("open"))lastFocus=document.activeElement;
  var h='<p class="dr-cat">'+esc(CAT[f.cat])+(f.camp.length?' · '+f.camp.map(esc).join(", "):'')+'</p>'+
    '<h2 id="dr-title">'+esc(f.t)+'</h2><p class="txt">'+esc(f.x)+'</p>';
  if(f.f.length)h+='<ul class="dr-facts">'+f.f.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul>';
  if(f.c)h+='<p class="dr-warn">À vérifier : chiffre, liste ou modalité qui change d\'une année à l\'autre. Confirme sur la source ou sur ipsa.fr avant de t\'y fier.</p>';
  var acts=[];
  if(typeof f.ci==="number")acts.push('<button class="btn primary" type="button" data-globe="'+f.ci+'">Voir sur le globe</button>');
  if(acts.length)h+='<div class="dr-actions">'+acts.join("")+'</div>';
  h+='<p class="dr-h">Sources</p><ul class="dr-src">'+f.src.map(function(k){var s=D.src[k];return '<li><a href="'+esc(s[1])+'" target="_blank" rel="noopener noreferrer">'+esc(s[0])+'<small>'+esc(s[1].replace(/^https?:\/\//,""))+'</small></a></li>';}).join("")+'</ul>'+
    '<p class="dr-date">Consulté le '+esc(D.date)+'</p>';
  var rel=related(f);
  if(rel.length)h+='<p class="dr-h">Fiches liées</p><div class="dr-rel">'+rel.map(function(o){return '<button type="button" data-id="'+o.id+'">'+esc(o.t)+'<span>'+esc(CAT[o.cat])+'</span></button>';}).join("")+'</div>';
  drb.innerHTML=h;drb.scrollTop=0;dr.querySelector(".dr-box").scrollTop=0;
  dr.classList.add("open");document.body.classList.add("locked");
  try{history.replaceState(null,"","#fiche/"+id);}catch(e){}
  $("dr-close").focus();
}
function closeFiche(){
  if(!dr.classList.contains("open"))return;
  dr.classList.remove("open");document.body.classList.remove("locked");
  try{history.replaceState(null,"",location.pathname+location.search);}catch(e){}
  if(lastFocus&&lastFocus.focus)lastFocus.focus();
}

export { openFiche, closeFiche };

export function initDrawer(){
dr=$("drawer");drb=$("dr-body");
$("dr-close").addEventListener("click",closeFiche);
dr.addEventListener("click",function(e){
  if(e.target===dr){closeFiche();return;}
  var r=e.target.closest("[data-id]");if(r){openFiche(r.getAttribute("data-id"));return;}
  var g=e.target.closest("[data-globe]");
  if(g){var i=+g.getAttribute("data-globe");closeFiche();var b=document.querySelector('.campus[data-i="'+i+'"]');
    if(b&&b.getAttribute("aria-pressed")!=="true")b.click();
    document.getElementById("campus").scrollIntoView({behavior:"smooth",block:"start"});}
});

/* lien direct #fiche/<id> */
var m=/^#fiche\/(.+)$/.exec(location.hash);if(m&&byId[m[1]])setTimeout(function(){openFiche(m[1]);},400);
}
