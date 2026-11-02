import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { stops } from './content.js';

const path = stops.map(s => new THREE.Vector3(...s.position));
const colors = { soil: 0xd4bfa4, grass: 0xb5cab5, pipe: 0x266b73, water: 0x73d7df, cream: 0xf8ebd4, roof: 0xd77e60 };
export default function CityScene({ selected, cutaway, height, onSelect }) {
  const [closeup, setCloseup] = useState(false), [travel, setTravel] = useState(35);
  const immersion = useRef({closeup,travel}); immersion.current={closeup,travel};
  const drag = useRef(null);
  function startTravel(event) {
    if (!closeup || (event.pointerType === 'mouse' && event.button !== 0)) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, value: travel, active: false };
  }
  function moveTravel(event) {
    const gesture = drag.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    if (!gesture.active) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { drag.current = null; return; }
      if (Math.abs(dx) < 8) return;
      gesture.active = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    setTravel(Math.max(0, Math.min(100, Math.round(gesture.value + dx / event.currentTarget.clientWidth * 100))));
  }
  function endTravel(event) {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  const host = useRef(null), state = useRef({ selected, cutaway, height, onSelect });
  state.current = { selected, cutaway, height, onSelect };
  const [paused, setPaused] = useState(false), [systemReduced, setSystemReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const pause = useRef(false); pause.current = paused;
  const [failed, setFailed] = useState(false), [turn, setTurn] = useState(0), [dusk, setDusk] = useState(false);
  const invalidate = useRef(() => {}), atmosphere = useRef(false); atmosphere.current = dusk;
  useEffect(() => { invalidate.current(); }, [selected, cutaway, height, turn, dusk, paused, closeup, travel]);
  const rotation = useRef(0); rotation.current = turn;
  useEffect(() => {
    const el = host.current;
    let renderer, frame = null, observer, intersection, disposed = false, visible = true, contextLost = false;
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0xe9eee4);
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
    const resources = [];
    function mesh(geo, color, x, y, z, parent = scene) {
      const mat = new THREE.MeshStandardMaterial({ color, roughness: .78 });
      const obj = new THREE.Mesh(geo, mat); obj.position.set(x, y, z); parent.add(obj); resources.push(geo, mat); return obj;
    }
    const box = (w,h,d,c,x,y,z,p) => mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,p);
    const cylinder = (r,h,c,x,y,z,p) => mesh(new THREE.CylinderGeometry(r,r,h,32),c,x,y,z,p);
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true }); }
    catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6)); renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0xe9eee4); el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', 'Interactive cutaway city. Use the five stop buttons below to explore the same journey.');
    renderer.domElement.setAttribute('role', 'img');
    const sky = new THREE.HemisphereLight(0xffffff, 0x8c9c8c, 2.5); scene.add(sky);
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
    const windows = [];
    for(const [x,z,h] of [[3,-1,1.3],[4.5,-1.2,1.7],[5,.35,1.05]]) {
      box(.95,h,.85,colors.cream,x,h/2,z,island);
      const roof = mesh(new THREE.ConeGeometry(.85,.55,4),colors.roof,x,h+.25,z,island); roof.rotation.y=Math.PI/4;
      for(const wx of [-.22,.22]) windows.push(box(.16,.25,.018,0x6c9290,x+wx,h*.64,z+.433,island));
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
    const branches = new THREE.Group(); island.add(branches);
    const branchRoutes = [
      [[-5,.2,-.35],[-5,-.57,-.35],[-5,-.57,1.55]],
      [[-2.2,.5,-.5],[-2.2,-.57,-.5],[-2.2,-.57,1.55]],
      [[.6,2.45,-.8],[.6,-.57,-.8],[.6,-.57,1.55]],
      [[3,-.57,1.55],[3,-.57,-1],[3,.12,-1]],
      [[4.5,-.57,1.55],[4.5,-.57,-1.2],[4.5,.12,-1.2]],
      [[5,-.57,1.55],[5,-.57,.35],[5,.12,.35]],
    ];
    branchRoutes.forEach(points => {
      const c = new THREE.CurvePath();
      for(let i=1;i<points.length;i++) c.add(new THREE.LineCurve3(new THREE.Vector3(...points[i-1]),new THREE.Vector3(...points[i])));
      mesh(new THREE.TubeGeometry(c,24,.065,8,false),0x40868a,0,0,0,branches);
    });
    // An open-topped fictional pipe section, viewed at water level.
    const pipeWorld = new THREE.Group(); scene.add(pipeWorld);
    const shellGeo = new THREE.BufferGeometry(), vertices=[], indices=[];
    for(let z=0;z<=1;z++)for(let a=0;a<=48;a++){
      const theta=Math.PI+a/48*Math.PI;
      vertices.push(Math.cos(theta)*2.4,Math.sin(theta)*2.4,-14+z*28);
    }
    for(let a=0;a<48;a++){const b=a+49;indices.push(a,b,a+1,b,b+1,a+1);}
    shellGeo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));shellGeo.setIndex(indices);shellGeo.computeVertexNormals();
    const shell=mesh(shellGeo,0x346d76,0,0,0,pipeWorld);shell.material.side=THREE.DoubleSide;
    for(let z=-12;z<=12;z+=3){const rib=mesh(new THREE.TorusGeometry(2.38,.045,8,48,Math.PI),0x9ec2bb,0,0,z,pipeWorld);rib.rotation.z=Math.PI;}
    const ribbon=box(3.6,.025,28,0x4fa9b6,0,-1.5,0,pipeWorld);ribbon.material.transparent=true;ribbon.material.opacity=.6;
    const nearDrops=[];
    for(let i=0;i<30;i++){const bead=mesh(new THREE.SphereGeometry(.10+(i%3)*.035,12,8),0xb9fff1,((i*7)%11-5)*.27,-1.2+(i%4)*.12,0,pipeWorld);nearDrops.push(bead);}
    const markerGeo = new THREE.SphereGeometry(.21,24,16);
    const markerMat = new THREE.MeshStandardMaterial({color:0x0e737f,emissive:0x166d76,emissiveIntensity:.25,roughness:.25}); resources.push(markerGeo,markerMat);
    const drop = new THREE.Mesh(markerGeo,markerMat); drop.scale.set(1,1.32,1); island.add(drop);
    const tip = mesh(new THREE.ConeGeometry(.18,.3,20),0x0e737f,0,.23,0,drop);
    const hotspots=stops.map((s,i) => {const hit=mesh(new THREE.SphereGeometry(.43,12,8),0xffffff,...s.position,island); hit.material.transparent=true; hit.material.opacity=0; hit.userData.index=i;return hit;});
    const ring=mesh(new THREE.TorusGeometry(.37,.035,8,40),0xfef8e9,0,0,0,island);ring.rotation.x=-Math.PI/2;
    const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
    function click(e){ if(immersion.current.closeup)return;const rect=el.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(hotspots)[0];if(hit){state.current.onSelect(hit.object.userData.index);}  }
    function lost(e){ e.preventDefault();contextLost=true;cancelAnimationFrame(frame);frame=null;setFailed(true); }
    renderer.domElement.addEventListener('click',click);renderer.domElement.addEventListener('webglcontextlost',lost);
    let last=0,elapsed=0;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced=motion.matches;
    function requestDraw(){if(!disposed&&!contextLost&&visible&&!document.hidden&&frame===null)frame=requestAnimationFrame(draw);}
    invalidate.current=requestDraw;
    function resize(){const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();requestDraw();}
    observer=new ResizeObserver(resize);observer.observe(el);resize();
    function visibility(){if(document.hidden||!visible){cancelAnimationFrame(frame);frame=null;last=0;}else requestDraw();}
    intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visibility();},{rootMargin:'80px'});intersection.observe(el);
    document.addEventListener('visibilitychange',visibility);
    function motionChange(){reduced=motion.matches;setSystemReduced(reduced);requestDraw();}motion.addEventListener('change',motionChange);
    function draw(time){frame=null;if(disposed||contextLost||!visible||document.hidden)return;const dt=last?Math.min((time-last)/1000,.05):0;last=time;elapsed+=dt;
      const s=state.current;const still=reduced||pause.current;const angle=rotation.current;branches.visible=s.cutaway;
      const night=atmosphere.current;
      scene.background.set(night?0x263c50:0xe9eee4);
      sky.color.set(night?0x9cb9df:0xffffff);sky.groundColor.set(night?0x7f887d:0x8c9c8c);sky.intensity=night?1.5:2.5;
      sun.color.set(night?0xf6c397:0xffefd8);sun.intensity=night?1.8:3.2;
      windows.forEach(w=>{w.material.color.set(night?0xffd99b:0x6c9290);w.material.emissive.set(night?0xf6aa53:0x000000);w.material.emissiveIntensity=night?.7:0;});
      markerMat.color.set(night?0x72e1de:0x0e737f);markerMat.emissiveIntensity=night?.6:.25;
      const dist=camera.aspect>2?11.5:camera.aspect<1?23:18;
      camera.position.set(Math.sin(angle)*dist,dist*.63,Math.cos(angle)*dist);camera.lookAt(0,.35,0);
      verge.position.y=still?(s.cutaway?-.95:-.25):THREE.MathUtils.lerp(verge.position.y,s.cutaway?-.95:-.25,.12);verge.material.transparent=true;verge.material.opacity=s.cutaway?.14:1;
      const towerScale=.65+s.height/45;tank.position.y=2.45*towerScale;lid.position.y=tank.position.y+.5;waterBand.position.y=tank.position.y-.03;
      legs.forEach(l=>{l.scale.y=towerScale;l.position.y=towerScale;});
      hotspots[2].position.y=tank.position.y+.35;hotspots[3].position.set(2.7,s.cutaway?-.25:.65,1.55);
      const target=path[s.selected].clone();if(s.selected===2)target.y=tank.position.y+.7;
      if(s.selected===3)target.set(2.7,s.cutaway?-.25:.65,1.55);
      if(still)drop.position.copy(target);else drop.position.lerp(target,.08);drop.position.y+=still?0:Math.sin(elapsed*2.6)*.0015;
      ring.position.copy(drop.position);ring.position.y-=.35;
      pipeDrops.forEach((p,i)=>{p.position.copy(curve.getPointAt(((still?0:elapsed*.085)+i/16)%1));p.position.y+=.11;p.visible=s.cutaway;});
      const view=immersion.current;
      island.visible=!view.closeup;pipeWorld.visible=view.closeup;
      if(view.closeup){
        scene.background.set(night?0x142d40:0xc2dfe0);
        const advance=view.travel/100*10;
        camera.position.set(Math.sin(angle)*.75,.05,10-advance);camera.lookAt(Math.sin(angle)*.35,-.8,-12);
        nearDrops.forEach((p,i)=>{p.position.z=14-((i*28/30+(still?0:elapsed*2)+advance)%28);});
      }
      renderer.render(scene,camera);
      if(!still)requestDraw();
    } requestDraw();
    return ()=>{disposed=true;cancelAnimationFrame(frame);observer?.disconnect();intersection?.disconnect();document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',motionChange);invalidate.current=()=>{};renderer.domElement.removeEventListener('click',click);renderer.domElement.removeEventListener('webglcontextlost',lost);resources.forEach(r=>r.dispose());renderer.dispose();renderer.domElement.remove();};
  }, []);
  return <><div className={`ld-scene-wrap${dusk ? ' ld-dusk' : ''}${closeup ? ' ld-closeup' : ''}`}>
    <div className="ld-scene" ref={host} hidden={failed} onPointerDown={startTravel} onPointerMove={moveTravel} onPointerUp={endTravel} onPointerCancel={endTravel} onLostPointerCapture={()=>{drag.current=null;}}/>
    {failed&&<div className="ld-fallback"><span>◈</span><h3>The journey still works.</h3><p>3D is unavailable on this device. Use the stops below to explore every explanation and experiment.</p></div>}
    <div className="ld-scene-note">{closeup?'AT WATER LEVEL':cutaway?'BELOW THE SURFACE':'A SMALL CITY, A BIG JOURNEY'}<span>Illustrative model · not to scale</span></div>
    {!failed&&<><button className="ld-atmosphere" aria-pressed={dusk} onClick={()=>setDusk(v=>!v)}>{dusk?'☾ Dusk view':'☀ Daylight view'}</button><div className="ld-camera"><button aria-label="Rotate city left" onClick={()=>setTurn(v=>v-.3)}>↶</button><button aria-label="Reset city view" onClick={()=>setTurn(0)}>⌂</button><button aria-label="Rotate city right" onClick={()=>setTurn(v=>v+.3)}>↷</button></div></>}
  </div>{!failed&&<div className="ld-immersion-controls"><button aria-pressed={closeup} onClick={()=>setCloseup(v=>!v)}>{closeup?'Return to city overview':'Get close to the flow'}</button>{closeup&&<div><label htmlFor="ld-travel">Move through the pipe <output>{travel}%</output></label><input id="ld-travel" type="range" min="0" max="100" value={travel} onChange={e=>setTravel(Number(e.target.value))}/><p>An open-topped fictional pipe at water level. Swipe sideways on the water or use the slider to travel. Scroll vertically to keep reading. Beads suggest movement, not measured speed, pressure or a water-quality view. The story stops below still control the city journey.</p></div>}</div>}{!failed&&<div className="ld-motion-controls"><button aria-pressed={paused} disabled={systemReduced} onClick={()=>setPaused(v=>!v)}>{systemReduced ? 'System reduced motion' : paused ? 'Resume city motion' : 'Pause city motion'}</button><p>{systemReduced ? 'Your device requests reduced motion. The city stays still.' : paused ? 'City motion paused. You can still explore each stop.' : 'Pause decorative city motion while you read.'} Journey playback is controlled separately below.</p></div>}</>;
}
