import * as THREE from 'three';

export function rngFor(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hash3 = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };

// Displace by a function of position so duplicated vertices of non-indexed geometry stay welded.
export function wobble(geo, amt, seed = 0) {
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const k = (n) => (hash3(Math.round(x * 997) + seed + n, Math.round(y * 991), Math.round(z * 983)) - 0.5) * 2 * amt;
    p.setXYZ(i, x + k(1), y + k(2), z + k(3));
  }
  return geo;
}

// Collects many primitives into one vertex-coloured, flat-shaded geometry.
export class Builder {
  constructor(seed = 1) { this.pos = []; this.col = []; this.rng = rngFor(seed); this.tmp = new THREE.Color(); }
  add(geo, { p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1], c = '#ffffff', j = 0.07, grad = 0 } = {}) {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    g.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(...p), new THREE.Quaternion().setFromEuler(new THREE.Euler(...r)), new THREE.Vector3(...s)));
    const a = g.attributes.position.array, base = new THREE.Color(c);
    let minY = Infinity, maxY = -Infinity;
    for (let i = 1; i < a.length; i += 3) { minY = Math.min(minY, a[i]); maxY = Math.max(maxY, a[i]); }
    for (let t = 0; t < a.length; t += 9) {
      const k = 1 + (this.rng() - 0.5) * 2 * j;
      for (let v = 0; v < 3; v++) {
        const y = a[t + v * 3 + 1], u = maxY > minY ? (y - minY) / (maxY - minY) : 0.5;
        const l = k * (1 + grad * (u - 0.5));
        this.col.push(base.r * l, base.g * l, base.b * l);
        this.pos.push(a[t + v * 3], a[t + v * 3 + 1], a[t + v * 3 + 2]);
      }
    }
    g.dispose();
  }
  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.computeVertexNormals();
    return g;
  }
}

const cone = (r, h, n) => new THREE.ConeGeometry(r, h, n).translate(0, h / 2, 0);
const cyl = (r1, r2, h, n) => new THREE.CylinderGeometry(r2, r1, h, n).translate(0, h / 2, 0);
const blob = (r, d, w = 0.12, seed = 0) => wobble(new THREE.IcosahedronGeometry(r, d).toNonIndexed(), r * w, seed);

const GREENS = ['#6faa4f', '#5f9c47', '#7cb857', '#4f8f45'];
const FOREST = ['#3f7d48', '#35703f', '#4a8a50'];

export function makeSpecies(detail) {
  const hi = detail >= 1, S = {}, seg = hi ? 7 : 5, ico = hi ? 1 : 0;
  const mk = (name, seed, fn) => { const b = new Builder(seed); fn(b); S[name] = b.build(); };
  const TRUNK = '#8a6444';

  const broadleaf = (b, greens, fruit) => {
    b.add(cyl(0.07, 0.04, 0.55, seg), { c: TRUNK, j: 0.05 });
    b.add(cyl(0.02, 0.012, 0.3, 4), { p: [0.06, 0.38, 0], r: [0, 0, -0.9], c: TRUNK });
    const bl = [[0, 0.82, 0, 0.36], [0.2, 0.64, 0.1, 0.25], [-0.2, 0.68, -0.08, 0.26], [0.04, 1.06, -0.04, 0.26], [-0.06, 0.62, 0.22, 0.2]];
    bl.forEach(([x, y, z, r], i) => b.add(blob(r, ico, 0.14, i), { p: [x, y, z], s: [1, 0.9, 1], c: greens[i % greens.length], j: 0.09, grad: 0.35 }));
    if (fruit) for (let i = 0; i < (hi ? 9 : 4); i++) { const a = i * 2.4, rr = 0.33; b.add(new THREE.IcosahedronGeometry(0.045, 0), { p: [Math.cos(a) * rr * (0.8 + (i % 3) * 0.1), 0.62 + (i % 4) * 0.12, Math.sin(a) * rr * 0.9], c: fruit, j: 0.1 }); }
  };
  mk('tree', 11, (b) => broadleaf(b, GREENS));
  mk('forestTree', 12, (b) => broadleaf(b, FOREST));
  mk('appleTree', 13, (b) => broadleaf(b, GREENS, '#e2573c'));
  mk('blossomTree', 14, (b) => broadleaf(b, ['#f1b8c4', '#eaa3b4', '#f7cdd5']));

  const pine = (snow) => (b) => {
    b.add(cyl(0.06, 0.04, 0.35, 5), { c: '#6e4f38' });
    const n = hi ? 5 : 4;
    for (let i = 0; i < n; i++) {
      const r = 0.42 - i * 0.07, h = 0.46 - i * 0.03, y = 0.22 + i * 0.26;
      b.add(wobble(cone(r, h, hi ? 8 : 6).toNonIndexed(), 0.012, i), { p: [0, y, 0], r: [0, i * 0.5, 0], c: FOREST[i % 3], j: 0.08, grad: 0.3 });
      if (snow) b.add(cone(r * 0.62, h * 0.55, hi ? 8 : 6), { p: [0, y + h * 0.5, 0], r: [0, i * 0.5, 0], c: '#f4f6f4', j: 0.03 });
    }
  };
  mk('pine', 21, pine(false)); mk('snowPine', 22, pine(true));

  const bush = (flower) => (b) => {
    [[0, 0.17, 0, 0.2], [0.17, 0.12, 0.05, 0.14], [-0.15, 0.13, -0.04, 0.15], [0.02, 0.14, 0.17, 0.13]].forEach(([x, y, z, r], i) => b.add(blob(r, ico, 0.14, i), { p: [x, y, z], c: GREENS[i % 4], j: 0.09, grad: 0.4 }));
    if (flower) for (let i = 0; i < (hi ? 10 : 5); i++) { const a = i * 2.1; b.add(new THREE.IcosahedronGeometry(0.035, 0), { p: [Math.cos(a) * 0.2, 0.18 + (i % 3) * 0.06, Math.sin(a) * 0.2], c: flower, j: 0.1 }); }
  };
  mk('bush', 31, bush()); mk('berryBush', 32, bush('#d84a4a')); mk('herbBush', 33, bush('#f6f3ea'));

  const flower = (c, tall = 0.36) => (b) => {
    b.add(cyl(0.012, 0.01, tall, 4), { c: '#5d9b48', j: 0.04 });
    b.add(cone(0.05, 0.1, 3), { p: [0.03, tall * 0.3, 0], r: [0, 0, -1.1], c: '#6fae51' });
    b.add(cone(0.05, 0.1, 3), { p: [-0.03, tall * 0.5, 0], r: [0, 0, 1.1], c: '#6fae51' });
    const n = hi ? 6 : 5;
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; b.add(blob(0.05, 0, 0.1, i), { p: [Math.cos(a) * 0.055, tall, Math.sin(a) * 0.055], s: [1, 0.55, 1], c, j: 0.06 }); }
    b.add(new THREE.IcosahedronGeometry(0.035, 0), { p: [0, tall + 0.01, 0], c: '#f5c542', j: 0.04 });
  };
  mk('flowerPink', 41, flower('#ee86a9')); mk('flowerYellow', 42, flower('#f6cf4a', 0.3)); mk('flowerWhite', 43, flower('#fbf8ef', 0.32)); mk('flowerOrange', 44, flower('#ee8a3c', 0.28)); mk('flowerBlue', 45, flower('#7fa6e6', 0.34));

  mk('sunflower', 51, (b) => {
    b.add(cyl(0.025, 0.02, 0.78, 5), { c: '#5b9645', j: 0.04 });
    b.add(cone(0.1, 0.22, 3), { p: [0.07, 0.25, 0], r: [0, 0, -1.2], s: [1, 1, 0.5], c: '#69a84e' });
    b.add(cone(0.1, 0.22, 3), { p: [-0.07, 0.42, 0], r: [0, 0, 1.2], s: [1, 1, 0.5], c: '#69a84e' });
    const n = hi ? 13 : 8;
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; b.add(cone(0.05, 0.17, 3), { p: [Math.cos(a) * 0.12, 0.8 + Math.sin(a) * 0.12 * 0.35, Math.sin(a) * 0.12], r: [Math.PI / 2 - 0.3, 0, -a + Math.PI / 2], c: '#f8c933', j: 0.07 });
    }
    b.add(cyl(0.1, 0.1, 0.05, 8), { p: [0, 0.77, 0.03], r: [0.35, 0, 0], c: '#6b4426', j: 0.06 });
  });

  mk('lavender', 61, (b) => {
    const n = hi ? 7 : 4;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.28 + 0.4, lean = 0.14, x = Math.cos(a) * 0.06, z = Math.sin(a) * 0.06;
      b.add(cyl(0.012, 0.008, 0.34, 4), { p: [x, 0, z], r: [Math.sin(a) * lean, 0, -Math.cos(a) * lean], c: '#6d9a58' });
      for (let k = 0; k < (hi ? 5 : 3); k++) b.add(blob(0.034 - k * 0.002, 0, 0.1, i * 7 + k), { p: [x + Math.cos(a) * 0.04, 0.3 + k * 0.045 + (i % 2) * 0.02, z + Math.sin(a) * 0.04], s: [1, 1.3, 1], c: k % 2 ? '#9b7bd0' : '#8a68c4', j: 0.08 });
    }
  });

  mk('cactus', 71, (b) => {
    const G = '#5b9a5e';
    b.add(new THREE.CapsuleGeometry(0.1, 0.5, 3, hi ? 8 : 6).translate(0, 0.35, 0), { c: G, j: 0.06 });
    b.add(new THREE.CapsuleGeometry(0.055, 0.2, 3, 6), { p: [0.2, 0.42, 0], r: [0, 0, 0], c: G });
    b.add(new THREE.CapsuleGeometry(0.05, 0.1, 3, 6), { p: [0.14, 0.31, 0], r: [0, 0, 1.57], c: G });
    b.add(new THREE.CapsuleGeometry(0.05, 0.16, 3, 6), { p: [-0.18, 0.5, 0], c: G });
    b.add(new THREE.CapsuleGeometry(0.045, 0.1, 3, 6), { p: [-0.13, 0.4, 0], r: [0, 0, 1.57], c: G });
    b.add(blob(0.04, 0, 0.1), { p: [0, 0.74, 0], c: '#ee6f9a' });
  });
  mk('agave', 72, (b) => {
    const n = hi ? 11 : 7;
    for (let i = 0; i < n; i++) { const a = i * 2.4, t = (i % 3) / 3; b.add(wobble(cone(0.06, 0.38 - t * 0.1, 4).toNonIndexed(), 0.004, i), { p: [Math.cos(a) * 0.03, 0.04, Math.sin(a) * 0.03], r: [Math.sin(a) * (0.7 + t * 0.4), 0, -Math.cos(a) * (0.7 + t * 0.4)], s: [1, 1, 0.4], c: i % 2 ? '#7aa88a' : '#6b9a7d', j: 0.07 }); }
  });

  mk('reed', 81, (b) => {
    const n = hi ? 6 : 4;
    for (let i = 0; i < n; i++) {
      const a = i * 1.9, h = 0.55 + (i % 3) * 0.12, x = Math.cos(a) * 0.05, z = Math.sin(a) * 0.05, lean = 0.1 + (i % 2) * 0.06;
      b.add(cone(0.016, h, 4), { p: [x, 0, z], r: [Math.sin(a) * lean, 0, -Math.cos(a) * lean], c: i % 2 ? '#7aa95a' : '#6b9a50' });
      if (i % 2 === 0) b.add(cyl(0.025, 0.025, 0.12, 5), { p: [x + Math.cos(a) * h * lean * 0.9, h * 0.8, z + Math.sin(a) * h * lean * 0.9], c: '#6b4a32' });
    }
  });
  mk('lotus', 82, (b) => {
    b.add(new THREE.CylinderGeometry(0.2, 0.2, 0.012, hi ? 10 : 7).translate(0, 0.01, 0), { c: '#5da37a', j: 0.06 });
    const n = hi ? 8 : 6;
    for (let i = 0; i < n; i++) { const a = (i / n) * 6.28; b.add(blob(0.06, 0, 0.08, i), { p: [Math.cos(a) * 0.055, 0.1, Math.sin(a) * 0.055], r: [Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6], s: [0.8, 1.6, 0.8], c: '#f4a4c0', j: 0.05 }); }
    b.add(blob(0.03, 0, 0.1), { p: [0, 0.1, 0], c: '#f5cf50' });
  });

  mk('fern', 91, (b) => {
    const n = hi ? 9 : 6;
    for (let i = 0; i < n; i++) { const a = (i / n) * 6.28, tilt = 0.8 + (i % 3) * 0.2; b.add(wobble(cone(0.055, 0.42, 4).toNonIndexed(), 0.004, i), { p: [0, 0.03, 0], r: [Math.sin(a) * tilt, 0, -Math.cos(a) * tilt], s: [1, 1, 0.3], c: i % 2 ? '#4f9552' : '#5aa35a', j: 0.07 }); }
  });
  mk('mushroom', 92, (b) => {
    b.add(cyl(0.035, 0.03, 0.12, 6), { c: '#f1e8d6' });
    b.add(new THREE.SphereGeometry(0.1, 8, 4, 0, 6.28, 0, Math.PI / 2).translate(0, 0.1, 0), { c: '#d6432f', j: 0.05 });
    for (let i = 0; i < 4; i++) b.add(new THREE.IcosahedronGeometry(0.018, 0), { p: [Math.cos(i * 1.6) * 0.055, 0.17 + (i % 2) * 0.01, Math.sin(i * 1.6) * 0.055], c: '#fff8ea', j: 0 });
  });
  mk('carrot', 93, (b) => {
    b.add(cone(0.045, 0.2, 6), { p: [0, 0.03, 0], r: [Math.PI, 0, 0], c: '#f08a24', j: 0.07 });
    const n = hi ? 7 : 5;
    for (let i = 0; i < n; i++) { const a = (i / n) * 6.28; b.add(cone(0.02, 0.22, 3), { p: [Math.cos(a) * 0.02, 0.04, Math.sin(a) * 0.02], r: [Math.sin(a) * 0.55, 0, -Math.cos(a) * 0.55], s: [1, 1, 0.5], c: '#5ea84a', j: 0.06 }); }
  });
  mk('rock', 101, (b) => { b.add(blob(0.12, 0, 0.25, 3), { s: [1.3, 0.7, 1], p: [0, 0.05, 0], c: '#b7b2a6', j: 0.1, grad: 0.3 }); b.add(blob(0.07, 0, 0.25, 4), { p: [0.14, 0.03, 0.05], c: '#a8a397', j: 0.1 }); });
  mk('redRock', 102, (b) => { b.add(blob(0.13, 0, 0.25, 5), { s: [1.2, 0.8, 1], p: [0, 0.06, 0], c: '#c4714a', j: 0.1, grad: 0.4 }); b.add(blob(0.07, 0, 0.25, 6), { p: [-0.14, 0.03, 0.04], c: '#b5643f', j: 0.1 }); });
  mk('pebble', 103, (b) => b.add(blob(0.035, 0, 0.2, 7), { s: [1.4, 0.5, 1], c: '#eee8d8', j: 0.05 }));
  mk('mound', 104, (b) => b.add(new THREE.SphereGeometry(0.1, 8, 4, 0, 6.28, 0, Math.PI / 2), { s: [1, 0.45, 1], c: '#8a6a4a', j: 0.1 }));
  mk('sprout', 105, (b) => { b.add(cyl(0.008, 0.006, 0.09, 3), { c: '#7ab85a' }); b.add(blob(0.028, 0, 0.1, 1), { p: [0.03, 0.09, 0], s: [1.4, 0.5, 1], c: '#8ccb63' }); b.add(blob(0.028, 0, 0.1, 2), { p: [-0.03, 0.1, 0], s: [1.4, 0.5, 1], c: '#7ab85a' }); });
  mk('flag', 106, (b) => { b.add(cyl(0.012, 0.012, 0.6, 4), { c: '#d9cdb8' }); b.add(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.6, 0), new THREE.Vector3(0.22, 0.52, 0), new THREE.Vector3(0, 0.44, 0)]).setIndex([0, 1, 2, 0, 2, 1]), { c: '#c65d3b', j: 0 }); });

  return S;
}

// Grass blade (3-segment tapered strip), instanced and wind-animated by the garden.
export function makeBlade() {
  const pos = [], idx = [], H = 1, segs = 3;
  for (let i = 0; i <= segs; i++) { const t = i / segs, w = 0.5 * (1 - t * 0.92); pos.push(-w * 0.07, t * H, 0, w * 0.07, t * H, 0); }
  for (let i = 0; i < segs; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
