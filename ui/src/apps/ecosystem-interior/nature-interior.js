// Nature interior - navigable 3D prototype for the
// 2026-11-15-ecosystem-growth-poc artifact ("World tour" tab, Nature theme).
// Bundled with esbuild to an IIFE exposing window.NatureInterior.
// A composed temperate-forest valley (painting-like framing), not a flat
// ground orbit: drag orbits, wheel/pinch dollies, tap recenters, bounded zone.
// Each design-gallery region has its own dressed spot in the scene.
import * as THREE from "three";

// one dressed anchor per Nature region (THEMES20 order):
// Forest Edge, Fern Understory, Stream Ravine, Wildflower Clearing,
// Mushroom Hollow, Old-Growth Heart, Treetop Canopy, Beaver Pond
const REGION_ANCHORS = [
  { x: -24, y: 3.0, z: -2 },    // Forest Edge - dense tree wall
  { x: 16, y: 1.4, z: -2 },     // Fern Understory - fern patch
  { x: -3, y: 0.8, z: 9 },      // Stream Ravine - winding stream
  { x: -14, y: 1.2, z: 10 },    // Wildflower Clearing - flower meadow
  { x: 12, y: 1.0, z: 11 },     // Mushroom Hollow - mushrooms + log
  { x: 10, y: 6.5, z: -13 },    // Old-Growth Heart - the ancient tree
  { x: 0, y: 7.5, z: -22 },     // Treetop Canopy - tall conifers
  { x: -11, y: 0.8, z: -6 },    // Beaver Pond - pond, lodge, reeds
];

const rand = (() => { let s = 42; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
const rr = (a, b) => a + rand() * (b - a);

function makeSky(scene) {
  const geo = new THREE.SphereGeometry(180, 24, 12);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      top: { value: new THREE.Color(0x9ec8e8) },
      mid: { value: new THREE.Color(0xd8e8dc) },
      low: { value: new THREE.Color(0xf4e9c8) },
    },
    vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform vec3 top; uniform vec3 mid; uniform vec3 low; varying vec3 vP;
      void main(){
        float h = normalize(vP).y;
        vec3 c = h > 0.18 ? mix(mid, top, smoothstep(0.18, 0.75, h)) : mix(low, mid, smoothstep(-0.06, 0.18, h));
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  scene.add(new THREE.Mesh(geo, mat));
}

function makeMountains(scene) {
  // two fog-blended ridge layers on the horizon
  const layers = [
    { r: 105, h: 26, col: 0x8fa8b8, n: 9 },
    { r: 78, h: 15, col: 0x6d8a7d, n: 11 },
  ];
  layers.forEach((L) => {
    const geo = new THREE.ConeGeometry(1, 1, 5);
    const mat = new THREE.MeshBasicMaterial({ color: L.col, fog: true });
    const mesh = new THREE.InstancedMesh(geo, mat, L.n);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3();
    for (let i = 0; i < L.n; i++) {
      const a = (i / L.n) * Math.PI * 2 + rr(-0.15, 0.15);
      const w = rr(24, 44);
      p.set(Math.cos(a) * L.r, L.h / 2 - 2, Math.sin(a) * L.r);
      s.set(w, L.h * rr(0.7, 1.25), w * 0.7);
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
    }
    scene.add(mesh);
  });
}

function makeTerrain() {
  const R = 52, SEG = 110;
  const geo = new THREE.PlaneGeometry(R * 2, R * 2, SEG, SEG);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const cGrass = new THREE.Color(0x59794a), cGrass2 = new THREE.Color(0x74915b);
  const cMeadow = new THREE.Color(0x8b9f65);
  const cEarth = new THREE.Color(0x8a6f4d), cSand = new THREE.Color(0xc9b98a);
  const cRock = new THREE.Color(0x7d7466);
  const c = new THREE.Color();
  const pondC = { x: -11, z: -6 };
  const heightAt = (x, z) => {
    const d = Math.hypot(x, z);
    let h = Math.sin(x * 0.10) * Math.cos(z * 0.12) * 1.5
      + Math.sin(x * 0.030 + 2.1) * Math.cos(z * 0.041) * 3.6
      + Math.sin(x * 0.33) * Math.cos(z * 0.29) * 0.2;
    h *= Math.min(1, d / 16);
    const pondD = Math.hypot(x - pondC.x, z - pondC.z);
    if (pondD < 7.6) { const shore = -0.65 + Math.pow(pondD / 7.6, 3) * 0.95; h = Math.min(h, shore); }
    // stream channel from pond toward the south edge
    const t = (z - pondC.z) / 26;
    if (t > 0 && t < 1.15) {
      const sx = pondC.x + Math.sin(t * 5.2) * 4.5 + t * 8;
      const sd = Math.abs(x - sx);
      if (sd < 1.6) h = Math.min(h, -0.5 + sd * 0.28);
    }
    return h;
  };
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const d = Math.hypot(x, z);
    const h = heightAt(x, z);
    pos.setY(i, h);
    const t = 0.5 + 0.5 * Math.sin(x * 0.19 + z * 0.16);
    c.lerpColors(cGrass, cGrass2, t);
    const meadowD = Math.hypot(x + 14, z - 10);
    if (meadowD < 7) c.lerp(cMeadow, 0.6 * (1 - meadowD / 7));
    const pondD = Math.hypot(x - pondC.x, z - pondC.z);
    if (pondD < 8.6) c.lerp(cSand, Math.max(0, 1 - Math.abs(pondD - 7.2) / 1.6));
    // stream banks
    const tt = (z - pondC.z) / 26;
    if (tt > 0 && tt < 1.15) {
      const sx = pondC.x + Math.sin(tt * 5.2) * 4.5 + tt * 8;
      const sd = Math.abs(x - sx);
      if (sd < 2.6 && sd > 1.3) c.lerp(cRock, 0.5 * (1 - Math.abs(sd - 1.95) / 0.7));
    }
    if (d > R * 0.84) c.lerp(new THREE.Color(0x3c6136), Math.min(1, (d - R * 0.84) / (R * 0.16)));
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;const ctx=canvas.getContext('2d');ctx.fillStyle='#d8d4b5';ctx.fillRect(0,0,1024,1024);for(let i=0;i<43000;i++){ctx.fillStyle=['#a7af83','#c3c69e','#e1d9b6','#b4bb8d','#979e75'][i%5];ctx.globalAlpha=0.15+rand()*0.35;const x=rand()*1024,y=rand()*1024;ctx.fillRect(x,y,rand()*5+1,rand()*3+1);}ctx.globalAlpha=1;const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(4,4);tex.anisotropy=4;
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map:tex, vertexColors: true, roughness: 0.95, metalness: 0 }));
  mesh.receiveShadow = true;
  return { mesh, heightAt };
}

function makeWater() {
  const group = new THREE.Group();
  const pondGeo = new THREE.CircleGeometry(6.0, 64);
  const pp=pondGeo.attributes.position; for(let i=1;i<pp.count;i++){const x=pp.getX(i),y=pp.getY(i),a=Math.atan2(y,x),f=1+0.07*Math.sin(a*5)+0.04*Math.cos(a*3);pp.setXY(i,x*f,y*f);}
  pondGeo.rotateX(-Math.PI / 2);
  const pond = new THREE.Mesh(pondGeo, new THREE.MeshStandardMaterial({
    color: 0x3b8185, transparent: true, opacity: 0.82, roughness: 0.15, metalness: 0.35,
  }));
  pond.position.set(-11, -0.34, -6);
  group.add(pond);
  // stream ribbon
  const pts = [];
  for (let i = 0; i <= 64; i++) {
    const t = 0.13 + (i / 64) * 0.92;
    const z = -6 + t * 26 * 1.05;
    const x = -11 + Math.sin(t * 5.2) * 4.5 + t * 8;
    pts.push(new THREE.Vector3(x, -0.18, z));
  }
  const streamGeo = new THREE.BufferGeometry();
  const verts = [], idx = [];
  pts.forEach((p, i) => {
    const w = 1.15;
    verts.push(p.x - w, p.y, p.z, p.x + w, p.y, p.z);
    if (i > 0) {
      const b = i * 2;
      idx.push(b - 2, b - 1, b, b - 1, b + 1, b);
    }
  });
  streamGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts), 3));
  streamGeo.setIndex(idx);
  streamGeo.computeVertexNormals();
  const stream = new THREE.Mesh(streamGeo, new THREE.MeshStandardMaterial({
    color: 0x4a8a94, transparent: true, opacity: 0.75, roughness: 0.2, metalness: 0.2, side: THREE.DoubleSide,
  }));
  group.add(stream);
  return group;
}

function treeParts() {
  const trunk = new THREE.CylinderGeometry(0.14, 0.26, 1.8, 5);
  trunk.translate(0, 0.9, 0);
  const cone = new THREE.ConeGeometry(1.25, 2.4, 9);
  cone.translate(0, 2.9, 0);
  const blob = new THREE.IcosahedronGeometry(1.25, 2);
  blob.translate(0, 2.5, 0);
  return { trunk, cone, blob };
}

function composeInto(mesh, i, x, y, z, sc, ry, sy) {
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(0, ry, 0), s = new THREE.Vector3(sc, sy || sc, sc);
  q.setFromEuler(e);
  m.compose(new THREE.Vector3(x, y, z), q, s);
  mesh.setMatrixAt(i, m);
}

function scatterForest(scene, heightAt) {
  const { trunk, cone, blob } = treeParts();
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 1 });
  const coneMat = new THREE.MeshStandardMaterial({ color: 0x3f6d35, roughness: 0.9, flatShading: false });
  const coneMat2 = new THREE.MeshStandardMaterial({ color: 0x4d7d3a, roughness: 0.9, flatShading: false });
  const blobMat = new THREE.MeshStandardMaterial({ color: 0x57893c, roughness: 0.9, flatShading: false });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xc9862e, roughness: 0.9, flatShading: false });
  const rustMat = new THREE.MeshStandardMaterial({ color: 0xb05e2c, roughness: 0.9, flatShading: false });

  const spots = [];
  const clear = (x, z) =>
    Math.hypot(x + 11, z + 6) > 8.8 &&          // pond
    Math.hypot(x + 14, z - 10) > 6.4 &&         // meadow
    Math.hypot(x - 10, z + 13) > 4.5 &&         // hero tree base
    Math.hypot(x - 12, z - 11) > 3.4 &&         // mushroom hollow
    Math.hypot(x - 16, z + 2) > 3.6 &&          // fern patch breathing room
    Math.abs(z - 2) + Math.abs(x) > 3;          // centre clearing
  // dense background wall (forest edge) + mid scatter
  for (let i = 0; i < 470; i++) {
    const a = rr(0, Math.PI * 2);
    const r = i < 320 ? rr(29, 50) : rr(17, 38);
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (r < 38 && !clear(x, z)) continue;
    if(z>0 && z<29 && x>-7 && x<22) continue;
    spots.push({ x, z, sc: rr(0.75, 1.4), kind: rand() });
  }
  // treetop canopy cluster (tall conifers)
  for (let i = 0; i < 9; i++) {
    const x = rr(-6, 6), z = rr(-26, -18);
    if (!clear(x, z)) continue;
    spots.push({ x, z, sc: rr(1.6, 2.3), kind: 0.1 });
  }
  const N = spots.length;
  const trunks = new THREE.InstancedMesh(trunk, trunkMat, N);
  const cones = new THREE.InstancedMesh(cone, coneMat, N);
  const cones2 = new THREE.InstancedMesh(cone, coneMat2, N);
  const blobs = new THREE.InstancedMesh(blob, blobMat, N);
  const golds = new THREE.InstancedMesh(blob, goldMat, N);
  const rusts = new THREE.InstancedMesh(blob, rustMat, N);
  let ti = 0, c1 = 0, c2 = 0, b1 = 0, g1 = 0, r1 = 0;
  spots.forEach((sp, i) => {
    const y = heightAt(sp.x, sp.z) - 0.1;
    composeInto(trunks, ti++, sp.x, y, sp.z, sp.sc, rr(0, 6.3), sp.sc * rr(0.9, 1.25));
    const k = sp.kind;
    if (k < 0.42) composeInto(cones, c1++, sp.x, y, sp.z, sp.sc, rr(0, 6.3), sp.sc * rr(0.95, 1.3));
    else if (k < 0.62) composeInto(cones2, c2++, sp.x, y, sp.z, sp.sc, rr(0, 6.3), sp.sc * rr(0.95, 1.3));
    else if (k < 0.84) composeInto(blobs, b1++, sp.x, y, sp.z, sp.sc, rr(0, 6.3));
    else if (k < 0.94) composeInto(golds, g1++, sp.x, y, sp.z, sp.sc * rr(0.8, 1), rr(0, 6.3));
    else composeInto(rusts, r1++, sp.x, y, sp.z, sp.sc * rr(0.8, 1), rr(0, 6.3));
  });
  trunks.count = ti; cones.count = c1; cones2.count = c2; blobs.count = b1; golds.count = g1; rusts.count = r1;
  [trunks, cones, cones2, blobs, golds, rusts].forEach((m2) => { m2.castShadow = true; scene.add(m2); });
  [blobs,golds,rusts].forEach(base=>{for(let l=0;l<4;l++){const crown=new THREE.InstancedMesh(blob,base.material,base.count);const mat=new THREE.Matrix4(),adj=new THREE.Matrix4().makeTranslation(Math.cos(l*1.57)*0.7, l%2?0.3:-0.35,Math.sin(l*1.57)*0.7);adj.scale(new THREE.Vector3(0.75,0.8,0.75));for(let i=0;i<base.count;i++){base.getMatrixAt(i,mat);mat.multiply(adj);crown.setMatrixAt(i,mat);}crown.castShadow=true;scene.add(crown);}});
  [cones,cones2].forEach(base=>{ for(let layer=0;layer<2;layer++){const crown=new THREE.InstancedMesh(cone,base.material,base.count);const mat=new THREE.Matrix4(), adj=new THREE.Matrix4().makeTranslation(0,0.7+layer*0.7,0);adj.scale(new THREE.Vector3(0.8-layer*0.2,0.85-layer*0.1,0.8-layer*0.2));for(let i=0;i<base.count;i++){base.getMatrixAt(i,mat);mat.multiply(adj);crown.setMatrixAt(i,mat);}crown.castShadow=true;scene.add(crown);}});
}

function makeHeroTree(scene, heightAt) {
  const g = new THREE.Group();
  const x = 10, z = -13, y = heightAt(10, -13);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d3f28, roughness: 1 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 1.05, 5.4, 7), trunkMat);
  trunk.position.set(x, y + 2.7, z);
  trunk.castShadow = true;
  g.add(trunk);
  // roots
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const root = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.28, 1.6, 4), trunkMat);
    root.position.set(x + Math.cos(a) * 1.1, y + 0.35, z + Math.sin(a) * 1.1);
    root.rotation.z = Math.cos(a) * 0.8;
    root.rotation.x = -Math.sin(a) * 0.8;
    g.add(root);
  }
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x3a6b31, roughness: 0.9, flatShading: false });
  const leafMat2 = new THREE.MeshStandardMaterial({ color: 0x4a7f39, roughness: 0.9, flatShading: false });
  const canopy = [[0, 6.4, 0, 2.9], [1.7, 5.4, 0.6, 2.0], [-1.6, 5.6, -0.5, 2.1], [0.4, 5.2, -1.5, 1.8], [-0.5, 5.1, 1.5, 1.7]];
  canopy.forEach((cp, i) => {
    const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(cp[3], 2), i % 2 ? leafMat2 : leafMat);
    blob.position.set(x + cp[0], y + cp[1], z + cp[2]);
    blob.castShadow = true;
    g.add(blob);
  });
  scene.add(g);
}

function makeFlowers(scene, heightAt) {
  const cols = [0xf2ede0, 0xe8c33d, 0xb98fd4, 0xd96a5f];
  const shape=new THREE.Shape();for(let k=0;k<=40;k++){const a=k/40*Math.PI*2,r=0.085+0.035*Math.cos(5*a);const x=Math.cos(a)*r,y=Math.sin(a)*r;if(k===0)shape.moveTo(x,y);else shape.lineTo(x,y);}const geo = new THREE.ShapeGeometry(shape);
  cols.forEach((col) => {
    const mat = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide });
    const N = 210;
    const mesh = new THREE.InstancedMesh(geo, mat, N);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(1, 1, 1), p = new THREE.Vector3();
    let placed=0;
    for (let i = 0; i < N; i++) {
      const inMeadow = i < 150;
      const cx = inMeadow ? -14 : 0, cz = inMeadow ? 10 : 0;
      const a = rr(0, Math.PI * 2), r = inMeadow ? Math.sqrt(rand()) * 6 : 12 + Math.sqrt(rand()) * 22;
      const x = inMeadow ? cx + Math.cos(a) * r : Math.cos(a) * r;
      const z = inMeadow ? cz + Math.sin(a) * r : Math.sin(a) * r;
      if (!inMeadow && (Math.hypot(x + 11, z + 6) < 7.6 || Math.hypot(x + 14, z - 10) < 6)) { continue; }
      p.set(x, heightAt(x, z) + 0.3, z);
      e.set(rr(-0.4, 0.4), rr(0, 6.3), rr(-0.4, 0.4));
      q.setFromEuler(e);
      m.compose(p, q, s);
      mesh.setMatrixAt(placed++, m);
    }
    mesh.count=placed;scene.add(mesh);
  });
}

function makeMushrooms(scene, heightAt) {
  const N = 48;
  const stem = new THREE.CylinderGeometry(0.07, 0.11, 0.3, 5);
  stem.translate(0, 0.15, 0);
  const cap = new THREE.SphereGeometry(0.24, 12, 8,0,Math.PI*2,0,Math.PI/2);
  cap.translate(0, 0.38, 0);
  const stems = new THREE.InstancedMesh(stem, new THREE.MeshStandardMaterial({ color: 0xe8dcc2, roughness: 1 }), N);
  const caps = new THREE.InstancedMesh(cap, new THREE.MeshStandardMaterial({ color: 0xc4502e, roughness: 0.85, flatShading: false }), N);
  for (let i = 0; i < N; i++) {
    const a = rr(0, Math.PI * 2), r = Math.sqrt(rand()) * 2.8;
    const x = 12 + Math.cos(a) * r, z = 11 + Math.sin(a) * r;
    const sc = rr(0.6, 1.6);
    composeInto(stems, i, x, heightAt(x, z), z, sc, rr(0, 6.3));
    composeInto(caps, i, x, heightAt(x, z), z, sc, rr(0, 6.3));
  }
  scene.add(stems, caps);
  // fallen log
  const log = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.38, 4.4, 7),
    new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 1 })
  );
  log.position.set(13.5, heightAt(13.5, 9.4) + 0.34, 9.4);
  log.rotation.z = Math.PI / 2;
  log.rotation.y = 0.5;
  log.castShadow = true;
  scene.add(log);
}

function makeFerns(scene, heightAt) {
  const N = 180;
  const blade = new THREE.BufferGeometry();const fv=[];for(let i=0;i<7;i++){const t=i/7,y=t*0.85,z=t*t*0.5,w=(1-t)*0.33;for(const side of [-1,1]){fv.push(0,y,z,side*w,y+0.09,z+0.05,0,y+0.12,z+0.07);}}blade.setAttribute('position',new THREE.Float32BufferAttribute(fv,3));blade.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ color: 0x2f5d2c, side: THREE.DoubleSide, roughness: 1 });
  const mesh = new THREE.InstancedMesh(blade, mat, N * 3);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
  let k = 0;
  for (let i = 0; i < N; i++) {
    const inPatch = i < 130;
    const a = rr(0, Math.PI * 2), r = inPatch ? Math.sqrt(rand()) * 3.2 : 8 + rand() * 26;
    const x = inPatch ? 16 + Math.cos(a) * r : Math.cos(a) * r;
    const z = inPatch ? -2 + Math.sin(a) * r : Math.sin(a) * r;
    if (!inPatch && Math.hypot(x + 11, z + 6) < 7.6) continue;
    const y = heightAt(x, z);
    for (let b = 0; b < 3; b++) {
      p.set(x, y, z);
      e.set(rr(-0.5, -0.15), rr(0, 6.3), 0);
      q.setFromEuler(e);
      const sc = rr(0.7, 1.3);
      s.set(sc, sc, sc);
      m.compose(p, q, s);
      mesh.setMatrixAt(k++, m);
    }
  }
  mesh.count = k;
  scene.add(mesh);
}

function makePondLife(scene) {
  // lily pads
  const padGeo = new THREE.CircleGeometry(0.32, 8);
  padGeo.rotateX(-Math.PI / 2);
  const pads = new THREE.InstancedMesh(padGeo, new THREE.MeshStandardMaterial({ color: 0x3e6b35, roughness: 0.9 }), 14);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
  for (let i = 0; i < 14; i++) {
    const a = rr(0, Math.PI * 2), r = rr(0.8, 4.4);
    p.set(-11 + Math.cos(a) * r, -0.3, -6 + Math.sin(a) * r);
    e.set(0, rr(0, 6.3), 0);
    q.setFromEuler(e);
    const sc = rr(0.6, 1.4);
    s.set(sc, 1, sc);
    m.compose(p, q, s);
    pads.setMatrixAt(i, m);
  }
  scene.add(pads);
  // reeds around the shore
  const reedGeo = new THREE.ConeGeometry(0.05, 1.5, 4);
  reedGeo.translate(0, 0.75, 0);
  const reeds = new THREE.InstancedMesh(reedGeo, new THREE.MeshStandardMaterial({ color: 0x6d7a3a, roughness: 1 }), 40);
  for (let i = 0; i < 40; i++) {
    const a = rr(0, Math.PI * 2), r = rr(6.0, 7.6);
    const x = -11 + Math.cos(a) * r, z = -6 + Math.sin(a) * r;
    composeInto(reeds, i, x, -0.5, z, rr(0.8, 1.3), rr(0, 6.3));
  }
  scene.add(reeds);
  // beaver lodge: a dome of sticks at the pond edge
  const lodge = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 7, 5, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x5d4227, roughness: 1, flatShading: false })
  );
  lodge.position.set(-6.4, -0.5, -9.6);
  lodge.scale.y = 0.75;
  lodge.castShadow = true;
  scene.add(lodge);
}

function makeGrass(scene, heightAt) {
  const N = 6500;
  const geo = new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute([-0.06,0,0,0.06,0,0,0.015,0.42,0],3));geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ color: 0x7b995d, emissive: 0x17220e, side: THREE.DoubleSide, roughness: 1 });
  const mesh = new THREE.InstancedMesh(geo, mat, N);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3();
  let placed = 0, guard = 0;
  while (placed < N && guard++ < N * 4) {
    const a = rr(0, Math.PI * 2), r = Math.sqrt(rand()) * 34;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (Math.hypot(x + 11, z + 6) < 7.4) continue;
    p.set(x, heightAt(x, z) + 0.04, z);
    e.set(rr(-0.2, 0.2), rr(0, Math.PI), rr(-0.2, 0.2));
    q.setFromEuler(e);
    const sc = rr(0.7, 1.6);
    s.set(sc, sc, sc);
    m.compose(p, q, s);
    mesh.setMatrixAt(placed++, m);
  }
  mesh.count = placed;
  scene.add(mesh);
}

function makeRocks(scene, heightAt) {
  const N = 46;
  const geo = new THREE.IcosahedronGeometry(0.5, 0);
  const mat = new THREE.MeshStandardMaterial({ color: 0x8d8577, roughness: 1, flatShading: false });
  const mesh = new THREE.InstancedMesh(geo, mat, N);
  for (let i = 0; i < N; i++) {
    const a = rr(0, Math.PI * 2), r = rr(5, 40);
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    const sc = rr(0.3, 1.4);
    composeInto(mesh, i, x, heightAt(x, z) + 0.08, z, sc, rr(0, 6.3), sc * 0.7);
  }
  mesh.castShadow = true;
  scene.add(mesh);
}


function dressValley(scene,heightAt){
  const wood=new THREE.MeshStandardMaterial({color:0x805c39,roughness:1});
  const paleWood=new THREE.MeshStandardMaterial({color:0xab895a,roughness:1});
  const stone=new THREE.MeshStandardMaterial({color:0x94927b,roughness:1});
  // A small footbridge makes the stream crossing legible while exploring.
  const bz=7, t=(bz+6)/26,bx=-11+Math.sin(t*5.2)*4.5+t*8;
  const deckY=Math.max(heightAt(bx-2,bz),heightAt(bx+2,bz))+0.38;
  for(let i=0;i<15;i++){const plank=new THREE.Mesh(new THREE.BoxGeometry(0.24,0.12,1.7),i%3===0?paleWood:wood);plank.position.set(bx-1.85+i*0.265,deckY+Math.sin(i/14*Math.PI)*0.18,bz);plank.castShadow=true;scene.add(plank);}
  for(const z of [bz-0.87,bz+0.87]){
    for(const x of [bx-1.85,bx,bx+1.85]){const post=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.07,1.0,7),wood);post.position.set(x,deckY+0.5,z);scene.add(post);}
    const rail=new THREE.Mesh(new THREE.BoxGeometry(4.0,0.075,0.065),paleWood);rail.position.set(bx,deckY+0.85,z);scene.add(rail);
  }
  // Broken rock/reed shoreline, rather than a perfect bare ring.
  const pebbles=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.3,1),stone,150);
  for(let i=0;i<150;i++){const a=rr(0,Math.PI*2),r=rr(5.8,7.6),x=-11+Math.cos(a)*r,z=-6+Math.sin(a)*r;composeInto(pebbles,i,x,heightAt(x,z)+0.07,z,rr(0.25,0.9),rr(0,6.28),rr(0.2,0.6));}scene.add(pebbles);
  // Weathered logs and small cut ends, with visible rings.
  const bark=new THREE.MeshStandardMaterial({color:0x684a31,roughness:1});
  const endMat=new THREE.MeshStandardMaterial({color:0xbd9c6f,roughness:1});
  for(const [x,z,len,rot] of [[-21,-4,2.8,0.6],[5,-18,3.6,-0.4],[17,7,2.3,1.1]]){const log=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.35,len,10),[bark,endMat,endMat]);log.rotation.z=Math.PI/2;log.rotation.y=rot;log.position.set(x,heightAt(x,z)+0.3,z);log.castShadow=true;scene.add(log);}
  // Feathered sprays of shore plants.
  const leafGeo=new THREE.BufferGeometry();leafGeo.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,-0.08,0.45,0.06,0,0.9,0.22,0,0,0,0,0.9,0.22,0.09,0.44,0.06],3));leafGeo.computeVertexNormals();
  const leaves=new THREE.InstancedMesh(leafGeo,new THREE.MeshStandardMaterial({color:0x63794b,side:THREE.DoubleSide,roughness:1}),500);let k=0;for(let i=0;i<100;i++){const a=rr(0,6.28),r=rr(6,8),x=-11+Math.cos(a)*r,z=-6+Math.sin(a)*r;for(let j=0;j<5;j++)composeInto(leaves,k++,x,heightAt(x,z),z,rr(0.5,1.1),j*1.256,rr(0.6,1.3));}scene.add(leaves);
}

// ---- animated life ----
function makeBirds(scene) {
  const N = 9;
  const geo = new THREE.ConeGeometry(0.16, 0.7, 4);
  geo.rotateX(Math.PI / 2);
  const mat = new THREE.MeshStandardMaterial({ color: 0x2e2a24, roughness: 0.8 });
  const mesh = new THREE.InstancedMesh(geo, mat, N);
  scene.add(mesh);
  const birds = [];
  for (let i = 0; i < N; i++) {
    birds.push({
      r: rr(14, 30), h: rr(9, 15),
      speed: rr(0.25, 0.55), phase: rr(0, Math.PI * 2),
      cx: rr(-10, 10), cz: rr(-10, 10),
    });
  }
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3(1, 1, 1);
  return (t) => {
    birds.forEach((b, i) => {
      const a = b.phase + t * b.speed;
      p.set(b.cx + Math.cos(a) * b.r, b.h + Math.sin(t * 0.7 + i) * 0.8, b.cz + Math.sin(a) * b.r);
      e.set(0, -a - Math.PI / 2 + Math.PI, Math.sin(t * 6 + i * 2) * 0.25);
      q.setFromEuler(e);
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
}

function makeButterflies(scene) {
  const N = 16;
  const geo = new THREE.PlaneGeometry(0.34, 0.26);
  const mat = new THREE.MeshBasicMaterial({ color: 0xe8a33d, side: THREE.DoubleSide, transparent: true, opacity: 0.95 });
  const mesh = new THREE.InstancedMesh(geo, mat, N);
  scene.add(mesh);
  const homes = [];
  for (let i = 0; i < N; i++) {
    const nearMeadow = i < 8;
    const a = rr(0, Math.PI * 2), r = nearMeadow ? rr(1, 6) : rr(4, 24);
    homes.push({
      x: (nearMeadow ? -14 : 0) + Math.cos(a) * r,
      z: (nearMeadow ? 10 : 0) + Math.sin(a) * r,
      phase: rr(0, Math.PI * 2), speed: rr(0.5, 1.5),
    });
  }
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3();
  return (t) => {
    homes.forEach((b, i) => {
      p.set(
        b.x + Math.sin(t * b.speed + b.phase) * 2.2,
        1.1 + Math.sin(t * 1.7 + b.phase * 2) * 0.55,
        b.z + Math.cos(t * b.speed * 0.8 + b.phase) * 2.2
      );
      const flap = Math.abs(Math.sin(t * 9 + b.phase)) * 0.9 + 0.15;
      e.set(0, t * 0.4 + b.phase, 0);
      q.setFromEuler(e);
      s.set(flap, 1, 1);
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
}

function makeFireflies(scene) {
  const N = 55;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3), phase = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const a = rr(0, Math.PI * 2), r = rr(5, 30);
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = rr(0.6, 3);
    pos[i * 3 + 2] = Math.sin(a) * r;
    phase[i] = rr(0, Math.PI * 2);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("phase", new THREE.BufferAttribute(phase, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float phase; uniform float uTime; varying float vA;
      void main() {
        vec3 p = position;
        p.x += sin(uTime * 0.6 + phase * 3.0) * 0.8;
        p.y += sin(uTime * 0.9 + phase * 5.0) * 0.4;
        p.z += cos(uTime * 0.5 + phase * 4.0) * 0.8;
        vA = 0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTime * 2.2 + phase * 7.0), 2.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = 90.0 * vA / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying float vA;
      void main() {
        vec2 d = gl_PointCoord - 0.5;
        float a = smoothstep(0.5, 0.05, length(d)) * vA;
        gl_FragColor = vec4(1.0, 0.9, 0.55, a);
      }`,
  });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  return (t) => { mat.uniforms.uTime.value = t; };
}

function makeRipples(scene) {
  const N = 3;
  const geo = new THREE.RingGeometry(0.3, 0.42, 24);
  geo.rotateX(-Math.PI / 2);
  const rings = [];
  for (let i = 0; i < N; i++) {
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xdff2f0, transparent: true, opacity: 0, side: THREE.DoubleSide }));
    const a = rr(0, Math.PI * 2), r = rr(0, 3.6);
    mesh.position.set(-11 + Math.cos(a) * r, -0.28, -6 + Math.sin(a) * r);
    scene.add(mesh);
    rings.push({ mesh, phase: i * 2.4 + rr(0, 2) });
  }
  return (t) => {
    rings.forEach((r) => {
      const c = (t * 0.4 + r.phase) % 3;
      const sc = 0.4 + c * 2.2;
      r.mesh.scale.set(sc, 1, sc);
      r.mesh.material.opacity = Math.max(0, 0.55 * (1 - c / 3));
    });
  };
}

export function create(opts) {
  const container = opts.container;
  const reducedMotion = !!opts.reducedMotion;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.maxPixelRatio || 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  const W = () => container.clientWidth || 2, H = () => container.clientHeight || 2;
  renderer.setSize(W(), H());
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xd8e4d4, 34, 120);

  const camera = new THREE.PerspectiveCamera(55, W() / H(), 0.1, 400);

  const sun = new THREE.DirectionalLight(0xffecd0, 2.0);
  sun.position.set(26, 40, 22);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -55; sun.shadow.camera.right = 55;
  sun.shadow.camera.top = 55; sun.shadow.camera.bottom = -55;
  sun.shadow.camera.far = 140;
  sun.shadow.bias = -0.0005;sun.shadow.radius=3;
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xd6e6ec, 0x626e43, 1.6));

  makeSky(scene);
  makeMountains(scene);
  const { mesh: terrain, heightAt } = makeTerrain();
  scene.add(terrain);
  scene.add(makeWater());
  scatterForest(scene, heightAt);
  makeHeroTree(scene, heightAt);
  makeFlowers(scene, heightAt);
  makeMushrooms(scene, heightAt);
  makeFerns(scene, heightAt);
  makePondLife(scene);
  makeGrass(scene, heightAt);
  makeRocks(scene, heightAt);
  dressValley(scene,heightAt);
  const tickBirds = makeBirds(scene);
  const tickButterflies = makeButterflies(scene);
  const tickFireflies = makeFireflies(scene);
  const tickRipples = makeRipples(scene);

  // ---- camera: orbit around a recenterable target, bounded zone ----
  // default framing mirrors the painted close-up: elevated view across the
  // clearing, pond left, ancient tree right, forest wall and ridges behind.
  const ZONE_R = 22;
  const HOME = { az: 0.15, pol: 0.90, dist: 33, tx: -3, ty: 1.6, tz: -4 };
  const target = new THREE.Vector3(HOME.tx, HOME.ty, HOME.tz);
  const cam = { az: HOME.az, pol: HOME.pol, dist: HOME.dist };
  const camGoal = { az: cam.az, pol: cam.pol, dist: cam.dist, tx: target.x, ty: target.y, tz: target.z };
  const MIN_D = 4, MAX_D = 34, MIN_P = 0.55, MAX_P = 1.38;

  const ray = new THREE.Raycaster();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.0);
  function recenter(clientX, clientY) {
    const r = renderer.domElement.getBoundingClientRect();
    const nx = ((clientX - r.left) / r.width) * 2 - 1;
    const ny = -((clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera({ x: nx, y: ny }, camera);
    const hit = new THREE.Vector3();
    if (ray.ray.intersectPlane(groundPlane, hit)) {
      const d = Math.hypot(hit.x, hit.z);
      if (d > ZONE_R) { hit.x *= ZONE_R / d; hit.z *= ZONE_R / d; }
      camGoal.tx = hit.x; camGoal.ty = 1.2; camGoal.tz = hit.z;
    }
  }

  const el = renderer.domElement;
  el.style.touchAction = "none";
  const pointers = new Map();
  let pinchD = 0, downInfo = null;
  el.addEventListener("pointerdown", (ev) => {
    pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    downInfo = { x: ev.clientX, y: ev.clientY, t: performance.now(), moved: false };
    if (pointers.size === 2) {
      const ps = [...pointers.values()];
      pinchD = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
    }
    el.setPointerCapture(ev.pointerId);
  });
  el.addEventListener("pointermove", (ev) => {
    const prev = pointers.get(ev.pointerId);
    if (!prev) return;
    if (pointers.size === 1) {
      camGoal.az -= (ev.clientX - prev.x) * 0.0052;
      camGoal.pol = Math.min(MAX_P, Math.max(MIN_P, camGoal.pol - (ev.clientY - prev.y) * 0.004));
      if (downInfo && Math.hypot(ev.clientX - downInfo.x, ev.clientY - downInfo.y) > 9) downInfo.moved = true;
    } else if (pointers.size === 2) {
      pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      const ps = [...pointers.values()];
      const d2 = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
      if (pinchD > 0 && d2 > 0) camGoal.dist = Math.min(MAX_D, Math.max(MIN_D, camGoal.dist * (pinchD / d2)));
      pinchD = d2;
      if (downInfo) downInfo.moved = true;
      return;
    }
    pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
  });
  const up = (ev) => {
    pointers.delete(ev.pointerId);
    pinchD = 0;
    if (ev.type === "pointerup" && downInfo && !downInfo.moved && performance.now() - downInfo.t < 350) {
      recenter(ev.clientX, ev.clientY);
    }
    downInfo = null;
  };
  el.addEventListener("pointerup", up);
  el.addEventListener("pointercancel", up);
  el.addEventListener("wheel", (ev) => {
    ev.preventDefault();
    camGoal.dist = Math.min(MAX_D, Math.max(MIN_D, camGoal.dist * (ev.deltaY > 0 ? 1.12 : 0.89)));
  }, { passive: false });

  function applyCamera(dt) {
    const k = reducedMotion ? 1 : Math.min(1, dt * 6);
    cam.az += (camGoal.az - cam.az) * k;
    cam.pol += (camGoal.pol - cam.pol) * k;
    cam.dist += (camGoal.dist - cam.dist) * k;
    target.x += (camGoal.tx - target.x) * k;
    target.y += (camGoal.ty - target.y) * k;
    target.z += (camGoal.tz - target.z) * k;
    camera.position.set(
      target.x + Math.sin(cam.az) * Math.sin(cam.pol) * cam.dist,
      target.y + Math.cos(cam.pol) * cam.dist,
      target.z + Math.cos(cam.az) * Math.sin(cam.pol) * cam.dist
    );
    camera.lookAt(target);
  }

  scene.traverse(o=>{if(!o.isMesh||!o.material||Array.isArray(o.material)||!o.material.isMeshStandardMaterial)return;const mat=o.material;if(mat.userData.mottled)return;mat.userData.mottled=true;mat.onBeforeCompile=shader=>{shader.vertexShader='varying vec3 vOrganic;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvOrganic=position;');shader.fragmentShader='varying vec3 vOrganic;\n'+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat fleck=sin(vOrganic.x*38.0+sin(vOrganic.z*29.0))*sin(vOrganic.y*31.0+vOrganic.z*22.0);diffuseColor.rgb*=0.94+0.10*fleck;');};});
  const clock = new THREE.Clock();
  let running = false, raf = 0, elapsed = 0;
  const stats = { fps: 0, frames: 0, t0: 0 };
  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, clock.getDelta());
    if (!reducedMotion) elapsed += dt;
    applyCamera(dt);
    tickBirds(elapsed);
    tickButterflies(elapsed);
    tickFireflies(elapsed);
    tickRipples(elapsed);
    renderer.render(scene, camera);
    stats.frames++;
    const now = performance.now();
    if (!stats.t0) stats.t0 = now;
    if (now - stats.t0 >= 600) {
      stats.fps = Math.round(stats.frames * 1000 / (now - stats.t0));
      stats.frames = 0; stats.t0 = now;
    }
    if (opts.onFrame) opts.onFrame();
  }

  return {
    start() { if (!running) { running = true; clock.getDelta(); frame(); } },
    stop() { running = false; cancelAnimationFrame(raf); },
    resize() {
      const w = W(), h = H();
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    },
    project(x, y, z) {
      const v = new THREE.Vector3(x, y, z).project(camera);
      if (v.z > 1) return null;
      return { x: (v.x * 0.5 + 0.5) * W(), y: (-v.y * 0.5 + 0.5) * H() };
    },
    regionAnchors: REGION_ANCHORS,
    home() { Object.assign(camGoal, { az: HOME.az, pol: HOME.pol, dist: HOME.dist, tx: HOME.tx, ty: HOME.ty, tz: HOME.tz }); },
    stats() {
      return {
        fps: stats.fps,
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
      };
    },
    dispose() {
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    },
  };
}
