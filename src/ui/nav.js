/* ---------- navigation : barre, section courante, logo ---------- */
export function initNav(){
var nav=document.querySelector('nav'),links=[].slice.call(document.querySelectorAll('.links a[href^="#"]:not(.join)'));
var map={cursus:'cursus',majeures:'majeures',campus:'campus',debouches:'debouches',reseau:'debouches',startup:'debouches',avis:'debouches',admission:'admission',explorer:'explorer'};
function onS(){nav.classList.toggle('scrolled',scrollY>40);
  var cur='',mid=innerHeight*.4;document.querySelectorAll('main section[id]').forEach(function(s){var r=s.getBoundingClientRect();if(r.top<mid&&r.bottom>mid)cur=map[s.id]||'';});
  links.forEach(function(a){a.classList.toggle('cur',a.getAttribute('href')==='#'+cur);});}
addEventListener('scroll',onS,{passive:true});onS();
/* logo : affiché seulement si le fichier officiel est déposé dans assets/ */
['assets/logo-ipsa.svg','assets/logo-ipsa.png'].reduce(function(p,src){return p.catch(function(){return new Promise(function(ok,ko){var i=new Image();i.onload=function(){ok(src);};i.onerror=ko;i.src=src;});});},Promise.reject()).then(function(src){
  document.querySelectorAll('[data-logo]').forEach(function(im){im.src=src;im.classList.add('ok');});
}).catch(function(){});
}
