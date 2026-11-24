/* ---------- explorateur dans la page ---------- */
import { $, esc } from '../utils.js';
import { D, F, CAT, search, hl, excerpt } from './engine.js';
import { openFiche } from '../fiches/drawer.js';

var CAMPS=["Paris-Ivry","Toulouse","Lyon"];
var showAll=null;
/* « Tout voir » depuis la palette : affiche tous les résultats d'une requête dans l'explorateur */
export function showAllResults(v){if(showAll)showAll(v);}

export function initExplorer(){
var st={q:"",cat:"",camp:"",n:12};
var q=$("x-q"),grid=$("x-grid"),more=$("x-more"),cnt=$("x-count"),cats=$("x-cats"),camps=$("x-camps");
$("x-date").textContent=D.date;
function chips(){
  var c={};F.forEach(function(f){c[f.cat]=(c[f.cat]||0)+1;});
  cats.innerHTML='<span class="x-label">Catégorie</span><button class="chip" type="button" data-c="" aria-pressed="true">Tout<i>'+F.length+'</i></button>'+
    D.cats.filter(function(k){return c[k[0]];}).map(function(k){return '<button class="chip" type="button" data-c="'+k[0]+'" aria-pressed="false">'+esc(k[1])+'<i>'+c[k[0]]+'</i></button>';}).join("");
  camps.innerHTML='<span class="x-label">Campus</span><button class="chip camp" type="button" data-p="" aria-pressed="true">Les trois</button>'+
    CAMPS.map(function(p){return '<button class="chip camp" type="button" data-p="'+p+'" aria-pressed="false">'+p+'</button>';}).join("");
}
function card(f,ws){
  return '<button class="fc" type="button" data-id="'+f.id+'"><span class="cat"><span>'+esc(CAT[f.cat])+'</span>'+(f.c?'<span class="warn">à vérifier</span>':'')+'</span>'+
    '<h3>'+hl(f.t,ws)+'</h3><p>'+hl(excerpt(f,ws),ws)+'</p>'+
    '<span class="meta">'+f.camp.map(function(c){return '<span class="pill ion">'+esc(c)+'</span>';}).join("")+'<span class="pill">'+f.src.length+' source'+(f.src.length>1?'s':'')+'</span></span></button>';
}
var reflowT;
function render(){
  var r=search(st.q,st.cat,st.camp),L=r.list;
  [].forEach.call(cats.querySelectorAll(".chip"),function(b){b.setAttribute("aria-pressed",String(b.getAttribute("data-c")===st.cat));});
  [].forEach.call(camps.querySelectorAll(".chip"),function(b){b.setAttribute("aria-pressed",String(b.getAttribute("data-p")===st.camp));});
  cnt.innerHTML="<b>"+L.length+"</b> fiche"+(L.length>1?"s":"")+(st.q||st.cat||st.camp?" trouvée"+(L.length>1?"s":""):" dans la base");
  grid.innerHTML=L.length?L.slice(0,st.n).map(function(f){return card(f,r.ws);}).join(""):
    '<div class="x-empty"><b>Aucune fiche pour « '+esc(st.q)+' ».</b><br>Essaie un mot plus général (propulsion, campus, stage) ou retire un filtre. Pour une question précise, ipsa.fr reste la référence.</div>';
  more.hidden=L.length<=st.n;
  clearTimeout(reflowT);reflowT=setTimeout(function(){window.dispatchEvent(new Event("resize"));},60);
}
chips();
var qt;q.addEventListener("input",function(){clearTimeout(qt);qt=setTimeout(function(){st.q=q.value;st.n=12;render();},90);});
cats.addEventListener("click",function(e){var b=e.target.closest(".chip");if(!b)return;st.cat=b.getAttribute("data-c");st.n=12;render();});
camps.addEventListener("click",function(e){var b=e.target.closest(".chip");if(!b)return;st.camp=b.getAttribute("data-p");st.n=12;render();});
more.addEventListener("click",function(){st.n+=24;render();});
grid.addEventListener("click",function(e){var b=e.target.closest(".fc");if(b)openFiche(b.getAttribute("data-id"),b);});
render();

showAll=function(v){q.value=v;st.q=v;st.cat="";st.camp="";st.n=24;render();document.getElementById("explorer").scrollIntoView({behavior:"smooth",block:"start"});};
}
