// The Little Factory - three.js scene: island, cutaway hall, belts, bays, machines, monument, effects.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const C = {
  cream: 0xf6efe3, paper: 0xfffdf8, ink: 0x2b2a28, terra: 0xc65d3b, terraD: 0xa94a2c,
  blue: 0x3f8fd2, orange: 0xf08a24, green: 0x5fa84a, brass: 0xc09a4a, brassD: 0x9a7629,
  wood: 0xc9a06c, woodD: 0xa87f4f, concrete: 0xd9d2c2, sage: 0x9dbd7a, sageD: 0x7da05c,
  dirt: 0xb08a63, stone: 0xb8b0a0, glass: 0xcfe4ef,
};
const MACHINE_COLORS = [0xc65d3b, 0x3f8fd2, 0xf08a24, 0x5fa84a, 0xb98a2f, 0x5b7a8c, 0x8c5b7a, 0x4a9e8f];

function seededRand(seed) { let s = seed * 2654435761 % 4294967296; return () => { s = (s * 1103515245 + 12345) % 4294967296; return s / 4294967296; }; }

function canvasTexture(w, h, draw) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  draw(cv.getContext('2d'), w, h);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return tex;
}
function textPlate(text, { w = 256, h = 64, bg = '#fffdf8', fg = '#2b2a28', border = '#c65d3b', font = '700 30px ui-monospace,monospace', sub = null, subFont = '600 18px ui-monospace,monospace' } = {}) {
  return canvasTexture(w, h, (g) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    if (border) { g.strokeStyle = border; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6); }
    g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, w / 2, sub ? h / 2 - 12 : h / 2 + 2, w - 20);
    if (sub) { g.font = subFont; g.globalAlpha = .75; g.fillText(sub, w / 2, h / 2 + 18, w - 20); g.globalAlpha = 1; }
  });
}

// ---------- static scenery ----------
function buildIsland(scene) {
  const g = new THREE.Group();
  const grass = new THREE.Mesh(new THREE.BoxGeometry(46, 1.6, 32), new THREE.MeshStandardMaterial({ color: C.sage, roughness: 1 }));
  grass.position.y = -0.8; g.add(grass);
  const cliff = new THREE.Mesh(new THREE.BoxGeometry(42, 4.5, 28), new THREE.MeshStandardMaterial({ color: C.dirt, roughness: 1 }));
  cliff.position.y = -3.8; g.add(cliff);
  const rock = new THREE.Mesh(new THREE.CylinderGeometry(13, 8, 5, 9), new THREE.MeshStandardMaterial({ color: C.stone, roughness: 1, flatShading: true }));
  rock.position.y = -8.2; g.add(rock);
  // path in front of the hall
  const path = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), new THREE.MeshStandardMaterial({ color: 0xe3d7bd, roughness: 1 }));
  path.rotation.x = -Math.PI / 2; path.position.set(-2, 0.02, 9.5); g.add(path);
  // trees + bushes
  const trunkG = new THREE.CylinderGeometry(.16, .22, 1.1, 6), leafG = new THREE.ConeGeometry(1.05, 2.2, 7);
  const trunkM = new THREE.MeshStandardMaterial({ color: 0x8a6844, roughness: 1 }), leafM = new THREE.MeshStandardMaterial({ color: C.sageD, roughness: 1, flatShading: true });
  [[-19, -11], [-20, 6], [18, -12], [20, 10.5], [15.5, 12.5], [-8, 13.2], [-16.5, 12]].forEach(([x, z], i) => {
    const t = new THREE.Group();
    const tr = new THREE.Mesh(trunkG, trunkM); tr.position.y = .55; t.add(tr);
    const lv = new THREE.Mesh(leafG, leafM); lv.position.y = 1.9; lv.scale.setScalar(.9 + (i % 3) * .25); t.add(lv);
    const lv2 = new THREE.Mesh(leafG, leafM); lv2.position.y = 2.9; lv2.scale.setScalar(.6 + (i % 2) * .2); t.add(lv2);
    t.position.set(x, 0, z); t.castShadow = true; g.add(t);
  });
  const bushG = new THREE.SphereGeometry(.55, 7, 5), bushM = new THREE.MeshStandardMaterial({ color: C.sageD, roughness: 1, flatShading: true });
  [[-14, -12.5], [6, 12.8], [17, -6], [-19.5, -3], [3.5, -12.8], [12, 12.6]].forEach(([x, z]) => {
    const b = new THREE.Mesh(bushG, bushM); b.position.set(x, .3, z); b.scale.y = .7; g.add(b);
  });
  scene.add(g);
  return g;
}
function buildClouds(scene) {
  const clouds = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: .92 });
  const rand = seededRand(7);
  for (let i = 0; i < 7; i++) {
    const cl = new THREE.Group();
    const n = 2 + Math.floor(rand() * 3);
    for (let j = 0; j < n; j++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(1 + rand() * 1.1, 8, 6), m);
      s.position.set(j * 1.6 - n * .8, rand() * .5, rand() * .8); s.scale.y = .55; cl.add(s);
    }
    cl.position.set(-30 + rand() * 60, 13 + rand() * 6, -18 + rand() * 14);
    cl.userData.speed = .25 + rand() * .35;
    clouds.add(cl);
  }
  scene.add(clouds);
  return clouds;
}
function buildHall(scene, factoryName) {
  const g = new THREE.Group();
  const floor = new THREE.Mesh(new THREE.BoxGeometry(20, .5, 12), new THREE.MeshStandardMaterial({ color: C.concrete, roughness: .95 }));
  floor.position.set(-3, .25, -2); g.add(floor);
  const wallM = new THREE.MeshStandardMaterial({ color: C.paper, roughness: .9 });
  const back = new THREE.Mesh(new THREE.BoxGeometry(20, 5, .4), wallM); back.position.set(-3, 2.5, -7.8); g.add(back);
  const left = new THREE.Mesh(new THREE.BoxGeometry(.4, 5, 12), wallM); left.position.set(-12.8, 2.5, -2); g.add(left);
  const rightLow = new THREE.Mesh(new THREE.BoxGeometry(.4, 5, 4.4), wallM); rightLow.position.set(6.8, 2.5, -5.6); g.add(rightLow);
  const rightHigh = new THREE.Mesh(new THREE.BoxGeometry(.4, 5, 4.4), wallM); rightHigh.position.set(6.8, 2.5, 1.4); g.add(rightHigh);
  const rightTop = new THREE.Mesh(new THREE.BoxGeometry(.4, 2, 3.4), wallM); rightTop.position.set(6.8, 4, -2.05); g.add(rightTop);
  const leftTop = new THREE.Mesh(new THREE.BoxGeometry(.4, 2, 3.4), wallM); leftTop.position.set(-12.8, 4, 2); g.add(leftTop);
  // sawtooth roof: three prisms
  const roofM = new THREE.MeshStandardMaterial({ color: C.terra, roughness: .8 });
  const glassM = new THREE.MeshStandardMaterial({ color: C.glass, roughness: .2, metalness: .1, transparent: true, opacity: .9, emissive: 0xbfd9e8, emissiveIntensity: .5 });
  for (let i = 0; i < 3; i++) {
    const x = -9.7 + i * 6.7;
    const ramp = new THREE.Mesh(new THREE.BoxGeometry(6.2, .3, 7.6), roofM);
    ramp.position.set(x, 6.15, -3.2); ramp.rotation.x = .32; g.add(ramp);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(6.2, 2.1, .18), glassM);
    glass.position.set(x, 5.9, .55); g.add(glass);
    const gable = new THREE.Mesh(new THREE.BoxGeometry(6.2, 2.3, .25), wallM);
    gable.position.set(x, 5.9, -7.75); g.add(gable);
  }
  const eaveF = new THREE.Mesh(new THREE.BoxGeometry(20.6, .35, .5), roofM); eaveF.position.set(-3, 5.05, .9); g.add(eaveF);
  // warm strip lights under the roof so the assembly floor reads
  const stripM = new THREE.MeshStandardMaterial({ color: 0xfff2d8, emissive: 0xffdf9e, emissiveIntensity: 1.6 });
  [-8, -3, 2].forEach(lx => { const strip = new THREE.Mesh(new THREE.BoxGeometry(3.4, .07, .3), stripM); strip.position.set(lx, 4.85, -2.5); g.add(strip); });
  // factory sign on the front eave
  const sign = new THREE.Mesh(new THREE.BoxGeometry(9, 1.35, .16), new THREE.MeshStandardMaterial({ roughness: .85, map: textPlate('THE LITTLE FACTORY', { w: 1024, h: 140, bg: '#fffdf8', fg: '#2b2a28', border: '#c65d3b', font: '700 64px Georgia,serif', sub: factoryName, subFont: '600 32px ui-monospace,monospace' }) }));
  sign.position.set(-3, 7.35, -.5); g.add(sign);
  const postM = new THREE.MeshStandardMaterial({ color: C.ink, roughness: .7 });
  [-6.5, .5].forEach(px => { const p = new THREE.Mesh(new THREE.BoxGeometry(.14, 1.5, .14), postM); p.position.set(px, 6.4, -.5); g.add(p); });
  // chimney
  const chim = new THREE.Mesh(new THREE.CylinderGeometry(.55, .75, 5.5, 10), new THREE.MeshStandardMaterial({ color: C.terraD, roughness: .9 }));
  chim.position.set(-11.5, 7.2, -6.5); g.add(chim);
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(.7, .62, .5, 10), new THREE.MeshStandardMaterial({ color: C.ink, roughness: .9 }));
  rim.position.set(-11.5, 10.1, -6.5); g.add(rim);
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  scene.add(g);
  return { group: g, chimneyTop: new THREE.Vector3(-11.5, 10.4, -6.5) };
}
function gateArch(text, color) {
  const g = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({ color: C.ink, roughness: .8 });
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(.45, 4.4, .45), m); p1.position.set(0, 2.2, -1.7); g.add(p1);
  const p2 = p1.clone(); p2.position.z = 1.7; g.add(p2);
  const top = new THREE.Mesh(new THREE.BoxGeometry(.45, .5, 3.9), m); top.position.set(0, 4.6, 0); g.add(top);
  const board = new THREE.Mesh(new THREE.BoxGeometry(.3, 1.5, 3.4), new THREE.MeshStandardMaterial({ map: textPlate(text, { w: 512, h: 224, bg: '#2b2a28', fg: color, border: null, font: '700 74px ui-monospace,monospace' }), roughness: .8 }));
  board.position.set(0, 3.3, 0); g.add(board);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}

// ---------- belts ----------
const beltTex = () => canvasTexture(64, 64, (g) => { g.fillStyle = '#4a4642'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#5b564f'; g.fillRect(0, 0, 64, 26); g.fillStyle = '#373430'; g.fillRect(0, 28, 64, 4); });
class Belt {
  constructor(scene, from, to, width = 1.6) {
    this.from = from; this.to = to; this.len = from.distanceTo(to);
    this.dir = to.clone().sub(from).normalize();
    this.items = []; this.speed = 3.4; this.minGap = 1.1;
    const g = this.group = new THREE.Group();
    const len = this.len;
    const geo = new THREE.BoxGeometry(len, .16, width);
    this.tex = beltTex(); this.tex.wrapS = this.tex.wrapT = THREE.RepeatWrapping; this.tex.repeat.set(len / .9, 1); this.tex.rotation = Math.PI / 2; this.tex.center.set(.5, .5);
    const top = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: this.tex, roughness: .9 }));
    top.position.copy(from).lerp(to, .5); top.position.y = from.y;
    top.lookAt(to.x, from.y, to.z); top.rotateY(Math.PI / 2);
    g.add(top);
    const railM = new THREE.MeshStandardMaterial({ color: C.ink, roughness: .7 });
    [-1, 1].forEach(s => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(len, .12, .1), railM);
      rail.position.copy(top.position); rail.translateZ(s * (width / 2 + .02)); rail.position.y += .12; g.add(rail);
    });
    const rollM = new THREE.MeshStandardMaterial({ color: 0x8a857c, roughness: .5, metalness: .4 });
    this.rollers = [];
    const nRoll = Math.max(2, Math.round(len / 2.6));
    for (let i = 0; i <= nRoll; i++) {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, width, 10), rollM);
      r.rotation.x = Math.PI / 2;
      r.position.copy(from).lerp(to, i / nRoll); r.position.y = from.y - .02;
      // orient roller axis across the belt
      r.lookAt(to.x, from.y - .02, to.z); r.rotateX(Math.PI / 2);
      this.rollers.push(r); g.add(r);
    }
    const legM = railM;
    for (let i = 0; i <= Math.round(len / 4); i++) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(.18, from.y, .18), legM);
      p.position.copy(from).lerp(to, i / Math.max(1, Math.round(len / 4))); p.position.y = from.y / 2 - .1; g.add(p);
    }
    scene.add(g);
  }
  attach(obj, cb) { this.items.push({ obj, s: 0, cb }); obj.position.copy(this.from); }
  update(dt) {
    this.tex.offset.y -= this.speed * dt / .9;
    for (const r of this.rollers) r.rotation.y += this.speed * dt * 2;
    // advance, front items first, keep spacing
    this.items.sort((a, b) => b.s - a.s);
    for (let i = 0; i < this.items.length; i++) {
      const it = this.items[i];
      let maxS = 1;
      if (i > 0) maxS = Math.min(maxS, this.items[i - 1].s - this.minGap / this.len);
      it.s = Math.min(maxS, it.s + this.speed * dt / this.len);
      it.obj.position.copy(this.from).lerp(this.to, it.s);
      it.obj.position.y = this.from.y + .3;
    }
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      if (it.s >= 1) { this.items.splice(i, 1); it.cb && it.cb(it.obj); }
    }
  }
}

// ---------- machines ----------
function makePlateTexture(num) {
  return textPlate('#' + num, { w: 128, h: 64, bg: '#2b2a28', fg: '#f6efe3', border: null, font: '700 40px ui-monospace,monospace' });
}
export function buildMachine(pr) {
  const rand = seededRand(pr.n * 7919 + 13);
  const color = MACHINE_COLORS[Math.floor(rand() * MACHINE_COLORS.length)];
  const g = new THREE.Group();
  const parts = [];
  const metal = new THREE.MeshStandardMaterial({ color: 0x6b665e, roughness: .5, metalness: .5 });
  const body = new THREE.MeshStandardMaterial({ color, roughness: .55, metalness: .25 });
  const dark = new THREE.MeshStandardMaterial({ color: C.ink, roughness: .7 });
  const brass = new THREE.MeshStandardMaterial({ color: C.brass, roughness: .35, metalness: .7 });
  const add = (mesh, at) => { mesh.visible = false; mesh.userData.at = at; mesh.castShadow = true; g.add(mesh); parts.push(mesh); return mesh; };
  const base = add(new THREE.Mesh(new THREE.BoxGeometry(1.15, .28, 1.15), dark), 0);
  base.position.y = .14;
  const torso = add(new THREE.Mesh(new THREE.BoxGeometry(.92, .85, .92), body), .12);
  torso.position.y = .7;
  const hopper = add(new THREE.Mesh(new THREE.CylinderGeometry(.28, .48, .5, 4), metal), .38);
  hopper.position.y = 1.38; hopper.rotation.y = Math.PI / 4;
  const chimH = .5 + rand() * .5;
  const chim = add(new THREE.Mesh(new THREE.CylinderGeometry(.11, .14, chimH, 8), dark), .55);
  chim.position.set(.28, 1.15 + chimH / 2, -.28);
  const flyR = .3 + rand() * .14;
  const fly = add(new THREE.Mesh(new THREE.TorusGeometry(flyR, .09, 8, 18), brass), .72);
  fly.position.set(-.52, .75, 0); fly.rotation.y = Math.PI / 2; fly.userData.spin = true;
  const spokes = add(new THREE.Mesh(new THREE.BoxGeometry(.08, flyR * 2, .08), brass), .72);
  spokes.position.copy(fly.position); spokes.userData.spin = true;
  if (rand() > .45) {
    const pipe = add(new THREE.Mesh(new THREE.TorusGeometry(.34, .07, 7, 10, Math.PI / 2), metal), .85);
    pipe.position.set(0, 1.15, .42); pipe.rotation.set(0, -Math.PI / 2, 0);
  }
  const plate = add(new THREE.Mesh(new THREE.PlaneGeometry(.62, .31), new THREE.MeshStandardMaterial({ map: makePlateTexture(pr.n), roughness: .6 })), .93);
  plate.position.set(0, .72, .475);
  g.userData.pr = pr; g.userData.parts = parts; g.userData.progress = -1;
  g.traverse(o => { o.userData.prRoot = g; });
  g.setProgress = (f) => {
    if (f === g.userData.progress) return;
    g.userData.progress = f;
    for (const p of parts) {
      const on = f >= p.userData.at;
      if (on && !p.visible) { p.visible = true; p.scale.setScalar(.01); p.userData.pop = .001; }
      if (!on) p.visible = false;
    }
  };
  g.update = (dt, t) => {
    for (const p of parts) {
      if (p.userData.pop) { p.userData.pop = Math.min(1, p.userData.pop + dt * 5); const s = .2 + .8 * (1 - Math.pow(1 - p.userData.pop, 3)) + (p.userData.pop < 1 ? Math.sin(p.userData.pop * Math.PI) * .25 : 0); p.scale.setScalar(s); if (p.userData.pop >= 1) { p.scale.setScalar(1); p.userData.pop = 0; } }
      if (p.visible && p.userData.spin) p.rotation.x += dt * 3;
    }
  };
  g.setProgress(0.0001);
  return g;
}

// ---------- monument ----------
function gearGeometry() {
  const parts = [new THREE.CylinderGeometry(.5, .5, .14, 18)];
  for (let i = 0; i < 9; i++) {
    const tooth = new THREE.BoxGeometry(.14, .14, .18);
    const a = i / 9 * Math.PI * 2;
    tooth.rotateY(-a);
    tooth.translate(Math.cos(a) * .54, 0, Math.sin(a) * .54);
    parts.push(tooth);
  }
  const hub = new THREE.CylinderGeometry(.16, .16, .3, 10); parts.push(hub);
  return mergeGeometries(parts);
}
class Monument {
  constructor(scene) {
    const g = this.group = new THREE.Group();
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.5, .8, 12), new THREE.MeshStandardMaterial({ color: C.concrete, roughness: .9 }));
    ped.position.y = .4; ped.castShadow = ped.receiveShadow = true; g.add(ped);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.11, .16, 15.4, 8), new THREE.MeshStandardMaterial({ color: C.brassD, roughness: .4, metalness: .6 }));
    shaft.position.y = 8.4; g.add(shaft);
    const finial = new THREE.Mesh(new THREE.SphereGeometry(.3, 10, 8), new THREE.MeshStandardMaterial({ color: C.brass, roughness: .3, metalness: .75 }));
    finial.position.y = 16.3; g.add(finial);
    this.plaqueTex = canvasTexture(512, 128, () => {});
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(2.6, .65, .12), new THREE.MeshStandardMaterial({ map: this.plaqueTex, roughness: .7 }));
    plaque.position.set(0, .75, 2.28); plaque.rotation.x = -.18; g.add(plaque);
    this.setPlaque(0);
    this.gearGeo = gearGeometry();
    this.gearMat = new THREE.MeshStandardMaterial({ color: C.brass, roughness: .35, metalness: .7 });
    this.mesh = new THREE.InstancedMesh(this.gearGeo, this.gearMat, 320);
    this.mesh.count = 0; this.mesh.castShadow = true; this.mesh.frustumCulled = false; this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    g.add(this.mesh);
    this.count = 0; this.angles = []; this.sizes = [];
    // pennant
    this.flag = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .75), new THREE.MeshStandardMaterial({ color: C.terra, side: THREE.DoubleSide })); this.flag.position.set(.75, 16.9, 0); this.flag.visible = false; g.add(this.flag);
    g.position.set(18.2, 0, 7.5);
    this.pos = g.position;
    scene.add(g);
    this._m4 = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._e = new THREE.Euler(); this._v = new THREE.Vector3(); this._s = new THREE.Vector3();
  }
  setPlaque(n) {
    const g = this.plaqueTex.image.getContext('2d');
    g.fillStyle = '#2b2a28'; g.fillRect(0, 0, 512, 128);
    g.fillStyle = '#f6efe3'; g.font = '700 44px ui-monospace,monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(n + (n === 1 ? ' MACHINE' : ' MACHINES'), 256, 46);
    g.globalAlpha = .7; g.font = '600 30px ui-monospace,monospace'; g.fillText('SHIPPED TO PRODUCTION', 256, 96); g.globalAlpha = 1;
    this.plaqueTex.needsUpdate = true;
  }
  addGear(size, instant) {
    if (this.count >= 320) return;
    const i = this.count++;
    this.angles.push(i * 2.399963); this.sizes.push(size);
    this.mesh.count = this.count;
    this.setPlaque(this.count);
    if (!instant) this.popT = 0;
  }
  reset() { this.count = 0; this.angles = []; this.sizes = []; this.mesh.count = 0; this.setPlaque(0); this.flag.visible = false; }
  finale() { this.flag.visible = true; }
  update(dt, t) {
    for (let i = 0; i < this.count; i++) {
      const size = this.sizes[i] * .82;
      const a = this.angles[i] + t * .25 * (i % 2 ? -1 : 1);
      const r = Math.max(.5, 1.25 - i * .0038) + size * .3;
      const y = 1.1 + i * .078;
      let s = size;
      if (this.popT !== undefined && this.popT < 1 && i === this.count - 1) { this.popT = Math.min(1, this.popT + dt * 3); s *= (1 - Math.pow(1 - this.popT, 3)); }
      this._e.set(0, a, 0); this._q.setFromEuler(this._e);
      this._v.set(Math.cos(a) * r, y, Math.sin(a) * r); this._s.setScalar(s);
      this._m4.compose(this._v, this._q, this._s);
      this.mesh.setMatrixAt(i, this._m4);
    }
    if (this.count) this.mesh.instanceMatrix.needsUpdate = true;
    if (this.flag.visible) this.flag.rotation.y = Math.sin(t * 2.2) * .3;
  }
}

// ---------- effects ----------
class Smoke {
  constructor(scene, cap = 30) {
    this.mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(.3, 7, 6), new THREE.MeshStandardMaterial({ color: 0xe8e2d5, roughness: 1, transparent: true, opacity: .55 }), cap);
    this.mesh.count = cap; this.cap = cap; this.mesh.frustumCulled = false;
    this.parts = Array.from({ length: cap }, () => ({ life: 0 }));
    scene.add(this.mesh);
    this._m4 = new THREE.Matrix4();
  }
  puff(pos, n = 3) {
    for (let i = 0; i < n; i++) {
      const p = this.parts.find(p => p.life <= 0); if (!p) return;
      p.life = 1; p.x = pos.x + (Math.random() - .5) * .3; p.y = pos.y; p.z = pos.z + (Math.random() - .5) * .3;
      p.vx = (Math.random() - .5) * .3 + .35; p.vy = 1 + Math.random() * .6; p.vz = (Math.random() - .5) * .3;
    }
  }
  update(dt) {
    let i = 0;
    for (const p of this.parts) {
      if (p.life > 0) {
        p.life -= dt * .4; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        const s = (1.6 - p.life) * .9;
        this._m4.makeScale(s, s, s); this._m4.setPosition(p.x, p.y, p.z);
      } else this._m4.makeScale(0, 0, 0);
      this.mesh.setMatrixAt(i++, this._m4);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}
class Sparks {
  constructor(scene, cap = 240) {
    this.cap = cap;
    this.pos = new Float32Array(cap * 3); this.vel = new Float32Array(cap * 3); this.life = new Float32Array(cap);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.points = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xf0b024, size: .14, sizeAttenuation: true, transparent: true, opacity: .95 }));
    this.points.frustumCulled = false;
    scene.add(this.points);
  }
  burst(p, n = 22, spread = 2.4, up = 3.4) {
    let placed = 0;
    for (let i = 0; i < this.cap && placed < n; i++) {
      if (this.life[i] > 0) continue;
      this.life[i] = .7 + Math.random() * .5;
      this.pos[i * 3] = p.x; this.pos[i * 3 + 1] = p.y; this.pos[i * 3 + 2] = p.z;
      this.vel[i * 3] = (Math.random() - .5) * spread; this.vel[i * 3 + 1] = Math.random() * up; this.vel[i * 3 + 2] = (Math.random() - .5) * spread;
      placed++;
    }
  }
  update(dt) {
    for (let i = 0; i < this.cap; i++) {
      if (this.life[i] <= 0) { this.pos[i * 3 + 1] = -50; continue; }
      this.life[i] -= dt;
      this.vel[i * 3 + 1] -= 6 * dt;
      this.pos[i * 3] += this.vel[i * 3] * dt; this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt; this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
    }
    this.points.geometry.attributes.position.needsUpdate = true;
  }
}

// ---------- world ----------
export function buildWorld(canvas, { lite = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lite, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, lite ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = !lite; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.cream);
  scene.fog = new THREE.Fog(C.cream, 70, 140);
  const camera = new THREE.PerspectiveCamera(lite ? 47 : 40, 1, .1, 300);
  camera.position.set(...(lite ? [33, 30, 40] : [25.5, 24.5, 31]));
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(...(lite ? [0, 1.6, 0] : [-2, 1.6, -.5]));
  controls.enableDamping = true; controls.dampingFactor = .08;
  controls.minDistance = 9; controls.maxDistance = 62;
  controls.maxPolarAngle = Math.PI * .49; controls.minPolarAngle = .12;
  controls.enablePan = true; controls.panSpeed = .7;

  const hemi = new THREE.HemisphereLight(0xfff6e6, 0xcbb59a, 1.05); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffedd0, 2.1);
  sun.position.set(22, 30, 14);
  if (!lite) {
    sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -32; sun.shadow.camera.right = 32; sun.shadow.camera.top = 32; sun.shadow.camera.bottom = -32;
    sun.shadow.camera.far = 90; sun.shadow.bias = -.0004;
  }
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xdfe9f0, .5); fill.position.set(-18, 14, -20); scene.add(fill);
  const hallGlow = new THREE.PointLight(0xffd9a0, 42, 26, 1.7); hallGlow.position.set(-3, 4.2, -2); scene.add(hallGlow);
  const hallGlow2 = new THREE.PointLight(0xffe4b8, 20, 18, 1.8); hallGlow2.position.set(2, 3.4, 0); scene.add(hallGlow2);

  buildIsland(scene);
  const clouds = buildClouds(scene);
  const hall = buildHall(scene, 'GENIOUS APPS · EST. MAR 2026');

  // gates
  const supGate = gateArch('SUPPLIES', '#f08a24'); supGate.position.set(-16.4, 0, 2); supGate.rotation.y = Math.PI / 2; scene.add(supGate);
  const portal = gateArch('PRODUCTION', '#5fa84a'); portal.position.set(13.6, 0, 2); portal.rotation.y = Math.PI / 2; scene.add(portal);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 3.9), new THREE.MeshBasicMaterial({ color: 0xc9f0b8, transparent: true, opacity: .25, side: THREE.DoubleSide }));
  glow.position.set(13.6, 2, 2); glow.rotation.y = Math.PI / 2; scene.add(glow);

  const beltY = .95;
  const mainBelt = new Belt(scene, new THREE.Vector3(-16.4, beltY, 2), new THREE.Vector3(13.6, beltY, 2), 1.7);

  // bays
  const bayXs = [-9.5, -5.5, -1.5, 2.5, 5.6];
  const bays = bayXs.map((x, i) => {
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.3, .3, 12), new THREE.MeshStandardMaterial({ color: C.stone, roughness: .8 }));
    pad.position.set(x, .65, -3.6); pad.receiveShadow = true; scene.add(pad);
    // robot arm
    const armG = new THREE.Group();
    const post = new THREE.Mesh(new THREE.CylinderGeometry(.12, .16, 1.7, 8), new THREE.MeshStandardMaterial({ color: C.ink, roughness: .6 }));
    post.position.y = .85; armG.add(post);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.1, .14, .14), new THREE.MeshStandardMaterial({ color: C.orange, roughness: .5 }));
    arm.position.set(.45, 1.72, 0); armG.add(arm);
    const claw = new THREE.Mesh(new THREE.BoxGeometry(.16, .34, .16), new THREE.MeshStandardMaterial({ color: C.ink, roughness: .6 }));
    claw.position.set(.95, 1.6, 0); armG.add(claw);
    armG.position.set(x - 1.4, .5, -4.6); armG.traverse(o => { if (o.isMesh) o.castShadow = true; });
    scene.add(armG);
    // dock door on the back wall
    const door = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.6, .12), new THREE.MeshStandardMaterial({ color: 0x8a857c, roughness: .8 }));
    door.position.set(x, 1.8, -7.55); scene.add(door);
    const line = new Belt(scene, new THREE.Vector3(x, beltY, -7.4), new THREE.Vector3(x, beltY, -4.7), 1.0);
    line.group.visible = false; line.speed = 2.6;
    // branch flag
    const flagHolder = new THREE.Group(); flagHolder.position.set(x, 4.6, -7.3); flagHolder.visible = false; scene.add(flagHolder);
    return { i, x, pad, arm: armG, door, line, flagHolder, busy: false, flagMesh: null };
  });

  const monument = new Monument(scene);
  const smoke = new Smoke(scene, lite ? 14 : 30);
  const sparks = new Sparks(scene, lite ? 90 : 240);

  // crates (instanced)
  const crateGeo = mergeGeometries([
    new THREE.BoxGeometry(.55, .45, .55),
    new THREE.BoxGeometry(.59, .12, .59).translate(0, .18, 0),
  ]);
  const crateMesh = new THREE.InstancedMesh(crateGeo, new THREE.MeshStandardMaterial({ color: C.wood, roughness: .85 }), 48);
  crateMesh.count = 0; crateMesh.castShadow = true; crateMesh.frustumCulled = false; crateMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(crateMesh);
  const crateState = [];
  const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3(1, 1, 1);

  const world = {
    scene, camera, renderer, controls, bays, monument, mainBelt, hall, lite,
    glow, clouds, smoke, sparks,
    portalPos: new THREE.Vector3(13.4, 1.4, 2),
    suppliesPos: new THREE.Vector3(-16.4, 1.4, 2),
    t: 0,
    setFlag(bay, branch) {
      if (bay.flagMesh) { bay.flagHolder.remove(bay.flagMesh); bay.flagMesh.material.map.dispose(); bay.flagMesh.material.dispose(); bay.flagMesh.geometry.dispose(); bay.flagMesh = null; }
      if (!branch) { bay.flagHolder.visible = false; return; }
      const label = branch.length > 22 ? branch.slice(0, 21) + '…' : branch;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(3.2, .62), new THREE.MeshStandardMaterial({ map: textPlate(label, { w: 512, h: 96, bg: '#fffdf8', fg: '#2b2a28', border: '#3f8fd2', font: '600 40px ui-monospace,monospace' }), side: THREE.DoubleSide, roughness: .8 }));
      bay.flagMesh = m; bay.flagHolder.add(m); bay.flagHolder.visible = true;
    },
    spawnCrate(from, to, dur, spinSeed, onDone) {
      if (crateState.length >= 48) { onDone && onDone(); return null; }
      const st = { from: from.clone(), to: to.clone(), t: 0, dur: Math.max(.12, dur), arc: .8 + (spinSeed % 3) * .2, rot: (spinSeed % 7) * .4, onDone, alive: true };
      crateState.push(st);
      return st;
    },
    clearCrates() { crateState.length = 0; crateMesh.count = 0; },
    portalFlash() { glow.material.opacity = .95; sparks.burst(world.portalPos, 26, 2.6, 3.6); },
    update(dt) {
      world.t += dt;
      const t = world.t;
      for (const c of clouds.children) { c.position.x += c.userData.speed * dt; if (c.position.x > 42) c.position.x = -42; }
      mainBelt.update(dt);
      for (const b of bays) { b.line.update(dt); b.arm.rotation.y = Math.sin(t * .8 + b.i) * .5; }
      monument.update(dt, t);
      smoke.update(dt); sparks.update(dt);
      glow.material.opacity = Math.max(.22, glow.material.opacity - dt * 1.4);
      // crates
      let alive = 0;
      for (let i = crateState.length - 1; i >= 0; i--) {
        const st = crateState[i];
        st.t += dt / st.dur;
        if (st.t >= 1) { crateState.splice(i, 1); st.onDone && st.onDone(); continue; }
      }
      for (const st of crateState) {
        const k = st.t;
        _v.copy(st.from).lerp(st.to, k); _v.y += Math.sin(k * Math.PI) * st.arc;
        _e.set(0, st.rot + k * 2.2, 0); _q.setFromEuler(_e);
        const sc = k > .8 ? 1 - (k - .8) * 3.5 : 1;
        _s.setScalar(Math.max(.05, sc));
        _m4.compose(_v, _q, _s);
        crateMesh.setMatrixAt(alive++, _m4);
      }
      crateMesh.count = alive; crateMesh.instanceMatrix.needsUpdate = true;
      if (Math.random() < dt * .18) smoke.puff(hall.chimneyTop, 1);
      controls.update();
      renderer.render(scene, camera);
    },
    resize() {
      const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    },
    dispose() { renderer.dispose(); },
  };
  addEventListener('resize', world.resize);
  world.resize();
  return world;
}
