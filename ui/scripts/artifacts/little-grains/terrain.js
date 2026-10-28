import * as THREE from 'three';

const h2 = (x, y, s) => { const v = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return v - Math.floor(v); };
const vnoise = (x, y, s) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); const a = h2(xi, yi, s), b = h2(xi + 1, yi, s), c = h2(xi, yi + 1, s), d = h2(xi + 1, yi + 1, s); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; };
export const terrainHeight = (x, z, s = 0) => (vnoise(x * 0.9, z * 0.9, s) - 0.5) * 0.5 + (vnoise(x * 2.4, z * 2.4, s + 3) - 0.5) * 0.25;

const STRATA = ['#a97c52', '#946a45', '#7b5738', '#5f432c'];

// Pointy-top hexagonal prism. Top is a vertex-coloured triangle lattice (subtle facets), edges are bevelled,
// sides show soil strata. Returned geometry is non-indexed and meant for flat shading.
export function hexPrism(R, H, { K = 6, top = '#8fbf63', top2 = '#7aae55', bevel = 0.06, noise = 0.03, seed = 1, strata = STRATA, colorJitter = 0.08 } = {}) {
  const pos = [], col = [];
  const c1 = new THREE.Color(top), c2 = new THREE.Color(top2), tmp = new THREE.Color();
  const bev = Math.min(bevel * R, 0.12), rt = R - bev * 1.2;
  const e1 = [Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)], e2 = [0, 1];
  const key = (i, j) => `${i},${j}`, pts = new Map();
  for (let i = -K; i <= K; i++) for (let j = -K; j <= K; j++) {
    if (Math.abs(i + j) > K) continue;
    const x = (i * e1[0] + j * e2[0]) * (rt / K), z = (i * e1[1] + j * e2[1]) * (rt / K);
    const edge = Math.max(Math.abs(i), Math.abs(j), Math.abs(i + j)) / K;
    const fade = Math.max(0, 1 - Math.pow(edge, 3));
    const y = H + (edge >= 1 ? 0 : (terrainHeight(x + seed * 17, z - seed * 5, seed) * noise * fade * 2));
    const n = vnoise(x * 0.8 + 9, z * 0.8 + 4, seed + 11), jit = 1 + (h2(i, j, seed) - 0.5) * 2 * colorJitter;
    tmp.copy(c1).lerp(c2, n); tmp.multiplyScalar(jit);
    pts.set(key(i, j), { x, y, z, c: tmp.clone() });
  }
  const push = (p, c) => { pos.push(p.x, p.y, p.z); col.push(c.r, c.g, c.b); };
  const tri = (a, b, c) => {
    const ux = b.x - a.x, uz = b.z - a.z, vx = c.x - a.x, vz = c.z - a.z;
    const cy = uz * vx - ux * vz; // y of (b-a)x(c-a) with y-up winding
    const t = new THREE.Color().copy(a.c).add(b.c).add(c.c).multiplyScalar(1 / 3);
    t.multiplyScalar(1 + (h2(a.x * 3.1, c.z * 2.7, seed) - 0.5) * 0.08);
    if (cy > 0) { push(a, t); push(b, t); push(c, t); } else { push(a, t); push(c, t); push(b, t); }
  };
  for (let i = -K; i <= K; i++) for (let j = -K; j <= K; j++) {
    const A = pts.get(key(i, j)), B = pts.get(key(i + 1, j)), C = pts.get(key(i, j + 1)), D = pts.get(key(i + 1, j + 1));
    if (A && B && C) tri(A, B, C);
    if (B && C && D) tri(B, D, C);
  }
  // Bevel and walls from the 6 corners.
  const corner = (k, r, y, c) => { const a = Math.PI / 6 + (k * Math.PI) / 3; return { x: Math.cos(a) * r, y, z: Math.sin(a) * r, c: new THREE.Color(c) }; };
  const edgeCol = c1.clone().multiplyScalar(0.82);
  const quad = (a, b, c, d, color) => { const pa = [a, b, c, d].map((p) => ({ ...p, c: new THREE.Color(color) })); const o = (p, q, r) => { const ux = q.x - p.x, uy = q.y - p.y, uz = q.z - p.z, vx = r.x - p.x, vy = r.y - p.y, vz = r.z - p.z; const nx = uy * vz - uz * vy, nz = ux * vy - uy * vx; const mx = (p.x + q.x + r.x) / 3, mz = (p.z + q.z + r.z) / 3; return nx * mx + nz * mz > 0; }; const t = (p, q, r) => { const k = 1 + (h2(p.x * 5, p.y * 7 + r.z, seed) - 0.5) * 0.12; const cc = new THREE.Color(color).multiplyScalar(k); if (o(p, q, r)) { push(p, cc); push(q, cc); push(r, cc); } else { push(p, cc); push(r, cc); push(q, cc); } }; t(pa[0], pa[1], pa[2]); t(pa[0], pa[2], pa[3]); };
  const yb = H - bev, bands = [yb, yb * 0.72, yb * 0.44, yb * 0.2, 0];
  for (let k = 0; k < 6; k++) {
    const t0 = corner(k, rt, H), t1 = corner(k + 1, rt, H), o0 = corner(k, R, yb), o1 = corner(k + 1, R, yb);
    quad(t0, t1, o1, o0, edgeCol.getStyle());
    for (let b = 0; b < 4; b++) quad(corner(k, R, bands[b]), corner(k + 1, R, bands[b]), corner(k + 1, R, bands[b + 1]), corner(k, R, bands[b + 1]), strata[b]);
  }
  // Bottom cap so the slab is closed when viewed from below.
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

export function hexOutline(R, w) {
  const outer = new THREE.Shape(), inner = new THREE.Path();
  for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + (k * Math.PI) / 3; const f = k ? 'lineTo' : 'moveTo'; outer[f](Math.cos(a) * R, Math.sin(a) * R); inner[f](Math.cos(a) * (R - w), Math.sin(a) * (R - w)); }
  outer.closePath(); inner.closePath(); outer.holes.push(inner);
  const g = new THREE.ShapeGeometry(outer); g.rotateX(-Math.PI / 2); return g; // rotated so +y faces up; shape y -> world -z
}

// Axial -> world for pointy-top hexes of circumradius r.
export const axial = (q, r, size) => ({ x: size * Math.sqrt(3) * (q + r / 2), z: size * 1.5 * r });
export const inHex = (x, z, R) => Math.abs(x) <= R * Math.sqrt(3) / 2 && Math.abs(z) + Math.abs(x) / Math.sqrt(3) <= R;
