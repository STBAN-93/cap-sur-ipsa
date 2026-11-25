import { photos } from 'virtual:media';
/* ================= Interface (indépendante de WebGL) ================= */
export function initInterface(){
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* rail + progress */
var secs=[].slice.call(document.querySelectorAll('[data-sec]'));
var rail=document.getElementById('rail');
secs.forEach(function(s){
  var a=document.createElement('a');a.href='#'+s.id;a.setAttribute('data-l',s.getAttribute('data-label'));a.setAttribute('aria-label',s.getAttribute('data-label'));
  rail.appendChild(a);
});
var dots=[].slice.call(rail.children);
var progress=document.getElementById('progress');
function onScroll(){
  var y=window.scrollY||0,max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
  progress.style.width=(clamp(y/max,0,1)*100)+'%';
  var mid=y+window.innerHeight*.5,cur=0;
  secs.forEach(function(s,i){if(mid>=s.getBoundingClientRect().top+y)cur=i;});
  dots.forEach(function(d,i){d.classList.toggle('on',i===cur);});
}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);onScroll();

/* tilt 3D au scroll */
var tiltEls=[].slice.call(document.querySelectorAll('.t3d'));
var bigs=[].slice.call(document.querySelectorAll('.bignum'));
var frameN=0;
function tiltLoop(){
  requestAnimationFrame(tiltLoop);
  if(reduce)return;
  if((frameN++)%2)return;
  var vh=window.innerHeight,vw=window.innerWidth;
  var rects=tiltEls.map(function(e){return e.getBoundingClientRect();});
  var brs=bigs.map(function(e){return e.parentNode.getBoundingClientRect();});
  tiltEls.forEach(function(e,i){
    var r=rects[i];if(r.bottom<-120||r.top>vh+120)return;
    var c=clamp((r.top+r.height/2-vh/2)/vh,-1.2,1.2);
    var cx=((r.left+r.width/2)/vw-.5);
    e.style.setProperty('--rx',(-c*7).toFixed(2)+'deg');
    e.style.setProperty('--ry',(-cx*9).toFixed(2)+'deg');
    e.style.setProperty('--ty',(c*-22).toFixed(1)+'px');
  });
  bigs.forEach(function(b,i){var r=brs[i];if(r.bottom<-200||r.top>vh+200)return;b.style.setProperty('--bn',(-r.top*.28).toFixed(1)+'px');});
}
tiltLoop();
[].slice.call(document.querySelectorAll('.card')).forEach(function(c){
  c.addEventListener('pointermove',function(e){
    if(reduce)return;var r=c.getBoundingClientRect();
    var px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
    c.style.setProperty('--hx',(-py*10).toFixed(2)+'deg');c.style.setProperty('--hy',(px*12).toFixed(2)+'deg');
  });
  c.addEventListener('pointerleave',function(){c.style.setProperty('--hx','0deg');c.style.setProperty('--hy','0deg');});
});

/* compteurs */
function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');}
if('IntersectionObserver' in window&&!reduce){
  var io=new IntersectionObserver(function(es){
    es.forEach(function(en){
      if(!en.isIntersecting)return;io.unobserve(en.target);
      var el=en.target,end=+el.getAttribute('data-count'),t0=performance.now(),d=1400,dec=+(el.getAttribute('data-dec')||0),suf=el.getAttribute('data-suffix')||'';
      (function step(t){
        var k=clamp((t-t0)/d,0,1),e=1-Math.pow(1-k,3),v=end*e;
        el.textContent=(dec?v.toFixed(dec).replace('.',','):fmt(Math.round(v)))+suf;
        if(k<1)requestAnimationFrame(step);
      })(t0);
    });
  },{threshold:.6});
  [].slice.call(document.querySelectorAll('[data-count]')).forEach(function(el){io.observe(el);});
}
/* apparitions : barres, jauges, soulignés */
function revealIn(el){
  el.classList.add('in');
  [].forEach.call(el.querySelectorAll('.gauge .fg'),function(c){c.style.strokeDashoffset=String(264*(1-(+c.getAttribute('data-v'))/5));});
}
if('IntersectionObserver' in window){
  var ro=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){ro.unobserve(en.target);revealIn(en.target);}});},{threshold:.15});
  [].forEach.call(document.querySelectorAll('.reveal,.bars'),function(el){ro.observe(el);});
}else{[].forEach.call(document.querySelectorAll('.reveal,.bars'),revealIn);}

/* sélecteur d'intérêts */
var picks=[].slice.call(document.querySelectorAll('#picker button'));
var cards=[].slice.call(document.querySelectorAll('#majors .card'));
var out=document.getElementById('pick-out');
var current='';
picks.forEach(function(b){
  b.addEventListener('click',function(){
    var k=b.getAttribute('data-k');current=(current===k)?'':k;
    picks.forEach(function(x){x.setAttribute('aria-pressed',String(x.getAttribute('data-k')===current));});
    var n=0;
    cards.forEach(function(c){
      var tags=(c.getAttribute('data-tags')||'').split(' ');
      var m=current&&tags.indexOf(current)>-1;
      c.classList.toggle('match',!!m);c.classList.toggle('dim',!!current&&!m);if(m)n++;
    });
    out.textContent=current?(n+(n>1?' majeures correspondent.':' majeure correspond.')):'';
  });
});

/* galerie : n'apparaît que si des photos existent dans photos/ */
var gal=document.getElementById('photos'),grid=document.getElementById('gal-grid'),lb=document.getElementById('lightbox'),lbi=document.getElementById('lightbox-img');
photos.forEach(function(n){(function(n){
  var im=new Image();
  im.onload=function(){
    var f=document.createElement('figure'),g=document.createElement('img');
    g.src=im.src;g.alt='Photo du campus '+n;g.loading='lazy';f.appendChild(g);
    f.addEventListener('click',function(){lbi.src=g.src;lb.classList.add('open');});
    f.style.order=n;grid.appendChild(f);gal.hidden=false;
  };
  im.src='photos/photo-'+n+'.jpg';
})(n);});
lb.addEventListener('click',function(){lb.classList.remove('open');});
document.addEventListener('keydown',function(e){if(e.key==='Escape')lb.classList.remove('open');});
}
