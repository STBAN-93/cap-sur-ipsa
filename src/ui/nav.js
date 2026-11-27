import { logos } from 'virtual:media';
/* ---------- navigation : barre, page courante, menu mobile, logo ---------- */
export function initNav(){
var nav=document.getElementById('nav');if(!nav)return;
var page=document.body.getAttribute('data-page');

/* page courante */
[].forEach.call(nav.querySelectorAll('.links a[data-page]'),function(a){
  var on=a.getAttribute('data-page')===page;
  a.classList.toggle('cur',on);
  if(on)a.setAttribute('aria-current','page');
});

function onS(){nav.classList.toggle('scrolled',scrollY>40);}
addEventListener('scroll',onS,{passive:true});onS();

/* menu repliable (bouton hamburger) sous 900 px */
var btn=document.getElementById('nav-toggle'),links=document.getElementById('nav-links');
var mq=window.matchMedia('(max-width: 900px)');
function isOpen(){return nav.classList.contains('open');}
function setOpen(open,focusBtn){
  nav.classList.toggle('open',open);
  btn.setAttribute('aria-expanded',String(open));
  btn.querySelector('.sr-only').textContent=open?'Fermer le menu':'Menu';
  if(open){var first=links.querySelector('a');if(first)first.focus();}
  else if(focusBtn)btn.focus();
}
btn.addEventListener('click',function(){setOpen(!isOpen(),false);});
/* Échap ferme le menu et rend le focus au bouton */
nav.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen()){e.stopPropagation();setOpen(false,true);}});
/* un lien choisi ferme le menu */
links.addEventListener('click',function(e){if(e.target.closest('a')&&isOpen())setOpen(false,false);});
/* clic hors du menu, ou focus qui sort du menu (Tab) : on referme */
document.addEventListener('click',function(e){if(isOpen()&&!nav.contains(e.target))setOpen(false,false);});
nav.addEventListener('focusout',function(e){if(isOpen()&&e.relatedTarget&&!nav.contains(e.relatedTarget))setOpen(false,false);});
/* retour en largeur ordinateur : le menu redevient une barre */
(mq.addEventListener?mq.addEventListener('change',function(){if(!mq.matches)setOpen(false,false);}):0);

/* logo : affiché seulement si le fichier officiel est déposé dans assets/ */
logos.reduce(function(p,src){return p.catch(function(){return new Promise(function(ok,ko){var i=new Image();i.onload=function(){ok(src);};i.onerror=ko;i.src=src;});});},Promise.reject()).then(function(src){
  document.querySelectorAll('[data-logo]').forEach(function(im){im.src=src;im.classList.add('ok');});
}).catch(function(){});
}
