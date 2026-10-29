import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeSpecies, makeBlade, rngFor } from './plants.js';
import { hexPrism, hexOutline, axial, inHex } from './terrain.js';

export const PROFILES = {
  desktop: { name: 'desktop', detail: 1, shadows: true, dpr: 1.75, K: 8, cellK: 5, trailK: 14, plants: 30, grass: 420, trailPlants: 70, trailGrass: 1300, creatures: 10, pollen: 150, clouds: 6, fov: 34 },
  mobile: { name: 'mobile', detail: 0, shadows: false, dpr: 1.5, K: 4, cellK: 3, trailK: 7, plants: 11, grass: 70, trailPlants: 22, trailGrass: 240, creatures: 3, pollen: 0, clouds: 0, fov: 38 },
};
const TERRACOTTA = '#c65d3b', SLAB_H = 0.55, CELL_H = 0.14, R_THEME = 3.15, R_CELL = 1.0, TRAIL_R = 6.8, TRAIL_H = 0.8, TILE_R = 1.12, TILE_H = 0.2;
const CELL_SLOTS = [[0, 0], [1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
const ORDER = [0, 1, 3, 5, 2, 4, 6];
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fraction = (progress) => { const total = (progress?.cards_total || 0) + (progress?.checkpoints_total || 0); return total ? ((progress.cards_completed || 0) + (progress.checkpoints_correct || 0)) / total : 0; };
const spiral = (n) => { const out = [[0, 0]]; for (let radius = 1; out.length < n; radius++) { let q = -radius, r = radius; for (const [dq, dr] of [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]]) for (let i = 0; i < radius && out.length < n; i++) { out.push([q, r]); q += dq; r += dr; } } return out; };
// Successive hex tiles of a learning path, as axial steps (a gentle zigzag).
const CHAIN = [[1, 0], [0, 1], [1, 0], [1, -1], [1, 0], [0, 1]];

const MIX = {
  meadow: { sig: ['tree', 'blossomTree', 'tree'], mid: ['bush', 'flowerPink', 'flowerBlue', 'flowerYellow'], low: ['flowerPink', 'flowerYellow', 'flowerWhite', 'flowerBlue'], lesson: 'tree', flower: 'flowerPink' },
  forest: { sig: ['pine', 'forestTree', 'pine'], mid: ['fern', 'fern', 'bush'], low: ['mushroom', 'fern', 'rock', 'mushroom'], lesson: 'pine', flower: 'mushroom' },
  orchard: { sig: ['appleTree', 'appleTree'], mid: ['herbBush', 'berryBush', 'sunflower'], low: ['carrot', 'carrot', 'carrot', 'flowerWhite'], lesson: 'appleTree', flower: 'carrot' },
  mesa: { sig: ['cactus', 'cactus'], mid: ['agave', 'redRock', 'agave'], low: ['flowerOrange', 'redRock', 'flowerOrange'], lesson: 'cactus', flower: 'flowerOrange' },
  lavender: { sig: ['sunflower', 'sunflower'], mid: ['lavender', 'lavender', 'lavender'], low: ['lavender', 'flowerYellow', 'lavender'], lesson: 'sunflower', flower: 'lavender' },
  pond: { sig: ['reed', 'reed', 'blossomTree'], mid: ['reed', 'flowerWhite', 'bush'], low: ['flowerWhite', 'flowerBlue', 'reed'], lesson: 'lotus', flower: 'flowerWhite' },
  alpine: { sig: ['snowPine', 'snowPine', 'pine'], mid: ['rock', 'bush', 'snowPine'], low: ['flowerWhite', 'rock', 'flowerBlue'], lesson: 'snowPine', flower: 'flowerWhite' },
};
const SIG_SCALE = { tree: [0.62, 0.85], blossomTree: [0.6, 0.8], forestTree: [0.6, 0.85], appleTree: [0.58, 0.8], pine: [0.62, 0.9], snowPine: [0.6, 0.85], cactus: [0.7, 1.0], sunflower: [0.8, 1.1], reed: [0.9, 1.25] };

function scatter(rng, n, test, minD, R) {
  const pts = [];
  for (let tries = 0; pts.length < n && tries < n * 40; tries++) {
    const x = (rng() * 2 - 1) * R, z = (rng() * 2 - 1) * R;
    if (!test(x, z)) continue;
    if (minD > 0 && pts.some((p) => (p[0] - x) ** 2 + (p[1] - z) ** 2 < minD * minD)) continue;
    pts.push([x, z]);
  }
  return pts;
}

// One InstancedMesh per species. Growth is applied on the CPU so shadows stay correct.
class Plants {
  constructor(species, mat, cast) { this.species = species; this.mat = mat; this.cast = cast; this.items = {}; this.meshes = []; this.dummy = new THREE.Object3D(); }
  add(name, o) { (this.items[name] ||= []).push(o); }
  build(parent) {
    for (const [name, list] of Object.entries(this.items)) {
      const mesh = new THREE.InstancedMesh(this.species[name], this.mat, list.length);
      mesh.castShadow = this.cast; mesh.receiveShadow = true; mesh.frustumCulled = false;
      list.forEach((it, i) => mesh.setColorAt(i, it.tint || new THREE.Color(1, 1, 1)));
      mesh.instanceColor.needsUpdate = true; mesh.userData.list = list; this.meshes.push(mesh); parent.add(mesh);
    }
  }
  update(disp) {
    const d = this.dummy;
    for (const mesh of this.meshes) {
      const list = mesh.userData.list;
      for (let i = 0; i < list.length; i++) {
        const it = list[i], p = disp.get(it.key) ?? 0;
        let e = smooth((p - it.thr) / it.w);
        if (it.inv) e = 1 - e;
        const f = it.min != null ? it.min + (1 - it.min) * e : e;
        const s = it.s * Math.max(f * (it.grow ? 0.65 + 0.35 * clamp(p) : 1), 0.0001);
        d.position.set(it.x, it.y, it.z); d.rotation.set(0, it.rot, 0); d.scale.set(s, s, s); d.updateMatrix();
        mesh.setMatrixAt(i, d.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  }
  dispose() { this.meshes.forEach((m) => { m.parent?.remove(m); m.dispose(); }); }
}

export function createGarden({ container, profile: P, themes: THEMES, rewards, recentLessons = [], onOpenLesson, onRewardInfo, onPracticeQuiz, reduced = false }) {
  const state = { rewards, recentLessons };
  const prof = typeof P === 'string' ? PROFILES[P] : P;
  const mobile = prof.name === 'mobile';
  const root = document.createElement('div');
  root.className = `lg-root ${mobile ? 'lg-mobile' : 'lg-desktop'}`;
  root.innerHTML = `<canvas class="lg-canvas" tabindex="0" aria-label="Interactive 3D garden of learning themes. Drag to orbit, scroll or pinch to zoom, tap a hexagon to open it."></canvas>
  <div class="lg-labels" aria-hidden="true"></div><div class="lg-fade"></div>
  <nav class="lg-crumbs" aria-label="Garden location"></nav>
  <div class="lg-stats" aria-label="Progress totals"></div>
  <aside class="lg-panel" aria-live="polite"><button class="lg-handle" aria-label="Expand or collapse details"><span></span></button><div class="lg-panel-body"></div></aside>
  <div class="lg-zoom"><button data-zoom="in" aria-label="Zoom in">+</button><button data-zoom="out" aria-label="Zoom out">−</button></div><div class="lg-hint"></div><div class="lg-toast" role="status"></div><div class="lg-error" hidden>This garden needs WebGL. Open it in a browser with hardware acceleration enabled.</div>`;
  container.appendChild(root);
  const $ = (s) => root.querySelector(s);
  const canvas = $('.lg-canvas');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' }); }
  catch (e) { $('.lg-error').hidden = false; return { dispose() { root.remove(); }, failed: true }; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, prof.dpr));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.02;
  if (prof.shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }

  const scene = new THREE.Scene();
  const HORIZON = new THREE.Color('#f8eddc');
  scene.fog = new THREE.Fog(HORIZON, 46, 130);
  const camera = new THREE.PerspectiveCamera(prof.fov, 1, 0.1, 400);
  const controls = new OrbitControls(camera, canvas);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.08, rotateSpeed: 0.7, zoomSpeed: 0.8, minPolarAngle: 0.2, maxPolarAngle: 1.28, screenSpacePanning: false, enablePan: true });
  controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
  controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE };
  controls.enableZoom = true; controls.panSpeed = 1.1;
  controls.autoRotate = !reduced; controls.autoRotateSpeed = 0.35;

  scene.add(new THREE.HemisphereLight('#fff7ea', '#d9ccb2', 1.35));
  const sun = new THREE.DirectionalLight('#fff0d8', 2.5);
  sun.position.set(-12, 20, 11);
  if (prof.shadows) { sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 70 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3; }
  scene.add(sun); scene.add(sun.target);
  const fill = new THREE.DirectionalLight('#cfe0ff', 0.55); fill.position.set(14, 8, -10); scene.add(fill);

  const sky = new THREE.Mesh(new THREE.SphereGeometry(200, 24, 12), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { top: { value: new THREE.Color('#bcd8ea') }, mid: { value: new THREE.Color('#f9e9d3') }, bot: { value: HORIZON.clone() } }, vertexShader: 'varying vec3 vP; void main(){ vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }', fragmentShader: 'varying vec3 vP; uniform vec3 top,mid,bot; void main(){ float h=vP.y; vec3 c = h>0. ? mix(mid, top, pow(h,.55)) : mix(mid, bot, clamp(-h*4.,0.,1.)); gl_FragColor=vec4(c,1.); }' }));
  scene.add(sky);
  const GROUND_Y = -0.95;
  const table = new THREE.Mesh(new THREE.CircleGeometry(150, 48).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#eee6d8', roughness: 1 }));
  table.position.y = GROUND_Y; scene.add(table);
  const contact = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 8, 64, 64, 64);
    g.addColorStop(0, 'rgba(90,70,40,.38)'); g.addColorStop(0.55, 'rgba(90,70,40,.16)'); g.addColorStop(1, 'rgba(90,70,40,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, fog: false }));
    blob.position.y = GROUND_Y + 0.01; blob.scale.setScalar(36); scene.add(blob); return blob;
  })();

  const species = makeSpecies(prof.detail);
  const plantMat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.88 });
  const bladeGeo = makeBlade();
  { const n = bladeGeo.attributes.position.count, c = new Float32Array(n * 3), base = new THREE.Color('#3f7d36'), tip = new THREE.Color('#a8d466'), t = new THREE.Color(); for (let i = 0; i < n; i++) { t.copy(base).lerp(tip, bladeGeo.attributes.position.getY(i)); c.set([t.r, t.g, t.b], i * 3); } bladeGeo.setAttribute('color', new THREE.BufferAttribute(c, 3)); }
  const grassUniforms = { uTime: { value: 0 } };
  const grassMat = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 1 });
  grassMat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = grassUniforms.uTime;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aGrow; uniform float uTime;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
      vec4 ip = instanceMatrix * vec4(0.,0.,0.,1.);
      float sw = sin(uTime*1.7 + ip.x*1.1 + ip.z*0.8)*0.2 + sin(uTime*2.9 + ip.x*2.3 - ip.z)*0.07;
      float hh = position.y*position.y;
      transformed.y *= aGrow;
      transformed.x += sw*hh*aGrow; transformed.z += sw*0.6*hh*aGrow;`);
  };
  const dummy = new THREE.Object3D();
  function makeGrass(list, parent) {
    if (!list.length) return null;
    const geo = bladeGeo.clone(), grow = new Float32Array(list.length);
    geo.setAttribute('aGrow', new THREE.InstancedBufferAttribute(grow, 1));
    const mesh = new THREE.InstancedMesh(geo, grassMat, list.length);
    list.forEach((g, i) => { dummy.position.set(g.x, g.y, g.z); dummy.rotation.set(0, g.rot, 0); dummy.scale.setScalar(g.s); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix); mesh.setColorAt(i, g.tint); });
    mesh.frustumCulled = false; mesh.userData.list = list; parent.add(mesh);
    return mesh;
  }
  function updateGrass(mesh, disp) {
    if (!mesh) return; const a = mesh.geometry.attributes.aGrow, list = mesh.userData.list;
    for (let i = 0; i < list.length; i++) { const p = disp.get(list[i].key) ?? 0; a.array[i] = 0.22 + 0.78 * smooth(p * 1.6) * (0.75 + 0.25 * list[i].v); }
    a.needsUpdate = true;
  }

  // ----- Garden of themes -----
  const garden = new THREE.Group(); scene.add(garden);
  const spacing = Math.sqrt(3) * R_THEME + 0.5;
  const themeSlots = THEMES.length <= 7 ? [[0, 0], [1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]] : spiral(THEMES.length);
  const themeMeshes = [], cellMeshes = [], tiles = [];
  const gardenPlants = new Plants(species, plantMat, prof.shadows);
  const grassList = [], rng = rngFor(20261028);
  THEMES.forEach((theme, ti) => {
    const [q, r] = themeSlots[ti], c = axial(q, r, spacing / Math.sqrt(3));
    const slab = new THREE.Mesh(hexPrism(R_THEME, SLAB_H, { K: prof.K, top: theme.top2, top2: theme.top, seed: ti + 1, noise: 0.015 }), new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 }));
    slab.position.set(c.x, 0, c.z); slab.castShadow = prof.shadows; slab.receiveShadow = true; slab.userData.pick = { kind: 'theme', ti };
    garden.add(slab); themeMeshes.push(slab);
    const mix = MIX[theme.terrain], T = { ti, theme, center: new THREE.Vector3(c.x, SLAB_H, c.z), cells: [] };
    theme.paths.forEach((path, pi) => {
      const [cq, cr] = CELL_SLOTS[ORDER[pi]] || spiral(theme.paths.length)[pi], cc = axial(cq, cr, R_CELL * 1.035), cx = c.x + cc.x, cz = c.z + cc.z;
      const mesh = new THREE.Mesh(hexPrism(R_CELL, CELL_H, { K: prof.cellK, top: '#' + new THREE.Color(theme.top).offsetHSL(0, 0, 0.02 * (pi % 3)).getHexString(), top2: theme.top2, seed: ti * 10 + pi + 3, noise: 0.05, bevel: 0.05, colorJitter: 0.09 }), new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 }));
      mesh.position.set(cx, SLAB_H, cz); mesh.castShadow = prof.shadows; mesh.receiveShadow = true; mesh.userData.pick = { kind: 'path', ti, pi };
      garden.add(mesh); cellMeshes.push(mesh);
      const key = `c${ti}.${pi}`, top = SLAB_H + CELL_H, cell = { pi, path, key, center: new THREE.Vector3(cx, top, cz), mesh };
      T.cells.push(cell);
      const isPond = theme.terrain === 'pond', pondR = 0.42;
      if (isPond) {
        const water = new THREE.Mesh(new THREE.CircleGeometry(pondR, 20).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#79bfd8', transparent: true, opacity: 0.86, roughness: 0.12, metalness: 0.1 }));
        water.position.set(cx, top + 0.012, cz); garden.add(water);
        const rim = new THREE.Mesh(new THREE.RingGeometry(pondR, pondR + 0.07, 20).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#cfc3a4', roughness: 1 }));
        rim.position.set(cx, top + 0.014, cz); garden.add(rim);
        for (let k = 0; k < 3; k++) { const a = k * 2.2 + pi; gardenPlants.add('lotus', { x: cx + Math.cos(a) * 0.19, y: top + 0.012, z: cz + Math.sin(a) * 0.19, rot: rng() * 6, s: 0.9 + rng() * 0.3, thr: 0.15 + k * 0.2, w: 0.3, key }); }
      }
      const test = (x, z) => inHex(x, z, 0.86) && (!isPond || Math.hypot(x, z) > pondR + 0.14);
      const pts = scatter(rng, prof.plants, test, mobile ? 0.3 : 0.21, 0.9);
      pts.forEach((pt, i) => {
        const u = i / Math.max(1, pts.length - 1), tier = u < 0.28 ? 'sig' : u < 0.62 ? 'mid' : 'low', list = mix[tier];
        const name = list[Math.floor(rng() * list.length)], sr = SIG_SCALE[name];
        let s, thr, w;
        if (tier === 'sig') { s = sr ? sr[0] + rng() * (sr[1] - sr[0]) : 0.9; thr = 0.4 + rng() * 0.5; w = 0.3; }
        else if (tier === 'mid') { s = (sr ? sr[0] * 0.9 : 1.0) * (0.75 + rng() * 0.45); thr = 0.15 + rng() * 0.4; w = 0.3; }
        else { s = (name === 'rock' || name === 'redRock') ? 0.7 + rng() * 0.6 : 0.9 + rng() * 0.5; thr = 0.01 + rng() * 0.3; w = 0.25; }
        gardenPlants.add(name, { x: cx + pt[0], y: top + 0.01, z: cz + pt[1], rot: rng() * 6.28, s, thr, w, key, grow: true, min: 0.14, tint: new THREE.Color().setScalar(0.88 + rng() * 0.22) });
      });
      const gp = scatter(rng, prof.grass, (x, z) => inHex(x, z, 0.9) && (!isPond || Math.hypot(x, z) > pondR + 0.08), 0, 0.92), gtint = new THREE.Color(theme.top);
      gp.forEach((pt) => grassList.push({ x: cx + pt[0], y: top, z: cz + pt[1], s: 0.14 + rng() * 0.16, rot: rng() * 6.28, key, v: rng(), tint: gtint.clone().offsetHSL((rng() - 0.5) * 0.03, 0, (rng() - 0.5) * 0.2).addScalar(0.45) }));
    });
    tiles.push(T);
  });
  gardenPlants.build(garden);
  const gardenGrass = makeGrass(grassList, garden);

  const outlineMat = new THREE.MeshBasicMaterial({ color: TERRACOTTA, transparent: true, opacity: 0.95, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, side: THREE.DoubleSide });
  const cellOutline = new THREE.Mesh(hexOutline(R_CELL, 0.07), outlineMat), slabOutline = new THREE.Mesh(hexOutline(R_THEME + 0.02, 0.11), outlineMat), selOutline = new THREE.Mesh(hexOutline(R_CELL, 0.09), outlineMat), tileOutline = new THREE.Mesh(hexOutline(TILE_R, 0.08), outlineMat);
  [cellOutline, slabOutline, selOutline, tileOutline].forEach((o) => { o.visible = false; o.renderOrder = 5; scene.add(o); });

  // ----- Ambient life -----
  const clouds = new THREE.Group(); scene.add(clouds);
  if (prof.clouds) {
    const cm = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true, transparent: true, opacity: 0.92 }), cr = rngFor(77);
    for (let i = 0; i < prof.clouds; i++) {
      const g = new THREE.Group(), n = 4 + Math.floor(cr() * 3);
      for (let k = 0; k < n; k++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6 + cr() * 1.6, 1), cm); b.position.set((k - n / 2) * 2.1, cr() * 0.8, (cr() - 0.5) * 2); b.scale.y = 0.55; g.add(b); }
      g.position.set((cr() - 0.5) * 90, 15 + cr() * 7, -20 - cr() * 45); g.userData.v = 0.25 + cr() * 0.3; clouds.add(g);
    }
  }
  const flyers = new THREE.Group(); scene.add(flyers);
  const wingGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.16, 0.09, 0.05), new THREE.Vector3(0.12, -0.08, 0.04)]).setIndex([0, 1, 2, 0, 2, 1]);
  const flyerRng = rngFor(5);
  for (let i = 0; i < prof.creatures; i++) {
    const g = new THREE.Group(), col = ['#f2a65a', '#f5d36b', '#e98a9f', '#f6f1e4', '#8fb8e8'][i % 5], mat = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide });
    const wl = new THREE.Mesh(wingGeo, mat), wr = new THREE.Mesh(wingGeo, mat); wr.scale.x = -1; g.add(wl, wr);
    g.userData = { wl, wr, ph: flyerRng() * 10, rad: 1.2 + flyerRng() * 2.2, sp: 0.35 + flyerRng() * 0.35, off: flyerRng() * 6.28, h: 0.9 + flyerRng() * 1.0, scale: 0.8 + flyerRng() * 0.5 };
    flyers.add(g);
  }
  let pollen = null;
  if (prof.pollen) {
    const n = prof.pollen, a = new Float32Array(n * 3), r2 = rngFor(9);
    for (let i = 0; i < n; i++) a.set([(r2() - 0.5) * 22, r2() * 4, (r2() - 0.5) * 22], i * 3);
    pollen = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(a, 3)), new THREE.PointsMaterial({ color: '#fff0b8', size: 0.07, transparent: true, opacity: 0.75, depthWrite: false }));
    pollen.frustumCulled = false; scene.add(pollen);
  }
  const RAIN_N = mobile ? 140 : 420, rainArr = new Float32Array(RAIN_N * 6), rainSeed = new Float32Array(RAIN_N * 3);
  { const r3 = rngFor(3); for (let i = 0; i < RAIN_N; i++) rainSeed.set([(r3() - 0.5) * 2, r3(), (r3() - 0.5) * 2], i * 3); }
  const rain = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(rainArr, 3)), new THREE.LineBasicMaterial({ color: '#4f9fe0', transparent: true, opacity: 0.65, depthWrite: false }));
  rain.frustumCulled = false; rain.visible = false; scene.add(rain);

  // Growth follows persisted learner progress from the API.
  const disp = new Map();
  let trail = null, trailGroup = null;
  const targetOf = (key) => {
    if (key[0] === 'c') { const [t, p] = key.slice(1).split('.').map(Number); return fraction(THEMES[t].paths[p].progress); }
    if (!trail) return 0;
    return key === 'T' ? fraction(trail.path.progress) : fraction(trail.path.lessonData[Number(key.slice(1))]?.progress);
  };
  const pathP = (ti, pi) => disp.get(`c${ti}.${pi}`) ?? 0;
  const lessonInfo = (path) => {
    const n = path.lessonData.length, cur = path.lessonData.filter((lesson) => lesson.progress.completed).length;
    return { n, cur, cards: path.lessonData[cur]?.progress.cards_completed || 0, done: !!path.progress.completed };
  };
  const totals = () => ({ ...state.rewards, started: THEMES.reduce((n, t) => n + t.paths.filter((p) => p.progress.started).length, 0), paths: THEMES.reduce((n,t) => n + t.paths.length, 0) });

  // ----- Learning path: successive hex tiles, one per lesson, one dot per card -----
  const tileCol = [new THREE.Color(1, 1, 1), new THREE.Color(0.95, 0.9, 0.78), new THREE.Color(0.83, 0.79, 0.68)];
  function disposeTrail() {
    if (!trailGroup) return;
    trailGroup.traverse((o) => { o.geometry?.dispose?.(); if (o.userData.own) { o.material?.map?.dispose?.(); o.material?.dispose?.(); } });
    trail?.plants.dispose(); scene.remove(trailGroup); trailGroup = null; trail = null;
    [...disp.keys()].filter((k) => k[0] === 'T' || k[0] === 'L').forEach((k) => disp.delete(k));
  }
  function buildTrail(ti, pi) {
    disposeTrail();
    const theme = THEMES[ti], path = theme.paths[pi], n = path.lessons.length, mix = MIX[theme.terrain], r = rngFor(ti * 100 + pi * 7 + 1);
    const g = new THREE.Group(), top = TRAIL_H, tTop = TRAIL_H + TILE_H;
    const plat = new THREE.Mesh(hexPrism(TRAIL_R, TRAIL_H, { K: prof.trailK, top: theme.top, top2: theme.top2, seed: ti * 10 + pi + 40, noise: 0.45, bevel: 0.04, colorJitter: 0.07 }), new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 }));
    plat.rotation.y = Math.PI / 6; plat.castShadow = prof.shadows; plat.receiveShadow = true; plat.userData.own = true; g.add(plat);
    // axial chain of tiles
    const ax = n > 7 ? spiral(n) : (() => { const cells = [[0, 0]]; for (let i = 1; i < n; i++) { const d = CHAIN[(i - 1) % CHAIN.length]; cells.push([cells[i - 1][0] + d[0], cells[i - 1][1] + d[1]]); } return cells; })();
    const wp = ax.map(([q, rr]) => axial(q, rr, TILE_R * 1.06));
    const cx = (Math.min(...wp.map((p) => p.x)) + Math.max(...wp.map((p) => p.x))) / 2, cz = (Math.min(...wp.map((p) => p.z)) + Math.max(...wp.map((p) => p.z))) / 2;
    const plants = new Plants(species, plantMat, prof.shadows), nodes = [];
    const ringGeo = hexOutline(TILE_R * 1.0, 0.075), dotGeo = new THREE.CircleGeometry(0.068, 12).rotateX(-Math.PI / 2);
    const lessonName = mix.lesson, big = { tree: 0.85, pine: 0.9, snowPine: 0.9, appleTree: 0.85, cactus: 1.05, lotus: 1.25, sunflower: 1.15 }[lessonName] || 1;
    wp.forEach((w, i) => {
      const x = w.x - cx, z = w.z - cz;
      const tile = new THREE.Mesh(hexPrism(TILE_R, TILE_H, { K: prof.cellK, top: theme.top, top2: theme.top2, seed: ti * 13 + pi * 5 + i + 90, noise: 0.05, bevel: 0.05, colorJitter: 0.07 }), new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 }));
      tile.position.set(x, top, z); tile.castShadow = prof.shadows; tile.receiveShadow = true; tile.userData = { pick: { kind: 'lesson', i }, own: true }; g.add(tile);
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: '#b9b3a2', transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide })); ring.position.set(x, tTop + 0.03, z); ring.userData.own = true; g.add(ring);
      const dotMat = [], dotMeshes = [];
      const cardCount = path.lessonData[i]?.progress.cards_total || 0;
      for (let k = 0; k < cardCount; k++) { const m = new THREE.MeshBasicMaterial({ color: '#e9e1cd' }), d = new THREE.Mesh(dotGeo, m); d.position.set(x + (k - (cardCount - 1) / 2) * Math.min(0.21, 1.1 / Math.max(cardCount, 1)), tTop + 0.04, z + 0.74); d.userData.own = true; g.add(d); dotMat.push(m); dotMeshes.push(d); }
      const key = `L${i}`;
      plants.add(lessonName, { x, y: tTop + 0.01, z: z - 0.1, rot: r() * 6, s: big, thr: 0, w: 1, key, min: 0.2, tint: new THREE.Color().setScalar(0.96) });
      plants.add('mound', { x, y: tTop + 0.01, z: z - 0.1, rot: 0, s: 1.3, thr: 0, w: 0.25, key, inv: true });
      plants.add('sprout', { x: x + 0.1, y: tTop + 0.02, z: z - 0.05, rot: r() * 6, s: 1.4, thr: 0, w: 0.2, key, inv: true });
      for (let k = 0; k < (mobile ? 3 : 6); k++) { const a = (k / 6) * 6.28 + i * 0.7, d = 0.55 + (k % 2) * 0.08; plants.add(mix.flower, { x: x + Math.cos(a) * d, y: tTop + 0.01, z: z - 0.1 + Math.sin(a) * d * 0.7, rot: r() * 6, s: 1.1 + r() * 0.3, thr: 0.8 + k * 0.025, w: 0.18, key }); }
      nodes.push({ i, pos: new THREE.Vector3(x, tTop, z), ring, stone: tile, dotMat });
    });
    const inside = (x, z) => inHex(z, x, TRAIL_R - 0.5) && nodes.every((nd) => (nd.pos.x - x) ** 2 + (nd.pos.z - z) ** 2 > 3.4);
    scatter(r, prof.trailPlants, inside, mobile ? 0.8 : 0.5, TRAIL_R).forEach((pt, i, arr) => {
      const u = i / arr.length, tier = u < 0.3 ? 'sig' : u < 0.65 ? 'mid' : 'low', lst = mix[tier], name = lst[Math.floor(r() * lst.length)], sr = SIG_SCALE[name];
      const s = tier === 'sig' ? (sr ? sr[0] + r() * (sr[1] - sr[0]) : 1) * 1.35 : tier === 'mid' ? 1.25 * (0.8 + r() * 0.5) : (name.includes('ock') ? 1.2 : 1.5) * (0.8 + r() * 0.5);
      plants.add(name, { x: pt[0], y: top + 0.03, z: pt[1], rot: r() * 6.28, s, thr: tier === 'sig' ? 0.3 + r() * 0.5 : tier === 'mid' ? 0.1 + r() * 0.4 : r() * 0.25, w: 0.3, key: 'T', grow: true, tint: new THREE.Color().setScalar(0.9 + r() * 0.2) });
    });
    plants.build(g);
    // Next-lesson marker: a gold pennant, a soft halo and a budding orange flower, moved onto the next lesson tile.
    const nextMark = new THREE.Group();
    {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.95, 5).translate(0, 0.475, 0), new THREE.MeshStandardMaterial({ color: '#d9cdb8', roughness: 0.9 }));
      pole.userData.own = true;
      const clothGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.95, 0), new THREE.Vector3(0.36, 0.84, 0), new THREE.Vector3(0, 0.72, 0)]).setIndex([0, 1, 2, 0, 2, 1]);
      clothGeo.computeVertexNormals();
      const cloth = new THREE.Mesh(clothGeo, new THREE.MeshStandardMaterial({ color: '#e3a83c', roughness: 0.6, side: THREE.DoubleSide, emissive: '#6b4a0e', emissiveIntensity: 0.3 }));
      cloth.userData.own = true;
      const pennant = new THREE.Group(); pennant.add(pole, cloth); pennant.position.set(-0.62, 0, 0.42); pennant.rotation.y = 0.3;
      const hc = document.createElement('canvas'); hc.width = hc.height = 128; const hx = hc.getContext('2d');
      const hg = hx.createRadialGradient(64, 64, 8, 64, 64, 64);
      hg.addColorStop(0, 'rgba(232,179,75,.5)'); hg.addColorStop(0.55, 'rgba(232,179,75,.18)'); hg.addColorStop(1, 'rgba(232,179,75,0)');
      hx.fillStyle = hg; hx.fillRect(0, 0, 128, 128);
      const halo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(hc), transparent: true, depthWrite: false }));
      halo.scale.setScalar(3.6); halo.position.y = 0.015; halo.renderOrder = 4; halo.userData.own = true;
      const bud = new THREE.Mesh(species.flowerOrange.clone(), plantMat); bud.scale.setScalar(1.6); bud.position.set(0.3, 0.012, 0.26); bud.rotation.y = 0.7;
      nextMark.add(pennant, halo, bud); nextMark.userData = { halo, pennant };
    }
    g.add(nextMark);
    const gl = [], gt = new THREE.Color(theme.top);
    scatter(r, prof.trailGrass, (x, z) => inHex(z, x, TRAIL_R - 0.35) && nodes.every((nd) => (nd.pos.x - x) ** 2 + (nd.pos.z - z) ** 2 > 1.5), 0, TRAIL_R)
      .forEach((pt) => gl.push({ x: pt[0], y: top, z: pt[1], s: 0.22 + r() * 0.25, rot: r() * 6.28, key: 'T', v: r(), tint: gt.clone().offsetHSL((r() - 0.5) * 0.03, 0, (r() - 0.5) * 0.2).addScalar(0.45) }));
    const tg = makeGrass(gl, g);
    trail = { ti, pi, theme, path, n, nodes, plants, grass: tg, nextMark };
    scene.add(g); trailGroup = g; g.visible = false;
    ['T', ...nodes.map((x) => `L${x.i}`)].forEach((k) => disp.set(k, 0));
    return trail;
  }

  // ----- View and camera -----
  const view = { level: 'garden', ti: -1, pi: -1, lesson: -1 };
  const sph = new THREE.Spherical(), tmpV = new THREE.Vector3();
  let fly = null, switching = false, panCenter = new THREE.Vector3(), panLimit = 3;
  const fitDist = (radius, polar) => { const v = THREE.MathUtils.degToRad(camera.fov / 2), h = Math.atan(Math.tan(v) * camera.aspect); return Math.max((radius * 1.08) / Math.tan(h), (radius * (Math.cos(polar) * 0.9 + 0.32) * 1.12) / Math.tan(v)); };
  function viewSpec() {
    if (view.level === 'garden') return { target: new THREE.Vector3(0, 0.4, 0.3), dist: fitDist(THEMES.length === 1 ? 4.5 : mobile ? 9.0 : 9.4, 0.95), polar: 0.95, pan: 3 };
    if (view.level === 'theme') return { target: tiles[view.ti].center.clone().setY(0.7), dist: fitDist(3.9, 0.92), polar: 0.92, pan: 1.6 };
    if (view.lesson >= 0 && trail) return { target: trail.nodes[view.lesson].pos.clone().setY(TRAIL_H + 0.45), dist: fitDist(2.3, 0.85), polar: 0.85, pan: 3 };
    const half = trail ? Math.max(...trail.nodes.map((n) => Math.abs(n.pos.x))) + 1.7 : 5;
    return { target: new THREE.Vector3(0, TRAIL_H + 0.3, 0), dist: fitDist(Math.max(half, 3.4), 0.86), polar: 0.86, pan: 4 };
  }
  function applyLimits(spec) {
    const inPath = view.level === 'path';
    controls.minDistance = inPath ? 2.6 : 4.5; controls.maxDistance = Math.max(spec.dist * 1.5, 34);
    if (inPath) { panCenter.set(0, TRAIL_H + 0.3, 0); panLimit = (trail ? Math.max(...trail.nodes.map((n) => Math.abs(n.pos.x))) : 4) + 2.2; }
    else { panCenter.set(0, 0.4, 0.3); panLimit = 9.8; }
  }
  function flyTo(spec, ms = 900, azim) {
    camera.position.sub(controls.target); sph.setFromVector3(camera.position); camera.position.add(controls.target);
    const to = { target: spec.target.clone(), r: spec.dist, phi: spec.polar, theta: azim ?? sph.theta };
    applyLimits(spec);
    if (reduced || ms === 0) { controls.target.copy(to.target); sph.set(to.r, to.phi, to.theta); camera.position.setFromSpherical(sph).add(controls.target); fly = null; return; }
    let dth = to.theta - sph.theta; dth = Math.atan2(Math.sin(dth), Math.cos(dth));
    fly = { t0: performance.now(), ms, from: { target: controls.target.clone(), r: sph.radius, phi: sph.phi, theta: sph.theta }, to, dth };
  }
  function stepFly(now) {
    if (!fly) return;
    const k = clamp((now - fly.t0) / fly.ms), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2, f = fly.from, t = fly.to;
    controls.target.lerpVectors(f.target, t.target, e);
    sph.set(f.r + (t.r - f.r) * e, f.phi + (t.phi - f.phi) * e, f.theta + fly.dth * e);
    camera.position.setFromSpherical(sph).add(controls.target);
    if (k >= 1) { const cb = fly.done; fly = null; cb?.(); }
  }
  controls.addEventListener('change', () => {
    if (fly) return;
    tmpV.copy(controls.target).sub(panCenter); const len = tmpV.length();
    if (len > panLimit) { tmpV.multiplyScalar((len - panLimit) / len); controls.target.sub(tmpV); camera.position.sub(tmpV); }
  });
  controls.addEventListener('start', () => { controls.autoRotate = false; fly = null; });

  // Touchpad two-finger scroll and mouse wheel move across the garden; pinch (ctrl+wheel) and the buttons zoom.
  const fwd = new THREE.Vector3(), rgt = new THREE.Vector3();
  function panBy(dx, dy) { // dx right, dy down on screen, in pixels
    camera.getWorldDirection(fwd); fwd.y = 0; if (fwd.lengthSq() < 1e-6) return; fwd.normalize(); rgt.crossVectors(fwd, camera.up).normalize();
    const k = (2 * camera.position.distanceTo(controls.target) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / Math.max(1, root.clientHeight);
    tmpV.set(0, 0, 0).addScaledVector(rgt, dx * k).addScaledVector(fwd, -dy * k);
    controls.target.add(tmpV); camera.position.add(tmpV); fly = null; controls.autoRotate = false;
  }
  function zoomBy(f) { camera.position.sub(controls.target); const d = clamp(camera.position.length() * f, controls.minDistance, controls.maxDistance); camera.position.setLength(d).add(controls.target); fly = null; controls.autoRotate = false; }
  root.addEventListener('wheel', (e) => {
    if (e.target.closest('.lg-panel')) return;
    e.preventDefault(); e.stopPropagation();
    const m = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? root.clientHeight : 1;
    if (e.ctrlKey || e.metaKey) zoomBy(Math.exp(e.deltaY * m * 0.01)); else panBy(e.deltaX * m, e.deltaY * m);
  }, { capture: true, passive: false });
  const fade = $('.lg-fade');
  function setVisibility() { const inPath = view.level === 'path'; garden.visible = !inPath; contact.visible = !inPath; if (trailGroup) trailGroup.visible = inPath; }
  const clearHover = () => { cellOutline.visible = slabOutline.visible = tileOutline.visible = false; };
  function goGarden(ms = 1000) {
    if (switching) return;
    const go = () => { view.level = 'garden'; view.ti = view.pi = view.lesson = -1; selOutline.visible = false; clearHover(); flyTo(viewSpec(), ms, 0.35); renderUI(); };
    if (view.level === 'path') exitPath(go); else go();
  }
  function goTheme(ti, ms = 1000) {
    if (switching) return;
    const go = () => { view.level = 'theme'; view.ti = ti; view.pi = view.lesson = -1; selOutline.visible = false; clearHover(); flyTo(viewSpec(), ms); renderUI(); };
    if (view.level === 'path') exitPath(go); else go();
  }
  function goPath(ti, pi) {
    if (switching) return;
    view.ti = ti; view.pi = pi; view.level = 'theme'; view.lesson = -1; clearHover();
    const cell = tiles[ti].cells[pi]; selOutline.position.set(cell.center.x, cell.center.y + 0.03, cell.center.z); selOutline.visible = true;
    switching = true; renderUI();
    const swap = () => {
      fade.classList.add('on');
      setTimeout(() => {
        buildTrail(ti, pi); view.level = 'path'; selOutline.visible = false; setVisibility(); fly = null;
        const s = viewSpec(); flyTo({ ...s, dist: s.dist * 0.75 }, 0, 0.1); flyTo(s, reduced ? 0 : 1100, 0.1);
        fade.classList.remove('on'); switching = false; dirty = true; renderUI();
      }, reduced ? 0 : 360);
    };
    flyTo({ target: cell.center.clone(), dist: fitDist(1.3, 0.9), polar: 0.9, pan: 2 }, reduced ? 0 : 750);
    if (fly) fly.done = swap; else swap();
  }
  function exitPath(next) {
    if (switching) return; switching = true; const ti = view.ti, pi = view.pi;
    fade.classList.add('on');
    setTimeout(() => {
      disposeTrail(); view.level = 'theme'; view.lesson = -1; setVisibility(); dirty = true;
      const cell = tiles[ti].cells[pi]; flyTo({ target: cell.center.clone(), dist: fitDist(1.3, 0.9), polar: 0.9, pan: 2 }, 0);
      fade.classList.remove('on'); switching = false; next?.();
    }, reduced ? 0 : 340);
  }
  function selectLesson(i) { if (view.level !== 'path' || !trail) return; view.lesson = view.lesson === i ? -1 : i; dirty = true; flyTo(viewSpec(), 800); renderUI(); }
  function back() {
    if (switching) return;
    if (view.level === 'path') { if (view.lesson >= 0) { view.lesson = -1; dirty = true; flyTo(viewSpec(), 700); renderUI(); } else exitPath(() => { flyTo(viewSpec(), 900); renderUI(); }); }
    else if (view.level === 'theme') goGarden();
  }

  // ----- Picking -----
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let hover = null;
  const pickables = () => switching ? [] : view.level === 'path' ? (trail ? trail.nodes.map((n) => n.stone) : []) : [...cellMeshes, ...themeMeshes];
  function pickAt(cx, cy) {
    const rc = canvas.getBoundingClientRect(); ptr.set(((cx - rc.left) / rc.width) * 2 - 1, -((cy - rc.top) / rc.height) * 2 + 1);
    ray.setFromCamera(ptr, camera); const hit = ray.intersectObjects(pickables(), false)[0];
    return hit ? hit.object.userData.pick : null;
  }
  function setHover(p) {
    const key = p ? `${p.kind}.${p.ti ?? ''}.${p.pi ?? ''}.${p.i ?? ''}` : null;
    if (key === hover) return; hover = key; clearHover(); canvas.style.cursor = p ? 'pointer' : 'grab';
    if (!p) return;
    const slab = (ti) => { const T = tiles[ti]; slabOutline.position.set(T.center.x, SLAB_H + CELL_H * 0.4, T.center.z); slabOutline.visible = true; };
    if (p.kind === 'lesson') { const n = trail.nodes[p.i]; tileOutline.position.set(n.pos.x, n.pos.y + 0.05, n.pos.z); tileOutline.visible = true; }
    else if (p.kind === 'theme' || view.level === 'garden' || p.ti !== view.ti) slab(p.ti);
    else { const c = tiles[p.ti].cells[p.pi].center; cellOutline.position.set(c.x, c.y + 0.03, c.z); cellOutline.visible = true; }
  }
  function activate(p) {
    if (!p) return;
    if (view.level === 'path') { if (p.kind === 'lesson') selectLesson(p.i); return; }
    if (view.level === 'garden' || p.ti !== view.ti) return goTheme(p.ti);
    if (p.kind === 'path') goPath(p.ti, p.pi);
  }
  let down = null;
  canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  canvas.addEventListener('pointerup', (e) => { if (!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y), dt = performance.now() - down.t; down = null; if (moved < 7 && dt < 600) activate(pickAt(e.clientX, e.clientY)); });
  canvas.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' && !down) setHover(pickAt(e.clientX, e.clientY)); });
  canvas.addEventListener('pointerleave', () => setHover(null));
  const onKey = (e) => {
    if (!root.isConnected || document.querySelector('.grains-modal-backdrop') || e.target.matches?.('input')) return;
    if (e.key === 'Escape' || e.key === 'Backspace') { back(); e.preventDefault(); }
    else if (/^[1-7]$/.test(e.key) && view.level !== 'path' && Number(e.key) <= THEMES.length) goTheme(Number(e.key) - 1);
    else if (e.key.startsWith('Arrow')) { const st = 60; panBy(e.key === 'ArrowLeft' ? -st : e.key === 'ArrowRight' ? st : 0, e.key === 'ArrowUp' ? -st : e.key === 'ArrowDown' ? st : 0); e.preventDefault(); }
    else if (e.key === '+' || e.key === '=') zoomBy(0.85);
    else if (e.key === '-' || e.key === '_') zoomBy(1.18);
  };
  addEventListener('keydown', onKey);

  // ----- UI -----
  const crumbs = $('.lg-crumbs'), panelBody = $('.lg-panel-body'), statsEl = $('.lg-stats'), labelsEl = $('.lg-labels'), toastEl = $('.lg-toast');
  const panel = $('.lg-panel');
  const ICON = {
    drop: '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M8 1.5C6 5 3.6 7 3.6 10a4.4 4.4 0 0 0 8.8 0C12.4 7 10 5 8 1.5z" fill="#3f8fd2"/></svg>',
    carrot: '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3 13.2C4 9 8 5.4 11 5.8c.5 3-2.6 7.6-8 7.4z" fill="#f08a24"/><path d="M10.2 5.4 11.4 2m-.2 3.8L14 4m-3.2 2.6L14.2 7" stroke="#5ea84a" stroke-width="1.5" stroke-linecap="round"/></svg>',
    play: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 2.5h3v11H4zm5 0h3v11H9z" fill="currentColor"/></svg>',
    replay: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 2.5a5.5 5.5 0 1 0 5.4 6.5h-1.7A3.8 3.8 0 1 1 8 4.2c1 0 1.9.4 2.6 1L8.7 7H14V1.7l-1.8 1.8A5.500 5.500 0 0 0 8 2.5z" fill="currentColor"/></svg>',
  };
  const dots = (n, on) => Array.from({ length: n }, (_, i) => `<i class="dot ${i < on ? 'on' : ''}"></i>`).join('');
  // Progress dots for paths (per lesson) and themes (per path): filled green only when complete, thicker border while in progress.
  const stateDots = (states) => states.map((st) => `<i class="dot ${st}"></i>`).join('');
  const pathState = (p) => (p.progress.completed ? 'done' : p.progress.started ? 'cur' : '');
  const lessonStates = (path) => path.lessonData.map((l) => (l.progress.completed ? 'done' : l.progress.started ? 'cur' : ''));
  const pct = (p) => `${Math.round(p * 100)}%`;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove('on'), 2600); };

  function renderCrumbs() {
    const cur = (lvl) => (view.level === lvl ? ' aria-current="page"' : '');
    let h = view.level !== 'garden' ? '<button class="lg-back" data-go="back" aria-label="Back">‹</button>' : '';
    h += `<button data-go="garden"${cur('garden')}>Garden</button>`;
    if (view.level !== 'garden') h += `<span class="sep">›</span><button data-go="theme"${cur('theme')}>${esc(THEMES[view.ti].title)}</button>`;
    if (view.level === 'path') h += `<span class="sep">›</span><button data-go="path"${cur('path')}>${esc(THEMES[view.ti].paths[view.pi].title)}</button>`;
    crumbs.innerHTML = h;
  }
  function renderRecent() {
    if (!state.recentLessons.length) return '';
    return `<section class="lg-recent" aria-label="Recent lessons"><p class="eyebrow">Pick up where you left off</p><ul>${state.recentLessons.map((lesson) => {
      const progress = lesson.progress || {};
      const step = lesson.next_step?.type === 'question' ? 'Next question' : `Next card · ${progress.cards_completed || 0}/${progress.cards_total || 0} read`;
      return `<li><button data-recent="${esc(lesson.id)}" aria-label="Continue ${esc(lesson.title)}"><span class="lg-recent-icon" aria-hidden="true">↗</span><span class="lg-recent-copy"><b>${esc(lesson.title)}</b><small>${esc(lesson.learning_path_title)}</small><em>${step}</em></span><span class="lg-recent-arrow" aria-hidden="true">→</span></button></li>`;
    }).join('')}</ul></section>`;
  }
  let revealedLesson = null, panelCtx = '';
  function revealSelectedLesson() {
    const row = panelBody.querySelector('.lg-lessons button.sel');
    if (!row) return;
    const pr = panel.getBoundingClientRect(), rr = row.getBoundingClientRect();
    panel.scrollTop += rr.top - pr.top - (pr.height - rr.height) / 2;
  }
  function renderPanel() {
    const ctx = `${view.level}.${view.ti}.${view.pi}`, keepTop = ctx === panelCtx ? panel.scrollTop : 0;
    panelCtx = ctx;
    let h = '';
    if (view.level === 'garden') {
      h = `<p class="eyebrow">Your learning garden</p><h2>The Garden</h2><p class="lede">Choose a theme, then a learning path. Every card you read helps your garden grow.</p>${renderRecent()}<ul class="lg-list">` +
        THEMES.map((t, i) => { const started = t.paths.filter((p) => p.progress.started).length, avg = fraction(t.progress); return `<li><button data-theme="${i}"><span class="sw" style="background:${t.top}"></span><span class="tt"><b>${esc(t.title)}</b><small>${started}/${t.paths.length} paths started</small></span><span class="bar"><i style="width:${pct(avg)}"></i></span></button></li>`; }).join('') + '</ul>';
    } else if (view.level === 'theme') {
      const t = THEMES[view.ti];
      h = `<p class="eyebrow">Theme garden</p><h2>${esc(t.title)}</h2><p class="lede">${esc(t.blurb)} One hexagon per learning path; one dot per lesson.</p>${renderRecent()}<ul class="lg-list">` +
        t.paths.map((p, i) => { const pr = fraction(p.progress), li = lessonInfo(p); return `<li><button data-path="${i}"><span class="tt"><b>${mobile ? `${i + 1}. ` : ''}${esc(p.title)}</b><span class="dots">${stateDots(lessonStates(p))}</span></span><span class="pc">${pr === 0 ? 'Not started' : pct(pr)}</span></button></li>`; }).join('') + '</ul>';
    } else if (trail) {
      const li = lessonInfo(trail.path), sel = view.lesson;
      const prog = trail.path.progress, qt = prog.questions_total || 0, qc = prog.questions_correct || 0, qp = qt ? Math.round((qc / qt) * 100) : 0;
      const cu = trail.path.catch_up || {};
      h = `<p class="eyebrow">${esc(trail.theme.title)} · learning path</p><h2>${esc(trail.path.title)}</h2><p class="lede">${li.done ? 'Every lesson has bloomed.' : `${li.cur} of ${li.n} lessons complete. Each dot is a card you have read.`}</p>`;
      h += `<div class="lg-gauge"><p class="lg-gauge-head"><span>Questions answered correctly</span><b>${qp}%</b></p><span class="bar"><i style="width:${qp}%"></i></span><p class="lg-gauge-count">${qc} of ${qt} questions on this path</p></div>`;
      if (cu.eligible) h += `<button class="primary lg-quiz" data-quiz="1">🌱 Practice quiz</button><p class="lg-quiz-hint">${cu.remaining > 0 ? `${cu.remaining} question${cu.remaining === 1 ? '' : 's'} still to answer correctly in read lessons` : 'Keep practicing questions from your read lessons'}</p>`;
      else h += '<button class="primary lg-quiz" disabled aria-disabled="true">Practice quiz</button><p class="lg-quiz-hint">Finish a lesson\'s cards first</p>';
      h += renderRecent();
      if (sel >= 0) {
        const lesson = trail.path.lessonData[sel], lp = lesson.progress, st = lp.completed ? 'done' : lp.started ? 'cur' : 'todo';
        const lqt = lp.questions_total || 0, lqc = lp.questions_correct || 0, lqp = lqt ? Math.round((lqc / lqt) * 100) : 0;
        h += `<div class="lg-lesson"><span class="chip ${st}">${st === 'done' ? 'Bloomed' : st === 'cur' ? 'In progress' : 'Not started'}</span><h3>${sel + 1}. ${esc(lesson.title)}</h3><p class="dots big">${dots(lp.cards_total, lp.cards_completed)}</p><p>${lp.cards_completed} of ${lp.cards_total} cards · ${lqc} of ${lqt} questions (${lqp}%)</p><span class="bar wide"><i style="width:${lqp}%"></i></span><button class="primary" data-start="${sel}">${st === 'done' ? 'Read lesson' : st === 'cur' ? 'Continue lesson' : 'Start lesson'}</button></div>`;
      }
      h += '<ol class="lg-lessons">' + trail.path.lessonData.map((lesson, i) => { const lp = lesson.progress, st = lp.completed ? 'done' : lp.started ? 'cur' : 'todo';
        const gap = lp.cards_total > 0 && lp.cards_completed === lp.cards_total && (lp.questions_total || 0) > 0 && (lp.questions_correct || 0) < lp.questions_total;
        const lqp = lp.questions_total ? Math.round(((lp.questions_correct || 0) / lp.questions_total) * 100) : 0;
        return `<li><button data-lesson="${i}" class="${st} ${i === sel ? 'sel' : ''}"><span class="num">${st === 'done' ? '✓' : i + 1}</span><span class="nm">${esc(lesson.title)}</span><span class="dots">${dots(lp.cards_total, lp.cards_completed)}</span>${gap ? `<span class="pc">${lqp}%</span>` : ''}</button></li>`; }).join('') + '</ol>';
    }
    panelBody.innerHTML = h;
    panel.scrollTop = keepTop;
    const revealKey = view.level === 'path' && trail && view.lesson >= 0 ? `${view.ti}.${view.pi}.${view.lesson}` : null;
    if (revealKey && revealKey !== revealedLesson) { revealedLesson = revealKey; revealSelectedLesson(); }
    else if (!revealKey) revealedLesson = null;
  }
  function renderStats() {
    const t = totals();
    statsEl.innerHTML = `<button class="chip drop" data-reward="drops" aria-label="${t.drops} Drops. How Drops are earned">${ICON.drop}<b>${t.drops}</b><small>drops</small><span class="info" aria-hidden="true">ⓘ</span></button><button class="chip carrot" data-reward="carrots" aria-label="${t.carrots} Carrots. How Carrots are earned">${ICON.carrot}<b>${t.carrots}</b><small>carrots</small><span class="info" aria-hidden="true">ⓘ</span></button>` + (mobile ? '' : `<span class="chip plain"><b>${t.started}</b><small>of ${t.paths} paths growing</small></span>`);
  }
  function renderUI() { renderCrumbs(); renderPanel(); renderStats(); buildLabels(); }
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.go) { const g = b.dataset.go; if (g === 'garden') goGarden(); else if (g === 'theme') { if (view.level === 'path') exitPath(() => { flyTo(viewSpec(), 900); renderUI(); }); else goTheme(view.ti); } else if (g === 'back') back(); }
    else if (b.dataset.theme) goTheme(Number(b.dataset.theme));
    else if (b.dataset.path) goPath(view.ti, Number(b.dataset.path));
    else if (b.dataset.lesson) selectLesson(Number(b.dataset.lesson));
    else if (b.dataset.start) onOpenLesson?.(trail.path.lessonData[Number(b.dataset.start)].id);
    else if (b.dataset.recent) onOpenLesson?.(b.dataset.recent);
    else if (b.dataset.reward) onRewardInfo?.(b.dataset.reward);
    else if (b.dataset.quiz) onPracticeQuiz?.(trail.path.id, trail.path.title);
    else if (b.dataset.zoom) zoomBy(b.dataset.zoom === 'in' ? 0.8 : 1.25);
    else if (b.classList.contains('lg-handle')) panel.classList.toggle('open');
  });

  let labelDefs = [];
  function buildLabels() {
    labelsEl.innerHTML = ''; labelDefs = [];
    const add = (cls, html, anchor, extra = {}) => { const el = document.createElement('div'); el.className = `lg-label ${cls}`; el.innerHTML = html; labelsEl.appendChild(el); labelDefs.push({ el, anchor, ...extra }); };
    if (view.level === 'garden') tiles.forEach((T, ti) => add('theme', `<b>${esc(T.theme.title)}</b><span class="dots"></span>`, T.center.clone().add(new THREE.Vector3(0, 1.45, R_THEME * 0.62)), { ti, dots: true }));
    if (view.level === 'theme') tiles[view.ti].cells.forEach((c, pi) => add('cell', `<b>${esc(c.path.title)}</b><span class="dots"></span>`, c.center.clone().add(new THREE.Vector3(0, 0.85, 0.28)), { ti: view.ti, pi, dots: true, cell: true }));
    if (view.level === 'path' && trail && !mobile && trail.n <= 8) trail.nodes.forEach((n) => add('lesson', `<b>${esc(trail.path.lessons[n.i])}</b>`, n.pos.clone().add(new THREE.Vector3(0, 1.5, 0))));
    refreshLabelDots();
  }
  const hint = $('.lg-hint'); hint.textContent = mobile ? 'Drag to move · pinch to zoom · two fingers to turn' : 'Scroll or drag to move · pinch or ctrl+scroll to zoom · right-drag to turn'; setTimeout(() => hint.classList.add('gone'), 9000);
  const tv = new THREE.Vector3();
  function placeLabels() {
    const w = root.clientWidth, h = root.clientHeight, shown = [];
    for (const L of labelDefs) {
      tv.copy(L.anchor).project(camera);
      const vis = tv.z < 1 && Math.abs(tv.x) < 1.1 && Math.abs(tv.y) < 1.1 && !switching;
      L.el.style.opacity = vis ? 1 : 0;
      if (vis) shown.push({ L, x: (tv.x * 0.5 + 0.5) * w, y: (-tv.y * 0.5 + 0.5) * h });
    }
    // Name + dots labels must stay readable: lift a label above any label it would cover.
    const named = shown.filter((e) => e.L.el.classList.contains('theme') || e.L.el.classList.contains('cell')).sort((a, b) => b.y - a.y), placed = [];
    for (const e of named) {
      e.w = e.L.el.offsetWidth; e.h = e.L.el.offsetHeight;
      for (let guard = 0; guard < 8; guard++) {
        const hit = placed.find((p) => Math.abs(p.x - e.x) < (p.w + e.w) / 2 + 4 && e.y > p.y - p.h - 4 && p.y > e.y - e.h - 4);
        if (!hit) break;
        e.y = hit.y - hit.h - 6;
      }
      placed.push(e);
    }
    for (const e of shown) e.L.el.style.transform = `translate(-50%,-100%) translate(${e.x.toFixed(1)}px,${e.y.toFixed(1)}px)`;
  }
  function refreshLabelDots() {
    for (const L of labelDefs) {
      if (L.dots) {
        const host = L.el.querySelector('.dots'); if (!host) continue;
        const sts = L.cell ? lessonStates(THEMES[L.ti].paths[L.pi]) : THEMES[L.ti].paths.map(pathState);
        const html = mobile && L.cell ? `<span class="count">(${sts.filter((s) => s === 'done').length} / ${sts.length})</span>` : stateDots(sts);
        if (L.k !== html) { L.k = html; host.innerHTML = html; }
      }
    }
  }

  // ----- Loop -----
  let raf = 0, last = performance.now(), time = 0, rainT = 0, dirty = true, alive = true, panelKey = '', resized = false;
  const TRAIL_DONE = new THREE.Color('#5fa84a'), TRAIL_NEXT = new THREE.Color('#e3a83c'), TRAIL_TODO = new THREE.Color('#b9b3a2'), DROP = new THREE.Color('#3f8fd2'), EMPTY = new THREE.Color('#e9e1cd');
  function resize() {
    const w = Math.max(1, root.clientWidth), h = Math.max(1, root.clientHeight);
    renderer.setSize(w, h, false); camera.aspect = w / h;
    if (mobile) camera.setViewOffset(w, h, 0, h * 0.09, w, h); else if (w > 900) camera.setViewOffset(w, h, -Math.min(170, w * 0.11), 0, w, h); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    if (!resized) { resized = true; flyTo(viewSpec(), 0, 0.35); }
    else if (!fly) { applyLimits(viewSpec()); }
  }
  const ro = new ResizeObserver(() => resize()); ro.observe(root);
  function frame(now) {
    if (!alive) return; raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
    let changed = false; const rate = 1 - Math.exp(-dt * (reduced ? 40 : 2.6));
    const keys = [];
    if (garden.visible) THEMES.forEach((t, ti) => t.paths.forEach((_, pi) => keys.push(`c${ti}.${pi}`)));
    if (trail && trailGroup.visible) { keys.push('T'); trail.nodes.forEach((n) => keys.push(`L${n.i}`)); }
    for (const k of keys) { const t = targetOf(k), c = disp.get(k) ?? 0, d = t - c; if (Math.abs(d) > 0.0004) { disp.set(k, c + d * rate); changed = true; } else if (d !== 0) { disp.set(k, t); changed = true; } }
    if (changed || dirty) {
      if (garden.visible) {
        gardenPlants.update(disp); updateGrass(gardenGrass, disp);
        tiles.forEach((T) => T.cells.forEach((c) => { const s = smooth((disp.get(c.key) ?? 0) * 3); c.mesh.material.color.setRGB(0.8 + 0.2 * s, 0.74 + 0.26 * s, 0.6 + 0.4 * s); }));
      }
      if (trail && trailGroup.visible) {
        trail.plants.update(disp); updateGrass(trail.grass, disp);
        trail.nodes.forEach((n) => {
          const f = disp.get(`L${n.i}`) ?? 0, tf = targetOf(`L${n.i}`), st = tf >= 0.995 ? 0 : tf > 0.01 ? 1 : 2;
          n.ring.material.color.copy(st === 0 ? TRAIL_DONE : TRAIL_TODO); n.stone.material.color.copy(tileCol[st]);
          if (view.lesson === n.i) n.stone.material.color.multiplyScalar(0.6);
          const filled = trail.path.lessonData[n.i]?.progress.cards_completed || 0; n.dotMat.forEach((m, k) => m.color.copy(k < filled ? DROP : EMPTY));
        });
      }
      renderStats(); refreshLabelDots(); dirty = false;
    }
    const pk = `${view.level}.${view.ti}.${view.pi}.${view.lesson}.${state.version || 0}`;
    if (pk !== panelKey) { panelKey = pk; if (!panel.matches(':hover')) renderPanel(); else panelKey = ''; }
    if (trail && trailGroup.visible) {
      const next = trail.path.lessonData.findIndex((lesson) => !lesson.progress.completed);
      trail.nodes.forEach((n) => { const isNext = n.i === next; n.ring.scale.setScalar(isNext ? 1 + Math.sin(time * 3) * 0.05 : 1); if (isNext) n.ring.material.color.copy(TRAIL_NEXT); });
      const mark = trail.nextMark;
      if (mark) {
        mark.visible = next >= 0;
        if (next >= 0) {
          const np = trail.nodes[next].pos; mark.position.set(np.x, np.y + 0.004, np.z);
          mark.userData.halo.material.opacity = 0.8 + Math.sin(time * 2.2) * 0.2;
          mark.userData.pennant.rotation.y = 0.3 + Math.sin(time * 1.4) * 0.12;
        }
      }
    }
    outlineMat.opacity = 0.75 + Math.sin(time * 5) * 0.2;
    grassUniforms.uTime.value = time;
    clouds.children.forEach((c) => { c.position.x += c.userData.v * dt; if (c.position.x > 60) c.position.x = -60; });
    const ctr = controls.target, spread = Math.min(4, camera.position.distanceTo(ctr) * 0.22);
    flyers.children.forEach((f) => { const u = f.userData, a = time * u.sp + u.off; f.position.set(ctr.x + Math.cos(a) * (u.rad + spread * 0.4), ctr.y + u.h + Math.sin(time * 1.3 + u.ph) * 0.25, ctr.z + Math.sin(a * 1.2) * (u.rad + spread * 0.4)); f.rotation.y = -a + Math.PI; const flap = Math.sin(time * 16 + u.ph) * 0.9; u.wl.rotation.z = flap; u.wr.rotation.z = -flap; f.scale.setScalar(u.scale * (view.level === 'garden' ? 1.8 : 1)); });
    if (pollen) { const a = pollen.geometry.attributes.position.array; for (let i = 0; i < a.length; i += 3) { a[i] += Math.sin(time * 0.5 + i) * 0.003 + 0.002; a[i + 1] += Math.sin(time * 0.7 + i * 0.3) * 0.002; a[i + 2] += Math.cos(time * 0.4 + i) * 0.002; if (a[i] > 11) a[i] -= 22; if (a[i + 1] > 4.2) a[i + 1] = 0.3; } pollen.geometry.attributes.position.needsUpdate = true; }
    if (rainT > 0) rainT -= dt;
    const raining = rainT > 0; rain.visible = raining;
    if (raining) { const R = Math.min(9, camera.position.distanceTo(ctr) * 0.5); for (let i = 0; i < RAIN_N; i++) { const s0 = rainSeed[i * 3], s1 = rainSeed[i * 3 + 1], s2 = rainSeed[i * 3 + 2], y = (((s1 - time * 0.9 * (0.8 + s0 * 0.2)) % 1) + 1) % 1, x = ctr.x + s0 * R, z = ctr.z + s2 * R, yy = ctr.y + y * 9 - 1; rainArr.set([x, yy, z, x - 0.02, yy - 0.34, z], i * 6); } rain.geometry.attributes.position.needsUpdate = true; }
    stepFly(now); controls.update(); placeLabels();
    renderer.render(scene, camera);
  }
  resize(); renderUI(); setVisibility(); raf = requestAnimationFrame(frame);

  return {
    root, view, state, prof, failed: false, camera, controls,
    goGarden, goTheme, goPath, selectLesson, back,
    updateData(nextThemes, nextRewards, nextRecentLessons = []) { nextThemes.forEach((theme, ti) => { if (!THEMES[ti]) return; THEMES[ti].progress = theme.progress; theme.paths.forEach((path, pi) => { if (!THEMES[ti].paths[pi]) return; Object.assign(THEMES[ti].paths[pi], { progress: path.progress, catch_up: path.catch_up, lessonData: path.lessonData }); }); }); state.rewards = nextRewards; state.recentLessons = nextRecentLessons; state.version = (state.version || 0) + 1; dirty = true; renderUI(); rainT = 1.2; },
    stats: () => ({ calls: renderer.info.render.calls, triangles: renderer.info.render.triangles, plants: gardenPlants.meshes.reduce((a, m) => a + m.count, 0), grass: gardenGrass?.count || 0 }),
    ready: () => !switching && !fly,
    dispose() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); removeEventListener('keydown', onKey); disposeTrail(); controls.dispose(); scene.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; if (m) (Array.isArray(m) ? m : [m]).forEach((x) => { x.map?.dispose?.(); x.dispose?.(); }); }); renderer.dispose(); renderer.forceContextLoss?.(); root.remove(); },
  };
}
