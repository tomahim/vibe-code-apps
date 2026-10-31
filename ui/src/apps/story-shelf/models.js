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
  } else if(kind === 'rocket') {
    if (page < 2) {
      // A Saturn V-style moon rocket climbing away from its pad.
      mesh(new THREE.CylinderGeometry(.52,.56,.35,20),0x40444c,0,.3,0);
      mesh(new THREE.CylinderGeometry(.42,.42,1.5,20),0xf1ead9,0,1.2,0);
      mesh(new THREE.CylinderGeometry(.28,.28,.5,18),0xdcd4c0,0,2.15,0);
      mesh(new THREE.ConeGeometry(.28,.5,18),0xe6ddc9,0,2.65,0);
      mesh(new THREE.CylinderGeometry(.04,.04,.35,8),0xb8b2a2,0,3,0);
      for(let i=0;i<4;i++){const a=i/4*Math.PI*2;mesh(new THREE.BoxGeometry(.1,.5,.4),0x40444c,Math.cos(a)*.5,.28,Math.sin(a)*.5);}
      mesh(new THREE.ConeGeometry(.4,.8,18),0xe07f3e,0,-.1,0).rotation.x=Math.PI;
      mesh(new THREE.ConeGeometry(.22,.5,14),0xf3c14f,0,-.02,0).rotation.x=Math.PI;
    } else {
      // The lander, the flag and the grey moon dust of the later pages.
      mesh(new THREE.CylinderGeometry(2,2.1,.12,40),0x94928e,0,-.02,0);
      mesh(new THREE.BoxGeometry(1.2,.8,1.2),0xcfa23f,0,1,0);
      mesh(new THREE.BoxGeometry(.8,.5,.8),0x8f9296,0,1.65,0);
      for(let i=0;i<4;i++){const a=i/4*Math.PI*2+Math.PI/4;const leg=mesh(new THREE.CylinderGeometry(.05,.05,1.3,8),0xb9b4a6,Math.cos(a)*.7,.45,Math.sin(a)*.7);leg.rotation.z=Math.cos(a)*.5;leg.rotation.x=-Math.sin(a)*.5;}
      mesh(new THREE.CylinderGeometry(.03,.03,1.5,8),0xd8d3c4,1.4,.8,.6);
      mesh(new THREE.BoxGeometry(.6,.4,.04),0xcf5b4e,1.72,1.35,.6);
      for(let i=0;i<6;i++) mesh(new THREE.SphereGeometry(.1+(i%3)*.05,7,5),0x7d7b77,Math.sin(i*2.7)*1.6,.02,Math.cos(i*2.7)*1.6);
    }
  } else if(kind === 'tomb') {
    // A rock-cut staircase and a sealed royal doorway in the Valley of the Kings.
    mesh(new THREE.BoxGeometry(4,2.6,.9),0xb08052,0,1.3,-.55);
    for(let i=0;i<4;i++) mesh(new THREE.BoxGeometry(1.5,.13,.5),0xc79a63,0,.07+i*.16,.8-i*.35);
    mesh(new THREE.BoxGeometry(1,1.4,.14),0x6e4f30,0,.9,-.06);
    for(let i=0;i<3;i++) mesh(new THREE.SphereGeometry(.11,10,8),0xd9b877,-.28+i*.28,1.05,.02).scale.set(1,1.25,.4);
    mesh(new THREE.SphereGeometry(.55,16,10),0xe8b23f,-1.55,2.2,-.9);
    if (page >= 3) {
      // The treasures of the antechamber appear beside the doorway.
      mesh(new THREE.BoxGeometry(.85,.5,.5),0xd8a83e,1.35,.32,.55);
      mesh(new THREE.BoxGeometry(.9,.1,.55),0xb5822c,1.35,.62,.55);
      mesh(new THREE.CylinderGeometry(.16,.22,.5,12),0xd8a83e,2,.3,.2);
      mesh(new THREE.CylinderGeometry(.14,.2,.42,12),0xc79a35,1.9,.26,.85);
    }
    if (page >= 4) {
      // A gilded pharaoh bust stands for the famous mask found in the coffins.
      mesh(new THREE.BoxGeometry(.5,.5,.5),0x8a5f36,-1.35,.3,.6);
      mesh(new THREE.SphereGeometry(.34,16,12),0xe8b23f,-1.35,.85,.6).scale.set(1,1.15,.85);
      const band=mesh(new THREE.TorusGeometry(.3,.07,6,18),0x2e4d8f,-1.35,1.02,.6);band.rotation.x=Math.PI/2;
    }
  } else if(kind === 'plane') {
    // A Wright Flyer: twin cloth wings, wooden struts, skids and pusher propellers.
    const flyer=new THREE.Group(); model.add(flyer);
    const fmesh=(g,c,x,y,z)=>{const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:c,roughness:.85,flatShading:true}));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;flyer.add(m);return m;};
    fmesh(new THREE.BoxGeometry(3.6,.07,1),0xd9c9a8,0,.75,0);
    fmesh(new THREE.BoxGeometry(3.6,.07,1),0xd9c9a8,0,1.45,0);
    for(let i=0;i<6;i++) fmesh(new THREE.BoxGeometry(.05,.7,.05),0x8a6b44,-1.5+i*.6,1.1,.38);
    for(let i=0;i<6;i++) fmesh(new THREE.BoxGeometry(.05,.7,.05),0x8a6b44,-1.5+i*.6,1.1,-.38);
    for(const side of [-1,1]) fmesh(new THREE.BoxGeometry(2.4,.08,.14),0x8a6b44,.2,.3,side*.4);
    fmesh(new THREE.BoxGeometry(.9,.06,.6),0xcdbb96,-2,1.1,0);
    for(const side of [-1,1]) {
      const prop=fmesh(new THREE.BoxGeometry(1,.07,.07),0x6e5638,.75,1.1,side*.55);
      fmesh(new THREE.BoxGeometry(.07,1,.07),0x6e5638,.75,1.1,side*.55);
      prop.rotation.z=.5;
    }
    fmesh(new THREE.BoxGeometry(.7,.16,.3),0x54442e,-.35,.82,0);
    if (page >= 3) {
      // December 17: the Flyer lifts above the sand.
      flyer.position.y=.55; flyer.rotation.z=-.06;
      for(let i=0;i<5;i++) mesh(new THREE.SphereGeometry(.12+(i%2)*.05,7,5),0xe4d9bd,-1.2+i*.6,.08,1+Math.sin(i*2)*.2);
    }
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
