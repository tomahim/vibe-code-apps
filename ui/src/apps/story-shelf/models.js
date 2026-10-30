import * as THREE from 'three';

// Original low-poly paper sculptures, shared by the paper theatre and the immersive book.
export function buildModel(kind, page) {
  const model = new THREE.Group();
  function mesh(geometry, color, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: .88, flatShading: true }));
    m.position.set(x,y,z); m.castShadow = true; m.receiveShadow = true; model.add(m); return m;
  }
  const box = (w,h,d,c,x,y,z) => mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z);
  mesh(new THREE.CylinderGeometry(2.3,2.4,.12,64),0xc6b489,0,-.1,0);
  if (kind === 'mountain') {
    for (const [x,z,h,r] of [[0,0,3,1.3],[-1.2,-.6,2.1,1],[1.15,-.7,2.4,1.1]]) {
      mesh(new THREE.ConeGeometry(r,h,5),0x647d82,x,h/2,z);
      mesh(new THREE.ConeGeometry(r*.39,h*.36,5),0xf8f1da,x,h*.82,z);
    }
    mesh(new THREE.CylinderGeometry(1.25,1.25,.04,48),0x69a6b1,0,0,-.0).scale.set(1,1,.65);
    for(let i=0;i<7;i++) {
      const x=-1.9+i*.55, z=1.1+Math.sin(i)*.2;
      mesh(new THREE.ConeGeometry(.19,.65,5),0x375f4e,x,.34,z);
    }
  } else if(kind === 'tree') {
    box(.35,2,.35,0x7d5434,0,.9,0);
    for(let i=0;i<11;i++) {
      const a=i*2.4, r=i<3?.25:.8;
      mesh(new THREE.IcosahedronGeometry(.7+(i%3)*.12,1), [0x57734b,0x789156,0x9ca861][i%3],Math.cos(a)*r,1.65+Math.sin(i*1.7)*.5,Math.sin(a)*r);
    }
    for(let i=0;i<5;i++) mesh(new THREE.SphereGeometry(.09,8,6),0xc7954b,Math.sin(i*3)*1.8,.05,Math.cos(i*3)*1.8);
  } else if(kind === 'press') {
    box(2,.16,1.6,0x65442c,0,.05,0);
    box(.26,2.7,.35,0x805534,-.8,1.35,0); box(.26,2.7,.35,0x805534,.8,1.35,0);
    box(2,.3,.5,0x65442c,0,2.6,0); box(1.5,.22,1.4,0x996f48,0,.65,0);
    box(1.3,.06,1.1,0xfff1c9,0,.82,.1);
    mesh(new THREE.CylinderGeometry(.12,.12,1.4,16),0x443a30,0,1.85,0);
    for(let i=0;i<14;i++) { const ring=mesh(new THREE.TorusGeometry(.14,.035,5,16),0xb79b6b,0,1.25+i*.08,0); ring.rotation.x=Math.PI/2; }
    box(1.35,.17,1.1,0x65442c,0,1.1,0);
    box(2,.09,.09,0x7c5735,.25,2.03,0);
    for(let i=0;i<8;i++) box(.16,.08,.12,0x4c5051,-.45+(i%4)*.25,.88,-.2+Math.floor(i/4)*.26);
  } else {
    const points=[];
    for(let i=0;i<170;i++) { const a=i/169*Math.PI*5.5; const r=.12+a*.085; points.push(new THREE.Vector3(Math.cos(a)*r,1.25+Math.sin(a)*r,0)); }
    mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),190,.14,8,false),0xd6ac67);
    for(let i=3;i<points.length;i+=6) { const pt=points[i]; const m=mesh(new THREE.SphereGeometry(.17,8,6),0xa97a42,pt.x,pt.y,0); m.scale.set(.5,1,1); m.rotation.z=i/169*Math.PI*5.5; }
    mesh(new THREE.BoxGeometry(3.6,.25,1.9),0x77868a,0,.03,0);
  }
  if(kind === 'tree' && page < 2) {
    // A seed and seedling grow into the full oak on later pages.
    const oak = model.children.slice(1); oak.forEach(o=>o.visible=false);
    mesh(new THREE.SphereGeometry(.55,20,12),0xa47443,0,.5,0).scale.set(.8,1.2,.8);
    mesh(new THREE.SphereGeometry(.48,16,10,0,Math.PI*2,0,Math.PI*.5),0x665036,0,.82,0);
    if(page===1) {
      const stem=mesh(new THREE.CylinderGeometry(.045,.06,1.1,10),0x6f8b48,0,1.35,0);
      for(const side of [-1,1]) { const leaf=mesh(new THREE.SphereGeometry(.38,10,6),0x74994d,side*.28,1.75,0);leaf.scale.set(1,.18,.5);leaf.rotation.z=side*.4; }
    }
  }
  if(kind==='mountain' && page>=2) {
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(.2,1.1,.5),new THREE.Vector3(.5,.45,.7),new THREE.Vector3(.1,.1,1.2),new THREE.Vector3(-.6,.08,1.7)]);
    mesh(new THREE.TubeGeometry(curve,35,.055,6,false),0x70c0cf);
  }
  if(kind==='press' && page===1) {
    model.rotation.y=-.25;
  }
  return model;
}
