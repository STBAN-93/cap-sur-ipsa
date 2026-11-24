/* ---------- palette Ctrl+K ---------- */
import { $, norm, esc } from '../utils.js';
import { CAT, search, hl } from './engine.js';
import { openFiche, closeFiche } from '../fiches/drawer.js';
import { showAllResults } from './explorer.js';

export function initPalette(){
var dr=$("drawer");
var pal=$("pal"),pin=$("pal-in"),plist=$("pal-list"),sel=0,items=[];
var JUMPS=[["top","Départ"],["chiffres","Chiffres clés"],["cursus","Cursus"],["majeures","Majeures"],["programmes","Programmes"],["campus","Campus"],["debouches","Débouchés"],["admission","Admission"],["monde","International et vie étudiante"],["explorer","Base de connaissances"],["faq","FAQ"]];
function palRender(){
  var v=pin.value,r=search(v,"",""),L=r.list.slice(0,v?8:6),h="";items=[];
  if(L.length){h+='<li class="grp" role="presentation">'+(v?'Fiches':'Fiches à la une')+'</li>';
    L.forEach(function(f){items.push({t:"f",id:f.id});h+='<li role="option" id="po'+(items.length-1)+'" data-k="'+(items.length-1)+'"><span class="pc">'+esc(CAT[f.cat])+'</span><span class="pt"><b>'+hl(f.t,r.ws)+'</b><span>'+esc(f.x.slice(0,110))+'</span></span></li>';});}
  var nv=norm(v),J=JUMPS.filter(function(j){return !nv||norm(j[1]).indexOf(nv)>=0||j[0].indexOf(nv)>=0;}).slice(0,v?3:4);
  if(J.length){h+='<li class="grp" role="presentation">Aller à la section</li>';
    J.forEach(function(j){items.push({t:"j",id:j[0]});h+='<li role="option" id="po'+(items.length-1)+'" data-k="'+(items.length-1)+'"><span class="pc">Section</span><span class="pt"><b>'+esc(j[1])+'</b></span></li>';});}
  if(v&&r.list.length>8){items.push({t:"all"});h+='<li role="option" id="po'+(items.length-1)+'" data-k="'+(items.length-1)+'"><span class="pc">Tout voir</span><span class="pt"><b>Les '+r.list.length+' résultats dans la base</b></span></li>';}
  if(!items.length)h='<li class="grp" role="presentation">Aucun résultat. Essaie un mot plus général.</li>';
  plist.innerHTML=h;sel=0;palSel();
}
function palSel(){
  [].forEach.call(plist.querySelectorAll('[role="option"]'),function(li){var on=+li.getAttribute("data-k")===sel;li.setAttribute("aria-selected",String(on));if(on)li.scrollIntoView({block:"nearest"});});
  pin.setAttribute("aria-activedescendant",items.length?"po"+sel:"");
}
function palGo(k){
  var it=items[k];if(!it)return;var v=pin.value;closePal(true);
  if(it.t==="f")openFiche(it.id);
  else if(it.t==="j")document.getElementById(it.id).scrollIntoView({behavior:"smooth",block:"start"});
  else showAllResults(v);
}
var palFrom=null;
function openPal(){if(pal.classList.contains("open"))return;palFrom=document.activeElement;closeFiche();pal.classList.add("open");document.body.classList.add("locked");pin.value="";palRender();pin.focus();}
function closePal(keep){if(!pal.classList.contains("open"))return;pal.classList.remove("open");document.body.classList.remove("locked");if(!keep&&palFrom&&palFrom.focus)palFrom.focus();}
pin.addEventListener("input",palRender);
pin.addEventListener("keydown",function(e){
  if(e.key==="ArrowDown"){e.preventDefault();sel=Math.min(sel+1,items.length-1);palSel();}
  else if(e.key==="ArrowUp"){e.preventDefault();sel=Math.max(sel-1,0);palSel();}
  else if(e.key==="Enter"){e.preventDefault();palGo(sel);}
});
plist.addEventListener("click",function(e){var li=e.target.closest('[role="option"]');if(li)palGo(+li.getAttribute("data-k"));});
plist.addEventListener("mousemove",function(e){var li=e.target.closest('[role="option"]');if(li&&+li.getAttribute("data-k")!==sel){sel=+li.getAttribute("data-k");palSel();}});
pal.addEventListener("click",function(e){if(e.target===pal)closePal();});
[].forEach.call(document.querySelectorAll("[data-open-search]"),function(b){b.addEventListener("click",openPal);});
var mac=/Mac|iPhone|iPad/.test(navigator.platform||"");
[].forEach.call(document.querySelectorAll(".kmod"),function(k){k.textContent=mac?"⌘":"Ctrl";});
document.addEventListener("keydown",function(e){
  if((e.ctrlKey||e.metaKey)&&(e.key==="k"||e.key==="K")){e.preventDefault();pal.classList.contains("open")?closePal():openPal();return;}
  var tag=(e.target.tagName||"").toLowerCase(),typing=tag==="input"||tag==="textarea"||e.target.isContentEditable;
  if(e.key==="/"&&!typing){e.preventDefault();openPal();return;}
  if(e.key==="Escape"){if(pal.classList.contains("open"))closePal();else closeFiche();}
  if(e.key==="Tab"){ /* garder le focus dans la fenêtre ouverte */
    var box=pal.classList.contains("open")?pal:dr.classList.contains("open")?dr:null;if(!box)return;
    var fo=[].filter.call(box.querySelectorAll("a[href],button,input"),function(x){return x.offsetParent!==null;});if(!fo.length)return;
    var a=fo[0],z=fo[fo.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}
  }
});
}
