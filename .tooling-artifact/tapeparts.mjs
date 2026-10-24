// Compact cassette deck - face view (x right, z up, y=0), mm units.
import { iso, pathOf, solidSvg, lineSvg, dotsSvg, fitProjection, tenth } from './engine.mjs';

export const VIEW_W = 640, VIEW_H = 430;

// ---- the honest numbers (compact cassette, IEC / Philips dimensions) ----
export const CORE_R = 10.5;                 // reel core radius, mm
export const TAU_T = 18e-3;                 // C-60 tape thickness, mm
export const L_SIDE = 86000;                // tape per side, mm (C-60: ~86 m)
export const V_TAPE = 47.6;                 // tape speed, mm/s (4.7625 cm/s standard)
export const CAP_R = 1.2;                   // capstan shaft radius (o2.4 mm)
export const PINCH_R = 6;                   // pinch roller radius
export const SIDE_S = L_SIDE / V_TAPE;      // seconds per side (~1807 s = 30:07)
export const packR = (len) => Math.sqrt(CORE_R * CORE_R + (Math.max(0, len) * TAU_T) / Math.PI);
export const PACK_MAX = packR(L_SIDE);      // ~24.6 mm

// ---- layout ----
export const SUP = { x: -21, z: 34 }, TAK = { x: 21, z: 34 };   // reel centers
const SHELL = { x0: -50.2, z0: 0, x1: 50.2, z1: 63.8 };         // cassette outline
const FACE = { x0: -60, z0: -16, x1: 60, z1: 70 };             // deck faceplate
const GUIDE_L = { x: -36, z: 5 }, GUIDE_R = { x: 36, z: 5 }, GUIDE_R_ = 2.2;
const RUN_Z = 2.8;                        // straight tape run height
const HEAD = { x: -10, w: 6.5 };          // play head, face top at RUN_Z
const CAP = { x: 12, z: RUN_Z - CAP_R };          // capstan center (below tape)
const PIN = { x: 12, z: RUN_Z + PINCH_R };        // pinch roller center (above tape)

export const PT = fitProjection(
  [[-68, -6, -20], [68, 6, 104], [-68, 6, 104], [68, -6, -20]],
  VIEW_W, VIEW_H, { pad: 22, azimuth: 90, elevation: 28 });

const S = (x, z, y = 0) => iso([x, y, z], PT);
const sidePath = (pts, closed = false, y = 0) => pathOf(pts.map(([x, z]) => S(x, z, y)), closed);
const circPts = (cx, cz, r, steps = 40, from = 0, span = Math.PI * 2) =>
  Array.from({ length: steps + 1 }, (_, i) => [cx + r * Math.cos(from + (i / steps) * span), cz + r * Math.sin(from + (i / steps) * span)]);
const annulus = (cx, cz, ro, ri, y = 0) =>
  sidePath(circPts(cx, cz, ro, 48), true, y) + sidePath(circPts(cx, cz, ri, 48).reverse(), true, y);
const flat = (d, className, tone = "hi") =>
  solidSvg({ fill: d, outline: d, crease: "", bevel: "", top: "", shades: [] }, { flat: true, tone, className });
const label = (x, z, text, size = 10, tone = "mid", anchor = "middle") => {
  const [sx, sy] = S(x, z);
  return `<text class="iso-face-text" data-tone="${tone}" x="${tenth(sx)}" y="${tenth(sy)}" font-size="${size}" text-anchor="${anchor}">${text}</text>`;
};

// ---- deck faceplate + cassette shell (baked) ----
export function faceSvg() {
  const out = [];
  const r = (x0, z0, x1, z1) => sidePath([[x0, z0], [x1, z0], [x1, z1], [x0, z1]], true);
  out.push(flat(r(FACE.x0, FACE.z0, FACE.x1, FACE.z1), "deckface", "lo"));
  // head/capstan slot below the cassette
  out.push(flat(r(-30, -7, 40, -1), "deckslot"));
  // corner screws
  const dots = [[FACE.x0 + 7, FACE.z0 + 7], [FACE.x1 - 7, FACE.z0 + 7], [FACE.x0 + 7, FACE.z1 - 7], [FACE.x1 - 7, FACE.z1 - 7]].map(([x, z]) => S(x, z));
  out.push(dotsSvg(dots, { size: 0.9, tone: "mid" }));
  return out.join("");
}
export function shellSvg() {
  const out = [];
  const r = (x0, z0, x1, z1, y = 0) => sidePath([[x0, z0], [x1, z0], [x1, z1], [x0, z1]], true, y);
  out.push(flat(r(SHELL.x0, SHELL.z0, SHELL.x1, SHELL.z1, 2.4), "shell-back", "mid"));
  out.push(flat(r(SHELL.x0, SHELL.z0, SHELL.x1, SHELL.z1), "shell"));
  // hub windows
  out.push(lineSvg(sidePath(circPts(SUP.x, SUP.z, PACK_MAX + 1.5, 48)), { tone: "faint" }));
  out.push(lineSvg(sidePath(circPts(TAK.x, TAK.z, PACK_MAX + 1.5, 48)), { tone: "faint" }));
  // label strip
  out.push(flat(r(SHELL.x0 + 5, SHELL.z1 - 14, SHELL.x1 - 5, SHELL.z1 - 5), "shellabel"));
  out.push(label(0, SHELL.z1 - 9.5, "C-60 · CHROME", 8.5, "mid"));
  // screws
  const dots = [[SHELL.x0 + 4, SHELL.z0 + 4], [SHELL.x1 - 4, SHELL.z0 + 4], [SHELL.x0 + 4, SHELL.z1 - 3], [SHELL.x1 - 4, SHELL.z1 - 3]].map(([x, z]) => S(x, z));
  out.push(dotsSvg(dots, { size: 0.6, tone: "mid" }));
  return out.join("");
}

// ---- tape path (rebuilt per frame: pack radii move the tangent points) ----
const A_SUP = -1.35, A_TAK = Math.PI + 1.35;
export function tapePts(rs, rt) {
  const supPt = [SUP.x + rs * Math.cos(A_SUP), SUP.z + rs * Math.sin(A_SUP)];
  const takPt = [TAK.x + rt * Math.cos(A_TAK), TAK.z + rt * Math.sin(A_TAK)];
  return [supPt,
    [GUIDE_L.x + GUIDE_R_ * 0.5, GUIDE_L.z + GUIDE_R_ * 0.87],
    [GUIDE_L.x - GUIDE_R_, GUIDE_L.z - 0.6],
    [GUIDE_L.x, RUN_Z], [GUIDE_R.x, RUN_Z],
    [GUIDE_R.x + GUIDE_R_, GUIDE_R.z - 0.6],
    [GUIDE_R.x - GUIDE_R_ * 0.5, GUIDE_R.z + GUIDE_R_ * 0.87],
    takPt];
}
function cumLens(pts) {
  const c = [0];
  for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return c;
}
function pointAt(pts, cum, s) {
  const total = cum[cum.length - 1];
  s = ((s % total) + total) % total;
  let i = 1;
  while (i < cum.length - 1 && cum[i] < s) i++;
  const L = cum[i] - cum[i - 1] || 1, t = (s - cum[i - 1]) / L;
  return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
}
export function tapeSvg(rs, rt, travel) {
  const pts = tapePts(rs, rt), cum = cumLens(pts), total = cum[cum.length - 1];
  const out = [];
  out.push(lineSvg(sidePath(pts), { tone: "hi", className: "taperun" }));
  const dashes = [];
  for (let s = 0; s < total; s += 4) dashes.push(S(...pointAt(pts, cum, s + travel)));
  out.push(dotsSvg(dashes, { size: 0.5, tone: "hi" }));
  return out.join("");
}

// ---- reels + packs ----
export function packSvg(c, r) {
  if (r < CORE_R + 0.7) return "";
  return flat(annulus(c.x, c.z, r, CORE_R + 0.5, 1.8), "pack-back", "mid") + flat(annulus(c.x, c.z, r, CORE_R + 0.5), "pack");
}
export function reelSvg(c, angle) {
  const out = [];
  out.push(flat(sidePath(circPts(c.x, c.z, CORE_R, 36), true), "reelhub"));
  const holes = [];
  for (let i = 0; i < 3; i++) {
    const a = angle + (i * Math.PI * 2) / 3;
    holes.push(sidePath(circPts(c.x + Math.cos(a) * 6.4, c.z + Math.sin(a) * 6.4, 2.3, 14), true));
  }
  out.push(lineSvg(holes.join(""), { tone: "mid" }));
  out.push(flat(sidePath(circPts(c.x, c.z, 2.2, 14), true), "reelaxle brass"));
  const teeth = [];
  for (let i = 0; i < 6; i++) {
    const a = angle + (i * Math.PI * 2) / 6;
    teeth.push(sidePath([[c.x + Math.cos(a) * 2.1, c.z + Math.sin(a) * 2.1], [c.x + Math.cos(a) * 3.4, c.z + Math.sin(a) * 3.4]]));
  }
  out.push(lineSvg(teeth.join(""), { tone: "hi", className: "hubteeth" }));
  return out.join("");
}

// ---- heads, capstan, pinch, guides ----
export function guidesSvg() {
  const out = [];
  for (const gpt of [GUIDE_L, GUIDE_R]) {
    out.push(flat(sidePath(circPts(gpt.x, gpt.z, GUIDE_R_, 20), true), "guide steel"));
    out.push(dotsSvg([S(gpt.x, gpt.z)], { size: 0.5, tone: "hi" }));
  }
  return out.join("");
}
export function headSvg() {
  const out = [];
  const x = HEAD.x, w = HEAD.w / 2;
  out.push(flat(sidePath([[x - w, -5], [x + w, -5], [x + w * 0.55, RUN_Z], [x - w * 0.55, RUN_Z]], true), "head brass"));
  // gap line on the face
  out.push(lineSvg(sidePath([[x, RUN_Z - 1.1], [x, RUN_Z]]), { tone: "red", className: "headgap" }));
  // lamination hints
  out.push(lineSvg(sidePath([[x - w * 0.7, -3.2], [x + w * 0.7, -3.2]]) + sidePath([[x - w * 0.62, -1.6], [x + w * 0.62, -1.6]]), { tone: "lo" }));
  return out.join("");
}
export function capstanSvg(angle) {
  const out = [];
  out.push(flat(sidePath(circPts(CAP.x, CAP.z, CAP_R, 18), true), "capstan steel"));
  const [dx, dy] = S(CAP.x + Math.cos(angle) * CAP_R * 0.6, CAP.z + Math.sin(angle) * CAP_R * 0.6);
  out.push(`<circle class="inset-dot" cx="${tenth(dx)}" cy="${tenth(dy)}" r="0.55"/>`);
  return out.join("");
}
export function pinchSvg(angle) {
  const out = [];
  out.push(flat(sidePath(circPts(PIN.x, PIN.z, PINCH_R, 24), true), "pinch"));
  out.push(lineSvg(sidePath([[PIN.x, PIN.z], [PIN.x + Math.cos(angle) * (PINCH_R - 1), PIN.z + Math.sin(angle) * (PINCH_R - 1)]]), { tone: "lo" }));
  return out.join("");
}

// ---- head-gap cutaway inset ----
const IN = { x: -28, z: 82, zoom: 5 };
const SI = (u, v) => S(IN.x + u * IN.zoom, IN.z + v * IN.zoom);
export function insetFrameSvg() {
  const c = [[-5.5, -3], [5.5, -3], [5.5, 3], [-5.5, 3]].map(([u, v]) => SI(u, v));
  const out = [];
  out.push(`<path class="inset-box" d="${pathOf(c, true)}"/>`);
  const [tx, ty] = SI(0, 2.1);
  out.push(`<text class="iso-face-text" data-tone="lo" x="${tenth(tx)}" y="${tenth(ty)}" font-size="10" text-anchor="middle">the gap, magnified</text>`);
  return out.join("");
}
export function insetLiveSvg(travel) {
  const out = [];
  // head block below, face at v=0
  out.push(`<path class="inset-head" d="${pathOf([[-2.4, -1.9], [2.4, -1.9], [1.8, 0], [-1.8, 0]].map(([u, v]) => SI(u, v)), true)}"/>`);
  out.push(`<path class="iso-line" data-tone="lo" d="${pathOf([[-1.9, -1.25], [1.9, -1.25]].map(([u, v]) => SI(u, v)))}${pathOf([[-2, -0.65], [2, -0.65]].map(([u, v]) => SI(u, v)))}"/>`);
  // tape band crossing the face
  out.push(`<path class="iso-line taperun" data-tone="hi" d="${pathOf([[-5.5, 0], [5.5, 0]].map(([u, v]) => SI(u, v)))}"/>`);
  // moving magnetic-domain dashes on the tape
  const dom = [];
  for (let u = -5.5; u < 5.5; u += 0.8) {
    const uu = u + (travel % 0.8);
    if (uu > 5.5) continue;
    dom.push(pathOf([[uu, -0.18], [uu, 0.18]].map(([a, b]) => SI(a, b))));
  }
  out.push(`<path class="iso-line" data-tone="mid" d="${dom.join("")}"/>`);
  // the gap, red
  out.push(`<path class="iso-line headgap" data-tone="red" d="${pathOf([[0, -0.6], [0, 0.5]].map(([u, v]) => SI(u, v)))}"/>`);
  // direction arrow
  const [ax, ay] = SI(4.2, 0.7);
  out.push(`<path class="iso-line arrow-force" d="M${tenth(ax - 12)} ${tenth(ay)}L${tenth(ax)} ${tenth(ay)}M${tenth(ax - 3.5)} ${tenth(ay - 3)}L${tenth(ax)} ${tenth(ay)}L${tenth(ax - 3.5)} ${tenth(ay + 3)}"/>`);
  // labels
  const [l1x, l1y] = SI(0, -2.7);
  const [l2x, l2y] = SI(3.0, 1.15);
  const [l3x, l3y] = SI(-4.5, 0.85);
  out.push(`<text class="iso-face-text" data-tone="mid" x="${tenth(l1x)}" y="${tenth(l1y)}" font-size="9.5" text-anchor="middle">play head</text>`);
  out.push(`<text class="iso-face-text" data-tone="red" x="${tenth(l2x)}" y="${tenth(l2y)}" font-size="9" text-anchor="middle">gap · a few µm</text>`);
  out.push(`<text class="iso-face-text" data-tone="mid" x="${tenth(l3x)}" y="${tenth(l3y)}" font-size="9" text-anchor="middle">tape</text>`);
  return out.join("");
}

// ---- static labels ----
export function labelsSvg() {
  const out = [];
  out.push(label(SUP.x - PACK_MAX - 4, SUP.z + 10, "supply", 10, "mid", "end"));
  out.push(label(TAK.x + PACK_MAX + 4, TAK.z + 10, "take-up", 10, "mid", "start"));
  out.push(label(HEAD.x, -12.5, "play head", 9.5, "lo"));
  out.push(label(CAP.x + 4.5, CAP.z - 6.2, "capstan · ø2.4 mm", 9.5, "lo", "start"));
  out.push(label(PIN.x + 8, PIN.z - 8, "pinch roller", 9.5, "lo", "start"));
  out.push(label(GUIDE_L.x - 4, GUIDE_L.z + 8, "guide", 9, "lo", "end"));
  out.push(label(GUIDE_R.x + 5, GUIDE_R.z + 4.5, "guide", 9, "lo", "start"));
  out.push(label(FACE.x0 + 4, FACE.z1 - 8, "C-60 · 86 m of tape a side", 10.5, "mid", "start"));
  return out.join("");
}
