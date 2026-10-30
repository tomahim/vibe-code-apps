import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { stops } from './content.js';

const path = stops.map(s => new THREE.Vector3(...s.position));
const colors = { soil: 0xd4bfa4, grass: 0xb5cab5, pipe: 0x266b73, water: 0x73d7df, cream: 0xf8ebd4, roof: 0xd77e60 };
export default function CityScene({ selected, cutaway, playing, height, onSelect, onEnd }) {
  const host = useRef(null), state = useRef({ selected, cutaway, playing, height, onSelect, onEnd });
  state.current = { selected, cutaway, playing, height, onSelect, onEnd };
  const [failed, setFailed] = useState(false), [turn, setTurn] = useState(0);
  const rotation = useRef(0); rotation.current = turn;
  useEffect(() => {
    const el = host.current;
    let renderer, frame, observer, disposed = false;
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0xe9eee4);
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
    const resources = [];
    function mesh(geo, color, x, y, z, parent = scene) {
      const mat = new THREE.MeshStandardMaterial({ color, roughness: .78 });
      const obj = new THREE.Mesh(geo, mat); obj.position.set(x, y, z); parent.add(obj); resources.push(geo, mat); return obj;
    }
    const box = (w,h,d,c,x,y,z,p) => mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,p);
    const cylinder = (r,h,c,x,y,z,p) => mesh(new THREE.CylinderGeometry(r,r,h,32),c,x,y,z,p);
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); }
    catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6)); renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0xe9eee4); el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', 'Interactive cutaway city. Use the five stop buttons below to explore the same journey.');
    renderer.domElement.setAttribute('role', 'img');
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8c9c8c, 2.5));
    const sun = new THREE.DirectionalLight(0xffefd8, 3.2); sun.position.set(-4,10,8); scene.add(sun);
    const island = new THREE.Group(); scene.add(island);
    box(13.2,1.1,3.65,colors.soil,0,-.8,-.825,island);
    box(13.2,.48,1.65,colors.soil,0,-1.11,1.825,island);
    box(13.3,.13,5.4,0xc4ad93,0,-1.42,0,island);
    const surface = new THREE.Group(); island.add(surface);
    // Front verge moves down to reveal the distribution pipe, while buildings remain readable.
    const verge = box(13.2,.62,1.35,colors.grass,0,-.25,1.95,surface);
    box(13.2,.16,4,colors.grass,0,-.14,-.65,surface);
    box(12,.035,.65,0xdfd9c6,0,-.03,1.05,surface);
    for (let i=-5;i<6;i++) box(.38,.015,.035,0xfff8df,i,.002,1.05,surface);
    // Reservoir, terraced banks, treatment basins.
    cylinder(1.35,.25,0x9cb3a6,-5,.02,-.35,island);
    cylinder(1.15,.12,colors.water,-5,.18,-.35,island);
    for (let i=0;i<3;i++) { cylinder(.48,.55,0xe3e2d3,-2.9+i*.7,.22,-.5,island); cylinder(.4,.04, i===0?0x9db49b:colors.water,-2.9+i*.7,.51,-.5,island); }
    box(1.7,.65,.85,colors.cream,-2.1,.3,-1.6,island);
    box(1.85,.12,1,colors.roof,-2.1,.67,-1.6,island);
    const tower = new THREE.Group(); tower.position.set(.6,0,-.8); island.add(tower);
    const legs=[];
    for(const x of [-.43,.43]) for(const z of [-.43,.43]) legs.push(box(.09,2,.09,0x5b7b70,x,1,z,tower));
    const tank = cylinder(.7,.72,colors.cream,0,2.45,0,tower);
    const lid = mesh(new THREE.ConeGeometry(.74,.28,32),colors.roof,0,2.95,0,tower);
    const waterBand = cylinder(.704,.12,0x70bac2,0,2.42,0,tower);
    for(const [x,z,h] of [[3,-1,1.3],[4.5,-1.2,1.7],[5,.35,1.05]]) {
      box(.95,h,.85,colors.cream,x,h/2,z,island);
      const roof = mesh(new THREE.ConeGeometry(.85,.55,4),colors.roof,x,h+.25,z,island); roof.rotation.y=Math.PI/4;
      for(const wx of [-.22,.22]) box(.16,.25,.018,0x6c9290,x+wx,h*.64,z+.433,island);
      box(.22,.43,.02,0x4d7772,x,.215,z+.44,island);
    }
    for (const [x,z] of [[-5.8,-1.8],[-3.7,-1.85],[1.8,-1.8],[5.8,-1.7],[2.2,.35]]) {
      cylinder(.06,.65,0x9f8870,x,.3,z,island);
      mesh(new THREE.IcosahedronGeometry(.43,0),0x739b80,x,.95,z,island);
    }
    // Real 3D pipe route beneath the street; no CSS perspective stand-in.
    const route = [new THREE.Vector3(-5,-.57,1.55),new THREE.Vector3(-2.2,-.57,1.55),new THREE.Vector3(.6,-.57,1.55),new THREE.Vector3(3,-.57,1.55),new THREE.Vector3(5,-.57,1.55)];
    const curve = new THREE.CatmullRomCurve3(route);
    mesh(new THREE.TubeGeometry(curve,70,.105,10,false),colors.pipe,0,0,0,island);
    const pipeDrops=[];
    for(let i=0;i<16;i++) pipeDrops.push(mesh(new THREE.SphereGeometry(.062,10,8),0xb3f8ef,0,0,0,island));
    const markerGeo = new THREE.SphereGeometry(.21,24,16);
    const markerMat = new THREE.MeshStandardMaterial({color:0x0e737f,emissive:0x166d76,emissiveIntensity:.25,roughness:.25}); resources.push(markerGeo,markerMat);
    const drop = new THREE.Mesh(markerGeo,markerMat); drop.scale.set(1,1.32,1); island.add(drop);
    const tip = mesh(new THREE.ConeGeometry(.18,.3,20),0x0e737f,0,.23,0,drop);
    const hotspots=stops.map((s,i) => {const hit=mesh(new THREE.SphereGeometry(.43,12,8),0xffffff,...s.position,island); hit.material.transparent=true; hit.material.opacity=0; hit.userData.index=i;return hit;});
    const ring=mesh(new THREE.TorusGeometry(.37,.035,8,40),0xfef8e9,0,0,0,island);ring.rotation.x=-Math.PI/2;
    const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
    function click(e){ const rect=el.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(hotspots)[0];if(hit)state.current.onSelect(hit.object.userData.index); }
    function lost(e){ e.preventDefault();setFailed(true); }
    renderer.domElement.addEventListener('click',click);renderer.domElement.addEventListener('webglcontextlost',lost);
    function resize(){const w=el.clientWidth,h=el.clientHeight; renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();} observer=new ResizeObserver(resize);observer.observe(el);resize();
    let last=0,elapsed=0,journey=0,wasPlaying=false;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function draw(time){if(disposed)return;frame=requestAnimationFrame(draw);const dt=Math.min((time-last)/1000,.05);last=time;elapsed+=dt;
      const s=state.current;const angle=rotation.current;
      const dist=camera.aspect>2?11.5:camera.aspect<1?23:18;
      camera.position.set(Math.sin(angle)*dist,dist*.63,Math.cos(angle)*dist);camera.lookAt(0,.35,0);
      verge.position.y=THREE.MathUtils.lerp(verge.position.y,s.cutaway?-.95:-.25,.12);verge.material.transparent=true;verge.material.opacity=s.cutaway?.14:1;
      const towerScale=.65+s.height/45;tank.position.y=2.45*towerScale;lid.position.y=tank.position.y+.5;waterBand.position.y=tank.position.y-.03;
      legs.forEach(l=>{l.scale.y=towerScale;l.position.y=towerScale;});
      if(s.playing&&!wasPlaying)journey=s.selected;
      if(s.playing){journey+=dt*.27;const n=Math.min(4,Math.floor(journey));if(n!==s.selected)s.onSelect(n);if(journey>=4.8){s.onEnd();journey=4;}}
      wasPlaying=s.playing;
      const target=path[s.selected].clone();if(s.selected===2)target.y=tank.position.y+.7;
      if(s.selected===3)target.set(2.7,s.cutaway?-.25:.65,1.55);
      drop.position.lerp(target,.08);drop.position.y+=reduced?0:Math.sin(elapsed*2.6)*.0015;
      ring.position.copy(drop.position);ring.position.y-=.35;
      pipeDrops.forEach((p,i)=>{p.position.copy(curve.getPointAt(((reduced?0:elapsed*.085)+i/16)%1));p.position.y+=.11;p.visible=s.cutaway;});
      renderer.render(scene,camera);
    } frame=requestAnimationFrame(draw);
    return ()=>{disposed=true;cancelAnimationFrame(frame);observer?.disconnect();renderer.domElement.removeEventListener('click',click);renderer.domElement.removeEventListener('webglcontextlost',lost);resources.forEach(r=>r.dispose());renderer.dispose();renderer.domElement.remove();};
  }, []);
  return <div className="ld-scene-wrap">
    <div className="ld-scene" ref={host} hidden={failed}/>
    {failed&&<div className="ld-fallback"><span>◈</span><h3>The journey still works.</h3><p>3D is unavailable on this device. Use the stops below to explore every explanation and experiment.</p></div>}
    <div className="ld-scene-note">{cutaway?'BELOW THE SURFACE':'A SMALL CITY, A BIG JOURNEY'}<span>Illustrative model · not to scale</span></div>
    {!failed&&<div className="ld-camera"><button aria-label="Rotate city left" onClick={()=>setTurn(v=>v-.3)}>↶</button><button aria-label="Reset city view" onClick={()=>setTurn(0)}>⌂</button><button aria-label="Rotate city right" onClick={()=>setTurn(v=>v+.3)}>↷</button></div>}
  </div>;
}
