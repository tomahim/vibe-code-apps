// Bicycle drivetrain model - side plane (x forward, z up, y=0), mm units.
import { iso, pathOf, solidSvg, lineSvg, dotsSvg, faceTextSvg, sideMatrix, fitProjection, gearRing, rotPts, circleRing, tenth } from './engine.mjs';

export const WHEEL_R = 350, RIM_R = 316, HUB_R = 11;
export const RH = { x: 0, z: 350 }, FH = { x: 1000, z: 350 };       // hubs
export const BB = { x: 415, z: 270 };                                // bottom bracket
export const R1 = 101, T1 = 50, R2 = 30, T2 = 15;                    // ring / cog radii + teeth
export const CRANK = 172.5, PITCH = 12.7, CIRC = 2.1;                // crank mm, chain pitch mm, wheel m/turn
export const VIEW_W = 640, VIEW_H = 430;

export const PB = fitProjection(
  [[-380, -40, -30], [1380, 40, 880], [-380, 40, 880], [1380, -40, -30]],
  VIEW_W, VIEW_H, { pad: 26, azimuth: 90, elevation: 28 });

const S = (x, z, y = 0) => iso([x, y, z], PB);
const sidePath = (pts, closed = false) => pathOf(pts.map(([x, z]) => S(x, z)), closed);
const circPts = (cx, cz, r, steps = 48, from = 0, span = Math.PI * 2) =>
  Array.from({ length: steps + 1 }, (_, i) => [cx + r * Math.cos(from + (i / steps) * span), cz + r * Math.sin(from + (i / steps) * span)]);
export const annulus = (cx, cz, ro, ri) =>
  sidePath(circPts(cx, cz, ro, 56), true) + sidePath(circPts(cx, cz, ri, 56).reverse(), true);
export const flat = (d, className, tone = "hi") =>
  solidSvg({ fill: d, outline: d, crease: "", bevel: "", top: "", shades: [] }, { flat: true, tone, className });
export const label = (x, z, text, size = 10.5, tone = "mid", anchor = "middle") => {
  const [sx, sy] = S(x, z);
  return `<text class="iso-face-text" data-tone="${tone}" x="${tenth(sx)}" y="${tenth(sy)}" font-size="${size}" text-anchor="${anchor}">${text}</text>`;
};

// ---- chain path (closed loop, direction of travel when pedaling) ----
function chainLoop() {
  const vx = BB.x - RH.x, vz = BB.z - RH.z;              // cog -> ring
  const dist = Math.hypot(vx, vz);
  const base = Math.atan2(vz, vx);                       // direction cog -> ring
  const cosG = (R2 - R1) / dist;                         // normal offset for unequal radii
  const g = Math.acos(cosG);                             // angle between base and tangent normal
  const nTop = base + g, nBot = base - g;                // pick up/down normals
  const top = Math.sin(nTop) > Math.sin(nBot) ? nTop : nBot;
  const bot = top === nTop ? nBot : nTop;
  const p = (c, r, a) => [c.x + r * Math.cos(a), c.z + r * Math.sin(a)];
  const ringBot = bot, ringTop = top;                    // radii angles on the ring
  const seq = [];
  // travel (forward pedaling): engage ring at bottom, wrap its right side CCW to top,
  // top run to cog, wrap cog's rear side CCW to bottom, bottom run back
  seq.push(...circPts(BB.x, BB.z, R1, 26, ringBot, (ringTop - ringBot + 2 * Math.PI) % (2 * Math.PI)));
  seq.push(...circPts(RH.x, RH.z, R2, 14, ringTop, (ringBot - ringTop + 2 * Math.PI) % (2 * Math.PI)));
  return { seq, meshRing: p(BB, R1, ringBot), meshCog: p(RH, R2, ringTop) };
}
const CHAIN = chainLoop(); const LOOP = CHAIN.seq;
const CUM = [0];
for (let i = 1; i < LOOP.length; i++) CUM.push(CUM[i - 1] + Math.hypot(LOOP[i][0] - LOOP[i - 1][0], LOOP[i][1] - LOOP[i - 1][1]));
export const CHAIN_LEN = CUM[CUM.length - 1] + Math.hypot(LOOP[0][0] - LOOP[LOOP.length - 1][0], LOOP[0][1] - LOOP[LOOP.length - 1][1]);
export function chainPointAt(s) {
  s = ((s % CHAIN_LEN) + CHAIN_LEN) % CHAIN_LEN;
  const pts = LOOP, n = pts.length;
  const cum = CUM;
  let i = 1;
  while (i < n && cum[i] < s) i++;
  if (i >= n) { // closing segment
    const a = pts[n - 1], b = pts[0], L = CHAIN_LEN - cum[n - 1] || 1, t = (s - cum[n - 1]) / L;
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  }
  const L = cum[i] - cum[i - 1] || 1, t = (s - cum[i - 1]) / L, a = pts[i - 1], b = pts[i];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}
export const chainPathD = () => sidePath(LOOP, true);
export function chainPinsSvg(travel, tone = "hi") {
  const dots = [];
  const n = Math.round(CHAIN_LEN / PITCH);
  for (let i = 0; i < n; i++) {
    const [x, z] = chainPointAt(i * PITCH + travel);
    dots.push(S(x, z));
  }
  return dotsSvg(dots, { size: 0.55, tone });
}

// ---- static figure ----
const TUBE = "tube", STAY = "stay";
function tube(a, b, cls = TUBE, tone = "hi") {
  return lineSvg(sidePath([a, b]), { tone, className: cls });
}
const SEAT = { x: 264, z: 762 }, HEAD_T = { x: 883, z: 748 }, HEAD_B = { x: 932, z: 596 };
export function frameSvg() {
  const out = [];
  // main triangle
  out.push(tube([BB.x, BB.z], [SEAT.x + 26, SEAT.z - 22]));                    // seat tube
  out.push(tube([SEAT.x + 26, SEAT.z - 22], [HEAD_T.x, HEAD_T.z]));            // top tube
  out.push(tube([BB.x, BB.z], [HEAD_B.x, HEAD_B.z]));                          // down tube
  out.push(tube([HEAD_B.x, HEAD_B.z], [HEAD_T.x, HEAD_T.z]));                  // head tube
  // stays + fork
  out.push(tube([SEAT.x + 26, SEAT.z - 22], [RH.x, RH.z], STAY, "mid"));       // seat stay
  out.push(tube([BB.x, BB.z], [RH.x, RH.z], STAY, "mid"));                     // chain stay
  out.push(tube([HEAD_B.x, HEAD_B.z], [FH.x, FH.z], STAY, "mid"));             // fork
  // cockpit + saddle
  out.push(tube([HEAD_T.x, HEAD_T.z], [HEAD_T.x - 26, HEAD_T.z + 34], STAY, "hi")); // stem
  out.push(tube([HEAD_T.x - 26, HEAD_T.z + 34], [HEAD_T.x - 58, HEAD_T.z + 26], STAY, "hi")); // bar
  out.push(flat(sidePath([[SEAT.x - 6, SEAT.z - 16], [SEAT.x + 58, SEAT.z - 16], [SEAT.x + 66, SEAT.z - 4], [SEAT.x + 6, SEAT.z - 4]], true), "saddle"));
  return out.join("");
}
export function groundSvg() {
  const out = [];
  out.push(lineSvg(sidePath([[-330, 0], [1330, 0]]), { tone: "lo" }));
  const ticks = [];
  for (let x = -300; x <= 1300; x += 100) ticks.push(sidePath([[x, 0], [x - 14, -16]]));
  out.push(lineSvg(ticks.join(""), { tone: "faint" }));
  return out.join("");
}
export function wheelStaticSvg(hub) {
  const out = [];
  out.push(flat(annulus(hub.x, hub.z, WHEEL_R, RIM_R), "tire", "mid"));
  out.push(lineSvg(sidePath(circPts(hub.x, hub.z, RIM_R - 4)), { tone: "mid" }));
  out.push(flat(sidePath(circPts(hub.x, hub.z, HUB_R + 3, 24), true), "hub"));
  return out.join("");
}
export function spokesSvg(hub, angle, count = 18) {
  const d = [];
  for (let i = 0; i < count; i++) {
    const a = angle + (i * Math.PI * 2) / count;
    d.push(sidePath([[hub.x + Math.cos(a) * (HUB_R + 2), hub.z + Math.sin(a) * (HUB_R + 2)], [hub.x + Math.cos(a) * (RIM_R - 5), hub.z + Math.sin(a) * (RIM_R - 5)]]));
  }
  const valve = S(hub.x + Math.cos(angle + 0.5) * (RIM_R - 14), hub.z + Math.sin(angle + 0.5) * (RIM_R - 14));
  return lineSvg(d.join(""), { tone: "mid", className: "spoke" }) + dotsSvg([valve], { size: 0.7, tone: "hi" });
}
export function ringSvg(angle) {
  const out = [];
  out.push(flat(sidePath(rotPts(gearRing(BB.x, BB.z, T1, R1 - 8, R1, 0.5), [BB.x, BB.z], angle), true), "chainring"));
  const arms = [];
  for (let i = 0; i < 5; i++) {
    const a = angle + (i * Math.PI * 2) / 5;
    arms.push(sidePath([[BB.x + Math.cos(a) * 20, BB.z + Math.sin(a) * 20], [BB.x + Math.cos(a) * (R1 - 10), BB.z + Math.sin(a) * (R1 - 10)]]));
  }
  out.push(lineSvg(arms.join(""), { tone: "hi", className: "spider" }));
  out.push(flat(sidePath(circPts(BB.x, BB.z, 21, 24), true), "hubcap"));
  return out.join("");
}
export function crankArmsSvg(angle) {
  const out = [];
  for (const off of [0, Math.PI]) {
    const a = angle + off;
    const px = BB.x + Math.cos(a) * CRANK, pz = BB.z + Math.sin(a) * CRANK;
    out.push(lineSvg(sidePath([[BB.x + Math.cos(a) * 12, BB.z + Math.sin(a) * 12], [px, pz]]), { tone: "hi", className: "crank" }));
  }
  return out.join("");
}
export function pedalsSvg(angle, force) {
  const out = [];
  for (const off of [0, Math.PI]) {
    const a = angle + off;
    const px = BB.x + Math.cos(a) * CRANK, pz = BB.z + Math.sin(a) * CRANK;
    out.push(flat(sidePath([[px - 42, pz - 8], [px + 42, pz - 8], [px + 42, pz + 8], [px - 42, pz + 8]], true), "pedal"));
    if (force > 0 && off === 0) { // drive pedal: downward force arrow
      const [ax, ay] = S(px, pz + 34);
      const [bx, by] = S(px, pz + 34 + 150 * force);
      out.push(`<path class="iso-line arrow-force" d="M${tenth(ax)} ${tenth(ay)}L${tenth(bx)} ${tenth(by)}M${tenth(ax - 5)} ${tenth(ay - 9)}L${tenth(ax)} ${tenth(ay)}L${tenth(ax + 5)} ${tenth(ay - 9)}"/>`);
    }
  }
  return out.join("");
}
export function cogSvg(angle) {
  const out = [];
  out.push(flat(sidePath(rotPts(gearRing(RH.x, RH.z, T2, R2 - 4.5, R2, 0.5), [RH.x, RH.z], angle), true), "cog"));
  // ratchet teeth ring (rotates with driver)
  out.push(lineSvg(sidePath(rotPts(gearRing(RH.x, RH.z, 12, 12, 15.5, 0.8), [RH.x, RH.z], angle), true), { tone: "mid" }));
  return out.join("");
}
export function pawlSvg(wheelAngle, engagement) {
  const out = [];
  for (let i = 0; i < 3; i++) {
    const a = wheelAngle + (i * Math.PI * 2) / 3;
    const bx = RH.x + Math.cos(a) * 7, bz = RH.z + Math.sin(a) * 7;         // pivot on hub
    const tipR = 7 + 8 * engagement;                                        // out when engaged
    const ta = a + 0.5;
    const tx = RH.x + Math.cos(ta) * tipR, tz = RH.z + Math.sin(ta) * tipR;
    out.push(flat(sidePath([[bx, bz], [tx, tz], [RH.x + Math.cos(a + 0.9) * 7, RH.z + Math.sin(a + 0.9) * 7]], true), "pawl", "mid"));
  }
  return out.join("");
}
export function ghostSvg() {
  const out = [];
  for (const [r, t, dx, dy] of [[22.2, "11T", 46, -30], [56.6, "28T", 82, 66]]) {
    out.push(lineSvg(sidePath(circPts(RH.x, RH.z, r, 28), true), { tone: "blue", dashed: true }));
    out.push(label(RH.x + dx, RH.z + dy, t, 10, "blue", "start"));
  }
  return out.join("");
}
export function labelsSvg() {
  const out = [];
  out.push(label(BB.x + R1 + 62, BB.z - 26, "50T ring", 10.5, "mid", "start"));
  out.push(label(RH.x, RH.z - 96, "15T cog", 10.5, "mid"));
  out.push(label(FH.x + 20, FH.z + WHEEL_R + 58, "700C wheel · 2.1 m a turn", 10.5, "lo"));
  out.push(label(BB.x + 195, BB.z - 88, "172.5 mm crank", 10, "lo", "start"));
  return out.join("");
}
export function meshDotsSvg() {
  // red dots where chain meets ring (bottom tangent entry) and cog (top tangent entry)
  return dotsSvg([S(CHAIN.meshRing[0], CHAIN.meshRing[1]), S(CHAIN.meshCog[0], CHAIN.meshCog[1])], { size: 1.05, tone: "red" });
}
