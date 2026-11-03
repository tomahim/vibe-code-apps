// Original specimen engine on Three.js (repo dependency, MIT).
// Procedural study models rebuilt per species: correct habit, colour and
// lustre character, but stylized study models - not scans and not measured
// specimens.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// ---- tiny original 3D value noise ----
const P = new Uint8Array(512);
{ const p = [...Array(256).keys()];
  let s = 1234567;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) P[i] = p[i & 255]; }
function fade(t) { return t * t * (3 - 2 * t); }
function grad(h) { return (h & 7) / 7 - 0.5; }
export function noise3(x, y, z) {
    const X = Math.floor(x) & 255; const Y = Math.floor(y) & 255; const Z = Math.floor(z) & 255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    const u = fade(x); const v = fade(y); const w = fade(z);
    const A = P[X] + Y; const AA = P[A] + Z; const AB = P[A + 1] + Z;
    const B = P[X + 1] + Y; const BA = P[B] + Z; const BB = P[B + 1] + Z;
    const l = (a, b, t) => a + (b - a) * t;
    return l(
        l(l(grad(P[AA]), grad(P[BA]), u), l(grad(P[AB]), grad(P[BB]), u), v),
        l(l(grad(P[AA + 1]), grad(P[BA + 1]), u), l(grad(P[AB + 1]), grad(P[BB + 1]), u), v),
        w);
}
export function fbm(x, y, z, oct = 3) {
    let a = 0; let amp = 0.5; let f = 1;
    for (let i = 0; i < oct; i++) { a += noise3(x * f, y * f, z * f) * amp; amp *= 0.5; f *= 2.1; }
    return a;
}

// ---- geometry builders ----
function displace(geo, freq, amp, seed) {
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const n = fbm(v.x * freq + seed, v.y * freq + seed * 1.7, v.z * freq - seed, 3);
        const len = v.length() || 1;
        const k = 1 + (n * amp) / len;
        pos.setXYZ(i, v.x * k, v.y * k, v.z * k);
    }
    geo.computeVertexNormals();
    return geo;
}
function rockGeo(r, seed, squashY = 0.62) {
    const g = new THREE.IcosahedronGeometry(r, 12);
    displace(g, 2.8, 0.42, seed);
    g.scale(1.25, squashY, 1.05);
    g.computeVertexNormals();
    return g;
}
// craggy rock surface: ridged noise for broken, angular relief
function cragGeo(r, seed, squashY = 0.55) {
    const g = rockGeo(r, seed, squashY);
    const pos = g.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const n = 1 - Math.abs(fbm(v.x * 3.3 + seed, v.y * 3.3 + seed * 0.7, v.z * 3.3, 3));
        const k = 1 + (n * 0.16) / (v.length() || 1);
        pos.setXYZ(i, v.x * k, v.y * k, v.z * k);
    }
    g.computeVertexNormals();
    return g;
}

// Realistic kyanite blade: parametric slab with mostly parallel edges, a thick
// bevel-edged cross-section, lengthwise cleavage steps on the flat faces, and an
// abrupt termination (slanted chisel cut or flat break) - never a spear point.
// Length along +Y from the base. aZone: 0 at the blade core, 1 at the sides.
// term: 0 = flat break, >0 = slant height of a diagonal cut across the width.
function bladeGeo(len, w, t, seed, term) {
    const segs = 26, ring = 12;
    const bendX = noise3(seed, 0.3, 1.7) * 0.18 * len;
    const bendZ = noise3(1.1, seed, 0.6) * 0.12 * len;
    const positions = []; const zone = []; const idx = [];
    const ringPts = [];
    for (let i = 0; i < ring; i++) {
        const a = (i / ring) * Math.PI * 2;
        const cx = Math.sign(Math.cos(a)) * Math.pow(Math.abs(Math.cos(a)), 0.30);
        const cz = Math.sign(Math.sin(a)) * Math.pow(Math.abs(Math.sin(a)), 0.55);
        ringPts.push([cx, cz]);
    }
    const stepAt = (px) => {
        const s1 = Math.abs(px - 0.35) < 0.06 ? 0.16 : 0;
        const s2 = Math.abs(px + 0.42) < 0.05 ? -0.13 : 0;
        return s1 + s2;
    };
    for (let s = 0; s <= segs; s++) {
        const u = s / segs;
        const taper = u < 0.9 ? 1 : 1 - (u - 0.9) * 2.0;
        const wob = 1 + 0.05 * fbm(u * 4 + seed, seed * 0.7, 0, 2);
        const cx0 = bendX * u * u;
        const cz0 = bendZ * Math.sin(u * 1.9);
        for (let i = 0; i < ring; i++) {
            const px = ringPts[i][0], pz = ringPts[i][1];
            const relief = stepAt(px) * Math.abs(pz) * t * 0.5;
            const cut = u > 0.9 && term > 0 ? term * (px * 0.5 + 0.5) * ((u - 0.9) / 0.1) : 0;
            const y = u * len - cut;
            const jx = fbm(u * 7 + seed, i * 0.9, seed * 0.3, 2) * w * 0.06;
            const jz = fbm(u * 7 - seed, i * 0.9 + 4.2, seed, 2) * t * 0.35;
            positions.push(cx0 + px * w * 0.5 * taper * wob + jx, y, cz0 + (pz * t * 0.5 + relief) * (1 - 0.25 * u) + jz);
            zone.push(Math.abs(px));
        }
    }
    for (let s = 0; s < segs; s++) {
        for (let i = 0; i < ring; i++) {
            const a = s * ring + i, b = s * ring + (i + 1) % ring;
            const c = a + ring, d = b + ring;
            idx.push(a, c, b, b, c, d);
        }
    }
    const topAvg = term > 0 ? len - term * 0.5 : len;
    const apex = positions.length / 3;
    positions.push(bendX, topAvg, bendZ * Math.sin(1.9));
    zone.push(0.5);
    const lastRing = segs * ring;
    for (let i = 0; i < ring; i++) idx.push(lastRing + i, apex, lastRing + (i + 1) % ring);
    const base = positions.length / 3;
    positions.push(0, 0, 0); zone.push(0);
    for (let i = 0; i < ring; i++) idx.push(base, (i + 1) % ring, i);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute('aZone', new THREE.Float32BufferAttribute(zone, 1));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
}

// Quartz crystal: hexagonal prism with the species' termination of alternating
// major and minor rhombohedron faces. Length along +Y from the base; slight
// taper, wobble and off-centre apex, as real crystals are rarely perfect.
function quartzGeo(len, r, seed) {
    const sides = 6, segs = 8;
    const twist = noise3(seed, 2.2, 0.4) * 0.08;
    const positions = []; const idx = [];
    for (let s = 0; s <= segs; s++) {
        const u = s / segs;
        const rr = r * (1 - 0.06 * u + 0.03 * fbm(u * 5 + seed, seed, 1, 2));
        const cx = twist * u * u * len;
        for (let i = 0; i < sides; i++) {
            const a = (i / sides) * Math.PI * 2 + Math.PI / 6;
            const jr = 1 + 0.04 * noise3(seed + i * 3.1, u * 4, 0.7);
            positions.push(cx + Math.cos(a) * rr * jr, u * len, Math.sin(a) * rr * jr);
        }
    }
    for (let s = 0; s < segs; s++) {
        for (let i = 0; i < sides; i++) {
            const a = s * sides + i, b = s * sides + (i + 1) % sides;
            idx.push(a, a + sides, b, b, a + sides, b + sides);
        }
    }
    // closed termination: staggered top ring (alternating face heights suggest
    // the major/minor rhombohedra) meeting a single apex - no open seams
    const ax = twist * len + r * 0.06 * noise3(seed, 7.7, 1.1);
    const az = r * 0.06 * noise3(seed, 1.3, 9.2);
    const topOff = segs * sides;
    const stag = positions.length / 3;
    for (let i = 0; i < sides; i++) {
        const a = (i / sides) * Math.PI * 2 + Math.PI / 6;
        const rr = r * 0.94;
        const up = i % 2 === 0 ? 0.10 : -0.16;
        positions.push(twist * len + Math.cos(a) * rr, len + up * r * 3, Math.sin(a) * rr);
    }
    const apex = positions.length / 3;
    positions.push(ax, len + r * 1.7, az);
    for (let i = 0; i < sides; i++) {
        const j = (i + 1) % sides;
        // quad strip prism-top -> staggered ring (two triangles), then cap triangle
        idx.push(topOff + i, stag + i, topOff + j, topOff + j, stag + i, stag + j);
        idx.push(stag + i, apex, stag + j);
    }
    const b0 = positions.length / 3; positions.push(0, 0, 0);
    for (let i = 0; i < sides; i++) idx.push(b0, (i + 1) % sides, i);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
}

// Calcite scalenohedron ("dogtooth"): two staggered triangle rings between a
// tall apex and a short foot, giving twelve scalene faces. Length along +Y.
function calcToothGeo(len, r, seed) {
    const positions = []; const idx = [];
    const lean = noise3(seed, 4.4, 0.9) * 0.1 * len;
    for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        const rr = r * (1 + 0.07 * noise3(seed + i, 0.5, 3.3));
        positions.push(lean * 0.35 + Math.cos(a) * rr, len * 0.42, Math.sin(a) * rr);
    }
    for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2 + Math.PI / 3;
        const rr = r * 0.94 * (1 + 0.07 * noise3(seed + i + 9, 1.5, 1.3));
        positions.push(Math.cos(a) * rr, 0, Math.sin(a) * rr);
    }
    const apex = positions.length / 3; positions.push(lean, len, 0);
    const foot = positions.length / 3; positions.push(0, -len * 0.18, 0);
    for (let i = 0; i < 3; i++) {
        const j = (i + 1) % 3;
        idx.push(i, apex, 3 + i, i, 3 + j, apex);
        idx.push(i, 3 + i, foot, i, foot, 3 + j);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
}

// Calcite cleavage rhomb: an oblique parallelepiped with the species' oblique
// rhombohedral angles (never a cube).
function rhombGeo(s, seed) {
    const g = new THREE.BoxGeometry(s, s * 1.06, s, 2, 2, 2);
    g.applyMatrix4(new THREE.Matrix4().makeShear(0.42, 0, 0, 0, 0, 0));
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const n = fbm(pos.getX(i) * 6 + seed, pos.getY(i) * 6, pos.getZ(i) * 6, 2) * 0.012;
        pos.setXYZ(i, pos.getX(i) * (1 + n), pos.getY(i) * (1 + n), pos.getZ(i) * (1 + n));
    }
    g.computeVertexNormals();
    return g;
}

// Nepheline: stubby hexagonal prism with a flat basal termination and softly
// uneven edges; the massive habit shows as intergrown greasy grains.
function hexPrismGeo(len, r, seed) {
    const g = new THREE.CylinderGeometry(r * 0.96, r * 1.03, len, 6, 4);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const n = fbm(pos.getX(i) * 5 + seed, pos.getY(i) * 3, pos.getZ(i) * 5, 2) * 0.05;
        pos.setX(i, pos.getX(i) * (1 + n));
        pos.setZ(i, pos.getZ(i) * (1 + n));
    }
    g.computeVertexNormals();
    return g;
}

// Pyrite cube: subdivided box with very slight face relief; the striations the
// species is known for are drawn in the shader, aligned per face (perpendicular
// on adjacent faces, matching on opposite ones).
function pyriteCubeGeo(s, seed) {
    const g = new THREE.BoxGeometry(s, s, s, 5, 5, 5);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const n = fbm(pos.getX(i) * 7 + seed, pos.getY(i) * 7, pos.getZ(i) * 7, 2) * 0.008;
        pos.setXYZ(i, pos.getX(i) * (1 + n), pos.getY(i) * (1 + n), pos.getZ(i) * (1 + n));
    }
    g.computeVertexNormals();
    return g;
}

// Fluorite cube with bevelled (octahedrally modified) corners. aZone runs from
// 0 at face centres to 1 at edges and corners, for the species' darker rim
// colour zoning.
function fluoriteGeo(s, seed) {
    const h = s / 2;
    const g = new THREE.BoxGeometry(s, s, s, 3, 3, 3);
    const pos = g.attributes.position;
    const zone = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        const ax = Math.abs(x), ay = Math.abs(y), az = Math.abs(z);
        const mx = Math.max(ax, ay, az), mn = Math.min(ax, ay, az);
        const mid = ax + ay + az - mx - mn;
        zone[i] = Math.max(0, Math.min(1, (mid / h - 0.42) / 0.5));
        const corner = (ax + ay + az) / (3 * h);
        if (corner > 0.86) {
            const k = 1 - 0.3 * ((corner - 0.86) / 0.14);
            x *= k; y *= k; z *= k;
        }
        const n = fbm(x * 6 + seed, y * 6, z * 6, 2) * 0.006;
        pos.setXYZ(i, x * (1 + n), y * (1 + n), z * (1 + n));
    }
    g.setAttribute('aZone', new THREE.BufferAttribute(zone, 1));
    g.computeVertexNormals();
    return g;
}

// ---- per-species surface detail (shader injection) ----
const NOISE_GLSL = `
      float hashStone(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
      float stoneNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(mix(hashStone(i),hashStone(i+vec3(1,0,0)),f.x),mix(hashStone(i+vec3(0,1,0)),hashStone(i+vec3(1,1,0)),f.x),f.y),mix(mix(hashStone(i+vec3(0,0,1)),hashStone(i+vec3(1,0,1)),f.x),mix(hashStone(i+vec3(0,1,1)),hashStone(i+vec3(1,1,1)),f.x),f.y),f.z);}
      `;
const vec = (c) => `vec3(${c[0]},${c[1]},${c[2]})`;

// shared craggy granular matrix shader; per-species palette and extras
function matrixDetail(dark, light, extra = '') {
    return `
      float warp = (stoneNoise(vStone*2.2)-.5)*8.;
      float bandf = stoneNoise(vec3(vStone.x*5.5+warp, vStone.y*5.5, vStone.z*5.5));
      vec3 col = mix(${vec(dark)}, ${vec(light)}, smoothstep(.3,.72,bandf));
      float lens = stoneNoise(vStone*4.2+13.7);
      col = mix(col, ${vec(light)}*1.25, smoothstep(.62,.82,lens)*.4);
      float grain = stoneNoise(vStone*120.);
      col *= .68 + grain*.58;
      ${extra}
      diffuseColor.rgb = col;
      `;
}
const MATRIX_BUMP = `
      float b=stoneNoise(vStone*110.); vec3 q0=dFdx(vStone),q1=dFdy(vStone);
      normal=normalize(normal + (dFdx(b)*normalize(q0)+dFdy(b)*normalize(q1))*.5);`;

function crystalDetail(mode) {
    if (mode === 'kyanite') return [`
      // cloudy internal colour variation, elongated along the blade
      float cl1 = stoneNoise(vStone*vec3(6.,1.5,6.));
      float cl2 = stoneNoise(vStone*vec3(15.,4.,15.));
      float cloud = cl1*.62 + cl2*.38;
      vec3 deep = vec3(.05,.13,.40);
      vec3 midb = vec3(.17,.31,.60);
      vec3 pale = vec3(.48,.56,.72);
      vec3 col = mix(pale, midb, smoothstep(.22,.52,cloud));
      col = mix(col, deep, smoothstep(.55,.85,cloud));
      float streak = stoneNoise(vec3(vStone.x*38., vStone.y*2.2, vStone.z*38.));
      col = mix(col, deep*1.1, smoothstep(.58,.9,streak)*.4);
      float fr = 1.-abs(stoneNoise(vStone*vec3(9.,2.2,9.))*2.-1.);
      col = mix(col, col*.5, smoothstep(.90,.985,fr)*.55);
      float chip = step(.958, stoneNoise(vStone*vec3(55.,16.,55.)));
      col = mix(col, pale*1.08, chip*.45);
      col = mix(col, pale, smoothstep(.68,1.,vZone)*.4);
      col = mix(col, pale*.92, smoothstep(.8,1.05,vStone.y)*.2);
      float stripe = sin(vStone.y*260. + stoneNoise(vStone*35.)*5.);
      col *= .96 + .04*smoothstep(-.6,.9,stripe);
      float pearl = stoneNoise(vStone*vec3(20.,4.5,20.));
      col = mix(col, col*vec3(1.06,1.08,1.14), smoothstep(.6,.92,pearl)*.35);
      diffuseColor.rgb = col;
      `, ''];
    if (mode === 'quartz') return [`
      // milky quartz: cloudy internal variation, glassier where clearer
      float qa = stoneNoise(vStone*3.2);
      float qb = stoneNoise(vStone*11.);
      float cloud = qa*.6 + qb*.4;
      vec3 clearq = vec3(.78,.80,.83);
      vec3 milk = vec3(.94,.93,.90);
      vec3 col = mix(clearq, milk, smoothstep(.26,.6,cloud));
      // faint growth banding across the prism
      float grow = stoneNoise(vec3(vStone.x*2.4, vStone.y*.9, vStone.z*2.4));
      col = mix(col, milk*.95, smoothstep(.55,.82,grow)*.35);
      // rusty staining wisps low on the prism
      col = mix(col, vec3(.60,.52,.40), smoothstep(.6,.9,stoneNoise(vStone*2.1+8.8))*.3*smoothstep(.3,-.5,vStone.y));
      diffuseColor.rgb = col;
      `, `
      // horizontal striations on the prism faces (none on the terminations)
      float pr = 1.-abs(vNrm.y);
      float bq = sin(vStone.y*160. + stoneNoise(vStone*30.)*4.)*.05*pr*pr;
      vec3 q0=dFdx(vStone),q1=dFdy(vStone);
      normal=normalize(normal + (dFdx(bq)*normalize(q0)+dFdy(bq)*normalize(q1))*2.);`];
    if (mode === 'pyrite') return [`
      // even brassy pyrite: mostly uniform metal, sparse tarnish, fine striations
      vec3 col = vec3(.82,.68,.36);
      float t1 = stoneNoise(vStone*2.8);
      col = mix(col, vec3(.50,.40,.20), smoothstep(.55,.85,t1)*.35);
      col = mix(col, vec3(.34,.26,.13), smoothstep(.68,.95,stoneNoise(vStone*1.7+5.5))*.35);
      col *= .96 + .08*stoneNoise(vStone*12.);
      // fine face striations: direction cycles per face, so adjacent faces cross
      vec3 an = abs(vNrm);
      float sco = an.x>max(an.y,an.z) ? vStone.y : (an.y>an.z ? vStone.z : vStone.x);
      float st = sin(sco*230. + stoneNoise(vStone*40.)*4.);
      col *= .965 + .05*smoothstep(-.4,.9,st);
      diffuseColor.rgb = col;
      `, `
      // striation relief grooves
      vec3 an2 = abs(vNrm);
      float sco2 = an2.x>max(an2.y,an2.z) ? vStone.y : (an2.y>an2.z ? vStone.z : vStone.x);
      float bp = sin(sco2*230. + stoneNoise(vStone*40.)*4.)*.045;
      vec3 q0=dFdx(vStone),q1=dFdy(vStone);
      normal=normalize(normal + (dFdx(bp)*normalize(q0)+dFdy(bp)*normalize(q1))*2.);`];
    if (mode === 'fluorite') return [`
      // violet fluorite: paler core, saturated rim zoning at edges and corners
      float f1 = stoneNoise(vStone*3.4);
      float f2 = stoneNoise(vStone*12.);
      vec3 core = vec3(.58,.50,.83);
      vec3 rim = vec3(.30,.18,.60);
      vec3 col = mix(core*.92, core*1.05, f1*.6 + f2*.4);
      col = mix(col, rim, smoothstep(.35,.95,vZone)*.8);
      // cloudy phantom patches inside
      col = mix(col, rim*1.15, smoothstep(.58,.85,stoneNoise(vStone*4.6+3.3))*.3);
      diffuseColor.rgb = col;
      `, ''];
    if (mode === 'calcite') return [`
      // calcite: glassy warm white with stronger internal clouding and honey wisps
      float c1 = stoneNoise(vStone*2.6);
      float c2 = stoneNoise(vStone*9.);
      vec3 clearc = vec3(.70,.68,.62);
      vec3 milkc = vec3(.96,.93,.85);
      vec3 col = mix(clearc, milkc, smoothstep(.36,.6,c1*.62+c2*.38));
      float band = sin(dot(vStone, vec3(.5774))*22.);
      col *= .92 + .08*smoothstep(-.7,.8,band);
      col = mix(col, vec3(.83,.66,.40), smoothstep(.58,.88,stoneNoise(vStone*2.2+6.6))*.35);
      col = mix(col, col*vec3(1.1,1.06,.98), smoothstep(.55,.9,stoneNoise(vStone*vec3(18.,5.,18.)))*.5);
      diffuseColor.rgb = col;
      `, ''];
    // nepheline
    return [`
      // greasy grey-green nepheline: mottled, paler altered patches
      float n1 = stoneNoise(vStone*4.5);
      float n2 = stoneNoise(vStone*16.);
      vec3 dark = vec3(.22,.24,.20);
      vec3 light = vec3(.42,.43,.37);
      vec3 col = mix(dark, light, smoothstep(.3,.72,n1));
      col *= .78 + .32*n2;
      col = mix(col, vec3(.62,.61,.55), smoothstep(.64,.88,stoneNoise(vStone*2.8+11.))*.3);
      diffuseColor.rgb = col;
      `, `
      float bn=stoneNoise(vStone*90.);
      vec3 q0=dFdx(vStone),q1=dFdy(vStone);
      normal=normalize(normal + (dFdx(bn)*normalize(q0)+dFdy(bn)*normalize(q1))*.3);`];
}

const CRYSTAL_MODES = ['kyanite', 'quartz', 'pyrite', 'fluorite', 'calcite', 'nepheline'];
const MATRIX_DETAIL = {
    schist: () => [`
      // foliated mica schist: irregular patchy bands, broken lighter lenses, glints
      float warp = (stoneNoise(vStone*2.2)-.5)*9.;
      float bandf = stoneNoise(vec3(vStone.x*6.5+warp, vStone.y*6.5, vStone.z*6.5));
      vec3 dark = vec3(.085,.08,.075);
      vec3 light = vec3(.16,.15,.135);
      vec3 col = mix(dark, light, smoothstep(.3,.72,bandf));
      float lens = stoneNoise(vStone*4.5+13.7);
      col = mix(col, light*1.3, smoothstep(.6,.8,lens)*.45);
      float grain = stoneNoise(vStone*130.);
      col *= .66 + grain*.6;
      float glint = step(.970, stoneNoise(vStone*330.));
      col += glint * vec3(.15,.14,.13);
      diffuseColor.rgb = col;
      `],
    granite: () => [matrixDetail([0.24, 0.23, 0.21], [0.55, 0.53, 0.49],
        'float fel = stoneNoise(vStone*7.5+4.4); col = mix(col, vec3(.62,.58,.52), smoothstep(.58,.8,fel)*.5);')],
    shale: () => [matrixDetail([0.075, 0.07, 0.065], [0.19, 0.18, 0.165],
        'col += step(.985, stoneNoise(vStone*260.)) * vec3(.35,.28,.12);')],
    lime: () => [matrixDetail([0.30, 0.28, 0.24], [0.56, 0.53, 0.46], '')],
    warm: () => [matrixDetail([0.32, 0.28, 0.22], [0.58, 0.53, 0.44], '')],
    syenite: () => [matrixDetail([0.13, 0.13, 0.12], [0.35, 0.34, 0.30],
        'float fel = stoneNoise(vStone*6.5+4.4); col = mix(col, vec3(.52,.5,.44), smoothstep(.6,.8,fel)*.5);')],
};

function mineralSurface(mat, mode) {
    const isCrystal = CRYSTAL_MODES.includes(mode);
    const hasZone = mode === 'kyanite' || mode === 'fluorite';
    mat.customProgramCacheKey = () => mode;
    mat.onBeforeCompile = (shader) => {
        shader.vertexShader = (hasZone ? 'attribute float aZone; varying float vZone;\n' : '')
            + 'varying vec3 vStone;\nvarying vec3 vNrm;\n' + shader.vertexShader.replace('#include <begin_vertex>',
            '#include <begin_vertex>\nvStone=position;\nvNrm=normal;' + (hasZone ? 'vZone=aZone;' : ''));
        shader.fragmentShader = `varying vec3 vStone;\nvarying vec3 vNrm;
      ${hasZone ? 'varying float vZone;' : ''}
      ${NOISE_GLSL}` + shader.fragmentShader;
        const detail = isCrystal ? crystalDetail(mode)[0] : MATRIX_DETAIL[mode]()[0];
        const bump = isCrystal ? crystalDetail(mode)[1] : MATRIX_BUMP;
        shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + detail);
        if (bump) shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' + bump);
    };
    return mat;
}

// ---- materials ----
function makeMats(kind) {
    const std = (mode, extra) => mineralSurface(new THREE.MeshStandardMaterial({
        color: '#ffffff', roughness: 0.95, metalness: 0.02, ...extra,
    }), mode);
    const phys = (mode, extra) => mineralSurface(new THREE.MeshPhysicalMaterial({
        color: '#ffffff', ...extra,
    }), mode);
    if (kind === 'kyanite') {
        return {
            matrix: std('schist', { roughness: 0.94, metalness: 0.04 }),
            crystal: () => phys('kyanite', {
                roughness: 0.38, metalness: 0,
                clearcoat: 0.25, clearcoatRoughness: 0.4,
                sheen: 0.35, sheenRoughness: 0.6, sheenColor: new THREE.Color('#bcccea'),
            }),
        };
    }
    if (kind === 'quartz') {
        return {
            matrix: std('granite'),
            crystal: () => phys('quartz', {
                roughness: 0.24, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.25,
                transparent: true, opacity: 0.96, flatShading: true,
            }),
        };
    }
    if (kind === 'pyrite') {
        return {
            matrix: std('shale', { roughness: 0.97 }),
            crystal: () => mineralSurface(new THREE.MeshStandardMaterial({
                color: '#ffffff', roughness: 0.34, metalness: 1.0,
            }), 'pyrite'),
        };
    }
    if (kind === 'fluorite') {
        return {
            matrix: std('lime'),
            crystal: (uv) => phys('fluorite', {
                roughness: 0.2, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.2,
                transparent: true, opacity: 0.95,
                emissive: uv ? new THREE.Color('#5a3fd0') : new THREE.Color('#000000'),
                emissiveIntensity: uv ? 0.55 : 0,
            }),
        };
    }
    if (kind === 'calcite') {
        return {
            matrix: std('warm'),
            crystal: () => phys('calcite', {
                roughness: 0.18, metalness: 0, clearcoat: 0.65, clearcoatRoughness: 0.2,
                transparent: true, opacity: 0.94, flatShading: true,
            }),
        };
    }
    return {
        matrix: std('syenite'),
        crystal: () => phys('nepheline', {
            roughness: 0.55, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.45,
            flatShading: true,
        }),
    };
}

// ---- specimen composition ----
export function buildSpecimen(kind, uv) {
    const g = new THREE.Group();
    const mats = makeMats(kind);
    const put = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0, s = 1) => {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(x, y, z);
        m.rotation.set(rx, ry, rz);
        m.scale.setScalar(s);
        m.castShadow = true;
        g.add(m);
        return m;
    };
    const baseSpec = { kyanite: [0.78, 0.5, -0.72], quartz: [0.78, 0.5, -0.72], pyrite: [0.74, 0.46, -0.7], fluorite: [0.7, 0.44, -0.68], calcite: [0.76, 0.48, -0.71], nepheline: [0.74, 0.52, -0.72] }[kind];
    const base = put(cragGeo(baseSpec[0], kind.length * 7 + 3, baseSpec[1]), mats.matrix, 0, baseSpec[2], 0);
    base.receiveShadow = true;
    const cm = mats.crystal(uv);
    if (kind === 'kyanite') {
        // craggy foliated schist base with embedded milky quartz intergrowth
        const quartzMat = new THREE.MeshPhysicalMaterial({ color: '#cfcabf', roughness: .58, metalness: 0, clearcoat: .2, clearcoatRoughness: .5, transparent: true, opacity: .96 });
        const lumps = [
            [0.085, 5, -0.42, -0.58, 0.26, 0.4, 1.9, 0.8, 1.1],
            [0.07, 9, 0.38, -0.58, -0.18, 1.2, 1.6, 0.8, 1.3],
            [0.06, 13, -0.12, -0.5, -0.33, 2.1, 1.4, 0.8, 1.0],
            [0.055, 17, 0.22, -0.54, 0.3, 0.8, 1.5, 0.8, 1.2],
            [0.05, 21, -0.34, -0.56, -0.05, 1.7, 1.8, 0.8, 0.9],
        ];
        for (const [r, sd, x, y, z, ry, sx, sy, sz] of lumps) {
            const q = new THREE.Mesh(cragGeo(r, sd, 0.7), quartzMat);
            q.position.set(x, y, z);
            q.rotation.set(0.3 * sd, ry, 0.2 * sd);
            q.scale.set(sx, sy, sz);
            q.castShadow = true;
            g.add(q);
        }
        // sub-parallel stacked cluster of thick blades (bent, fanned, some crossing)
        // [len, w, t, x, z, rx, rz, ry, term]
        const blades = [
            [1.5, 0.30, 0.085, 0.0, 0.0, 0.04, -0.22, 0.2, 0.16],
            [1.3, 0.26, 0.075, 0.14, 0.08, -0.03, -0.34, -0.4, 0.0],
            [1.42, 0.24, 0.07, -0.15, 0.05, 0.06, -0.13, 0.8, 0.22],
            [1.05, 0.20, 0.06, 0.05, -0.12, 0.14, -0.42, 1.9, 0.12],
            [0.85, 0.17, 0.05, -0.08, 0.16, -0.08, 0.18, -1.1, 0.0],
            [0.62, 0.14, 0.045, 0.24, -0.04, 0.05, -0.55, 1.3, 0.1],
        ];
        for (const [len, w, t, x, z, rx, rz, ry, term] of blades) {
            const b = new THREE.Mesh(bladeGeo(len, w, t, len * 13.7, term), cm);
            b.position.set(x, -0.56, z);
            b.rotation.set(rx, ry, rz);
            b.castShadow = true;
            g.add(b);
        }
        // broken blade stubs around the cluster base
        for (const [len, w, t, x, z, rx, rz, ry] of [
            [0.32, 0.12, 0.04, -0.3, 0.18, 0.3, -0.5, 0.6],
            [0.26, 0.1, 0.035, 0.34, 0.12, -0.2, -0.28, 2.2],
        ]) {
            const b = new THREE.Mesh(bladeGeo(len, w, t, len * 31.1, 0), cm);
            b.position.set(x, -0.5, z);
            b.rotation.set(rx, ry, rz);
            b.castShadow = true;
            g.add(b);
        }
    } else if (kind === 'quartz') {
        // druse-like cluster of prisms with alternating rhombohedral terminations
        put(quartzGeo(0.95, 0.26, 21), cm, 0.02, -0.38, 0.0, 0.05, 0.2, 0.07);
        put(quartzGeo(0.72, 0.19, 25), cm, -0.32, -0.44, 0.1, 0.02, 0.7, 0.32);
        put(quartzGeo(0.62, 0.16, 29), cm, 0.33, -0.45, -0.06, -0.04, -0.5, -0.3);
        put(quartzGeo(0.42, 0.11, 33), cm, 0.14, -0.5, 0.3, -0.18, 0.4, -0.42);
        put(quartzGeo(0.36, 0.09, 37), cm, -0.16, -0.52, 0.28, -0.1, 1.9, 0.45);
        put(quartzGeo(0.3, 0.08, 41), cm, 0.42, -0.52, 0.22, -0.3, 2.6, -0.55);
    } else if (kind === 'pyrite') {
        // intergrown parallel cubes, some half-sunk in dark shale
        put(pyriteCubeGeo(0.72, 5), cm, -0.06, -0.2, -0.02, 0.04, 0.35, 0.03);
        put(pyriteCubeGeo(0.46, 9), cm, 0.42, -0.32, 0.22, 0.04, 0.62, 0.05);
        put(pyriteCubeGeo(0.34, 13), cm, -0.48, -0.4, 0.26, 0.05, 0.28, 0.02);
        put(pyriteCubeGeo(0.27, 17), cm, 0.08, -0.34, -0.38, 0.06, 0.5, 0.04);
        put(pyriteCubeGeo(0.2, 21), cm, 0.58, -0.48, -0.12, 0.04, 0.4, 0.03);
        put(pyriteCubeGeo(0.15, 25), cm, -0.32, -0.52, -0.28, 0.05, 0.7, 0.04);
    } else if (kind === 'fluorite') {
        // bevelled cubes with rim zoning, plus a cleaved octahedral fragment
        put(fluoriteGeo(0.62, 5), cm, 0.0, -0.02, 0.0, 0.05, 0.5, 0.04);
        put(fluoriteGeo(0.42, 9), cm, 0.46, -0.24, 0.14, 0.06, 1.1, 0.05);
        put(fluoriteGeo(0.26, 13), cm, -0.42, -0.34, 0.18, 0.04, 0.9, 0.03);
        put(new THREE.OctahedronGeometry(0.17, 0), cm, 0.3, -0.52, -0.3, 0.3, 0.2, 0.4);
    } else if (kind === 'calcite') {
        // dogtooth scalenohedra with cleavage rhombs at the base
        put(calcToothGeo(1.0, 0.26, 5), cm, 0.0, -0.3, 0.04, 0.03, 0.4, 0.06);
        put(calcToothGeo(0.68, 0.2, 9), cm, -0.32, -0.36, 0.16, 0.02, 1.1, 0.34);
        put(calcToothGeo(0.58, 0.17, 13), cm, 0.34, -0.36, 0.1, -0.02, 2.0, -0.3);
        put(calcToothGeo(0.38, 0.12, 17), cm, 0.14, -0.44, -0.26, -0.24, 0.8, -0.1);
        put(rhombGeo(0.42, 21), cm, -0.44, -0.5, -0.22, 0.05, 0.6, 0.03);
        put(rhombGeo(0.28, 25), cm, 0.46, -0.55, -0.28, 0.04, 1.4, 0.02);
    } else {
        // nepheline: stubby greasy prisms among intergrown massive grains
        put(hexPrismGeo(0.56, 0.28, 5), cm, -0.2, -0.08, 0.02, 0.16, 0.52, 0.3);
        put(hexPrismGeo(0.42, 0.22, 9), cm, 0.3, -0.16, -0.08, -0.1, 0.52, -0.34);
        put(hexPrismGeo(0.3, 0.16, 13), cm, 0.06, -0.24, 0.3, -0.3, 0.52, 0.15);
        for (const [r, sd, x, y, z] of [
            [0.2, 17, -0.44, -0.32, 0.24],
            [0.16, 21, 0.48, -0.35, 0.2],
            [0.15, 25, -0.1, -0.38, -0.32],
            [0.13, 29, 0.3, -0.4, -0.3],
        ]) {
            const lump = new THREE.Mesh(rockGeo(r, sd, 0.8), cm);
            lump.position.set(x, y, z);
            lump.rotation.set(0.3 * sd, sd, 0.2 * sd);
            lump.castShadow = true;
            g.add(lump);
        }
    }
    return g;
}

// ---- bench lighting ----
function lightScene(scene, variant) {
    if (variant === 'benchUV') {
        scene.add(new THREE.AmbientLight('#241d3a', 1.4));
        const key = new THREE.SpotLight('#7a5cff', 40, 0, 0.7, 0.5, 1.6);
        key.position.set(0.8, 3, 2); key.castShadow = true;
        scene.add(key);
        const rim = new THREE.DirectionalLight('#3a2f6a', 1.2);
        rim.position.set(-2, 0.8, -1.5);
        scene.add(rim);
    } else {
        scene.add(new THREE.AmbientLight('#3a3f4a', 0.7));
        const key = new THREE.SpotLight('#f5e4cd', 24, 0, 0.62, 0.45, 1.6);
        key.position.set(1.6, 3.2, 2.2); key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0004;
        scene.add(key);
        const rim = new THREE.DirectionalLight('#5a6f95', 1.1);
        rim.position.set(-2.4, 1.2, -1.6);
        scene.add(rim);
    }
}

export function createScene(canvas, kind, variant) {
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: false });
    } catch { return null; }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.25;
    lightScene(scene, variant);
    const model = buildSpecimen(kind, variant === 'benchUV');
    model.scale.setScalar(0.92);
    scene.add(model);
    const ground = new THREE.Mesh(
        new THREE.CircleGeometry(1.6, 40),
        new THREE.ShadowMaterial({ opacity: 0.5 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.18;
    ground.receiveShadow = true;
    scene.add(ground);
    const cam = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    cam.position.set(0, 0.3, 4.3);
    cam.lookAt(0, .05, 0);
    return {
        resize: () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = canvas.clientWidth; const h = canvas.clientHeight;
            if (!w || !h) return;
            renderer.setPixelRatio(dpr);
            renderer.setSize(w, h, false);
            cam.aspect = w / h;
            cam.updateProjectionMatrix();
        },
        render: (ry, rx) => {
            model.rotation.y = ry;
            model.rotation.x = rx;
            renderer.render(scene, cam);
        },
        dispose: () => {
            scene.traverse((o) => {
                if (o.isMesh) {
                    o.geometry.dispose();
                    const ms = Array.isArray(o.material) ? o.material : [o.material];
                    ms.forEach((m) => { for (const v of Object.values(m)) if (v && v.isTexture) v.dispose(); m.dispose(); });
                }
            });
            scene.environment?.dispose();
            renderer.dispose(); renderer.forceContextLoss();
            pmrem.dispose();
        },
    };
}
