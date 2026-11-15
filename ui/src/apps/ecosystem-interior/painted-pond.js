// Authored close-view experiment: bounded 2.5D scene with separate animated wildlife.
// This is not a full free-orbit 3D interior. Detail image is independently authored.
import * as T from 'three';
const ASSET='/artifact-assets/2026-11-15-ecosystem-growth-poc/interior-lab/';
const W=28,H=W*941/1672,D=34,scene=new T.Scene();scene.background=new T.Color('#183b2b');
const renderer=new T.WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=T.SRGBColorSpace;document.body.appendChild(renderer.domElement);
const cam=new T.PerspectiveCamera(2*Math.atan(H/(2*D))*180/Math.PI,innerWidth/innerHeight,.1,120),loader=new T.TextureLoader();
const nativeLoad=loader.load.bind(loader);loader.load=(url,...args)=>nativeLoad(window.NATURE_LAB_TEXTURES?.[url]||url,...args);
const load=n=>{const t=loader.load(n);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t;};
const tex=load(ASSET+'pond-detail.webp'),overview=load('/artifact-assets/2026-11-15-ecosystem-growth-poc/cu-nature.webp'),mask=loader.load(ASSET+'pond-mask.png');
let active=true,az=0,el=0,zoom=1.04,tx=0,ty=0,pinch=0,clock=0;const pointers=new Map(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const masses=[[.08,.28,.1,.3,1.3],[.95,.38,.1,.4,1.8],[.46,.15,.2,.16,1.2],[.67,.35,.2,.16,1.0],[.15,.87,.2,.14,1.0],[.9,.91,.15,.1,1.4]];
function depth(u,v){let z=(v-.5)*3.8;for(const[x,y,rx,ry,h]of masses){const d=((u-x)/rx)**2+((v-y)/ry)**2;if(d<1)z+=h*(1-d)**.6;}return z;}
function pos(u,v,extra=0){const z=depth(u,v)+extra;return new T.Vector3((u-.5)*W*(D-z)/D,(.5-v)*H*(D-z)/D,z);}
const geo=new T.PlaneGeometry(W,H,260,146),p=geo.attributes.position,uv=geo.attributes.uv;for(let i=0;i<p.count;i++){const v=pos(uv.getX(i),1-uv.getY(i));p.setXYZ(i,v.x,v.y,v.z);}
const uniforms={time:{value:0},waterMask:{value:mask},enabled:{value:1}};
const mat=new T.MeshBasicMaterial({map:tex,side:T.DoubleSide});mat.onBeforeCompile=s=>{Object.assign(s.uniforms,uniforms);s.fragmentShader='uniform float time; uniform sampler2D waterMask; uniform float enabled;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>',`#ifdef USE_MAP
vec2 q=vMapUv;float a=texture2D(waterMask,q).r*enabled;
q.x+=sin(q.y*170.0+time*1.1)*.0007*a;
q.y+=cos(q.x*120.0-time*.8)*.0004*a;
vec4 sampledDiffuseColor=texture2D(map,q);diffuseColor*=sampledDiffuseColor;
#endif`);};scene.add(new T.Mesh(geo,mat));
const animal=new T.Group();scene.add(animal);const bt=load(ASSET+'beaver.png'),bm=new T.MeshBasicMaterial({map:bt,transparent:true,alphaTest:.08,side:T.DoubleSide,depthWrite:false});const beaver=new T.Mesh(new T.PlaneGeometry(1.7,.59),bm);beaver.position.z=.06;animal.add(beaver);
const wakes=[];for(let i=0;i<6;i++){const curve=new T.EllipseCurve(-.6-i*.18,-.19,.43+i*.14,.075+i*.035,Math.PI*.3,Math.PI*1.7,false,0);const g=new T.BufferGeometry().setFromPoints(curve.getPoints(32));const l=new T.Line(g,new T.LineBasicMaterial({color:'#caf8eb',transparent:true,opacity:.32}));l.position.z=.025;animal.add(l);wakes.push(l);}
const motes=[];for(let i=0;i<12;i++){const m=new T.Mesh(new T.CircleGeometry(.017,7),new T.MeshBasicMaterial({color:'#fff9bd',transparent:true,opacity:.6,depthWrite:false}));const u=.45+Math.random()*.4,v=.1+Math.random()*.28;m.userData={u,v,phase:Math.random()*6.28};scene.add(m);motes.push(m);}
const canvas=renderer.domElement;canvas.style.touchAction='none';
canvas.onpointerdown=e=>{pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});canvas.setPointerCapture(e.pointerId);};
canvas.onpointermove=e=>{const prev=pointers.get(e.pointerId);if(!prev)return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const a=[...pointers.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(pinch)zoom=Math.min(2.5,Math.max(1.04,zoom*d/pinch));pinch=d;return;}if(zoom>1.12){tx=Math.max(-8,Math.min(8,tx-(e.clientX-prev.x)*.018/zoom));ty=Math.max(-4,Math.min(4,ty+(e.clientY-prev.y)*.018/zoom));}else{az=Math.max(-.055,Math.min(.055,az+(e.clientX-prev.x)*.0003));el=Math.max(-.035,Math.min(.035,el+(e.clientY-prev.y)*.0003));}};
canvas.onpointerup=e=>{pointers.delete(e.pointerId);pinch=0;};canvas.onpointercancel=canvas.onpointerup;canvas.onwheel=e=>{e.preventDefault();zoom=Math.max(1.04,Math.min(2.5,zoom*Math.exp(-e.deltaY*.001)));};
function reset(){az=el=tx=ty=0;zoom=1.04;}document.querySelector('#reset').onclick=reset;
function select(v){active=v;reset();mat.map=v?tex:overview;uniforms.enabled.value=v?1:0;mat.needsUpdate=true;document.querySelector('#detail').classList.toggle('selected',v);document.querySelector('#overview').classList.toggle('selected',!v);document.body.classList.remove('entering');void document.body.offsetWidth;document.body.classList.add('entering');document.querySelector('#caption').textContent=v?'New close-view artwork with separate moving wildlife and water.':'Original overview. Select Pond interior to enter newly authored detail.';}
document.querySelector('#overview').onclick=()=>select(false);document.querySelector('#detail').onclick=()=>select(true);
document.querySelector('#life').onclick=()=>{select(true);zoom=1.65;tx=0;ty=-1.0;};
function resize(){cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}window.onresize=resize;
let last=0;function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;if(!reduced)clock+=dt;uniforms.time.value=clock;const effective=Math.max(zoom,cam.aspect/(W/H)*1.04),vh=H/effective,vw=vh*cam.aspect;tx=Math.max(-Math.max(0,(W-vw)/2-.4),Math.min(Math.max(0,(W-vw)/2-.4),tx));ty=Math.max(-Math.max(0,(H-vh)/2-.35),Math.min(Math.max(0,(H-vh)/2-.35),ty));const d=D/effective;cam.position.set(tx+Math.sin(az)*d,ty+Math.sin(el)*d,Math.cos(az)*Math.cos(el)*d);cam.lookAt(tx,ty,0);
// A short natural swim path stays inside the open-water basin, away from lilies and banks.
const u=.45+Math.sin(clock*.075)*.075,v=.66+Math.cos(clock*.12)*.014;animal.position.copy(pos(u,v,.12));animal.visible=active;animal.scale.x=Math.cos(clock*.075)>=0?1:-1;beaver.position.y=Math.sin(clock*2)*.014;wakes.forEach((l,i)=>l.material.opacity=.17+Math.sin(clock*2-i)*.08);motes.forEach((m,i)=>{const a=m.userData;m.position.copy(pos(a.u+Math.sin(clock*.2+a.phase)*.003,a.v+Math.cos(clock*.28+a.phase)*.006,.15));m.visible=active;m.material.opacity=.25+Math.max(0,Math.sin(clock*1.2+i))*.5;});renderer.render(scene,cam);}requestAnimationFrame(frame);
window.__pondStudy={getState:()=>({active,zoom,tx,ty,time:clock,animal:animal.position.toArray()}),select};
