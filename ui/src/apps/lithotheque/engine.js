// Original specimen engine on Three.js (repo dependency, MIT).
// Procedural study models: correct habit, colour and lustre character,
// but stylized placeholders - not scans and not measured specimens.
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

// ---- procedural canvas textures (original) ----
function speckleTex(base, dots, n, seed) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = base; g.fillRect(0, 0, 256, 256);
    let s = seed;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < n; i++) {
        g.fillStyle = dots[Math.floor(rnd() * dots.length)];
        const r = 0.5 + rnd() * 2.2;
        g.globalAlpha = 0.25 + rnd() * 0.5;
        g.beginPath(); g.arc(rnd() * 256, rnd() * 256, r, 0, 7); g.fill();
    }
    g.globalAlpha = 1;
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
}
function striationTex(seed) {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d');
    g.fillStyle = '#808080'; g.fillRect(0, 0, 128, 128);
    let s = seed;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let x = 0; x < 128; x += 2) {
        const v = 100 + Math.floor(rnd() * 90);
        g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
        g.fillRect(x, 0, 1 + rnd() * 1.5, 128);
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
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
    const g = new THREE.IcosahedronGeometry(r, 18);
    displace(g, 2.8, 0.42, seed);
    g.scale(1.25, squashY, 1.05);
    const pos = g.attributes.position;
    const n = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3(pos.getX(i) / 1.25, pos.getY(i) / squashY, pos.getZ(i) / 1.05).normalize();
        n.set([v.x, v.y, v.z], i * 3);
    }
    g.setAttribute('normal', new THREE.BufferAttribute(n, 3));
    return g;
}
function bladeGeo(w, h, t) {
    const sh = new THREE.Shape();
    sh.moveTo(-w * .5, -h * .5); sh.lineTo(w * .49, -h * .5);
    sh.lineTo(w * .44, h * .3); sh.lineTo(w * .28, h * .47);
    sh.lineTo(-w * .08, h * .5); sh.lineTo(-w * .38, h * .42); sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: t, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: .012, bevelThickness: .008 });
    g.translate(0, 0, -t * .5);
    return g;
}
function prismGeo(r, h, seed, sides = 6) {
    const g = new THREE.CylinderGeometry(r, r * 1.04, h, sides, 4);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const n = fbm(pos.getX(i) * 3 + seed, pos.getY(i) * 2, pos.getZ(i) * 3, 2) * 0.04;
        pos.setX(i, pos.getX(i) * (1 + n));
        pos.setZ(i, pos.getZ(i) * (1 + n));
    }
    g.computeVertexNormals();
    return g;
}

function mineralSurface(mat, mode) {
    mat.customProgramCacheKey = () => mode;
    mat.onBeforeCompile = (shader) => {
        shader.vertexShader = 'varying vec3 vStone;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvStone=position;');
        shader.fragmentShader = `varying vec3 vStone;
      float hashStone(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
      float stoneNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(mix(hashStone(i),hashStone(i+vec3(1,0,0)),f.x),mix(hashStone(i+vec3(0,1,0)),hashStone(i+vec3(1,1,0)),f.x),f.y),mix(mix(hashStone(i+vec3(0,0,1)),hashStone(i+vec3(1,0,1)),f.x),mix(hashStone(i+vec3(0,1,1)),hashStone(i+vec3(1,1,1)),f.x),f.y),f.z);}
      ` + shader.fragmentShader;
        const detail = mode === 'matrix' ? `
      float grain=stoneNoise(vStone*135.);
      float patch=stoneNoise(vStone*18.)*.55+stoneNoise(vStone*51.)*.25;
      diffuseColor.rgb *= .52+patch*.75+grain*.35;
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.56,.51,.43),smoothstep(.86,.97,grain)*.5);
      ` : mode === 'blade' ? `
      float stripe=pow(.5+.5*sin(vStone.x*430.+stoneNoise(vStone*30.)*1.7),8.);
      float zone=stoneNoise(vec3(vStone.x*38.,vStone.y*2.,vStone.z*15.));
      diffuseColor.rgb*=.67+zone*.48+stripe*.16;
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.61,.7,.81),smoothstep(.66,.83,zone)*.35);
      ` : `float grains=stoneNoise(vStone*85.);float cloud=stoneNoise(vStone*8.);
      diffuseColor.rgb *= .78+cloud*.3+grains*.1;`;
        shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + detail);
        if (mode === 'matrix') shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      float b=stoneNoise(vStone*110.); vec3 q0=dFdx(vStone),q1=dFdy(vStone);
      vec3 sn=normalize(cross(q0,q1));
      normal=normalize(normal + (dFdx(b)*normalize(q0)+dFdy(b)*normalize(q1))*.45);`);
    };
    return mat;
}

// ---- materials ----
function makeMats(kind) {
    const matrix = new THREE.MeshStandardMaterial({
        color: '#6f6a62', roughness: 0.96, metalness: 0,
        map: speckleTex('#6f6a62', ['#5d5850', '#7d7870', '#857f75'], 900, 11),
        bumpScale: 0.012,
    });
    if (kind === 'kyanite') {
        return { matrix, crystal: () => mineralSurface(new THREE.MeshPhysicalMaterial({
            color: '#3d5da8', roughness: 0.38, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.45,
            flatShading: false,
        }), 'blade') };
    }
    if (kind === 'nepheline') {
        return { matrix, crystal: () => new THREE.MeshPhysicalMaterial({
            color: '#a0a28c', roughness: 0.36, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.25,
            map: speckleTex('#9aa38d', ['#8e9783', '#a6ae9c', '#939c88'], 500, 31),
        }) };
    }
    if (kind === 'quartz') {
        return { matrix, crystal: () => new THREE.MeshPhysicalMaterial({
            color: '#f2efe9', roughness: 0.16, metalness: 0, clearcoat: 0.8, clearcoatRoughness: 0.12,
            transparent: true, opacity: 0.94,
        }) };
    }
    if (kind === 'pyrite') {
        const st = striationTex(41);
        return { matrix, crystal: () => new THREE.MeshStandardMaterial({
            color: '#caa64f', roughness: 0.34, metalness: 1.0, roughnessMap: st, bumpMap: st, bumpScale: 0.15,
        }) };
    }
    if (kind === 'fluorite') {
        return { matrix, crystal: (uv) => new THREE.MeshPhysicalMaterial({
            color: '#7d63c2', roughness: 0.18, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.15,
            transparent: true, opacity: 0.93,
            emissive: uv ? new THREE.Color('#5a3fd0') : new THREE.Color('#000000'),
            emissiveIntensity: uv ? 0.55 : 0,
        }) };
    }
    return { matrix, crystal: () => new THREE.MeshPhysicalMaterial({
        color: '#e8e2d4', roughness: 0.2, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.18,
        transparent: true, opacity: 0.93,
    }) };
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
    const base = put(rockGeo(0.72, kind.length * 7 + 3), mats.matrix, 0, -0.72, 0);
    base.receiveShadow = true;
    const cm = mats.crystal(uv);
    for (let i = 0; i < 14; i++) {
        const a = i * 2.399, rad = .25 + (i % 4) * .12;
        put(rockGeo(.12 + (i % 3) * .05, i + 36, .45), mats.matrix, Math.cos(a) * rad, -.66 + (i % 3) * .055, Math.sin(a) * rad, .3 * i, .7 * i, .2 * i);
    }
    if (kind === 'kyanite') {
        const mica = new THREE.MeshStandardMaterial({ color: '#aaa99d', metalness: .48, roughness: .36, side: THREE.DoubleSide });
        for (let i = 0; i < 45; i++) {
            const a = i * 2.399, rad = .2 + (i % 9) * .07;
            put(new THREE.CircleGeometry(.025 + (i % 4) * .012, 5), mica, Math.cos(a) * rad, -.43 + Math.sin(i) * .09, Math.sin(a) * rad, -1.15 + i * .17, i * .3, i * .2);
        }
        const blades = [
            [0.34, 1.7, 0.09, -0.12, 0.28, 0.02, 0.1, 0.22],
            [0.3, 1.45, 0.08, 0.22, 0.1, 0.12, -0.08, -0.3],
            [0.4, 1.9, 0.1, 0.02, 0.42, -0.1, 0.18, 0.05],
            [0.26, 1.1, 0.07, -0.34, 0.02, 0.16, -0.14, 0.5],
            [0.28, 1.35, 0.08, 0.4, 0.18, -0.06, 0.06, -0.62],
        ];
        for (const [w, h, t, x, y, z, rx, rz] of blades) put(bladeGeo(w, h, t), cm, x, y, z, rx, 0, rz);
    } else if (kind === 'nepheline') {
        put(prismGeo(0.34, 0.95, 5), cm, -0.22, 0.05, 0.06, 0.14, 0.3, 0.1);
        put(prismGeo(0.28, 0.72, 9), cm, 0.26, -0.02, -0.08, -0.1, 0.9, -0.18);
        put(prismGeo(0.22, 0.5, 13), cm, 0.04, 0.3, 0.24, 0.5, 0.4, 0.3);
        const lump = new THREE.Mesh(rockGeo(0.3, 17, 0.8), cm);
        lump.position.set(0.3, -0.38, 0.2); lump.castShadow = true; g.add(lump);
    } else if (kind === 'quartz') {
        put(prismGeo(0.4, 1.3, 21), cm, -0.12, 0.1, 0);
        put(new THREE.ConeGeometry(0.4, 0.62, 6), cm, -0.12, 1.06, 0);
        put(prismGeo(0.2, 0.7, 25), cm, 0.38, -0.28, 0.16, 0, 0.3, -0.4);
        put(new THREE.ConeGeometry(0.2, 0.32, 6), cm, 0.52, 0.12, 0.16, 0, 0.3, -0.4);
    } else if (kind === 'pyrite') {
        put(new THREE.BoxGeometry(0.85, 0.85, 0.85), cm, -0.1, 0.1, 0, 0.06, 0.4, 0.04);
        put(new THREE.BoxGeometry(0.38, 0.38, 0.38), cm, 0.5, 0.5, 0.28, 0.12, 0.8, 0.06);
        put(new THREE.BoxGeometry(0.24, 0.24, 0.24), cm, -0.52, 0.28, 0.3, 0.1, 0.2, 0.1);
    } else if (kind === 'fluorite') {
        put(new THREE.OctahedronGeometry(0.78, 0), cm, 0, 0.12, 0, 0.1, 0.5, 0.06);
        put(new THREE.OctahedronGeometry(0.3, 0), cm, 0.6, -0.3, 0.22, 0.3, 0.2, 0.4);
    } else {
        const rh = new THREE.BoxGeometry(0.85, 0.95, 0.85);
        rh.applyMatrix4(new THREE.Matrix4().makeShear(0.36, 0, 0, 0, 0, 0));
        put(rh, cm, 0, 0.06, 0, 0.04, 0.4, 0.02);
        const rh2 = new THREE.BoxGeometry(0.36, 0.4, 0.36);
        rh2.applyMatrix4(new THREE.Matrix4().makeShear(0.36, 0, 0, 0, 0, 0));
        put(rh2, cm, 0.56, -0.32, 0.26, 0.04, 0.9, 0.02);
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
