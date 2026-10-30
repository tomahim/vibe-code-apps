// The Little Factory - night shift: a dark futuristic hall seen from inside.
// Robot arms work the assembly bays, moving spotlights sweep the production line,
// merged PRs roll off the belt as machines and stack as gears on the core tower.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const C = {
  bg: 0x05070c, floor: 0x10151d, wall: 0x0b0f15, panel: 0x151c26,
  gun: 0x2c343f, gunD: 0x1a2029, ink: 0x0c1016,
  cyan: 0x39d5ff, cyanD: 0x1a8fb8, amber: 0xffb347, orange: 0xf08a24,
  green: 0x4ade80, blue: 0x4aa8ff, violet: 0x8b7cf6, magenta: 0xe06ba8, teal: 0x2dd4bf,
  brass: 0xd8b25c, wood: 0x35415a, cream: 0xdfe7ef, terra: 0x39d5ff,
};
const ACCENTS = [0x39d5ff, 0xf08a24, 0x4ade80, 0x8b7cf6, 0xffb347, 0x4aa8ff, 0xe06ba8, 0x2dd4bf];

// hall extents: x -24..24, z -14..12, ceiling 12.2
const HALL = { x: 24, zMin: -14, zMax: 12, h: 12.2 };

function seededRand(seed) { let s = seed * 2654435761 % 4294967296; return () => { s = (s * 1103515245 + 12345) % 4294967296; return s / 4294967296; }; }

function canvasTexture(w, h, draw) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  draw(cv.getContext('2d'), w, h);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return tex;
}
function textPlate(text, { w = 256, h = 64, bg = 'rgba(8,16,26,0.72)', fg = '#8fe8ff', border = '#39d5ff', font = '700 30px ui-monospace,monospace', sub = null, subFont = '600 18px ui-monospace,monospace' } = {}) {
  return canvasTexture(w, h, (g) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    if (border) { g.strokeStyle = border; g.lineWidth = 4; g.globalAlpha = .85; g.strokeRect(3, 3, w - 6, h - 6); g.globalAlpha = 1; }
    g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = fg; g.shadowBlur = 12;
    g.fillText(text, w / 2, sub ? h / 2 - 12 : h / 2 + 2, w - 24);
    if (sub) { g.font = subFont; g.shadowBlur = 6; g.globalAlpha = .8; g.fillText(sub, w / 2, h / 2 + 18, w - 24); g.globalAlpha = 1; }
  });
}

// ---------- static hall ----------
function floorTexture() {
  return canvasTexture(1024, 512, (g, w, h) => {
    g.fillStyle = '#0c1118'; g.fillRect(0, 0, w, h);
    for (let x = 0; x <= w; x += 64) { g.strokeStyle = 'rgba(140,180,220,0.05)'; g.lineWidth = x % 256 ? 1 : 2; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y <= h; y += 64) { g.strokeStyle = 'rgba(140,180,220,0.05)'; g.lineWidth = y % 256 ? 1 : 2; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    const rand = seededRand(31);
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(0,0,0,${.05 + rand() * .1})`;
      g.beginPath(); g.ellipse(rand() * w, rand() * h, 20 + rand() * 60, 12 + rand() * 30, rand() * 3, 0, 7); g.fill();
    }
    // lane markings: hall x -24..24 -> u, z -14..12 -> v (v=0 at z=12 after plane rotation)
    const u = (x) => (x + 24) / 48 * w, v = (z) => (12 - z) / 26 * h;
    g.strokeStyle = 'rgba(57,213,255,0.32)'; g.lineWidth = 3;
    g.shadowColor = '#39d5ff'; g.shadowBlur = 10;
    g.beginPath(); g.moveTo(u(-16.4), v(2.9)); g.lineTo(u(13.6), v(2.9)); g.stroke();
    g.beginPath(); g.moveTo(u(-16.4), v(1.1)); g.lineTo(u(13.6), v(1.1)); g.stroke();
    g.lineWidth = 2; g.globalAlpha = .5;
    for (const bx of [-9.5, -5.5, -1.5, 2.5, 5.6]) { g.beginPath(); g.moveTo(u(bx), v(-4.4)); g.lineTo(u(bx), v(-7.6)); g.stroke(); }
    g.globalAlpha = .16; g.lineWidth = 2;
    g.beginPath(); g.moveTo(u(-20), v(6.5)); g.lineTo(u(20), v(6.5)); g.stroke();
    g.beginPath(); g.moveTo(u(-20), v(-9.8)); g.lineTo(u(20), v(-9.8)); g.stroke();
    g.globalAlpha = 1; g.shadowBlur = 0;
    for (const cx of [-16.4, 13.6]) {
      g.save(); g.beginPath(); g.rect(u(cx) - 34, v(4.4), 68, v(-0.4) - v(4.4)); g.clip();
      for (let i = -6; i < 6; i++) {
        g.fillStyle = i % 2 ? 'rgba(255,179,71,0.28)' : 'rgba(10,12,16,0.4)';
        g.beginPath();
        const x0 = u(cx) + i * 14;
        g.moveTo(x0, v(4.4)); g.lineTo(x0 + 14, v(4.4)); g.lineTo(x0 + 28, v(-0.4)); g.lineTo(x0 + 14, v(-0.4));
        g.closePath(); g.fill();
      }
      g.restore();
    }
  });
}
function wallTexture() {
  return canvasTexture(1024, 256, (g, w, h) => {
    g.fillStyle = '#0a0e14'; g.fillRect(0, 0, w, h);
    for (let x = 0; x <= w; x += 86) {
      g.fillStyle = 'rgba(255,255,255,0.025)'; g.fillRect(x, 0, 2, h);
      g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(x + 40, 0, 3, h);
    }
    g.fillStyle = 'rgba(57,213,255,0.5)'; g.shadowColor = '#39d5ff'; g.shadowBlur = 8;
    g.fillRect(0, h * .62, w, 2);
    g.shadowBlur = 0;
    g.fillStyle = 'rgba(160,200,235,0.10)'; g.font = '700 44px ui-monospace,monospace'; g.textAlign = 'center';
    g.fillText('SECTOR 07', w * .25, h * .3); g.fillText('LINE 01', w * .72, h * .82);
    const rand = seededRand(9);
    for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(0,0,0,${.08 + rand() * .12})`; g.fillRect(rand() * w, 0, 4 + rand() * 18, h); }
  });
}
function buildHallShell(scene) {
  const g = new THREE.Group();
  const fw = HALL.x * 2, fd = HALL.zMax - HALL.zMin, cz = (HALL.zMin + HALL.zMax) / 2;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(fw, fd), new THREE.MeshStandardMaterial({ map: floorTexture(), color: 0xd4dce6, roughness: .38, metalness: .6 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, cz); floor.receiveShadow = true; g.add(floor);
  const wTex = wallTexture(); wTex.wrapS = THREE.RepeatWrapping;
  const mkWall = (len, x, z, ry) => {
    const t = wTex.clone(); t.needsUpdate = true; t.repeat.set(Math.max(1, Math.round(len / 14)), 1);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(len, HALL.h), new THREE.MeshStandardMaterial({ map: t, roughness: .8, metalness: .3 }));
    m.position.set(x, HALL.h / 2, z); m.rotation.y = ry; m.receiveShadow = true; g.add(m);
  };
  mkWall(fw, 0, HALL.zMin, 0);
  mkWall(fw, 0, HALL.zMax, Math.PI);
  mkWall(fd, -HALL.x, cz, Math.PI / 2);
  mkWall(fd, HALL.x, cz, -Math.PI / 2);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(fw, fd), new THREE.MeshStandardMaterial({ color: 0x080b10, roughness: .9, metalness: .2 }));
  ceil.rotation.x = Math.PI / 2; ceil.position.set(0, HALL.h, cz); g.add(ceil);
  const beamM = new THREE.MeshStandardMaterial({ color: 0x141a23, roughness: .6, metalness: .6 });
  const beams = [];
  for (let x = -21; x <= 21; x += 6) beams.push(new THREE.BoxGeometry(.35, .5, fd).translate(x, HALL.h - .3, cz));
  for (let z = HALL.zMin + 2; z <= HALL.zMax - 2; z += 5.5) beams.push(new THREE.BoxGeometry(fw, .28, .3).translate(0, HALL.h - .62, z));
  g.add(new THREE.Mesh(mergeGeometries(beams), beamM));
  const barM = new THREE.MeshStandardMaterial({ color: 0x9fdfff, emissive: 0x86d8ff, emissiveIntensity: 1.1 });
  const bars = [];
  for (let x = -15; x <= 15; x += 10) for (const z of [-7.5, 3.5]) bars.push(new THREE.BoxGeometry(3.6, .08, .3).translate(x, HALL.h - .7, z));
  g.add(new THREE.Mesh(mergeGeometries(bars), barM));
  const s1 = new THREE.Mesh(new THREE.BoxGeometry(fw * .8, .07, .07), new THREE.MeshBasicMaterial({ color: 0x39d5ff }));
  s1.position.set(0, 7.6, HALL.zMin + .12); g.add(s1);
  const s2 = new THREE.Mesh(new THREE.BoxGeometry(.07, .07, fd * .7), new THREE.MeshBasicMaterial({ color: 0xf08a24 }));
  s2.position.set(-HALL.x + .12, 6.4, cz); g.add(s2);
  const s3 = new THREE.Mesh(new THREE.BoxGeometry(.07, .07, fd * .7), new THREE.MeshBasicMaterial({ color: 0x39d5ff }));
  s3.position.set(HALL.x - .12, 6.4, cz); g.add(s3);
  // high windows: cool glow band that sells the hall's height
  const winM = new THREE.MeshBasicMaterial({ color: 0xbfe0f5, transparent: true, opacity: .55, fog: false });
  const winFrameM = new THREE.MeshStandardMaterial({ color: 0x141a23, roughness: .6, metalness: .6 });
  for (let wx = -18; wx <= 18; wx += 6) {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.5), winM);
    win.position.set(wx, 10.2, HALL.zMin + .06); g.add(win);
    const fr = new THREE.Mesh(new THREE.BoxGeometry(3.6, .12, .1), winFrameM);
    fr.position.set(wx, 11.05, HALL.zMin + .08); g.add(fr);
    const fr2 = fr.clone(); fr2.position.y = 9.35; g.add(fr2);
    const mull = new THREE.Mesh(new THREE.BoxGeometry(.1, 1.7, .1), winFrameM);
    mull.position.set(wx, 10.2, HALL.zMin + .08); g.add(mull);
  }
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(13, 1.7), new THREE.MeshBasicMaterial({
    map: textPlate('THE LITTLE FACTORY', { w: 1400, h: 180, bg: 'rgba(5,8,12,0)', fg: '#8fe8ff', border: null, font: '700 92px ui-monospace,monospace', sub: 'GENIOUS APPS · EST. MAR 2026', subFont: '600 40px ui-monospace,monospace' }),
    transparent: true,
  }));
  sign.position.set(HALL.x - .12, 8.6, -3); sign.rotation.y = -Math.PI / 2; g.add(sign);
  // structural pillars with lit edges (front and back rows)
  const pilM = new THREE.MeshStandardMaterial({ color: 0x141a23, roughness: .55, metalness: .65 });
  const pilEdge = new THREE.MeshStandardMaterial({ color: C.cyan, emissive: C.cyan, emissiveIntensity: 1.1 });
  for (const px of [-20, -12, 8, 16]) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(.55, HALL.h, .55), pilM);
    p.position.set(px, HALL.h / 2, HALL.zMin + .45); p.castShadow = true; g.add(p);
    const e = new THREE.Mesh(new THREE.BoxGeometry(.06, HALL.h * .8, .06), pilEdge);
    e.position.set(px, HALL.h * .42, HALL.zMin + .78); g.add(e);
  }
  for (const px of [-14, -2, 14]) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(.55, HALL.h, .55), pilM);
    p.position.set(px, HALL.h / 2, HALL.zMax - .45); p.castShadow = true; g.add(p);
  }
  // parked cargo near the intake and the front corner
  const cargoM = new THREE.MeshStandardMaterial({ color: 0x35415a, roughness: .5, metalness: .6, emissive: 0x1a8fb8, emissiveIntensity: .22 });
  const cargo = [];
  const stacks = [[-19.5, 5.5, 3], [-18.3, 6.6, 2], [10.5, 8.6, 2], [11.8, 9.4, 1]];
  for (const [sx, sz, n] of stacks) for (let i = 0; i < n; i++)
    cargo.push(new THREE.BoxGeometry(.9, .8, .9).translate(sx + (i % 2) * .12, .4 + i * .82, sz));
  const cargoMesh = new THREE.Mesh(mergeGeometries(cargo), cargoM);
  cargoMesh.castShadow = cargoMesh.receiveShadow = true; g.add(cargoMesh);
  scene.add(g);
  return g;
}

// ---------- gates ----------
function gateFrame(text, color, glowColor) {
  const g = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({ color: C.gunD, roughness: .45, metalness: .75 });
  const edge = new THREE.MeshBasicMaterial({ color });
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(.5, 4.6, .5), m); p1.position.set(0, 2.3, -1.9); g.add(p1);
  const p2 = p1.clone(); p2.position.z = 1.9; g.add(p2);
  const top = new THREE.Mesh(new THREE.BoxGeometry(.5, .55, 4.3), m); top.position.set(0, 4.85, 0); g.add(top);
  for (const z of [-1.62, 1.62]) { const e = new THREE.Mesh(new THREE.BoxGeometry(.08, 4.4, .08), edge); e.position.set(.26, 2.3, z); g.add(e); }
  const board = new THREE.Mesh(new THREE.PlaneGeometry(3.6, .9), new THREE.MeshBasicMaterial({
    map: textPlate(text, { w: 512, h: 128, bg: 'rgba(5,10,16,0.85)', fg: color, border: null, font: '700 62px ui-monospace,monospace' }), transparent: true,
  }));
  board.position.set(.3, 4.1, 0); board.rotation.y = Math.PI / 2; g.add(board);
  const board2 = board.clone(); board2.rotation.y = -Math.PI / 2; board2.position.x = -.3; g.add(board2);
  const shimmer = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 4.2), new THREE.MeshBasicMaterial({ color: glowColor, transparent: true, opacity: .14, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  shimmer.rotation.y = Math.PI / 2; shimmer.position.y = 2.2; g.add(shimmer);
  g.traverse(o => { if (o.isMesh && o.material === m) o.castShadow = true; });
  return { group: g, shimmer };
}

// ---------- belts ----------
const beltTex = () => canvasTexture(64, 64, (g) => {
  g.fillStyle = '#12171f'; g.fillRect(0, 0, 64, 64);
  g.fillStyle = '#1a222d'; g.fillRect(0, 0, 64, 26);
  g.fillStyle = 'rgba(57,213,255,0.55)'; g.beginPath(); g.moveTo(22, 6); g.lineTo(42, 13); g.lineTo(22, 20); g.closePath(); g.fill();
  g.fillStyle = '#0a0d12'; g.fillRect(0, 28, 64, 4);
});
class Belt {
  constructor(scene, from, to, width = 1.6) {
    this.from = from; this.to = to; this.len = from.distanceTo(to);
    this.dir = to.clone().sub(from).normalize();
    this.items = []; this.speed = 3.4; this.minGap = 1.1;
    const g = this.group = new THREE.Group();
    const len = this.len;
    this.tex = beltTex(); this.tex.wrapS = this.tex.wrapT = THREE.RepeatWrapping; this.tex.repeat.set(len / .9, 1); this.tex.rotation = Math.PI / 2; this.tex.center.set(.5, .5);
    const top = new THREE.Mesh(new THREE.BoxGeometry(len, .16, width), new THREE.MeshStandardMaterial({ map: this.tex, roughness: .6, metalness: .4 }));
    top.position.copy(from).lerp(to, .5); top.position.y = from.y;
    top.lookAt(to.x, from.y, to.z); top.rotateY(Math.PI / 2);
    top.receiveShadow = true;
    g.add(top);
    const railM = new THREE.MeshStandardMaterial({ color: C.gun, roughness: .4, metalness: .75 });
    [-1, 1].forEach(s => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(len, .12, .1), railM);
      rail.position.copy(top.position); rail.translateZ(s * (width / 2 + .02)); rail.position.y += .12; g.add(rail);
      const edge = new THREE.Mesh(new THREE.BoxGeometry(len, .03, .03), new THREE.MeshStandardMaterial({ color: C.cyan, emissive: C.cyan, emissiveIntensity: 1.4 }));
      edge.position.copy(rail.position); edge.translateZ(s * .06); edge.position.y -= .1; g.add(edge);
    });
    const rollM = new THREE.MeshStandardMaterial({ color: 0x39424e, roughness: .35, metalness: .7 });
    this.rollers = [];
    const nRoll = Math.max(2, Math.round(len / 2.6));
    for (let i = 0; i <= nRoll; i++) {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, width, 10), rollM);
      r.rotation.x = Math.PI / 2;
      r.position.copy(from).lerp(to, i / nRoll); r.position.y = from.y - .02;
      r.lookAt(to.x, from.y - .02, to.z); r.rotateX(Math.PI / 2);
      this.rollers.push(r); g.add(r);
    }
    for (let i = 0; i <= Math.round(len / 4); i++) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(.2, from.y, .2), railM);
      p.position.copy(from).lerp(to, i / Math.max(1, Math.round(len / 4))); p.position.y = from.y / 2 - .1;
      p.castShadow = true; g.add(p);
    }
    scene.add(g);
  }
  attach(obj, cb) { this.items.push({ obj, s: 0, cb }); obj.position.copy(this.from); }
  update(dt) {
    this.tex.offset.y -= this.speed * dt / .9;
    for (const r of this.rollers) r.rotation.y += this.speed * dt * 2;
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

// ---------- machines (merged PRs) ----------
function makePlateTexture(num) {
  return textPlate('#' + num, { w: 128, h: 64, bg: 'rgba(6,12,20,0.9)', fg: '#8fe8ff', border: null, font: '700 40px ui-monospace,monospace' });
}
let _machineSkin = null;
function machineSkin() {
  if (_machineSkin) return _machineSkin;
  _machineSkin = canvasTexture(128, 128, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 2;
    g.strokeRect(8, 8, w - 16, h - 16);
    g.beginPath(); g.moveTo(w / 2, 8); g.lineTo(w / 2, h - 8); g.stroke();
    g.beginPath(); g.moveTo(8, h * .62); g.lineTo(w - 8, h * .62); g.stroke();
    g.fillStyle = 'rgba(0,0,0,0.5)';
    for (const [rx, ry] of [[14, 14], [w - 14, 14], [14, h - 14], [w - 14, h - 14]]) { g.beginPath(); g.arc(rx, ry, 3, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(8, h * .62 + 6, w - 16, 8);
  });
  return _machineSkin;
}
export function buildMachine(pr) {
  const rand = seededRand(pr.n * 7919 + 13);
  const accent = ACCENTS[Math.floor(rand() * ACCENTS.length)];
  const g = new THREE.Group();
  const parts = [];
  const gun = new THREE.MeshStandardMaterial({ color: 0x333c48, roughness: .4, metalness: .75 });
  const body = new THREE.MeshStandardMaterial({ map: machineSkin(), color: 0x2c3540, roughness: .48, metalness: .6 });
  const dark = new THREE.MeshStandardMaterial({ color: C.gunD, roughness: .5, metalness: .7 });
  const glow = new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 1.5, roughness: .4 });
  const brass = new THREE.MeshStandardMaterial({ color: C.brass, roughness: .3, metalness: .8, emissive: C.brass, emissiveIntensity: .3 });
  const add = (mesh, at) => { mesh.visible = false; mesh.userData.at = at; mesh.castShadow = true; g.add(mesh); parts.push(mesh); return mesh; };
  const base = add(new THREE.Mesh(new THREE.BoxGeometry(1.15, .28, 1.15), dark), 0);
  base.position.y = .14;
  const baseGlow = add(new THREE.Mesh(new THREE.BoxGeometry(1.17, .05, 1.17), glow), 0);
  baseGlow.position.y = .3;
  const torso = add(new THREE.Mesh(new THREE.BoxGeometry(.92, .85, .92), body), .12);
  torso.position.y = .76;
  const panel = add(new THREE.Mesh(new THREE.BoxGeometry(.5, .4, .04), glow), .3);
  panel.position.set(-.18, .8, .47);
  const hopper = add(new THREE.Mesh(new THREE.CylinderGeometry(.28, .44, .5, 6), gun), .42);
  hopper.position.y = 1.42;
  const antH = .5 + rand() * .5;
  const ant = add(new THREE.Mesh(new THREE.CylinderGeometry(.05, .08, antH, 6), dark), .58);
  ant.position.set(.3, 1.3 + antH / 2, -.3);
  const tip = add(new THREE.Mesh(new THREE.SphereGeometry(.09, 8, 6), new THREE.MeshBasicMaterial({ color: accent })), .58);
  tip.position.set(.3, 1.32 + antH, -.3); tip.userData.blink = true;
  const flyR = .3 + rand() * .14;
  const fly = add(new THREE.Mesh(new THREE.TorusGeometry(flyR, .08, 8, 20), brass), .74);
  fly.position.set(-.52, .8, 0); fly.rotation.y = Math.PI / 2; fly.userData.spin = true;
  const spokes = add(new THREE.Mesh(new THREE.BoxGeometry(.07, flyR * 2, .07), brass), .74);
  spokes.position.copy(fly.position); spokes.userData.spin = true;
  if (rand() > .45) {
    const pipe = add(new THREE.Mesh(new THREE.TorusGeometry(.34, .06, 7, 12, Math.PI / 2), gun), .85);
    pipe.position.set(0, 1.2, .42); pipe.rotation.set(0, -Math.PI / 2, 0);
  }
  const plate = add(new THREE.Mesh(new THREE.PlaneGeometry(.62, .31), new THREE.MeshBasicMaterial({ map: makePlateTexture(pr.n), transparent: true })), .93);
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
      if (p.visible && p.userData.blink) p.visible = Math.sin(t * 6 + pr.n) > -.6;
    }
  };
  g.setProgress(0.0001);
  return g;
}

// ---------- robot arms (one per assembly bay) ----------
class RobotArm {
  constructor(scene, x, z, i) {
    this.i = i;
    const gun = new THREE.MeshStandardMaterial({ color: 0x2b333e, roughness: .35, metalness: .8 });
    const gunD = new THREE.MeshStandardMaterial({ color: 0x1c232d, roughness: .45, metalness: .75 });
    const accent = new THREE.MeshStandardMaterial({ color: 0xd97728, roughness: .45, metalness: .55, emissive: 0xd97728, emissiveIntensity: .5 });
    const cableM = new THREE.MeshStandardMaterial({ color: 0x0c1016, roughness: .8, metalness: .3 });
    const g = this.group = new THREE.Group();
    // bolted pedestal
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(.52, .58, .12, 12), gunD); plate.position.y = .06; g.add(plate);
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(.34, .44, .5, 10), gun); ped.position.y = .36; g.add(ped);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.46, .04, 6, 24), new THREE.MeshStandardMaterial({ color: C.cyan, emissive: C.cyan, emissiveIntensity: 1.2 }));
    ring.rotation.x = Math.PI / 2; ring.position.y = .13; g.add(ring);
    // rotating turret with side motor
    this.yaw = new THREE.Group(); this.yaw.position.y = .62; g.add(this.yaw);
    const turret = new THREE.Mesh(new THREE.BoxGeometry(.62, .55, .62), accent); turret.position.y = .28; this.yaw.add(turret);
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .34, 10), gunD); motor.rotation.z = Math.PI / 2; motor.position.set(-.4, .28, 0); this.yaw.add(motor);
    const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .7, 10), gunD); shoulder.rotation.x = Math.PI / 2; shoulder.position.y = .62; this.yaw.add(shoulder);
    // upper arm: tapered housing + piston
    this.upper = new THREE.Group(); this.upper.position.y = .62; this.yaw.add(this.upper);
    const ua = new THREE.Mesh(new THREE.BoxGeometry(1.5, .3, .26), gun); ua.position.x = .62; this.upper.add(ua);
    const uaTop = new THREE.Mesh(new THREE.BoxGeometry(1.1, .12, .18), gunD); uaTop.position.set(.6, .22, 0); this.upper.add(uaTop);
    const uaStrip = new THREE.Mesh(new THREE.BoxGeometry(1.3, .05, .05), new THREE.MeshStandardMaterial({ color: C.cyan, emissive: C.cyan, emissiveIntensity: 1.6 }));
    uaStrip.position.set(.62, -.17, 0); this.upper.add(uaStrip);
    const piston = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .9, 8), gunD); piston.rotation.z = 1.1; piston.position.set(.15, -.3, .18); this.upper.add(piston);
    const elbow = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, .5, 10), gunD); elbow.rotation.x = Math.PI / 2; elbow.position.x = 1.42; this.upper.add(elbow);
    const elbowCap = new THREE.Mesh(new THREE.SphereGeometry(.14, 10, 8), accent); elbowCap.position.set(1.42, 0, .26); this.upper.add(elbowCap);
    // forearm with cable loop
    this.fore = new THREE.Group(); this.fore.position.x = 1.42; this.upper.add(this.fore);
    const fa = new THREE.Mesh(new THREE.BoxGeometry(1.1, .2, .18), gun); fa.position.x = .5; this.fore.add(fa);
    const faGuard = new THREE.Mesh(new THREE.BoxGeometry(.7, .1, .24), accent); faGuard.position.set(.45, -.14, 0); this.fore.add(faGuard);
    const cable = new THREE.Mesh(new THREE.TorusGeometry(.42, .035, 6, 14, Math.PI * 1.2), cableM);
    cable.position.set(.3, .3, 0); cable.rotation.set(0, 0, .6); this.fore.add(cable);
    // wrist + welding torch + gripper fingers
    this.wrist = new THREE.Group(); this.wrist.position.x = 1.05; this.fore.add(this.wrist);
    const wHub = new THREE.Mesh(new THREE.SphereGeometry(.13, 10, 8), gunD); this.wrist.add(wHub);
    const torch = new THREE.Mesh(new THREE.CylinderGeometry(.035, .09, .42, 8), gun); torch.rotation.z = Math.PI / 2; torch.position.x = .24; this.wrist.add(torch);
    for (const s of [-1, 1]) { const fing = new THREE.Mesh(new THREE.BoxGeometry(.22, .05, .05), gunD); fing.position.set(.3, s * .09, 0); this.wrist.add(fing); }
    this.tip = new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 6), new THREE.MeshBasicMaterial({ color: 0x9feaff }));
    this.tip.position.x = .48; this.wrist.add(this.tip);
    g.position.set(x, 0, z);
    g.scale.setScalar(1.45);
    g.traverse(o => { if (o.isMesh) o.castShadow = true; });
    scene.add(g);
    this._tipWorld = new THREE.Vector3();
  }
  tipWorld() { return this.tip.getWorldPosition(this._tipWorld); }
  update(dt, t, working) {
    const sp = working ? 2.6 : 1;
    const i = this.i;
    this.yaw.rotation.y = Math.sin(t * .55 * sp + i * 1.7) * (working ? .85 : .35);
    this.upper.rotation.z = .5 + Math.sin(t * .8 * sp + i * 2.3) * (working ? .34 : .1);
    this.fore.rotation.z = -1 + Math.sin(t * 1.05 * sp + i * 3.1) * (working ? .42 : .13);
    this.wrist.rotation.z = .45 + Math.sin(t * 1.6 * sp + i) * .3;
    this.tip.material.color.setHex(working && Math.sin(t * 9 + i * 2) > .2 ? 0xd8f6ff : 0x2a4a5a);
    this.tip.scale.setScalar(working && Math.sin(t * 9 + i * 2) > .2 ? 1.6 : 1);
  }
}

// ---------- overhead gantries ----------
class Gantry {
  constructor(scene, z, phase) {
    this.phase = phase;
    const railM = new THREE.MeshStandardMaterial({ color: C.gun, roughness: .4, metalness: .75 });
    const rail = new THREE.Mesh(new THREE.BoxGeometry(30, .22, .34), railM);
    rail.position.set(-1, 10.9, z); scene.add(rail);
    const trolley = this.trolley = new THREE.Group();
    const car = new THREE.Mesh(new THREE.BoxGeometry(1.1, .5, .8), new THREE.MeshStandardMaterial({ color: 0x2b333e, roughness: .4, metalness: .8 }));
    trolley.add(car);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(.09, 8, 6), new THREE.MeshBasicMaterial({ color: C.amber }));
    eye.position.set(0, -.3, .35); trolley.add(eye);
    this.cable = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, 1, 6), railM);
    trolley.add(this.cable);
    this.load = new THREE.Mesh(new THREE.BoxGeometry(.6, .5, .6), new THREE.MeshStandardMaterial({ color: 0x35415a, roughness: .5, metalness: .6, emissive: 0x1a8fb8, emissiveIntensity: .3 }));
    trolley.add(this.load);
    trolley.position.set(-1, 10.6, z);
    trolley.traverse(o => { if (o.isMesh) o.castShadow = true; });
    scene.add(trolley);
  }
  update(dt, t) {
    const x = -1 + Math.sin(t * .16 + this.phase) * 12.5;
    this.trolley.position.x = x;
    const drop = 2.2 + (Math.sin(t * .5 + this.phase * 3) * .5 + .5) * 3.4;
    this.cable.scale.y = drop; this.cable.position.y = -.25 - drop / 2;
    this.load.position.y = -.3 - drop;
    this.load.rotation.y = Math.sin(t * .4 + this.phase) * .4;
  }
}

// ---------- moving spotlights ----------
let _beamGrad = null;
function beamGradient() {
  if (_beamGrad) return _beamGrad;
  _beamGrad = canvasTexture(8, 128, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(.55, '#999999'); gr.addColorStop(1, '#000000');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  _beamGrad.colorSpace = THREE.NoColorSpace;
  return _beamGrad;
}
class SpotRig {
  constructor(scene, { x, z, color, phase, rangeX, rangeZ, cx, cz, shadow, lite }) {
    this.phase = phase; this.rangeX = rangeX; this.rangeZ = rangeZ; this.cx = cx; this.cz = cz;
    const head = this.head = new THREE.Group();
    const yoke = new THREE.Mesh(new THREE.BoxGeometry(.5, .24, .5), new THREE.MeshStandardMaterial({ color: C.gunD, roughness: .5, metalness: .7 }));
    head.add(yoke);
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(.16, .24, .4, 10), new THREE.MeshStandardMaterial({ color: C.gun, roughness: .4, metalness: .8, emissive: color, emissiveIntensity: .35 }));
    lamp.position.y = -.3; head.add(lamp);
    head.position.set(x, HALL.h - .8, z);
    scene.add(head);
    const pivotAdd = [];
    const light = this.light = new THREE.SpotLight(color, lite ? 480 : 640, 42, .3, .8, 1.5);
    light.position.copy(head.position).y -= .4;
    if (shadow) {
      light.castShadow = true;
      light.shadow.mapSize.set(1024, 1024);
      light.shadow.camera.near = 2; light.shadow.camera.far = 30; light.shadow.bias = -.0005;
    }
    scene.add(light);
    const target = this.target = new THREE.Object3D();
    scene.add(target);
    light.target = target;
    const len = HALL.h - 1.2;
    const cone = this.cone = new THREE.Mesh(
      new THREE.CylinderGeometry(.12, 2.4, len, 20, 1, true),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .12, alphaMap: beamGradient(), blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
    cone.position.y = -len / 2;
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(.06, 1.1, len, 14, 1, true),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .14, alphaMap: beamGradient(), blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
    core.position.y = -len / 2;
    pivotAdd.push(core);
    const pivot = this.pivot = new THREE.Group();
    pivot.position.copy(light.position);
    pivot.add(cone);
    for (const extra of pivotAdd) pivot.add(extra);
    scene.add(pivot);
    this.pool = new THREE.Mesh(new THREE.CircleGeometry(2.1, 24), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .16, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    this.pool.rotation.x = -Math.PI / 2; this.pool.position.y = .04;
    scene.add(this.pool);
  }
  update(dt, t) {
    const tx = this.cx + Math.sin(t * .31 + this.phase) * this.rangeX;
    const tz = this.cz + Math.sin(t * .23 + this.phase * 2.1) * this.rangeZ;
    this.target.position.set(tx, 0, tz);
    this.pool.position.x = tx; this.pool.position.z = tz;
    this.pivot.lookAt(tx, 0, tz);
    this.pivot.rotateX(-Math.PI / 2);
    this.head.lookAt(tx, 0, tz);
  }
}

// ---------- core tower (one glowing gear per shipped machine) ----------
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
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.5, .8, 6), new THREE.MeshStandardMaterial({ color: 0x1a222d, roughness: .5, metalness: .7 }));
    ped.position.y = .4; ped.castShadow = ped.receiveShadow = true; g.add(ped);
    const pedRing = new THREE.Mesh(new THREE.TorusGeometry(2.16, .05, 8, 40), new THREE.MeshStandardMaterial({ color: C.cyan, emissive: C.cyan, emissiveIntensity: 1.6 }));
    pedRing.rotation.x = Math.PI / 2; pedRing.position.y = .82; g.add(pedRing);
    const core = new THREE.Mesh(new THREE.CylinderGeometry(.55, .7, 14.6, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0x1a8fb8, transparent: true, opacity: .16, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false, fog: false }));
    core.position.y = 8.3; g.add(core);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.11, .16, 15.4, 8), new THREE.MeshStandardMaterial({ color: 0x39424e, roughness: .35, metalness: .8 }));
    shaft.position.y = 8.4; g.add(shaft);
    const finial = new THREE.Mesh(new THREE.SphereGeometry(.3, 10, 8), new THREE.MeshStandardMaterial({ color: C.cyan, emissive: C.cyan, emissiveIntensity: 1.8 }));
    finial.position.y = 16.3; g.add(finial);
    this.plaqueTex = canvasTexture(512, 128, () => {});
    const plaque = new THREE.Mesh(new THREE.PlaneGeometry(2.6, .65), new THREE.MeshBasicMaterial({ map: this.plaqueTex, transparent: true }));
    plaque.position.set(0, .78, 2.24); plaque.rotation.x = -.18; g.add(plaque);
    this.setPlaque(0);
    this.gearGeo = gearGeometry();
    this.gearMat = new THREE.MeshStandardMaterial({ color: C.brass, roughness: .3, metalness: .8, emissive: 0x8a6a20, emissiveIntensity: .5 });
    this.mesh = new THREE.InstancedMesh(this.gearGeo, this.gearMat, 320);
    this.mesh.count = 0; this.mesh.castShadow = true; this.mesh.frustumCulled = false; this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    g.add(this.mesh);
    this.count = 0; this.angles = []; this.sizes = [];
    this.flag = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .85), new THREE.MeshBasicMaterial({ map: textPlate('TODAY', { w: 256, h: 128, bg: 'rgba(6,14,22,0.85)', fg: '#8fe8ff', border: '#39d5ff', font: '700 56px ui-monospace,monospace' }), transparent: true, side: THREE.DoubleSide }));
    this.flag.position.set(1.1, 16.9, 0); this.flag.visible = false; g.add(this.flag);
    g.position.set(18.2, 0, 7.5);
    this.pos = g.position;
    scene.add(g);
    this._m4 = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._e = new THREE.Euler(); this._v = new THREE.Vector3(); this._s = new THREE.Vector3();
  }
  setPlaque(n) {
    const g = this.plaqueTex.image.getContext('2d');
    g.clearRect(0, 0, 512, 128);
    g.fillStyle = 'rgba(6,12,20,0.85)'; g.fillRect(0, 0, 512, 128);
    g.strokeStyle = '#39d5ff'; g.globalAlpha = .7; g.lineWidth = 4; g.strokeRect(3, 3, 506, 122); g.globalAlpha = 1;
    g.fillStyle = '#8fe8ff'; g.shadowColor = '#39d5ff'; g.shadowBlur = 14;
    g.font = '700 44px ui-monospace,monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(n + (n === 1 ? ' MACHINE' : ' MACHINES'), 256, 46);
    g.globalAlpha = .7; g.font = '600 30px ui-monospace,monospace'; g.shadowBlur = 6;
    g.fillText('SHIPPED TO PRODUCTION', 256, 96); g.globalAlpha = 1;
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
    this.mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(.3, 7, 6), new THREE.MeshStandardMaterial({ color: 0x6f8296, roughness: 1, transparent: true, opacity: .3 }), cap);
    this.mesh.count = cap; this.cap = cap; this.mesh.frustumCulled = false;
    this.parts = Array.from({ length: cap }, () => ({ life: 0 }));
    scene.add(this.mesh);
    this._m4 = new THREE.Matrix4();
  }
  puff(pos, n = 3) {
    for (let i = 0; i < n; i++) {
      const p = this.parts.find(p => p.life <= 0); if (!p) return;
      p.life = 1; p.x = pos.x + (Math.random() - .5) * .3; p.y = pos.y; p.z = pos.z + (Math.random() - .5) * .3;
      p.vx = (Math.random() - .5) * .3; p.vy = .8 + Math.random() * .5; p.vz = (Math.random() - .5) * .3;
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
    this.points = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffb347, size: .14, sizeAttenuation: true, transparent: true, opacity: .95 }));
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
class WeldSparks extends Sparks {
  constructor(scene, cap) {
    super(scene, cap);
    this.points.material.color.setHex(0x9feaff);
    this.points.material.size = .11;
  }
}

// ---------- dressing: crane, pipes, fans, racks, barrels ----------
function buildDressing(scene) {
  const g = new THREE.Group();
  // overhead bridge crane spanning the hall over the line (scale cue)
  const craneM = new THREE.MeshStandardMaterial({ color: 0x54431c, roughness: .55, metalness: .6, emissive: 0x8c6a1f, emissiveIntensity: .07 });
  const craneD = new THREE.MeshStandardMaterial({ color: 0x232b36, roughness: .45, metalness: .7 });
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(1.8, .7, 22.5), craneM);
  bridge.position.set(10.8, 10.3, -1); bridge.castShadow = true; g.add(bridge);
  const bridgeStrip = new THREE.Mesh(new THREE.BoxGeometry(1.84, .08, 5.5), new THREE.MeshStandardMaterial({ color: 0xffd9a0, emissive: 0xffc978, emissiveIntensity: .9 }));
  bridgeStrip.position.set(10.8, 9.9, -3); g.add(bridgeStrip);
  const bridgeRib = new THREE.Mesh(new THREE.BoxGeometry(2, .16, 22.5), craneD);
  bridgeRib.position.set(10.8, 10.75, -1); g.add(bridgeRib);
  for (const rz of [10.4, -12.4]) {
    const truck = new THREE.Mesh(new THREE.BoxGeometry(2.4, .55, 1.1), craneD);
    truck.position.set(10.8, 9.85, rz); g.add(truck);
  }
  const crab = new THREE.Mesh(new THREE.BoxGeometry(1.2, .8, 1.4), craneD);
  crab.position.set(10.8, 9.7, -3.2); g.add(crab);
  const hookCable = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 3.2, 6), craneD);
  hookCable.position.set(10.8, 7.9, -3.2); g.add(hookCable);
  const hook = new THREE.Mesh(new THREE.BoxGeometry(.45, .45, .45), craneM);
  hook.position.set(10.8, 6.2, -3.2); g.add(hook);
  const pipeM = new THREE.MeshStandardMaterial({ color: 0x232b36, roughness: .5, metalness: .7 });
  // wall fans
  const fans = [];
  for (const fx of [-16, 16]) {
    const fg = new THREE.Group();
    const housing = new THREE.Mesh(new THREE.CylinderGeometry(.85, .85, .3, 16), pipeM);
    housing.rotation.x = Math.PI / 2; fg.add(housing);
    const rimF = new THREE.Mesh(new THREE.TorusGeometry(.85, .05, 6, 24), new THREE.MeshStandardMaterial({ color: C.cyan, emissive: C.cyan, emissiveIntensity: .9 }));
    fg.add(rimF);
    const blades = new THREE.Group();
    for (let k = 0; k < 3; k++) { const bl = new THREE.Mesh(new THREE.BoxGeometry(.7, .18, .04), pipeM); bl.rotation.z = k * Math.PI * 2 / 3; blades.add(bl); }
    blades.position.z = .18; fg.add(blades);
    fg.position.set(fx, 8.6, HALL.zMin + .35);
    g.add(fg); fans.push(blades);
  }
  // storage racks along the back wall corners
  const rackM = new THREE.MeshStandardMaterial({ color: 0x1a222d, roughness: .5, metalness: .7 });
  const boxM = new THREE.MeshStandardMaterial({ color: 0x35415a, roughness: .6, metalness: .5, emissive: 0x1a8fb8, emissiveIntensity: .18 });
  const racks = [], boxes = [];
  const rand = seededRand(77);
  for (const rx of [-19.5, -16.5, 15, 18]) {
    for (let lv = 0; lv < 3; lv++) {
      racks.push(new THREE.BoxGeometry(2.4, .08, 1).translate(rx, .5 + lv * 1.05, -12.4));
      for (let bx = 0; bx < 3; bx++) if (rand() > .3)
        boxes.push(new THREE.BoxGeometry(.55 + rand() * .25, .5 + rand() * .3, .6).translate(rx - .8 + bx * .8, .83 + lv * 1.05, -12.4));
    }
    for (const px of [-1.15, 1.15]) racks.push(new THREE.BoxGeometry(.08, 3.3, 1).translate(rx + px, 1.65, -12.4));
  }
  const rackMesh = new THREE.Mesh(mergeGeometries(racks), rackM); rackMesh.castShadow = true; g.add(rackMesh);
  const boxMesh = new THREE.Mesh(mergeGeometries(boxes), boxM); boxMesh.castShadow = true; g.add(boxMesh);
  // barrel clusters
  const barrelM = new THREE.MeshStandardMaterial({ color: 0x2c343f, roughness: .45, metalness: .7 });
  const barrels = [];
  for (const [bx, bz, n] of [[-21.5, -11, 4], [20.5, 2.5, 3], [-21, 8.5, 2]])
    for (let i = 0; i < n; i++) barrels.push(new THREE.CylinderGeometry(.34, .34, .85, 10).translate(bx + (i % 2) * .75, .42, bz + Math.floor(i / 2) * .75));
  const barrelMesh = new THREE.Mesh(mergeGeometries(barrels), barrelM); barrelMesh.castShadow = true; g.add(barrelMesh);
  scene.add(g);
  return { fans };
}

// ---------- world ----------
export function buildWorld(canvas, { lite = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lite, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, lite ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;
  renderer.shadowMap.enabled = !lite; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.bg);
  scene.fog = new THREE.FogExp2(C.bg, .026);
  const camera = new THREE.PerspectiveCamera(lite ? 50 : 44, 1, .1, 120);
  camera.position.set(...(lite ? [-16, 9.5, 16] : [-19, 8, 15]));
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(...(lite ? [2, 2, -1] : [5, 2, -0.5]));
  controls.enableDamping = true; controls.dampingFactor = .08;
  controls.minDistance = 5; controls.maxDistance = 23;
  controls.maxPolarAngle = Math.PI * .53; controls.minPolarAngle = .12;
  controls.enablePan = true; controls.panSpeed = .7;

  const hemi = new THREE.HemisphereLight(0x3a506e, 0x0a0e14, 1.3);
  const fill1 = new THREE.PointLight(0x4a6a8c, 22, 28, 1.9); fill1.position.set(-6, 7, -4); scene.add(fill1);
  const bayLight = new THREE.SpotLight(0xbfd9ea, 260, 26, .72, .9, 1.6); bayLight.position.set(-2, 11.4, -3.4); bayLight.target.position.set(-2, 0, -3.6); scene.add(bayLight); scene.add(bayLight.target);
  const fill2 = new THREE.PointLight(0x4a6a8c, 18, 28, 1.9); fill2.position.set(8, 7, 4); scene.add(fill2); scene.add(hemi);
  const wallWash = new THREE.PointLight(0x5a7ea6, 24, 22, 1.8); wallWash.position.set(14.5, 8.5, 6); scene.add(wallWash);
  const portalLight = new THREE.PointLight(0x4ade80, 30, 13, 1.8); portalLight.position.set(13.4, 2.6, 2); scene.add(portalLight);
  const intakeLight = new THREE.PointLight(0xf08a24, 26, 13, 1.8); intakeLight.position.set(-16.2, 2.6, 2); scene.add(intakeLight);
  const coreLight = new THREE.PointLight(0x39d5ff, 26, 14, 1.8); coreLight.position.set(18.2, 4, 7.5); scene.add(coreLight);
  const weldLight = new THREE.PointLight(0x9feaff, 0, 8, 1.6); scene.add(weldLight);
  const rim = new THREE.DirectionalLight(0x4a6a8c, .5); rim.position.set(-10, 18, -12); scene.add(rim);

  buildHallShell(scene);
  const dressing = buildDressing(scene);
  const hall = { chimneyTop: new THREE.Vector3(13.6, 6.4, 2) };

  const sup = gateFrame('SUPPLIES', '#f08a24', 0xf08a24); sup.group.position.set(-16.4, 0, 2); scene.add(sup.group);
  const por = gateFrame('PRODUCTION', '#4ade80', 0x4ade80); por.group.position.set(13.6, 0, 2); scene.add(por.group);
  const glow = por.shimmer;

  const beltY = .95;
  const mainBelt = new Belt(scene, new THREE.Vector3(-16.4, beltY, 2), new THREE.Vector3(13.6, beltY, 2), 1.7);

  const bayXs = [-9.5, -5.5, -1.5, 2.5, 5.6];
  const bays = bayXs.map((x, i) => {
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.3, .3, 12), new THREE.MeshStandardMaterial({ color: 0x1a222d, roughness: .45, metalness: .7 }));
    pad.position.set(x, .65, -3.6); pad.receiveShadow = true; pad.castShadow = true; scene.add(pad);
    const padRing = new THREE.Mesh(new THREE.TorusGeometry(1.18, .045, 6, 28), new THREE.MeshStandardMaterial({ color: C.cyan, emissive: C.cyan, emissiveIntensity: 1.3 }));
    padRing.rotation.x = Math.PI / 2; padRing.position.set(x, .81, -3.6); scene.add(padRing);
    const robot = new RobotArm(scene, x - 1.7, -2.1, i);
    const line = new Belt(scene, new THREE.Vector3(x, beltY, -7.4), new THREE.Vector3(x, beltY, -4.7), 1.0);
    line.group.visible = false; line.speed = 2.6;
    const flagHolder = new THREE.Group(); flagHolder.position.set(x, 4.6, -7.3); flagHolder.visible = false; scene.add(flagHolder);
    return { i, x, pad, padRing, robot, line, flagHolder, busy: false, flagMesh: null };
  });

  const gantries = [new Gantry(scene, 2, 0), new Gantry(scene, -5.6, 2.4)];
  const rigs = [
    new SpotRig(scene, { x: -8, z: -1, color: 0xbfe8ff, phase: 0, rangeX: 7, rangeZ: 4, cx: -7, cz: -1, shadow: !lite, lite }),
    new SpotRig(scene, { x: 4, z: 5, color: 0x7fe0ff, phase: 2.1, rangeX: 8, rangeZ: 4.5, cx: 3, cz: 1.5, shadow: false, lite }),
  ];
  if (!lite) rigs.push(new SpotRig(scene, { x: -1, z: -8, color: 0xffd9a0, phase: 4.4, rangeX: 9, rangeZ: 3, cx: -1, cz: -5, shadow: false, lite }));

  const monument = new Monument(scene);
  const smoke = new Smoke(scene, lite ? 14 : 30);
  const sparks = new Sparks(scene, lite ? 90 : 240);
  const weldSparks = new WeldSparks(scene, lite ? 60 : 160);

  const crateGeo = mergeGeometries([
    new THREE.BoxGeometry(.55, .45, .55),
    new THREE.BoxGeometry(.59, .12, .59).translate(0, .18, 0),
  ]);
  const crateMesh = new THREE.InstancedMesh(crateGeo, new THREE.MeshStandardMaterial({ color: 0x35415a, roughness: .5, metalness: .6, emissive: 0x1a8fb8, emissiveIntensity: .35 }), 48);
  crateMesh.count = 0; crateMesh.castShadow = true; crateMesh.frustumCulled = false; crateMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(crateMesh);
  const crateState = [];
  const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3(1, 1, 1);
  let weldTimer = 0;

  const world = {
    scene, camera, renderer, controls, bays, monument, mainBelt, hall, lite,
    glow, smoke, sparks,
    portalPos: new THREE.Vector3(13.4, 1.4, 2),
    suppliesPos: new THREE.Vector3(-16.4, 1.4, 2),
    t: 0,
    setFlag(bay, branch) {
      if (bay.flagMesh) { bay.flagHolder.remove(bay.flagMesh); bay.flagMesh.material.map.dispose(); bay.flagMesh.material.dispose(); bay.flagMesh.geometry.dispose(); bay.flagMesh = null; }
      if (!branch) { bay.flagHolder.visible = false; return; }
      const label = branch.length > 22 ? branch.slice(0, 21) + '…' : branch;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(3.2, .62), new THREE.MeshBasicMaterial({ map: textPlate(label, { w: 512, h: 96, bg: 'rgba(6,14,22,0.8)', fg: '#8fe8ff', border: '#39d5ff', font: '600 40px ui-monospace,monospace' }), transparent: true, side: THREE.DoubleSide }));
      bay.flagMesh = m; bay.flagHolder.add(m); bay.flagHolder.visible = true;
    },
    spawnCrate(from, to, dur, spinSeed, onDone) {
      if (crateState.length >= 48) { onDone && onDone(); return null; }
      const st = { from: from.clone(), to: to.clone(), t: 0, dur: Math.max(.12, dur), arc: .8 + (spinSeed % 3) * .2, rot: (spinSeed % 7) * .4, onDone, alive: true };
      crateState.push(st);
      return st;
    },
    clearCrates() { crateState.length = 0; crateMesh.count = 0; },
    portalFlash() { glow.material.opacity = .95; sparks.burst(world.portalPos, 26, 2.6, 3.6); portalLight.intensity = 90; },
    update(dt) {
      world.t += dt;
      const t = world.t;
      mainBelt.update(dt);
      let welding = null;
      for (const b of bays) {
        b.line.update(dt);
        b.robot.update(dt, t, b.busy);
        b.padRing.material.emissiveIntensity = b.busy ? 2.2 : 1.1;
        if (b.busy && !welding) welding = b;
      }
      for (const gn of gantries) gn.update(dt, t);
      for (const bl of dressing.fans) bl.rotation.z += dt * 2.4;
      for (const r of rigs) r.update(dt, t);
      monument.update(dt, t);
      smoke.update(dt); sparks.update(dt); weldSparks.update(dt);
      glow.material.opacity = Math.max(.14, glow.material.opacity - dt * 1.4);
      portalLight.intensity = Math.max(30, portalLight.intensity - dt * 160);
      sup.shimmer.material.opacity = .12 + Math.sin(t * 1.7) * .05;
      // welding flicker on one active bay
      weldTimer -= dt;
      if (welding && weldTimer <= 0) {
        weldTimer = .12 + Math.random() * .3;
        const p = welding.robot.tipWorld();
        weldSparks.burst(p, 7, 1.4, 1.6);
        weldLight.position.copy(p);
        weldLight.intensity = 26 + Math.random() * 22;
      }
      weldLight.intensity = Math.max(0, weldLight.intensity - dt * 180);
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
      if (Math.random() < dt * .12) smoke.puff(hall.chimneyTop, 1);
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
