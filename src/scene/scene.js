/* ================= Scène 3D ================= */
import * as THREE from 'three';

export function initScene(){
var canvas=document.getElementById('stage');
if(typeof THREE==='undefined'){document.body.classList.add('no-gl');return;}
var renderer;
try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true});}
catch(e){document.body.classList.add('no-gl');return;}

var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var R=5;
var scene=new THREE.Scene();
scene.background=new THREE.Color(0x05070e);
var camera=new THREE.PerspectiveCamera(45,1,0.05,2000);
scene.add(camera);
var camFx=new THREE.Group();camera.add(camFx);
var W=1,H=1,DPR=1;

function ll2v(lat,lon,r){
  var p=lat*Math.PI/180,l=lon*Math.PI/180;
  return new THREE.Vector3(r*Math.cos(p)*Math.sin(l),r*Math.sin(p),r*Math.cos(p)*Math.cos(l));
}
function rnd(a,b){return a+Math.random()*(b-a);}
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function smooth(a,b,x){var t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);}
function V(x,y,z){return new THREE.Vector3(x,y,z);}

/* ---------- points (étoiles, points du globe, fumée) ---------- */
var dotUniforms=[];
function dotMaterial(size,min,max,additive){
  var u={uScale:{value:1},uSize:{value:size},uMin:{value:min},uMax:{value:max},uDpr:{value:1}};
  dotUniforms.push(u);
  return new THREE.ShaderMaterial({
    uniforms:u,
    vertexShader:
      'attribute vec3 aColor;attribute float aAlpha;attribute float aSize;varying vec3 vC;varying float vA;'+
      'uniform float uScale,uSize,uMin,uMax,uDpr;'+
      'void main(){vC=aColor;vA=aAlpha;vec4 mv=modelViewMatrix*vec4(position,1.0);'+
      'gl_PointSize=clamp(uSize*aSize*uScale/(-mv.z),uMin*uDpr,uMax*uDpr);gl_Position=projectionMatrix*mv;}',
    fragmentShader:
      'varying vec3 vC;varying float vA;'+
      'void main(){float r=length(gl_PointCoord-0.5);float a=smoothstep(0.5,0.25,r);if(a<0.01)discard;gl_FragColor=vec4(vC,a*vA);}',
    transparent:true,depthWrite:false,
    blending:additive?THREE.AdditiveBlending:THREE.NormalBlending
  });
}
function pointsFrom(list,mat){
  var n=list.length,pos=new Float32Array(n*3),col=new Float32Array(n*3),al=new Float32Array(n),sz=new Float32Array(n);
  for(var i=0;i<n;i++){
    var d=list[i];
    pos[i*3]=d.p.x;pos[i*3+1]=d.p.y;pos[i*3+2]=d.p.z;
    col[i*3]=d.c[0];col[i*3+1]=d.c[1];col[i*3+2]=d.c[2];
    al[i]=d.a;sz[i]=d.s;
  }
  var g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  g.setAttribute('aColor',new THREE.BufferAttribute(col,3));
  g.setAttribute('aAlpha',new THREE.BufferAttribute(al,1));
  g.setAttribute('aSize',new THREE.BufferAttribute(sz,1));
  var pts=new THREE.Points(g,mat);
  pts.frustumCulled=false;
  return pts;
}

/* ---------- textures procédurales ---------- */
function glowTex(r,g,b){
  var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d');
  var gr=x.createRadialGradient(128,128,0,128,128,128);
  gr.addColorStop(0,'rgba('+r+','+g+','+b+',1)');gr.addColorStop(.25,'rgba('+r+','+g+','+b+',.45)');gr.addColorStop(1,'rgba('+r+','+g+','+b+',0)');
  x.fillStyle=gr;x.fillRect(0,0,256,256);
  return new THREE.CanvasTexture(c);
}
function hash3(x,y,z){var s=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return s-Math.floor(s);}
function vnoise3(x,y,z){
  var xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=x-xi,yf=y-yi,zf=z-zi;
  var u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),w=zf*zf*(3-2*zf);
  function h(a,b,c){return hash3(xi+a,yi+b,zi+c);}
  var x00=h(0,0,0)+(h(1,0,0)-h(0,0,0))*u,x10=h(0,1,0)+(h(1,1,0)-h(0,1,0))*u,x01=h(0,0,1)+(h(1,0,1)-h(0,0,1))*u,x11=h(0,1,1)+(h(1,1,1)-h(0,1,1))*u;
  var y0=x00+(x10-x00)*v,y1=x01+(x11-x01)*v;
  return y0+(y1-y0)*w;
}
function fbm3(x,y,z){var s=0,a=.5,f=1;for(var i=0;i<5;i++){s+=a*vnoise3(x*f,y*f,z*f);f*=2.03;a*=.5;}return s;}
function cloudTex(){
  var w=512,h=256,c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d'),img=x.createImageData(w,h);
  for(var j=0;j<h;j++){
    var lat=(.5-j/h)*Math.PI;
    for(var i=0;i<w;i++){
      var lon=(i/w)*Math.PI*2;
      var px=Math.cos(lat)*Math.sin(lon),py=Math.sin(lat),pz=Math.cos(lat)*Math.cos(lon);
      var n=fbm3(px*2.6+5,py*2.6+5,pz*2.6+5);
      var a=smooth(.58,.8,n);
      var k=(j*w+i)*4;img.data[k]=255;img.data[k+1]=255;img.data[k+2]=255;img.data[k+3]=Math.round(a*120);
    }
  }
  x.putImageData(img,0,0);
  var t=new THREE.CanvasTexture(c);return t;
}
function moonTex(){
  var c=document.createElement('canvas');c.width=512;c.height=256;var x=c.getContext('2d'),img=x.createImageData(512,256);
  for(var j=0;j<256;j++)for(var i=0;i<512;i++){
    var n=fbm3(i/60,j/60,3.1),v=Math.round(110+n*110),k=(j*512+i)*4;
    img.data[k]=v;img.data[k+1]=v;img.data[k+2]=Math.round(v*.96);img.data[k+3]=255;
  }
  x.putImageData(img,0,0);
  for(var q=0;q<90;q++){
    var cx=rnd(0,512),cy=rnd(0,256),r=rnd(3,16);
    var gr=x.createRadialGradient(cx,cy,r*.2,cx,cy,r);
    gr.addColorStop(0,'rgba(40,40,45,.55)');gr.addColorStop(.8,'rgba(40,40,45,.25)');gr.addColorStop(1,'rgba(255,255,255,.18)');
    x.fillStyle=gr;x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.fill();
  }
  return new THREE.CanvasTexture(c);
}

/* ---------- ciel : étoiles, nébuleuses, halos ---------- */
(function(){
  var list=[],n=window.innerWidth<700?2200:5200;
  for(var i=0;i<n;i++){
    var v=V(rnd(-1,1),rnd(-1,1),rnd(-1,1)).normalize().multiplyScalar(rnd(500,1100));
    var k=Math.random(),c=k<.12?[1,.62,.4]:(k<.3?[.6,.84,1]:[.93,.9,.86]);
    list.push({p:v,c:c,a:rnd(.25,1),s:rnd(.6,2.0)});
  }
  scene.add(pointsFrom(list,dotMaterial(4.2,1.2,5.5,true)));
  /* voie lactée : bande dense inclinée */
  var mw=[],m=window.innerWidth<700?1500:4200;
  var nrm=V(.3,1,.2).normalize(),ax=V(1,0,0).cross(nrm).normalize(),bx=nrm.clone().cross(ax);
  for(var j=0;j<m;j++){
    var a=rnd(0,Math.PI*2),h=(Math.random()+Math.random()+Math.random()-1.5)*.14,r=rnd(600,1000);
    var p=ax.clone().multiplyScalar(Math.cos(a)).add(bx.clone().multiplyScalar(Math.sin(a))).add(nrm.clone().multiplyScalar(h)).normalize().multiplyScalar(r);
    var warm=Math.random()<.35;
    mw.push({p:p,c:warm?[.85,.65,.55]:[.55,.65,.95],a:rnd(.05,.28),s:rnd(1.5,4)});
  }
  scene.add(pointsFrom(mw,dotMaterial(5,1,16,true)));
  function neb(tex,x,y,z,s,o){
    var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:o}));
    sp.position.set(x,y,z);sp.scale.set(s,s,1);scene.add(sp);
  }
  neb(glowTex(255,110,50),140,40,-330,420,.35);
  neb(glowTex(80,150,255),-230,-60,-380,520,.33);
  neb(glowTex(170,90,255),60,160,-420,380,.2);
  neb(glowTex(255,190,120),-120,40,-250,260,.18);
})();

/* ---------- lumières ---------- */
scene.add(new THREE.AmbientLight(0x2a3a66,.8));
var sun=new THREE.DirectionalLight(0xfff0dc,2.0);sun.position.set(30,12,26);scene.add(sun);
var rim=new THREE.DirectionalLight(0x6fd6ff,1.1);rim.position.set(-24,10,-22);scene.add(rim);

/* ---------- Lune ---------- */
var moon=new THREE.Mesh(new THREE.SphereGeometry(3.4,48,48),new THREE.MeshStandardMaterial({map:moonTex(),roughness:1,metalness:0}));
moon.position.set(-38,-6,-64);scene.add(moon);

/* ---------- contours simplifiés des continents (lat, lon) ---------- */
var FR=[[47.59,7.62],[47.43,7.34],[47.49,7.14],[47.45,6.97],[47.39,6.9],[47.32,7.0],[47.03,6.67],[46.95,6.46],[46.75,6.41],[46.61,6.16],[46.46,6.07],[46.38,6.12],[46.28,6.1],[46.21,5.97],[46.14,6.01],[46.19,6.2],[46.25,6.27],[46.33,6.23],[46.43,6.43],[46.41,6.78],[46.28,6.82],[46.16,6.77],[45.93,7.02],[45.81,6.81],[45.74,6.79],[45.4,7.16],[45.24,7.08],[45.12,6.63],[44.92,6.74],[44.83,6.99],[44.72,7.03],[44.51,6.84],[44.39,6.87],[44.2,7.15],[44.13,7.37],[44.16,7.64],[44.08,7.68],[43.86,7.48],[43.77,7.49],[43.66,7.18],[43.17,6.49],[43.07,6.11],[43.1,5.81],[43.23,5.41],[43.35,5.32],[43.37,5.07],[43.44,5.06],[43.37,4.71],[43.48,4.22],[43.59,4.05],[43.56,3.91],[43.19,3.26],[42.91,3.05],[42.59,3.09],[42.43,3.21],[42.46,2.89],[42.39,2.67],[42.34,2.65],[42.42,2.2],[42.36,1.99],[42.5,1.7],[42.6,1.71],[42.64,1.5],[42.6,1.43],[42.69,1.35],[42.84,0.77],[42.84,0.67],[42.69,0.63],[42.69,-0.04],[42.83,-0.3],[42.8,-0.59],[42.94,-0.76],[43.02,-1.18],[43.1,-1.3],[43.04,-1.43],[43.07,-1.48],[43.24,-1.41],[43.32,-1.76],[43.41,-1.79],[43.44,-1.63],[43.56,-1.49],[44.56,-1.24],[44.69,-1.08],[44.76,-1.15],[44.67,-1.24],[45.53,-1.08],[45.38,-0.83],[45.09,-0.69],[45.0,-0.55],[45.09,-0.64],[45.38,-0.73],[45.71,-1.2],[45.77,-1.21],[45.74,-1.03],[46.31,-1.15],[46.52,-1.79],[46.87,-2.09],[47.04,-2.02],[47.16,-2.2],[47.26,-2.11],[47.22,-1.74],[47.31,-1.97],[47.31,-2.5],[47.38,-2.53],[47.47,-2.43],[47.51,-2.77],[47.6,-2.73],[47.63,-2.79],[47.62,-3.07],[47.69,-3.16],[47.84,-3.9],[47.82,-4.31],[47.97,-4.43],[48.04,-4.68],[48.17,-4.33],[48.29,-4.58],[48.3,-4.24],[48.37,-4.39],[48.36,-4.72],[48.45,-4.76],[48.54,-4.72],[48.62,-4.53],[48.71,-3.71],[48.84,-3.23],[48.79,-3.0],[48.54,-2.69],[48.65,-2.45],[48.65,-2.08],[48.58,-2.0],[48.7,-1.91],[48.63,-1.82],[48.65,-1.38],[48.8,-1.56],[49.2,-1.58],[49.49,-1.81],[49.68,-1.86],[49.68,-1.26],[49.49,-1.23],[49.39,-1.14],[49.3,-0.16],[49.45,0.42],[49.51,0.13],[49.7,0.19],[50.09,1.41],[50.25,1.59],[50.29,1.55],[50.82,1.61],[50.99,1.91],[51.1,2.53],[50.88,2.6],[50.75,2.76],[50.71,2.84],[50.78,3.11],[50.53,3.27],[50.48,3.59],[50.31,3.69],[50.34,3.95],[50.25,4.17],[50.14,4.13],[50.09,4.19],[50.0,4.14],[49.96,4.18],[49.96,4.55],[50.14,4.77],[50.14,4.86],[49.96,4.79],[49.79,4.87],[49.68,5.28],[49.51,5.51],[49.54,5.79],[49.45,6.01],[49.49,6.24],[49.4,6.54],[49.16,6.73],[49.21,6.89],[49.11,7.04],[49.15,7.45],[49.06,7.61],[48.97,8.13],[48.89,8.14],[48.64,7.84],[48.16,7.62],[47.67,7.53]];
var CO=[[42.81,9.48],[42.66,9.46],[42.55,9.53],[42.16,9.56],[41.93,9.4],[41.68,9.37],[41.39,9.19],[41.59,8.81],[41.7,8.89],[41.76,8.72],[41.93,8.74],[41.93,8.62],[42.04,8.7],[42.22,8.57],[42.28,8.67],[42.36,8.57],[42.55,8.71],[42.73,9.14],[42.71,9.32],[43.02,9.36],[42.98,9.46]];
var LAND=[
 /* Amérique du Nord */
 [[70,-165],[71,-150],[69,-135],[68,-115],[70,-100],[68,-88],[62,-80],[60,-70],[58,-62],[52,-56],[47,-53],[45,-61],[44,-66],[41,-70],[38,-75],[35,-76],[31,-81],[27,-80],[25,-80.5],[26,-82],[30,-84],[29,-89],[29,-94],[26,-97],[22,-98],[19,-96],[19,-91],[21,-87],[18,-88],[15,-88],[15,-84],[11,-83],[9,-82],[8,-77],[8,-80],[9,-84],[13,-88],[16,-95],[18,-103],[23,-106],[28,-112],[31,-114.5],[32,-117],[35,-121],[40,-124.3],[46,-124],[48.5,-124.7],[50,-127],[54,-130],[58,-136],[59,-144],[60,-148],[58,-152],[55,-160],[57,-163],[60,-165],[64,-166],[67,-164]],
 /* Groenland */
 [[83,-35],[81,-20],[76,-19],[70,-22],[66,-35],[60,-44],[62,-50],[68,-53],[72,-56],[77,-70],[81,-62]],
 /* Amérique du Sud */
 [[12,-72],[11,-62],[8,-60],[5,-52],[0,-50],[-5,-35],[-9,-35],[-13,-38.5],[-23,-41],[-25,-48],[-30,-50],[-35,-55],[-39,-58],[-42,-64],[-47,-66],[-52,-68.5],[-55,-68],[-52,-74],[-46,-75],[-40,-73.5],[-30,-71.5],[-20,-70],[-15,-75],[-6,-81],[-2,-80],[2,-78],[8,-77],[11,-74]],
 /* Afrique */
 [[37,10],[36,-5.5],[31,-9.5],[27,-13],[21,-17],[15,-17],[10,-15],[6,-10],[4.5,-8],[5,-2],[6,2],[4,6.5],[3,9.7],[-1,9],[-6,12],[-12,13.5],[-17,11.8],[-23,14.5],[-29,16.5],[-34,18.5],[-34.5,25],[-31,30],[-26,33],[-22,35.5],[-16,40],[-10,40.5],[-4,39.5],[2,45.5],[11.8,51],[12,43.3],[15,40],[20,37],[27,34],[31,32],[31,25],[32.5,20],[33,12]],
 /* Eurasie */
 [[43.5,-9],[43.5,-2],[46,-1.2],[47.5,-2.5],[48.6,-4.5],[48.8,-1.5],[49.7,-1.9],[49.4,0.1],[51,2.5],[52.5,4.5],[53.5,6],[54,8.7],[57.5,10.5],[55,12],[54.3,13],[54.5,19],[56,21],[57.5,22],[59.4,24],[59.5,28],[60,30],[60.5,23],[62,21.5],[65,25],[65.7,22.5],[63.5,19],[60.7,17.2],[59.3,18.5],[58,16.5],[56,15.8],[55.5,13],[57,12],[59,11],[59,5.5],[62,5],[64,10.5],[68,14],[70,19.5],[71,26],[70,31],[69.5,33],[67,41],[66,34],[64,37],[66,40],[68,44],[67,50],[68.5,58],[73,70],[75,90],[77,105],[73,113],[72,130],[71,140],[69.5,160],[69.5,170],[67,178],[65,178],[62,170],[60,166],[56,162.5],[51,156.7],[56,155],[59.5,153],[59,143],[54,140],[49,140.5],[43,132],[40,129.5],[39,127.5],[35.5,129.5],[34.7,126.5],[37,126.5],[39,125],[40,121.5],[38.5,118],[37.2,122.6],[35,119.3],[32,121.8],[30,122.2],[26.5,120],[23,116.5],[21.5,111],[21.5,108],[19,105.7],[16.3,107.7],[12,109.3],[9,105.3],[10.5,104],[12.5,100.5],[9.5,99.2],[7.5,100.4],[3,101],[1.3,103.7],[3.5,100.7],[6,100.3],[9.8,98.5],[13,98.2],[16.5,97.5],[16,94.5],[19,93.8],[22,91.8],[22,89],[21.5,87],[19.5,85.5],[16.5,82.3],[13,80.3],[10,79.8],[8.1,77.5],[9.8,76.2],[12,75],[15,74],[19,72.8],[22.2,69.5],[23.5,68.3],[25.3,66.7],[25.2,61.5],[26.3,57],[27.2,56.2],[28.5,51.5],[29.5,48.8],[27,49.5],[26,50.2],[24.5,51.5],[24,54],[24.5,56.5],[26,56.3],[22.5,59.8],[19,57.5],[17,55],[15,52],[13,45],[12.7,43.4],[16,42.7],[20,40],[24,37.5],[28,34.8],[29.5,32.7],[31.2,34.2],[33,35.1],[36.2,35.9],[36.8,34.5],[36.6,30],[36.7,28],[37.2,27.2],[38.4,26.4],[40,26.2],[40.5,24],[40.6,22.9],[38,24],[36.5,22.8],[37.8,21.2],[39.6,20],[41.3,19.5],[42.5,18.5],[45,13.5],[45.6,13],[44.5,12.3],[43.5,13.6],[41.9,15.9],[40.5,18.5],[39.8,16.5],[38,16],[38,15.6],[39.5,15.8],[40.2,14.5],[41.2,13],[42.2,11.2],[43.4,10.3],[44.3,8.8],[43.3,6.6],[43.4,4],[42.5,3.1],[41.2,1.2],[39.5,-0.3],[37.6,-0.7],[36.7,-2.5],[36.1,-5.4],[36.8,-6.4],[37,-8.9],[39,-9.4],[41.5,-8.9]],
 /* Australie */
 [[-11,132],[-12,136.5],[-15,135],[-17,140],[-11,142.5],[-19,147],[-24,152],[-28,153.5],[-34,151],[-38,148],[-39,146],[-38,141],[-35,138],[-32,134],[-32,128],[-34,123],[-34.5,115],[-26,113],[-22,114],[-17,122],[-14,127],[-12,130]],
 /* îles */
 [[50,-5.5],[51.5,1.3],[53,1.5],[55.5,-1.7],[58.5,-3],[58.5,-5.5],[56,-6],[54.5,-5],[53.3,-4.7],[51.7,-5.2]],
 [[51.5,-10],[52,-6],[54.2,-5.5],[55.2,-7.3],[54,-10]],
 [[31,130.5],[34,131],[35.5,133],[37,137],[41,140],[43,145],[45,142],[41.5,140],[38,139.5],[35,136.5],[34,135],[33.5,133]],
 [[5.5,95.5],[2,99],[-3,106],[-5.8,105.8],[-5,102],[0,98]],
 [[7,117],[1,119],[-3.5,116],[-3,111],[1.5,109],[4,115]],
 [[-6,106],[-6.2,111],[-8,114.5],[-8.5,111],[-7.5,106.5]],
 [[-2,134],[-3,141],[-8,148],[-10,150.5],[-9,143],[-8,138.5],[-4,132.5]],
 [[-12,49.5],[-16,50],[-25,47],[-25,44],[-20,43.5],[-15,47]],
 [[-34.5,173],[-37.5,178.5],[-41.5,175],[-39,174]],
 [[-41,172.5],[-46.5,169],[-46.5,167.5],[-43,170.5]],
 [[63.4,-22],[66.5,-22],[66.3,-15],[64,-14],[63.4,-19]],
 [[10,-85],[9,-79],[8,-77],[9,-84]]
];
var WATER=[
 [[41.2,28],[41.5,33],[42,41.5],[44,38],[45.3,36.5],[46,33],[46.5,31],[44,28.8]],
 [[37,49.5],[40,50],[43,47],[46,49],[47,53],[44,51],[41,52.5],[37.5,54]],
 [[63,-94],[60,-94],[57,-92],[55,-82],[52,-80],[55,-77],[58,-78],[62,-78],[64,-85]]
];
function inPoly(lat,lon,poly){
  var inside=false;
  for(var i=0,j=poly.length-1;i<poly.length;j=i++){
    var yi=poly[i][0],xi=poly[i][1],yj=poly[j][0],xj=poly[j][1];
    if(((yi>lat)!==(yj>lat))&&(lon<(xj-xi)*(lat-yi)/(yj-yi)+xi))inside=!inside;
  }
  return inside;
}
function inFrance(lat,lon){return inPoly(lat,lon,FR)||inPoly(lat,lon,CO);}
function inLand(lat,lon){
  if(lat<-70)return true;
  var i;
  for(i=0;i<WATER.length;i++)if(inPoly(lat,lon,WATER[i]))return false;
  for(i=0;i<LAND.length;i++)if(inPoly(lat,lon,LAND[i]))return true;
  return false;
}

/* ---------- Terre ---------- */
var earth=new THREE.Group();scene.add(earth);
earth.add(new THREE.Mesh(new THREE.SphereGeometry(R,96,96),new THREE.MeshStandardMaterial({color:0x07122a,roughness:.95,metalness:0,emissive:0x061530,emissiveIntensity:.7})));

(function graticule(){
  var pts=[],i,j;
  function add(a,b){pts.push(a.x,a.y,a.z,b.x,b.y,b.z);}
  for(var lat=-75;lat<=75;lat+=15){for(i=0;i<128;i++)add(ll2v(lat,i*360/128,R*1.002),ll2v(lat,(i+1)*360/128,R*1.002));}
  for(var lon=0;lon<360;lon+=15){for(j=0;j<64;j++)add(ll2v(-90+j*180/64,lon,R*1.002),ll2v(-90+(j+1)*180/64,lon,R*1.002));}
  var g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
  earth.add(new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0x35609c,transparent:true,opacity:.1})));
})();

/* lumières de villes */
(function cities(){
  var C=[[51.5,-0.1],[48.86,2.35],[52.5,13.4],[40.4,-3.7],[41.9,12.5],[55.8,37.6],[41,29],[30,31.2],[6.5,3.4],[-1.3,36.8],[-26.2,28],[25.2,55.3],[19.1,72.9],[28.6,77.2],[13.8,100.5],[1.35,103.8],[39.9,116.4],[31.2,121.5],[35.7,139.7],[37.6,127],[-33.9,151.2],[40.7,-74],[34,-118.2],[41.9,-87.6],[19.4,-99.1],[-23.5,-46.6],[-34.6,-58.4],[-12,-77],[4.7,-74.1],[43.7,-79.4],[-33.9,18.4],[33.6,-7.6],[45.5,9.2],[50.1,8.7],[52.4,4.9],[59.3,18.1],[35.7,51.4],[24.7,46.7],[22.3,114.2],[14.6,121],[-6.2,106.8],[23.1,113.3],[29.8,31.3],[9,38.7],[-4.3,15.3],[43.6,1.44],[45.76,4.84]];
  var list=C.map(function(c){return {p:ll2v(c[0],c[1],R*1.01),c:[1,.86,.55],a:.95,s:2.2};});
  earth.add(pointsFrom(list,dotMaterial(.016,2,9,true)));
})();

/* nuages */
var clouds=new THREE.Mesh(new THREE.SphereGeometry(R*1.022,64,64),new THREE.MeshStandardMaterial({map:cloudTex(),transparent:true,depthWrite:false,roughness:1,metalness:0,emissive:0x1a2a4a,emissiveIntensity:.5}));
scene.add(clouds);

/* atmosphère */
var atmoVert='varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}';
scene.add(new THREE.Mesh(new THREE.SphereGeometry(R*1.16,64,64),new THREE.ShaderMaterial({
  vertexShader:atmoVert,
  fragmentShader:'varying vec3 vN;void main(){float i=pow(clamp(0.74-vN.z,0.,1.),3.0)*smoothstep(0.,0.5,-vN.z);gl_FragColor=vec4(vec3(0.3,0.68,1.0)*i*1.1,1.0);}',
  side:THREE.BackSide,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false
})));
scene.add(new THREE.Mesh(new THREE.SphereGeometry(R*1.035,64,64),new THREE.ShaderMaterial({
  vertexShader:atmoVert,
  fragmentShader:'varying vec3 vN;void main(){float i=pow(clamp(1.0-vN.z,0.,1.),3.2);gl_FragColor=vec4(vec3(0.3,0.68,1.0)*i*0.55,1.0);}',
  side:THREE.FrontSide,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false
})));

/* ---------- ceinture de débris ---------- */
var belt=new THREE.Group();scene.add(belt);
(function(){
  var list=[];
  for(var i=0;i<700;i++){
    var a=rnd(0,Math.PI*2),r=rnd(15,20.5),h=(Math.random()+Math.random()-1)*1.2;
    list.push({p:V(Math.cos(a)*r,h,Math.sin(a)*r),c:Math.random()<.2?[1,.6,.35]:[.7,.78,.95],a:rnd(.15,.7),s:rnd(.6,2.2)});
  }
  belt.add(pointsFrom(list,dotMaterial(.05,1,6,true)));
  belt.rotation.x=.38;belt.rotation.z=-.15;
})();

/* ---------- satellites détaillés + station ---------- */
var orbiters=[];
function makeSat(type){
  var g=new THREE.Group();
  var metal=new THREE.MeshStandardMaterial({color:0xece7dc,roughness:.4,metalness:.5});
  var pm=new THREE.MeshStandardMaterial({color:0x1b3f8a,roughness:.3,metalness:.7,emissive:0x0a2250,emissiveIntensity:.8});
  g.add(new THREE.Mesh(new THREE.BoxGeometry(.2,.2,.3),metal));
  var p1=new THREE.Mesh(new THREE.BoxGeometry(.62,.015,.26),pm);p1.position.x=.44;
  var p2=p1.clone();p2.position.x=-.44;g.add(p1,p2);
  var led=new THREE.Mesh(new THREE.SphereGeometry(.03,10,10),new THREE.MeshBasicMaterial({color:0xff5a1f}));led.position.set(0,.12,0);g.add(led);
  if(type===1){
    var dish=new THREE.Mesh(new THREE.SphereGeometry(.14,20,10,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0xdddddd,roughness:.3,metalness:.8,side:THREE.DoubleSide}));
    dish.rotation.x=-Math.PI/2;dish.position.set(0,0,.24);g.add(dish);
  }
  if(type===2){
    var tel=new THREE.Mesh(new THREE.CylinderGeometry(.09,.11,.5,20),new THREE.MeshStandardMaterial({color:0x222a3d,roughness:.5,metalness:.7}));
    tel.rotation.x=Math.PI/2;tel.position.z=-.35;g.add(tel);
  }
  return g;
}
function makeStation(){
  var g=new THREE.Group();
  var metal=new THREE.MeshStandardMaterial({color:0xd9d4c8,roughness:.45,metalness:.5});
  var pm=new THREE.MeshStandardMaterial({color:0xc58a1c,roughness:.35,metalness:.6,emissive:0x3a2200,emissiveIntensity:.7});
  var truss=new THREE.Mesh(new THREE.BoxGeometry(2.8,.05,.05),metal);g.add(truss);
  [[-1.2],[-.85],[.85],[1.2]].forEach(function(p){
    var a=new THREE.Mesh(new THREE.BoxGeometry(.28,.01,.9),pm);a.position.set(p[0],0,.52);g.add(a);
    var b=a.clone();b.position.z=-.52;g.add(b);
  });
  var m1=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,1.1,16),metal);m1.rotation.z=Math.PI/2;g.add(m1);
  var m2=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.7,16),metal);m2.position.set(0,0,.0);m2.rotation.x=Math.PI/2;g.add(m2);
  var m3=new THREE.Mesh(new THREE.SphereGeometry(.12,16,16),metal);g.add(m3);
  g.scale.setScalar(.3);
  return g;
}
function addOrbit(radius,incl,tilt,speed,phase,obj){
  var pivot=new THREE.Group();pivot.rotation.x=incl;pivot.rotation.z=tilt;scene.add(pivot);
  var pts=[];for(var i=0;i<=200;i++){var a=i/200*Math.PI*2;pts.push(V(Math.cos(a)*radius,0,Math.sin(a)*radius));}
  pivot.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x6fd6ff,transparent:true,opacity:.2})));
  var spin=new THREE.Group();pivot.add(spin);
  obj.position.x=radius;spin.add(obj);
  orbiters.push({spin:spin,speed:speed,phase:phase,obj:obj});
}



/* ---------- v4 : satellites réalistes, astéroïdes ---------- */
function mergeColored(parts){ /* parts : [geometry, [r,g,b]] -> BufferGeometry non indexée avec couleurs */
  var pos=[],nor=[],col=[];
  parts.forEach(function(pc){
    var g=pc[0].index?pc[0].toNonIndexed():pc[0];g.computeVertexNormals();
    var P=g.attributes.position.array,N=g.attributes.normal.array;
    for(var i=0;i<P.length;i+=3){pos.push(P[i],P[i+1],P[i+2]);nor.push(N[i],N[i+1],N[i+2]);col.push(pc[1][0],pc[1][1],pc[1][2]);}
  });
  var out=new THREE.BufferGeometry();
  out.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  out.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
  out.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
  return out;
}
function bx(w,h,d,x,y,z){var g=new THREE.BoxGeometry(w,h,d);g.translate(x||0,y||0,z||0);return g;}
/* texture de panneau solaire : cellules */
var panelTex=(function(){
  var c=document.createElement('canvas');c.width=256;c.height=128;var x=c.getContext('2d');
  x.fillStyle='#0b1c44';x.fillRect(0,0,256,128);
  for(var i=0;i<16;i++)for(var j=0;j<8;j++){var g=x.createLinearGradient(i*16,j*16,i*16+16,j*16+16);g.addColorStop(0,'#1d3f8f');g.addColorStop(1,'#0e2457');x.fillStyle=g;x.fillRect(i*16+1,j*16+1,14,14);}
  x.strokeStyle='rgba(180,200,240,.35)';x.lineWidth=2;x.strokeRect(1,1,254,126);
  var t=new THREE.CanvasTexture(c);t.anisotropy=4;return t;
})();
var foilTex=(function(){
  var c=document.createElement('canvas');c.width=128;c.height=128;var x=c.getContext('2d');
  var g=x.createLinearGradient(0,0,128,128);g.addColorStop(0,'#f2c35a');g.addColorStop(.5,'#b9832a');g.addColorStop(1,'#e8b24c');x.fillStyle=g;x.fillRect(0,0,128,128);
  for(var i=0;i<60;i++){x.strokeStyle='rgba(255,240,200,'+Math.random()*.35+')';x.beginPath();x.moveTo(Math.random()*128,Math.random()*128);x.lineTo(Math.random()*128,Math.random()*128);x.stroke();}
  return new THREE.CanvasTexture(c);
})();
var panelMat=new THREE.MeshStandardMaterial({map:panelTex,roughness:.25,metalness:.75,emissive:0x0a1f55,emissiveIntensity:.55,side:THREE.DoubleSide});
var foilMat=new THREE.MeshStandardMaterial({map:foilTex,roughness:.35,metalness:.85,emissive:0x2a1a00,emissiveIntensity:.5});
var whiteMat=new THREE.MeshStandardMaterial({color:0xe9ecf1,roughness:.5,metalness:.3,emissive:0x1a2030,emissiveIntensity:.4});
function panelWing(len,wid,x){var m=new THREE.Mesh(new THREE.BoxGeometry(len,.008,wid),panelMat);m.position.x=x;return m;}

/* satellites nommés (types réels simplifiés) */
var SAT_LABELS=[];
function satGalileo(){ /* navigation : caisson + 2 ailes */
  var g=new THREE.Group();g.add(new THREE.Mesh(new THREE.BoxGeometry(.22,.2,.3),foilMat));
  var boom=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,1.3,6),whiteMat);boom.rotation.z=Math.PI/2;g.add(boom);
  g.add(panelWing(.46,.2,.42),panelWing(.46,.2,-.42));
  var ant=new THREE.Mesh(new THREE.BoxGeometry(.16,.04,.12),whiteMat);ant.position.y=.12;g.add(ant);
  return g;
}
function satTelecom(){ /* géostationnaire : grandes ailes + réflecteurs */
  var g=new THREE.Group();g.add(new THREE.Mesh(new THREE.BoxGeometry(.26,.26,.26),foilMat));
  [-1,1].forEach(function(s){for(var k=0;k<3;k++){var p=panelWing(.24,.22,s*(.24+k*.26));g.add(p);}});
  [-1,1].forEach(function(s){var d=new THREE.Mesh(new THREE.SphereGeometry(.16,24,12,0,Math.PI*2,0,Math.PI/2.6),new THREE.MeshStandardMaterial({color:0xf2f2f2,roughness:.25,metalness:.6,side:THREE.DoubleSide}));d.rotation.x=s*Math.PI/2;d.position.set(0,0,s*.22);g.add(d);});
  return g;
}
function satTelescope(){ /* télescope spatial type Hubble */
  var g=new THREE.Group();
  var tube=new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,.55,28),new THREE.MeshStandardMaterial({color:0xd8dde4,roughness:.25,metalness:.9}));tube.rotation.x=Math.PI/2;g.add(tube);
  var aft=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.2,28),foilMat);aft.rotation.x=Math.PI/2;aft.position.z=-.37;g.add(aft);
  var door=new THREE.Mesh(new THREE.CircleGeometry(.11,24),new THREE.MeshStandardMaterial({color:0x9aa3ad,metalness:.8,roughness:.4,side:THREE.DoubleSide}));door.position.set(0,.09,.3);door.rotation.x=-1.1;g.add(door);
  [-1,1].forEach(function(s){var w=panelWing(.08,.42,s*.2);w.rotation.x=0;w.scale.set(1,1,1);g.add(w);});
  return g;
}
/* ---------- constellation façon Starlink (instances) ---------- */
var starlinkGeo=mergeColored([
  [bx(.056,.007,.028,0,0,0),[.82,.84,.88]],            /* châssis plat */
  [bx(.004,.004,.004,.03,0,0),[.6,.62,.66]],            /* rotule */
  [bx(.15,.0025,.04,.106,.0,0),[.09,.17,.42]],          /* aile solaire unique */
  [bx(.15,.003,.0015,.106,.0005,0),[.55,.62,.8]],       /* nervure */
  [bx(.02,.004,.02,-.012,-.0055,0),[.9,.9,.92]]         /* antennes phased array */
]);
var starlinkMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.35,metalness:.6,emissive:0x0c1830,emissiveIntensity:.5});
/* ---------- astéroïdes (instances de rochers irréguliers) ---------- */
function rockGeo(seed){
  var g=new THREE.IcosahedronGeometry(1,2),P=g.attributes.position,v=new THREE.Vector3();
  for(var i=0;i<P.count;i++){v.fromBufferAttribute(P,i);var n=.75+.25*Math.sin(v.x*3.1+seed)*Math.cos(v.y*2.7-seed)+.12*Math.sin(v.z*7+seed*2);v.multiplyScalar(n);P.setXYZ(i,v.x,v.y*.85,v.z);}
  g.computeVertexNormals();return g;
}
var rockMat=new THREE.MeshStandardMaterial({color:0x8a7f73,roughness:.95,metalness:.05,flatShading:true,emissive:0x15110d,emissiveIntensity:.6});
var ROCKS=[];
[rockGeo(1.3),rockGeo(4.1),rockGeo(7.7)].forEach(function(geo,k){
  var n=90,im=new THREE.InstancedMesh(geo,rockMat,n);im.frustumCulled=false;
  for(var i=0;i<n;i++){
    var a=Math.random()*Math.PI*2,r=15+Math.random()*5.5,h=(Math.random()+Math.random()-1)*1.1,s=.03+Math.pow(Math.random(),3)*.22;
    ROCKS.push({im:im,i:i,a:a,r:r,h:h,s:s,rx:Math.random()*6,ry:Math.random()*6,sp:(.6+Math.random()*.8)*(.02/Math.sqrt(r/15)),spin:Math.random()*1.5});
  }
  belt.add(im);
});
var rq=new THREE.Quaternion(),re=new THREE.Euler(),rs=new THREE.Vector3(),rp=new THREE.Vector3(),rm=new THREE.Matrix4();
function updateRocks(T){
  ROCKS.forEach(function(o){
    var a=o.a+T*o.sp;rp.set(Math.cos(a)*o.r,o.h,Math.sin(a)*o.r);
    re.set(o.rx+T*o.spin*.3,o.ry+T*o.spin*.2,0);rq.setFromEuler(re);rs.setScalar(o.s);
    rm.compose(rp,rq,rs);o.im.setMatrixAt(o.i,rm);
  });
  belt.children.forEach(function(c){if(c.isInstancedMesh)c.instanceMatrix.needsUpdate=true;});
}
addOrbit(7.4,.5,.25,.22,0,satGalileo());
addOrbit(9.2,-.9,-.4,-.15,2,satTelecom());
addOrbit(11.0,1.15,.7,.1,4,satTelescope());
addOrbit(8.3,.1,-.1,.3,1,(function(){var m=new THREE.Mesh(new THREE.SphereGeometry(.05,10,10),new THREE.MeshBasicMaterial({color:0xff5a1f}));return m;})());
addOrbit(6.7,.9,.1,.34,0.6,makeStation());
addOrbit(12.4,-.35,.5,.07,3,satTelecom());
addOrbit(10.2,.25,-.7,-.12,5,satGalileo());

/* ---------- constellation (instances) ---------- */
var CP=8,CPN=26,CN=CP*CPN;
var constMesh=new THREE.InstancedMesh(starlinkGeo,starlinkMat,CN);
constMesh.frustumCulled=false;scene.add(constMesh);
var planes=[];
for(var cp=0;cp<CP;cp++){
  var q=new THREE.Quaternion().setFromEuler(new THREE.Euler(.25+cp*.42,cp*.9,0,'YXZ'));
  planes.push({u:V(1,0,0).applyQuaternion(q),v:V(0,0,1).applyQuaternion(q),r:6.15+(cp%3)*.3,sp:(cp%2?1:-1)*(.16+cp*.012)});
}
var cPos=new Float32Array(CN*3);
var linkGeo=new THREE.BufferGeometry();var linkArr=new Float32Array(CN*6);
linkGeo.setAttribute('position',new THREE.BufferAttribute(linkArr,3));
scene.add(new THREE.LineSegments(linkGeo,new THREE.LineBasicMaterial({color:0x6fd6ff,transparent:true,opacity:.16,depthWrite:false})));
var mtx=new THREE.Matrix4(),slP=new THREE.Vector3(),slT=new THREE.Vector3(),slU=new THREE.Vector3();

/* ---------- épingles des campus + sites de lancement ---------- */
var campuses=[
  {name:'Paris-Ivry',lat:48.81,lon:2.39},
  {name:'Toulouse',lat:43.61,lon:1.40},
  {name:'Lyon',lat:45.77,lon:4.80}
];
var labelsEl=document.getElementById('labels');
var pins=campuses.map(function(c){
  var g=new THREE.Group();
  var pos=ll2v(c.lat,c.lon,R*1.009);
  g.position.copy(pos);g.lookAt(pos.clone().multiplyScalar(2));
  g.add(new THREE.Mesh(new THREE.SphereGeometry(.028,16,16),new THREE.MeshBasicMaterial({color:0xffffff})));
  var ring=new THREE.Mesh(new THREE.RingGeometry(.05,.062,40),new THREE.MeshBasicMaterial({color:0xff5a1f,transparent:true,opacity:.9,side:THREE.DoubleSide,depthWrite:false}));
  g.add(ring);
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0,0,0),V(0,0,.28)]),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.7})));
  earth.add(g);
  var el=document.createElement('div');el.className='pin-label';el.textContent=c.name;labelsEl.appendChild(el);
  return {g:g,ring:ring,el:el,pos:pos,c:c};
});
var ports=[[5.24,-52.77],[28.5,-80.6],[45.96,63.3],[34.7,-120.6],[13.7,80.2]].map(function(p){
  var g=new THREE.Group();var pos=ll2v(p[0],p[1],R*1.009);g.position.copy(pos);g.lookAt(pos.clone().multiplyScalar(2));
  g.add(new THREE.Mesh(new THREE.SphereGeometry(.022,12,12),new THREE.MeshBasicMaterial({color:0x6fd6ff})));
  var ring=new THREE.Mesh(new THREE.RingGeometry(.05,.058,32),new THREE.MeshBasicMaterial({color:0x6fd6ff,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));
  g.add(ring);earth.add(g);return {g:g,ring:ring};
});

/* arcs de liaison avec impulsions */
var arcs=[];
function makeArc(la1,lo1,la2,lo2,h,col){
  var a=ll2v(la1,lo1,1),b=ll2v(la2,lo2,1),om=Math.acos(clamp(a.dot(b),-1,1)),pts=[],N=64;
  for(var i=0;i<=N;i++){
    var t=i/N,s=Math.sin(om);
    var p=a.clone().multiplyScalar(Math.sin((1-t)*om)/s).add(b.clone().multiplyScalar(Math.sin(t*om)/s)).normalize().multiplyScalar(R*1.01+Math.sin(Math.PI*t)*h);
    pts.push(p);
  }
  earth.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:col,transparent:true,opacity:.55})));
  var dot=new THREE.Mesh(new THREE.SphereGeometry(.04,12,12),new THREE.MeshBasicMaterial({color:col}));
  earth.add(dot);arcs.push({pts:pts,dot:dot,off:Math.random()});
}
makeArc(48.81,2.39,43.61,1.40,.35,0xff8a57);
makeArc(48.81,2.39,45.77,4.80,.25,0xff8a57);
makeArc(43.61,1.40,5.24,-52.77,1.2,0x6fd6ff);
makeArc(48.81,2.39,28.5,-80.6,1.6,0x6fd6ff);
makeArc(43.61,1.40,45.96,63.3,1.5,0x6fd6ff);
makeArc(48.81,2.39,35.7,139.7,1.8,0xff8a57);

/* faisceaux sol → satellite */
var beamGeo=new THREE.BufferGeometry();var beamArr=new Float32Array(3*6);
beamGeo.setAttribute('position',new THREE.BufferAttribute(beamArr,3));
var beamCol=new Float32Array(3*6);for(var bi=0;bi<3;bi++){beamCol.set([1,.35,.12,.4,.85,1],bi*6);}
beamGeo.setAttribute('color',new THREE.BufferAttribute(beamCol,3));
var beamMat=new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
scene.add(new THREE.LineSegments(beamGeo,beamMat));

/* ---------- fusée ---------- */
var rocket=new THREE.Group();scene.add(rocket);
var rocketBody=new THREE.Group();rocket.add(rocketBody);
var flameGroup=new THREE.Group();
var flameMats=[];
var boosters=[];
function flame(rad,len,mix){
  var geo=new THREE.ConeGeometry(rad,len,28,1,true);
  var mat=new THREE.ShaderMaterial({
    uniforms:{uT:{value:0},uMix:{value:mix}},
    vertexShader:'varying float vH;uniform float uT;void main(){vH=(position.y+'+(len/2).toFixed(3)+')/'+len.toFixed(3)+';vec3 p=position;p.x+=sin(uT*40.+position.y*6.)*.02*vH;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}',
    fragmentShader:'varying float vH;uniform float uT;uniform float uMix;void main(){float fl=.85+.15*sin(uT*55.+vH*9.);vec3 c=mix(vec3(1.,.97,.85),vec3(1.,.34,.06),clamp(vH*1.4+uMix,0.,1.));float a=pow(1.-vH,1.6)*fl;gl_FragColor=vec4(c*a,1.0);}',
    transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide
  });
  flameMats.push(mat);
  var m=new THREE.Mesh(geo,mat);m.rotation.x=Math.PI;m.position.y=-len/2;
  return m;
}
(function buildRocket(){
  var white=new THREE.MeshStandardMaterial({color:0xece7dc,roughness:.36,metalness:.35});
  var dark=new THREE.MeshStandardMaterial({color:0x141a2b,roughness:.5,metalness:.6});
  var orange=new THREE.MeshStandardMaterial({color:0xff5a1f,roughness:.45,metalness:.2,emissive:0x2c0c00});
  var steel=new THREE.MeshStandardMaterial({color:0x8a93a8,roughness:.3,metalness:.9});
  function cyl(rt,rb,h,y,mat,parent){var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,56),mat);m.position.y=y;(parent||rocketBody).add(m);return m;}
  [[0,0],[.3,0],[-.3,0],[0,.3],[0,-.3]].forEach(function(p){
    var e=new THREE.Mesh(new THREE.CylinderGeometry(.12,.24,.6,24,1,true),new THREE.MeshStandardMaterial({color:0x141a2b,roughness:.4,metalness:.8,side:THREE.DoubleSide}));
    e.position.set(p[0],.3,p[1]);rocketBody.add(e);
  });
  cyl(.66,.72,.5,.8,dark);
  cyl(.62,.66,4.6,3.35,white);
  cyl(.665,.665,.3,4.2,orange);
  cyl(.665,.665,.08,2.4,dark);
  cyl(.665,.665,.04,3.1,dark);cyl(.665,.665,.04,3.7,dark);cyl(.665,.665,.04,4.7,dark);cyl(.665,.665,.04,5.2,dark);
  cyl(.6,.62,.36,5.8,dark);
  cyl(.56,.6,1.7,6.83,white);
  cyl(.565,.565,.12,7.2,orange);
  var prof=[[.56,0],[.585,.5],[.5,1.2],[.38,1.85],[.2,2.5],[0,2.9]].map(function(a){return new THREE.Vector2(a[0],a[1]);});
  var fair=new THREE.Mesh(new THREE.LatheGeometry(prof,56),white);fair.position.y=7.68;rocketBody.add(fair);
  var tip=new THREE.Mesh(new THREE.SphereGeometry(.07,12,12),steel);tip.position.y=10.58;rocketBody.add(tip);
  /* hublots de service */
  for(var h=0;h<3;h++){
    var wdw=new THREE.Mesh(new THREE.CircleGeometry(.07,20),new THREE.MeshBasicMaterial({color:0x6fd6ff}));
    var ang=h*.7-.7;wdw.position.set(Math.sin(ang)*.572,6.5,Math.cos(ang)*.572);wdw.lookAt(wdw.position.clone().multiplyScalar(2));rocketBody.add(wdw);
  }
  /* ailerons */
  var sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(.85,-.55);sh.lineTo(.85,-1.35);sh.lineTo(0,-.95);sh.lineTo(0,0);
  var fg=new THREE.ExtrudeGeometry(sh,{depth:.07,bevelEnabled:false});fg.translate(0,0,-.035);
  for(var i=0;i<4;i++){
    var f=new THREE.Mesh(fg,orange);var pivot=new THREE.Group();pivot.rotation.y=i*Math.PI/2+Math.PI/4;
    f.position.set(.6,2.1,0);pivot.add(f);rocketBody.add(pivot);
  }
  /* propulseurs d'appoint */
  [-1,1].forEach(function(s){
    var b=new THREE.Group();
    cyl(.3,.3,4.2,0,white,b);
    var nose=new THREE.Mesh(new THREE.ConeGeometry(.3,.9,32),orange);nose.position.y=2.55;b.add(nose);
    cyl(.3,.34,.35,-2.2,dark,b);
    cyl(.305,.305,.2,1.2,orange,b);
    var en=new THREE.Mesh(new THREE.CylinderGeometry(.1,.2,.45,20,1,true),new THREE.MeshStandardMaterial({color:0x141a2b,roughness:.4,metalness:.8,side:THREE.DoubleSide}));en.position.y=-2.55;b.add(en);
    var fw=new THREE.Group();fw.position.y=-2.75;fw.add(flame(.28,2.4,0));b.add(fw);
    b.position.set(s*.98,2.9,0);rocketBody.add(b);
    boosters.push({g:b,s:s,fw:fw});
  });
  flameGroup.add(flame(.62,3.8,0));
  flameGroup.add(flame(.34,2.7,-.5));
  flameGroup.position.y=.1;
  rocketBody.add(flameGroup);
  var fl=new THREE.PointLight(0xff6a2a,3,22,2);fl.position.y=-1;rocketBody.add(fl);
  var gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(255,140,60),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:.8}));
  gl.scale.set(6,6,1);gl.position.y=-.4;rocketBody.add(gl);
})();
rocketBody.position.y=-5.2;
rocket.position.set(0,40,0);

/* fumée de l'échappement */
var SN=300;
var smoke={pos:new Float32Array(SN*3),col:new Float32Array(SN*3),al:new Float32Array(SN),sz:new Float32Array(SN),age:new Float32Array(SN).fill(99),vel:new Float32Array(SN*3),idx:0,acc:0};
var smokeGeo=new THREE.BufferGeometry();
smokeGeo.setAttribute('position',new THREE.BufferAttribute(smoke.pos,3));
smokeGeo.setAttribute('aColor',new THREE.BufferAttribute(smoke.col,3));
smokeGeo.setAttribute('aAlpha',new THREE.BufferAttribute(smoke.al,1));
smokeGeo.setAttribute('aSize',new THREE.BufferAttribute(smoke.sz,1));
var smokePts=new THREE.Points(smokeGeo,dotMaterial(1.5,0,170,true));smokePts.frustumCulled=false;scene.add(smokePts);
var tmpV=new THREE.Vector3();

/* ---------- effets liés à la caméra : lignes de vitesse + étoiles filantes ---------- */
var SL=160,slPos=new Float32Array(SL*6),slCol=new Float32Array(SL*6);
for(var s=0;s<SL;s++){
  var ang=rnd(0,Math.PI*2),rad=rnd(1.6,9),z0=-rnd(6,26),x0=Math.cos(ang)*rad,y0=Math.sin(ang)*rad,len=rnd(5,13);
  slPos.set([x0,y0,z0,x0*1.3,y0*1.3,z0-len],s*6);
  slCol.set([.8,.9,1,0,0,0],s*6);
}
var slGeo=new THREE.BufferGeometry();
slGeo.setAttribute('position',new THREE.BufferAttribute(slPos,3));
slGeo.setAttribute('color',new THREE.BufferAttribute(slCol,3));
var slMat=new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
var speedLines=new THREE.LineSegments(slGeo,slMat);speedLines.frustumCulled=false;camFx.add(speedLines);

var meteors=[];
for(var mi=0;mi<6;mi++){
  var mg=new THREE.BufferGeometry();
  mg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6),3));
  mg.setAttribute('color',new THREE.BufferAttribute(new Float32Array([1,.95,.85,0,0,0]),3));
  var mm=new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
  var ml=new THREE.Line(mg,mm);ml.frustumCulled=false;camFx.add(ml);
  meteors.push({line:ml,life:0,dur:1,head:V(0,0,0),dir:V(-1,-.3,0),spd:90});
}
function spawnMeteor(m){
  m.head.set(rnd(-45,45),rnd(10,32),-rnd(70,130));
  m.dir.set(-rnd(.6,1),-rnd(.1,.5),0).normalize();
  m.spd=rnd(90,150);m.dur=rnd(.6,1.2);m.life=m.dur;
}

/* ---------- dimensions ---------- */
function resize(){
  W=window.innerWidth;H=window.innerHeight;DPR=Math.min(window.devicePixelRatio||1,W<700?1.5:2);
  renderer.setPixelRatio(DPR);renderer.setSize(W,H,false);
  camera.aspect=W/H;camera.updateProjectionMatrix();
  dotUniforms.forEach(function(u){u.uScale.value=H/2*DPR;u.uDpr.value=DPR;});
  measure();
}


/* ---------- v3 : Terre texturée 4K, patch Europe HD, France interactive, avions ---------- */
var texLoader=new THREE.TextureLoader();
var maxAniso=renderer.capabilities.getMaxAnisotropy?renderer.capabilities.getMaxAnisotropy():1;
function loadTex(url,cb){texLoader.load(url,function(t){t.anisotropy=Math.min(8,maxAniso);cb(t);},undefined,function(){});}
(function texturedEarth(){
  var base=earth.children[0];
  var m=base.material;
  m.color.set(0x0b1a33);m.emissive.set(0x061530);m.emissiveIntensity=.45;
  var big=(renderer.capabilities.maxTextureSize>=8192)&&window.innerWidth>=900;
  loadTex(big?'assets/earth-8k.webp':'assets/earth-4k.webp',function(t){
    t.wrapS=THREE.RepeatWrapping;t.offset.x=.25;
    m.map=t;m.color.set(0xc4c4c4);m.emissive.set(0xffffff);m.emissiveIntensity=.3;m.roughness=1;m.needsUpdate=true;
    loadTex('assets/earth-emissive.webp',function(e){e.wrapS=THREE.RepeatWrapping;e.offset.x=.25;m.emissiveMap=e;m.needsUpdate=true;});
    loadTex('assets/earth-bump.webp',function(b){b.wrapS=THREE.RepeatWrapping;b.offset.x=.25;m.bumpMap=b;m.bumpScale=.018;m.needsUpdate=true;});
    loadTex('assets/earth-rough.webp',function(r){r.wrapS=THREE.RepeatWrapping;r.offset.x=.25;m.roughnessMap=r;m.needsUpdate=true;});
  });
})();
var D2R=Math.PI/180;
function patchGeo(r,lon0,lon1,latTop,latBot,ws,hs){
  return new THREE.SphereGeometry(r,ws,hs,(lon0+90)*D2R,(lon1-lon0)*D2R,(90-latTop)*D2R,(latTop-latBot)*D2R);
}
function edgeFade(w,h,f){
  var c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d');
  x.fillStyle='#000';x.fillRect(0,0,w,h);
  var gx=x.createLinearGradient(0,0,w,0);gx.addColorStop(0,'#000');gx.addColorStop(f,'#fff');gx.addColorStop(1-f,'#fff');gx.addColorStop(1,'#000');
  x.fillStyle=gx;x.fillRect(0,0,w,h);
  x.globalCompositeOperation='multiply';
  var gy=x.createLinearGradient(0,0,0,h);gy.addColorStop(0,'#000');gy.addColorStop(f*1.3,'#fff');gy.addColorStop(1-f*1.3,'#fff');gy.addColorStop(1,'#000');
  x.fillStyle=gy;x.fillRect(0,0,w,h);
  return new THREE.CanvasTexture(c);
}
var EU=[-11,17,57,35];
(function europeHD(){
  var mat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,metalness:0,transparent:true,alphaMap:edgeFade(256,256,.07),emissive:0xffffff,emissiveIntensity:.18,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,depthWrite:false,opacity:0});
  var mesh=new THREE.Mesh(patchGeo(R*1.0008,EU[0],EU[1],EU[2],EU[3],96,80),mat);mesh.renderOrder=1;
  earth.add(mesh);
  loadTex('assets/europe-hd.webp',function(t){mat.map=t;mat.emissiveMap=t;mat.opacity=1;mat.needsUpdate=true;});
  loadTex('assets/europe-bump.webp',function(b){mat.bumpMap=b;mat.bumpScale=.02;mat.needsUpdate=true;});
})();
/* calque France : remplissage + contour, plus lumineux au survol */
var franceMat=(function(){
  var w=1400,h=Math.round(w*(EU[2]-EU[3])/(EU[1]-EU[0])),c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d');
  function P(la,lo){return [(lo-EU[0])/(EU[1]-EU[0])*w,(EU[2]-la)/(EU[2]-EU[3])*h];}
  function path(poly){x.beginPath();poly.forEach(function(p,i){var q=P(p[0],p[1]);if(i)x.lineTo(q[0],q[1]);else x.moveTo(q[0],q[1]);});x.closePath();}
  [FR,CO].forEach(function(poly){
    path(poly);
    var g=x.createLinearGradient(0,P(51,0)[1],0,P(42,0)[1]);g.addColorStop(0,'rgba(255,120,60,.55)');g.addColorStop(1,'rgba(255,70,20,.35)');
    x.fillStyle=g;x.fill();
    x.lineJoin='round';x.strokeStyle='rgba(255,200,160,.95)';x.lineWidth=3;x.shadowColor='rgba(255,110,50,1)';x.shadowBlur=18;x.stroke();x.shadowBlur=0;
  });
  /* trame de points technique */
  x.globalCompositeOperation='source-atop';x.fillStyle='rgba(255,230,200,.5)';
  for(var yy=0;yy<h;yy+=9)for(var xx=(yy/9%2)*4.5;xx<w;xx+=9){x.beginPath();x.arc(xx,yy,1.1,0,6.283);x.fill();}
  var t=new THREE.CanvasTexture(c);t.anisotropy=Math.min(8,maxAniso);
  var m=new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:.0,blending:THREE.AdditiveBlending,depthWrite:false});
  var mesh=new THREE.Mesh(patchGeo(R*1.0035,EU[0],EU[1],EU[2],EU[3],72,60),m);mesh.renderOrder=2;earth.add(mesh);
  return m;
})();

/* faisceau lumineux au-dessus du campus survolé */
var beamUp=new THREE.Mesh(new THREE.CylinderGeometry(.006,.03,1,16,1,true),new THREE.MeshBasicMaterial({color:0x6fd6ff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
beamUp.geometry.translate(0,.5,0);earth.add(beamUp);
var hoverRing=new THREE.Mesh(new THREE.RingGeometry(.09,.105,48),new THREE.MeshBasicMaterial({color:0x6fd6ff,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));
earth.add(hoverRing);

/* ---------- avions sur des arcs (Paris vers universités partenaires) ---------- */
var HUBS={paris:[48.81,2.39],tls:[43.61,1.40],lyon:[45.77,4.80]};
var ROUTES=[
  ['paris',43.61,1.40],['tls',48.81,2.39],['paris',43.44,5.21],['lyon',48.81,2.39],['tls',5.24,-52.77],
  ['paris',53.08,8.80],['paris',48.15,11.57],['paris',47.81,16.24],['paris',54.69,25.28],['paris',52.07,-0.63],
  ['paris',49.25,-122.98],['paris',19.04,-98.2],['paris',-23.56,-46.73],['paris',32.06,118.8],['paris',34.26,108.94],['paris',-37.81,144.96]
];
function planeModel(){
  var g=new THREE.Group(),white=new THREE.MeshStandardMaterial({color:0xf2f4f8,roughness:.45,metalness:.2,emissive:0x223044,emissiveIntensity:.6});
  var fus=new THREE.Mesh(new THREE.CylinderGeometry(.012,.009,.15,10),white);fus.rotation.x=Math.PI/2;g.add(fus);
  var nose=new THREE.Mesh(new THREE.SphereGeometry(.012,10,8),white);nose.position.z=.075;nose.scale.z=1.6;g.add(nose);
  var wing=new THREE.Mesh(new THREE.BoxGeometry(.17,.003,.034),white);wing.position.z=.005;g.add(wing);
  var stab=new THREE.Mesh(new THREE.BoxGeometry(.06,.003,.018),white);stab.position.z=-.065;g.add(stab);
  var fin=new THREE.Mesh(new THREE.BoxGeometry(.003,.035,.024),new THREE.MeshStandardMaterial({color:0xff5a1f,roughness:.5,emissive:0xff5a1f,emissiveIntensity:.5}));fin.position.set(0,.018,-.065);g.add(fin);
  var nl=new THREE.Mesh(new THREE.SphereGeometry(.006,6,6),new THREE.MeshBasicMaterial({color:0xff3030}));nl.position.set(-.085,0,.005);g.add(nl);
  var nr=new THREE.Mesh(new THREE.SphereGeometry(.006,6,6),new THREE.MeshBasicMaterial({color:0x30ff70}));nr.position.set(.085,0,.005);g.add(nr);
  g.userData.lights=[nl,nr];
  return g;
}
var jets=ROUTES.map(function(r,i){
  var a=HUBS[r[0]],A=ll2v(a[0],a[1],1),B=ll2v(r[1],r[2],1),om=Math.acos(clamp(A.dot(B),-1,1));
  var h=.12+om*.55,N=96,pts=[];
  for(var k=0;k<=N;k++){
    var t=k/N,s=Math.sin(om);
    pts.push(A.clone().multiplyScalar(Math.sin((1-t)*om)/s).add(B.clone().multiplyScalar(Math.sin(t*om)/s)).normalize().multiplyScalar(R*1.012+Math.sin(Math.PI*t)*h));
  }
  var line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineDashedMaterial({color:i<5?0xff8a57:0x6fd6ff,dashSize:.06,gapSize:.05,transparent:true,opacity:.35,depthWrite:false}));
  line.computeLineDistances();earth.add(line);
  var trailN=28,tr=new Float32Array(trailN*3),tc=new Float32Array(trailN*3);
  var tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.BufferAttribute(tr,3));tg.setAttribute('color',new THREE.BufferAttribute(tc,3));
  var trail=new THREE.Line(tg,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
  earth.add(trail);
  var m=planeModel();earth.add(m);
  var land=new THREE.Mesh(new THREE.RingGeometry(.03,.04,24),new THREE.MeshBasicMaterial({color:i<5?0xff8a57:0x6fd6ff,transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false}));
  var lp=ll2v(r[1],r[2],R*1.008);land.position.copy(lp);land.lookAt(lp.clone().multiplyScalar(2));earth.add(land);
  return {pts:pts,m:m,trail:trail,tr:tr,tc:tc,trailN:trailN,line:line,land:land,sp:.05+.25/(1+om*2.2),off:(i*.37)%1,dur:om};
});
var jv1=new THREE.Vector3(),jv2=new THREE.Vector3(),jv3=new THREE.Vector3();
function arcAt(pts,t,out){
  t=clamp(t,0,1);var f=t*(pts.length-1),i=Math.floor(f),j=Math.min(i+1,pts.length-1),k=f-i;
  return out.copy(pts[i]).lerp(pts[j],k);
}
function updateJets(dt,T,vis,ps){
  jets.forEach(function(J,i){
    J.m.visible=J.trail.visible=J.line.visible=J.land.visible=vis>0.01;
    if(!vis)return;
    J.line.material.opacity=.32*vis;
    var t=((T*J.sp+J.off)%1.25)/1.1;
    var shown=t<=1;J.m.visible=shown;
    arcAt(J.pts,t,jv1);arcAt(J.pts,t+.01,jv2);
    J.m.position.copy(jv1);J.m.up.copy(jv1).normalize();jv3.copy(jv2);J.m.lookAt(jv3);
    J.m.scale.setScalar(ps*.55*vis);
    var blink=(T*1.6+i*.3)%1<.12;J.m.userData.lights.forEach(function(l){l.visible=blink;});
    for(var k=0;k<J.trailN;k++){
      var tt=t-k*.006;arcAt(J.pts,tt,jv2);
      J.tr[k*3]=jv2.x;J.tr[k*3+1]=jv2.y;J.tr[k*3+2]=jv2.z;
      var a=(shown&&tt>0)?(1-k/J.trailN)*.85*vis:0;
      J.tc[k*3]=a*(i<5?1:.45);J.tc[k*3+1]=a*(i<5?.62:.85);J.tc[k*3+2]=a*(i<5?.4:1);
    }
    J.trail.geometry.attributes.position.needsUpdate=true;J.trail.geometry.attributes.color.needsUpdate=true;
    var lt=(T*.8+i*.17)%1;J.land.scale.setScalar(ps*(1+lt*1.5));J.land.material.opacity=(1-lt)*.75*vis;
  });
}

/* ---------- survol : France et campus ---------- */
var CAMPUS_INFO=[
  {k:'Campus',n:'Paris-Ivry',rows:[['Candidats Parcoursup 2025','3 439'],['Places (bac général)','220'],['Taux d\'accès calculé','<b>72,7 %</b>',72.7],['Avis Diplomeo','4,3 / 5 (11)'],['Avis L\'Étudiant','4,6 / 5 (23)'],['Programmes','Ingénieur, Bachelor, MSc, MBA']]},
  {k:'Campus',n:'Toulouse',rows:[['Candidats Parcoursup 2025','2 815'],['Places (bac général)','130'],['Taux d\'accès calculé','<b>53,2 %</b>',53.2],['Avis Diplomeo','4,5 / 5 (2)'],['Spécificité','MSc Space Data'],['Diplômés en Occitanie','30 %']]},
  {k:'Campus',n:'Lyon',rows:[['Candidats Parcoursup 2025','2 717'],['Places (bac général)','50'],['Taux d\'accès calculé','<b>56,3 %</b>',56.3],['Ouverture','Rentrée 2025'],['Avis publiés','Pas encore'],['Niveau','1re année du cycle prépa']]}
];
var FRANCE_INFO={k:'Pays · 3 campus',n:'France',rows:[['Étudiants','3 200'],['Diplômés','5 500+'],['En poste à 2 mois','<b>100 %</b>',100],['Salaire médian (promo 2024)','44 000 €'],['L\'Étudiant 2026, aéro','<b>3e</b>'],['Taux d\'accès moyen, 3 campus','61,6 %',61.6]]};
var gcard=document.getElementById('gcard');
function cardHTML(d){
  var h='<div class="gk">'+d.k+'</div><h4>'+d.n+'</h4><dl>';
  d.rows.forEach(function(r){h+='<dt>'+r[0]+'</dt><dd>'+r[1]+'</dd>';if(r[2])h+='<span class="gbar"><i style="--w:'+r[2]+'%"></i></span>';});
  return h+'</dl><p class="gsrc">Sources : rapport public Parcoursup 2025, brochure IPSA 2026, L\'Étudiant, Diplomeo. Clique pour zoomer.</p>';
}
var hov={x:-1,y:-1,ui:true,fine:window.matchMedia&&window.matchMedia('(hover: hover) and (pointer: fine)').matches,state:'',campus:-1,france:false,fr:0};
window.addEventListener('pointermove',function(e){
  hov.x=e.clientX;hov.y=e.clientY;
  hov.ui=!!(e.target.closest&&e.target.closest('.panel,.campus,a,button,input,nav,.rail,.card,details,.pal,.drawer,.marquee,h1,h2,p,.mission,.fc'));
},{passive:true});
window.addEventListener('pointerleave',function(){hov.x=-1;});
var ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),sph=new THREE.Sphere(new THREE.Vector3(),R),hit=new THREE.Vector3();
window.addEventListener('click',function(e){
  if(hov.ui||hov.campus<0)return;
  var b=document.querySelector('.campus[data-i="'+hov.campus+'"]');if(b)b.click();
});
function updateHover(globeW,ps){
  var campus=-1,france=false;
  if(hov.fine&&!hov.ui&&hov.x>=0&&globeW>.3){
    ndc.set(hov.x/W*2-1,-(hov.y/H)*2+1);
    ray.setFromCamera(ndc,camera);
    if(ray.ray.intersectSphere(sph,hit)){
      var la=Math.asin(clamp(hit.y/R,-1,1))/D2R,lo=Math.atan2(hit.x,hit.z)/D2R;
      france=inFrance(la,lo);
      var best=34*34;
      pins.forEach(function(p,i){
        if(p.sx===undefined)return;var dx=p.sx-hov.x,dy=p.sy-hov.y,d=dx*dx+dy*dy;if(d<best){best=d;campus=i;}
      });
    }
  }
  hov.campus=campus;hov.france=france||campus>=0;
  var st=campus>=0?'c'+campus:(france?'fr':'');
  if(st!==hov.state){
    hov.state=st;
    if(st){gcard.innerHTML=cardHTML(campus>=0?CAMPUS_INFO[campus]:FRANCE_INFO);}
    gcard.classList.toggle('on',!!st);
    document.body.style.cursor=campus>=0?'pointer':'';
    [].forEach.call(document.querySelectorAll('.campus'),function(b){b.classList.toggle('hov',+b.getAttribute('data-i')===campus);});
  }
  if(st){
    var cx=hov.x+22,cy=hov.y+18;
    if(cx+310>W)cx=hov.x-322;if(cy+260>H)cy=H-262;
    gcard.style.transform='translate3d('+Math.round(cx)+'px,'+Math.round(cy)+'px,0)';
  }
  hov.fr+=((hov.france?1:0)-hov.fr)*.12;
}

/* ---------- chemin de caméra piloté par le scroll ---------- */
var secs=[].slice.call(document.querySelectorAll('[data-sec]'));
var tops=[],heights=[];
function measure(){
  var y=window.scrollY||window.pageYOffset||0;
  tops=secs.map(function(s){return s.getBoundingClientRect().top+y;});
  heights=secs.map(function(s){return s.offsetHeight;});
}
/* positions de caméra, par identifiant de section (accueil) */
var KEYS={
  top:{p:V(0,40.5,19),t:V(0,40,0),ox:.22},                          /* départ */
  chiffres:{p:V(-5,9,19),t:V(0,1.5,0),ox:.2},                       /* chiffres */
  globe:{p:V(0,0,10),t:V(0,0,0),ox:.2},                             /* campus (dynamique) */
  classements:{p:ll2v(30,22,R+8.6),t:ll2v(40,4,R*.25),ox:-.2},      /* classements : avions */
  rejoindre:{p:V(0,3,30),t:V(0,8,0),ox:0}                           /* orbite */
};
var keys=secs.map(function(s){return KEYS[s.id]||{p:V(0,7,24),t:V(0,0,0),ox:0};});
var campusSel=-1;
var campusPos=V(0,0,10),campusTar=V(0,0,0);
function campusGoal(){
  if(campusSel<0)return {p:ll2v(38.5,2.6,R+2.0),t:ll2v(46.7,2.6,R)};
  var c=campuses[campusSel];
  return {p:ll2v(c.lat-5.5,c.lon,R+.85),t:ll2v(c.lat+.3,c.lon,R)};
}
var g0=campusGoal();campusPos.copy(g0.p);campusTar.copy(g0.t);
var CAMPUS_KEY=Math.max(0,secs.map(function(x){return x.id;}).indexOf('globe'));
keys[CAMPUS_KEY].p=campusPos;keys[CAMPUS_KEY].t=campusTar;

[].slice.call(document.querySelectorAll('.campus')).forEach(function(b,_,all){
  b.addEventListener('click',function(){
    var i=+b.getAttribute('data-i');campusSel=(campusSel===i)?-1:i;
    all.forEach(function(x){x.setAttribute('aria-pressed',String(+x.getAttribute('data-i')===campusSel));});
  });
});

var camPos=keys[0].p.clone(),camTar=keys[0].t.clone(),ox=0;
var mouse={x:0,y:0,sx:0,sy:0};
window.addEventListener('pointermove',function(e){mouse.x=e.clientX/window.innerWidth*2-1;mouse.y=e.clientY/window.innerHeight*2-1;},{passive:true});
window.addEventListener('resize',resize);
window.addEventListener('load',measure);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measure);

var hudSec=document.getElementById('hud-sec'),hudAlt=document.getElementById('hud-alt'),hudBar=document.getElementById('hud-bar'),hudT=document.getElementById('hud-t');
var lastScroll=window.scrollY||0,vel=0,thrust=.8,fovCur=45,roll=0,clock=new THREE.Clock(),T=0,nextMeteor=2;
var lerpV=new THREE.Vector3(),lerpT=new THREE.Vector3();
var proj=new THREE.Vector3(),toCam=new THREE.Vector3(),wp=new THREE.Vector3();

function computeU(){
  var y=window.scrollY||window.pageYOffset||0;
  var mid=y+Math.min(y,window.innerHeight*.5),i=0;
  for(var k=0;k<secs.length;k++){if(mid>=tops[k])i=k;}
  if(i===secs.length-1)return i;
  var frac=clamp((mid-tops[i])/Math.max(1,heights[i]),0,1);
  return i+smooth(.3,1,frac);
}
function emitSmoke(dt){
  smoke.acc+=dt*(60+thrust*30);
  while(smoke.acc>1){
    smoke.acc-=1;
    var i=smoke.idx;smoke.idx=(smoke.idx+1)%SN;
    tmpV.set(rnd(-.2,.2),-.2,rnd(-.2,.2));rocketBody.localToWorld(tmpV);
    smoke.pos[i*3]=tmpV.x;smoke.pos[i*3+1]=tmpV.y;smoke.pos[i*3+2]=tmpV.z;
    smoke.vel[i*3]=rnd(-.5,.5);smoke.vel[i*3+1]=-rnd(2.5,4.5)-thrust*1.2;smoke.vel[i*3+2]=rnd(-.5,.5);
    smoke.age[i]=0;
  }
}
function updateSmoke(dt){
  var life=2.4;
  for(var i=0;i<SN;i++){
    var a=smoke.age[i]+=dt;
    if(a>life){smoke.al[i]=0;continue;}
    smoke.pos[i*3]+=smoke.vel[i*3]*dt;smoke.pos[i*3+1]+=smoke.vel[i*3+1]*dt;smoke.pos[i*3+2]+=smoke.vel[i*3+2]*dt;
    var k=a/life;
    smoke.al[i]=(1-k)*(1-k)*.5*smooth(0,.08,a);
    smoke.sz[i]=.5+k*2.6;
    smoke.col[i*3]=1-k*.45;smoke.col[i*3+1]=.55+k*.1;smoke.col[i*3+2]=.28+k*.5;
  }
  smokeGeo.attributes.position.needsUpdate=true;smokeGeo.attributes.aAlpha.needsUpdate=true;
  smokeGeo.attributes.aSize.needsUpdate=true;smokeGeo.attributes.aColor.needsUpdate=true;
}

function frame(){
  requestAnimationFrame(frame);
  var dt=Math.min(clock.getDelta(),.05);T+=dt;
  var y=window.scrollY||0;
  vel+=((y-lastScroll)/Math.max(dt,.001)-vel)*Math.min(1,dt*6);lastScroll=y;
  var av=Math.abs(vel);

  var u=computeU(),i0=Math.floor(u),i1=Math.min(i0+1,keys.length-1),f=u-i0;
  if(i0>=keys.length-1){i0=keys.length-1;i1=i0;f=0;}

  var gg=campusGoal(),kc=reduce?1:1-Math.exp(-dt*3.2);
  campusPos.lerp(gg.p,kc);campusTar.lerp(gg.t,kc);

  lerpV.copy(keys[i0].p).lerp(keys[i1].p,f);
  lerpT.copy(keys[i0].t).lerp(keys[i1].t,f);
  var oxT=(W>860)?keys[i0].ox+(keys[i1].ox-keys[i0].ox)*f:0;
  var k=reduce?1:1-Math.exp(-dt*4.5);
  camPos.lerp(lerpV,k);camTar.lerp(lerpT,k);ox+=(oxT-ox)*k;

  mouse.sx+=(mouse.x-mouse.sx)*Math.min(1,dt*3);mouse.sy+=(mouse.y-mouse.sy)*Math.min(1,dt*3);
  camera.position.copy(camPos);camera.lookAt(camTar);
  if(!reduce){
    camera.translateX(mouse.sx*.5);camera.translateY(-mouse.sy*.3);
    var shake=u<.9?Math.max(0,thrust-.9)*.05:0;
    if(shake>0){camera.translateX(rnd(-shake,shake));camera.translateY(rnd(-shake,shake));}
    roll+=(clamp(vel/16000,-.09,.09)-roll)*Math.min(1,dt*5);camera.rotateZ(roll);
  }
  var fovT=45+(reduce?0:Math.min(18,av/80));fovCur+=(fovT-fovCur)*Math.min(1,dt*6);camera.fov=fovCur;
  camera.setViewOffset(W,H,-ox*W,0,W,H);
  camera.updateMatrixWorld();

  /* lignes de vitesse + étoiles filantes */
  slMat.opacity=reduce?0:clamp((av-350)/1900,0,.65);
  speedLines.rotation.z+=dt*.15;
  if(!reduce){
    nextMeteor-=dt;
    if(nextMeteor<0){
      for(var mi=0;mi<meteors.length;mi++){if(meteors[mi].life<=0){spawnMeteor(meteors[mi]);break;}}
      nextMeteor=rnd(1.2,3.2);
    }
    meteors.forEach(function(m){
      if(m.life<=0){m.line.material.opacity=0;return;}
      m.life-=dt;m.head.addScaledVector(m.dir,m.spd*dt);
      var a=m.line.geometry.attributes.position.array;
      a[0]=m.head.x;a[1]=m.head.y;a[2]=m.head.z;
      a[3]=m.head.x-m.dir.x*9;a[4]=m.head.y-m.dir.y*9;a[5]=m.head.z;
      m.line.geometry.attributes.position.needsUpdate=true;
      m.line.material.opacity=clamp(m.life/m.dur*1.4,0,1);
    });
  }

  /* fusée et séparation des propulseurs */
  var inHero=u<1.7;
  rocket.visible=inHero;smokePts.visible=inHero;
  if(inHero){
    var launch=120*Math.pow(smooth(.04,1.05,u),1.6);
    rocket.position.y=40+launch+(reduce?0:Math.sin(T*.9)*.12);
    rocket.rotation.z=-.1-smooth(.3,1,u)*.28;
    rocketBody.rotation.y=(reduce?0:T*.35)+mouse.sx*.4;
    rocket.rotation.x=mouse.sy*.05;
    var th=.78+Math.min(1.6,av/700)+(u>.02?.4:0);
    thrust+=(th-thrust)*Math.min(1,dt*5);
    flameGroup.scale.set(1+(thrust-.8)*.12,.55+thrust*.5,1+(thrust-.8)*.12);
    var sep=smooth(.22,.7,u);
    boosters.forEach(function(b){
      b.g.position.x=b.s*(.98+sep*7);
      b.g.position.y=2.9-sep*sep*34;
      b.g.rotation.z=-b.s*sep*1.1;b.g.rotation.x=sep*.8;
      b.fw.scale.setScalar(Math.max(.001,1-sep*1.4));
    });
    flameMats.forEach(function(m){m.uniforms.uT.value=T;});
    rocket.updateMatrixWorld(true);
    if(!reduce)emitSmoke(dt);
    updateSmoke(dt);
  }

  /* astres */
  clouds.rotation.y+=dt*(reduce?0:.012);
  moon.rotation.y+=dt*.01;
  belt.rotation.y+=dt*(reduce?0:.015);
  updateRocks(reduce?0:T);
  orbiters.forEach(function(o){o.spin.rotation.y=o.phase+T*o.speed*(reduce?0:1);o.obj.rotation.y=-o.spin.rotation.y;});

  /* constellation */
  var ci=0;
  for(var p=0;p<CP;p++){
    var pl=planes[p];
    for(var j=0;j<CPN;j++){
      var a=j/CPN*Math.PI*2+T*pl.sp*(reduce?0:1);
      var ca=Math.cos(a)*pl.r,sa=Math.sin(a)*pl.r;
      var x=pl.u.x*ca+pl.v.x*sa,yy=pl.u.y*ca+pl.v.y*sa,z=pl.u.z*ca+pl.v.z*sa;
      cPos[ci*3]=x;cPos[ci*3+1]=yy;cPos[ci*3+2]=z;
      var vx=-pl.u.x*sa+pl.v.x*ca,vy=-pl.u.y*sa+pl.v.y*ca,vz=-pl.u.z*sa+pl.v.z*ca;
      slP.set(x,yy,z);slT.set(x+vx,yy+vy,z+vz);slU.set(x,yy,z).normalize();
      mtx.lookAt(slP,slT,slU);mtx.setPosition(slP);constMesh.setMatrixAt(ci,mtx);ci++;
    }
  }
  constMesh.instanceMatrix.needsUpdate=true;
  for(var q=0;q<CP;q++){
    for(var jj=0;jj<CPN;jj++){
      var s0=q*CPN+jj,s1=q*CPN+((jj+1)%CPN),o=s0*6;
      linkArr[o]=cPos[s0*3];linkArr[o+1]=cPos[s0*3+1];linkArr[o+2]=cPos[s0*3+2];
      linkArr[o+3]=cPos[s1*3];linkArr[o+4]=cPos[s1*3+1];linkArr[o+5]=cPos[s1*3+2];
    }
  }
  linkGeo.attributes.position.needsUpdate=true;

  /* épingles, arcs, faisceaux */
  var camDist=camera.position.length(),ps=clamp(camDist/9,.8,3.2);
  var campusW=clamp(1-Math.abs(u-CAMPUS_KEY)*1.4,0,1);
  pins.forEach(function(p,idx){
    p.g.scale.setScalar(ps);
    var pulse=(T*.9+idx*.33)%1;
    p.ring.scale.setScalar(1+pulse*1.8);p.ring.material.opacity=(1-pulse)*.9;
    toCam.copy(camera.position).sub(p.pos).normalize();
    var facing=p.pos.clone().normalize().dot(toCam);
    proj.copy(p.pos).multiplyScalar(1.004).project(camera);
    var scx=(proj.x*.5+.5)*W,scy=(-proj.y*.5+.5)*H;
    var show=(facing>.08&&proj.z<1)?campusW:0;
    if(facing>.08&&proj.z<1){wp.copy(p.pos).project(camera);p.sx=(wp.x*.5+.5)*W;p.sy=(-wp.y*.5+.5)*H;}else{p.sx=undefined;}
    if(hov.campus===idx){p.g.scale.setScalar(ps*1.7);}
    var sel=campusSel===idx;
    p.el.style.opacity=show*(campusSel<0||sel?1:.45);
    p.el.style.transform='translate('+Math.round(scx+14)+'px,'+Math.round(scy-34)+'px)';
  });
  ports.forEach(function(p,i){p.g.scale.setScalar(ps);var t=(T*.7+i*.21)%1;p.ring.scale.setScalar(1+t*1.6);p.ring.material.opacity=(1-t)*.7;});
  arcs.forEach(function(a){var t=(T*.12+a.off)%1,n=Math.min(a.pts.length-1,Math.floor(t*a.pts.length));a.dot.position.copy(a.pts[n]);a.dot.scale.setScalar(ps*.9);});
  beamMat.opacity=clamp(campusW*.9+.12,0,.95);
  pins.forEach(function(p,idx){
    var best=1e9,bi=0;
    for(var n=0;n<CN;n++){
      var dx=cPos[n*3]-p.pos.x,dy=cPos[n*3+1]-p.pos.y,dz=cPos[n*3+2]-p.pos.z,d=dx*dx+dy*dy+dz*dz;
      if(d<best){best=d;bi=n;}
    }
    var o=idx*6;
    beamArr[o]=p.pos.x;beamArr[o+1]=p.pos.y;beamArr[o+2]=p.pos.z;
    beamArr[o+3]=cPos[bi*3];beamArr[o+4]=cPos[bi*3+1];beamArr[o+5]=cPos[bi*3+2];
  });
  beamGeo.attributes.position.needsUpdate=true;

  /* v3 : avions, survol, calque France */
  var jetVis=clamp((u-(CAMPUS_KEY-.7))/.7,0,1);
  updateJets(dt,reduce?0:T,jetVis,ps);
  updateHover(clamp(u-(CAMPUS_KEY-1.4),0,1),ps);
  var frBase=campusW*.32+(reduce?0:Math.sin(T*2.2)*.06*campusW);
  franceMat.opacity=clamp(frBase+hov.fr*.75,0,1);
  if(hov.campus>=0){
    var hp=pins[hov.campus].pos;beamUp.position.copy(hp);beamUp.quaternion.setFromUnitVectors(V(0,1,0),hp.clone().normalize());
    beamUp.scale.set(ps,ps*(1.4+Math.sin(T*6)*.1),ps);beamUp.material.opacity+=(.75-beamUp.material.opacity)*.15;
    hoverRing.position.copy(hp).multiplyScalar(1.001);hoverRing.lookAt(hp.clone().multiplyScalar(2));
    var hr=(T*1.4)%1;hoverRing.scale.setScalar(ps*(1+hr*2.4));hoverRing.material.opacity=(1-hr)*.9;
  }else{beamUp.material.opacity*=.85;hoverRing.material.opacity*=.85;}

  /* HUD */
  var uc=clamp(u/(secs.length-1),0,1);
  hudAlt.textContent=Math.round(uc*400);
  hudBar.style.width=(uc*100)+'%';
  hudSec.textContent=secs[Math.round(clamp(u,0,secs.length-1))].getAttribute('data-label');
  var sT=Math.floor(T),mm=Math.floor(sT/60),ss=sT%60;
  hudT.textContent=(mm<10?'0':'')+mm+':'+(ss<10?'0':'')+ss;

  renderer.render(scene,camera);
}

resize();
frame();
}
