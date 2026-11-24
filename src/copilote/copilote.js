/* ---------- Copilote : assistant de la base de connaissances ---------- */
import { esc } from '../utils.js';
import { D, search } from '../search/engine.js';
import { openFiche } from '../fiches/drawer.js';

export function initCopilote(){
var HUB={search:function(q){return search(q,'','');},openFiche:openFiche};
var fab=document.getElementById('cp-fab'),box=document.getElementById('cp'),log=document.getElementById('cp-log'),form=document.getElementById('cp-form'),inp=document.getElementById('cp-in'),sug=document.getElementById('cp-sug'),modeEl=document.getElementById('cp-mode'),stopB=document.getElementById('cp-stop');
var CAT={};D.cats.forEach(function(c){CAT[c[0]]=c[1];});
var byId={};D.fiches.forEach(function(f){byId[f.id]=f;});
var sample=null,history=[],busy=false,ctrl=null,lastFocus=null;
function setMode(){modeEl.textContent=sample?'Réponses rédigées par Claude, à partir des fiches sourcées':'Mode fiches : réponses tirées directement de la base';}
setMode();
if(window.claude&&window.claude.use){window.claude.use('sample').then(function(s){sample=s;setMode();}).catch(function(){});}

function open(){if(box.classList.contains('open'))return;lastFocus=document.activeElement;box.classList.add('open');fab.setAttribute('aria-expanded','true');if(!log.children.length)greet();setTimeout(function(){inp.focus();},30);}
function close(){box.classList.remove('open');fab.setAttribute('aria-expanded','false');if(lastFocus&&lastFocus.focus)lastFocus.focus();}
fab.addEventListener('click',function(){box.classList.contains('open')?close():open();});
document.getElementById('cp-x').addEventListener('click',close);
[].forEach.call(document.querySelectorAll('[data-open-chat]'),function(b){b.addEventListener('click',function(e){e.preventDefault();open();});});
box.addEventListener('keydown',function(e){if(e.key==='Escape'){e.stopPropagation();close();}});

function bubble(who,html){
  var d=document.createElement('div');d.className='cp-msg '+who;d.innerHTML=html;log.appendChild(d);log.scrollTop=log.scrollHeight;return d;
}
function greet(){
  bubble('bot','<p>Bonjour. Je réponds à tes questions sur l\'IPSA à partir des '+D.fiches.length+' fiches sourcées de ce site : cursus, majeures, campus, admission, débouchés, associations…</p><p class="cp-mini">Assistant non officiel. Pour une démarche (candidature, inscription), la référence reste ipsa.fr.</p>');
}
function chips(ids){
  ids=ids.filter(function(id,i){return byId[id]&&ids.indexOf(id)===i;}).slice(0,5);
  if(!ids.length)return '';
  return '<div class="cp-src">'+ids.map(function(id){return '<button type="button" data-fid="'+id+'"><span>'+esc(CAT[byId[id].cat])+'</span>'+esc(byId[id].t)+'</button>';}).join('')+'</div>';
}
log.addEventListener('click',function(e){var b=e.target.closest('[data-fid]');if(b)HUB.openFiche(b.getAttribute('data-fid'));});

function fmt(text){ /* markdown très léger + citations [id] */
  var cited=[];
  var h=esc(text).replace(/\[([a-z0-9-]+)\]/g,function(m,id){if(byId[id]){cited.push(id);return '<sup class="cp-ref">'+(cited.indexOf(id)+1)+'</sup>';}return '';});
  h=h.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
  var lines=h.split(/\n+/),out='',inList=false;
  lines.forEach(function(l){
    if(/^\s*[-•]\s+/.test(l)){if(!inList){out+='<ul>';inList=true;}out+='<li>'+l.replace(/^\s*[-•]\s+/,'')+'</li>';}
    else{if(inList){out+='</ul>';inList=false;}if(l.trim())out+='<p>'+l+'</p>';}
  });
  if(inList)out+='</ul>';
  return {html:out,cited:cited};
}
function context(q){
  var r=HUB.search(q),list=r.list.slice(0,8);
  if(list.length<6)list=list.concat(D.fiches.filter(function(f){return f.feat&&list.indexOf(f)<0;}).slice(0,6-list.length));
  return list;
}
function prompt(q,fiches){
  var ctx=fiches.map(function(f){
    return '['+f.id+'] '+f.t+' ('+CAT[f.cat]+(f.camp.length?', '+f.camp.join(', '):'')+')\n'+f.x+(f.f.length?' '+f.f.join('. ')+'.':'')+(f.c?' (Information qui change souvent : à vérifier.)':'')+'\nSources : '+f.src.map(function(k){return D.src[k][0];}).join(' ; ');
  }).join('\n\n');
  return "Tu es le Copilote du site étudiant non officiel « Cap sur l'IPSA ». Tu réponds en français, au tutoiement, en 2 à 6 phrases ou une courte liste.\n"+
  "Règles :\n- Utilise UNIQUEMENT les fiches ci-dessous. N'invente aucun chiffre, nom, date ou prix.\n- Après chaque information, cite la fiche entre crochets avec son identifiant exact, par exemple [prog-stages].\n- Si les fiches ne permettent pas de répondre, dis-le simplement et renvoie vers ipsa.fr ou le service admissions.\n- Si une fiche est marquée « à vérifier », précise que le chiffre peut avoir changé.\n- Ne parle pas de personnes privées. Pas d'emoji.\n\n"+
  "FICHES (compilées le "+D.date+") :\n"+ctx+"\n\n"+
  (history.length?"CONVERSATION PRÉCÉDENTE :\n"+history.slice(-4).map(function(h){return (h.r==='u'?'Utilisateur : ':'Copilote : ')+h.t;}).join('\n')+"\n\n":"")+
  "QUESTION : "+q;
}
function offline(q,fiches){
  var top=fiches.slice(0,3);
  if(!top.length)return bubble('bot','<p>Je ne trouve rien dans la base pour cette question. Essaie d\'autres mots, ou consulte ipsa.fr.</p>');
  bubble('bot','<p>Voici ce que disent les fiches les plus proches :</p>'+top.map(function(f){return '<p><b>'+esc(f.t)+'.</b> '+esc(f.x.length>260?f.x.slice(0,f.x.lastIndexOf(' ',255))+'…':f.x)+'</p>';}).join('')+chips(top.map(function(f){return f.id;})));
}
function ask(q){
  q=q.trim();if(!q||busy)return;
  bubble('me','<p>'+esc(q)+'</p>');inp.value='';sug.hidden=true;
  var fiches=context(q);
  if(!sample){offline(q,fiches);history.push({r:'u',t:q});return;}
  busy=true;form.classList.add('busy');stopB.hidden=false;
  var b=bubble('bot','<p class="cp-typing"><i></i><i></i><i></i></p>');
  ctrl=new AbortController();
  sample(prompt(q,fiches),{modelTier:'quick',cache:false,signal:ctrl.signal,onText:function(e){var r=fmt(e.text||'');b.innerHTML=r.html||'<p class="cp-typing"><i></i><i></i><i></i></p>';log.scrollTop=log.scrollHeight;}})
  .then(function(res){var r=fmt(res.text||'');b.innerHTML=(r.html||'<p>Pas de réponse.</p>')+chips(r.cited.length?r.cited:fiches.slice(0,3).map(function(f){return f.id;}));history.push({r:'u',t:q},{r:'a',t:res.text||''});})
  .catch(function(err){
    if(err&&err.code==='not_granted'){sample=null;setMode();b.remove();offline(q,fiches);}
    else if(ctrl&&ctrl.signal.aborted){b.innerHTML+= '<p class="cp-mini">Réponse interrompue.</p>';}
    else{b.innerHTML='<p>'+(err&&err.code==='rate_limited'?'Trop de questions d\'un coup : réessaie dans un instant.':'Le Copilote n\'a pas pu répondre.')+'</p>';offlineInto(b,fiches);}
  })
  .then(function(){busy=false;form.classList.remove('busy');stopB.hidden=true;log.scrollTop=log.scrollHeight;});
}
function offlineInto(b,fiches){b.innerHTML+=chips(fiches.slice(0,3).map(function(f){return f.id;}));}
stopB.addEventListener('click',function(){if(ctrl)ctrl.abort();});
form.addEventListener('submit',function(e){e.preventDefault();ask(inp.value);});
sug.addEventListener('click',function(e){var b=e.target.closest('button');if(b)ask(b.textContent);});
window.IPSA_CHAT={open:open,ask:function(q){open();ask(q);}};
}
