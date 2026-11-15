// Nature interior - ground-level navigable 3D prototype for the
// 2026-11-15-ecosystem-growth-poc artifact ("World tour" tab, Nature theme).
// Bundled with esbuild to an IIFE exposing window.NatureInterior.
// One bounded forest clearing: drag orbits, wheel/pinch dollies, tap recenters.
import * as THREE from "three";

const REGION_ANCHORS = [
  { key: 0, x: -11, y: 1.2, z: -6 },   // near the pond
  { key: 1, x: 9, y: 2.6, z: -12 },    // big tree knoll
  { key: 2, x: -14, y: 1.6, z: 9 },    // meadow
  { key: 3, x: 12, y: 1.4, z: 10 },    // grove
  { key: 4, x: 0, y: 2.2, z: -18 },    // far ridge
];

function makeTerrain() {
  const R = 46, SEG = 96;
  const geo = new THREE.PlaneGeometry(R * 2, R * 2, SEG, SEG);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const cGrass = new THREE.Color(0x5d8a48), cGrass2 = new THREE.Color(0x6f9a4e);
  const cEarth = new THREE.Color(0x8a6f4d), cSand = new THREE.Color(0xc9b98a);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const d = Math.hypot(x, z);
    let h = Math.sin(x * 0.11) * Math.cos(z * 0.13) * 1.4
      + Math.sin(x * 0.031 + 2.1) * Math.cos(z * 0.043) * 3.2
      + Math.sin(x * 0.35) * Math.cos(z * 0.31) * 0.22;
    h *= Math.min(1, d / 14); // flatten the clearing
    const pondD = Math.hypot(x + 11, z + 6);
    if (pondD < 6.4) h = Math.min(h, -0.9 + pondD * 0.12); // pond bowl
    pos.setY(i, h);
    const t = 0.5 + 0.5 * Math.sin(x * 0.21 + z * 0.17);
    c.lerpColors(cGrass, cGrass2, t);
    if (pondD < 8.4) c.lerp(cSand, Math.max(0, 1 - Math.abs(pondD - 7.2) / 1.4));
    const pathD = Math.abs(z - Math.sin(x * 0.1) * 3 - 2);
    if (pathD < 1.2 && pondD > 7.6) c.lerp(cEarth, 0.65 * (1 - pathD / 1.2));
    if (d > R * 0.86) c.lerp(new THREE.Color(0x41663a), (d - R * 0.86) / (R * 0.14));
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 }));
  mesh.receiveShadow = true;
  return mesh;
}

function makePond() {
  const geo = new THREE.CircleGeometry(5.6, 40);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x3f7f8f, transparent: true, opacity: 0.82, roughness: 0.15, metalness: 0.35,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(-11, -0.32, -6);
  return mesh;
}

function treeGeometries() {
  const trunk = new THREE.CylinderGeometry(0.14, 0.24, 1.6, 5);
  trunk.translate(0, 0.8, 0);
  const cone = new THREE.ConeGeometry(1.15, 2.6, 7);
  cone.translate(0, 2.7, 0);
  const blob = new THREE.IcosahedronGeometry(1.25, 0);
  blob.translate(0, 2.4, 0);
  return { trunk, cone, blob };
}

function scatterTrees(scene) {
  const { trunk, cone, blob } = treeGeometries();
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 1 });
  const coneMat = new THREE.MeshStandardMaterial({ color: 0x3f6d35, roughness: 0.9, flatShading: true });
  const blobMat = new THREE.MeshStandardMaterial({ color: 0x57893c, roughness: 0.9, flatShading: true });
  const N_CONE = 130, N_BLOB = 80;
  const trunks = new THREE.InstancedMesh(trunk, trunkMat, N_CONE + N_BLOB);
  const cones = new THREE.InstancedMesh(cone, coneMat, N_CONE);
  const blobs = new THREE.InstancedMesh(blob, blobMat, N_BLOB);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  const e = new THREE.Euler();
  let placed = 0, ci = 0, bi = 0, guard = 0;
  while (placed < N_CONE + N_BLOB && guard++ < 4000) {
    const a = Math.random() * Math.PI * 2;
    const r = 10 + Math.pow(Math.random(), 0.6) * 34;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (Math.hypot(x + 11, z + 6) < 8.6) continue;           // pond
    if (Math.abs(z - Math.sin(x * 0.1) * 3 - 2) < 1.8) continue; // path
    const sc = 0.7 + Math.random() * 1.15;
    p.set(x, 0, z);
    e.set(0, Math.random() * Math.PI * 2, 0);
    q.setFromEuler(e);
    s.set(sc, sc * (0.85 + Math.random() * 0.4), sc);
    m.compose(p, q, s);
    trunks.setMatrixAt(placed, m);
    if (placed % 3 === 2 && bi < N_BLOB) { blobs.setMatrixAt(bi++, m); }
    else if (ci < N_CONE) { cones.setMatrixAt(ci++, m); }
    else { blobs.setMatrixAt(bi++, m); }
    placed++;
  }
  trunks.count = placed; cones.count = ci; blobs.count = bi;
  trunks.castShadow = cones.castShadow = blobs.castShadow = true;
  scene.add(trunks, cones, blobs);
}

function makeGrass(scene) {
  const N = 5200;
  const geo = new THREE.PlaneGeometry(0.13, 0.42);
  geo.translate(0, 0.2, 0);
  const mat = new THREE.MeshStandardMaterial({ color: 0x6f9a4e, emissive: 0x283d1a, side: THREE.DoubleSide, roughness: 1 });
  const mesh = new THREE.InstancedMesh(geo, mat, N);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3();
  let placed = 0, guard = 0;
  while (placed < N && guard++ < N * 4) {
    const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * 30;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (Math.hypot(x + 11, z + 6) < 7.4) continue;
    p.set(x, 0.05, z);
    e.set((Math.random() - 0.5) * 0.35, Math.random() * Math.PI, (Math.random() - 0.5) * 0.35);
    q.setFromEuler(e);
    const sc = 0.7 + Math.random() * 0.9;
    s.set(sc, sc, sc);
    m.compose(p, q, s);
    mesh.setMatrixAt(placed++, m);
  }
  mesh.count = placed;
  scene.add(mesh);
  return mesh;
}

function makeRocks(scene) {
  const N = 40;
  const geo = new THREE.IcosahedronGeometry(0.5, 0);
  const mat = new THREE.MeshStandardMaterial({ color: 0x8d8577, roughness: 1, flatShading: true });
  const mesh = new THREE.InstancedMesh(geo, mat, N);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3();
  for (let i = 0; i < N; i++) {
    const a = Math.random() * Math.PI * 2, r = 6 + Math.random() * 34;
    p.set(Math.cos(a) * r, 0.1, Math.sin(a) * r);
    e.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    q.setFromEuler(e);
    const sc = 0.3 + Math.random() * 1.1;
    s.set(sc, sc * 0.7, sc);
    m.compose(p, q, s);
    mesh.setMatrixAt(i, m);
  }
  mesh.castShadow = true;
  scene.add(mesh);
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
      r: 14 + Math.random() * 16, h: 9 + Math.random() * 6,
      speed: 0.25 + Math.random() * 0.3, phase: Math.random() * Math.PI * 2,
      cx: (Math.random() - 0.5) * 20, cz: (Math.random() - 0.5) * 20,
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
  const N = 14;
  const geo = new THREE.PlaneGeometry(0.34, 0.26);
  const mat = new THREE.MeshBasicMaterial({ color: 0xe8a33d, side: THREE.DoubleSide, transparent: true, opacity: 0.95 });
  const mesh = new THREE.InstancedMesh(geo, mat, N);
  scene.add(mesh);
  const homes = [];
  for (let i = 0; i < N; i++) {
    const a = Math.random() * Math.PI * 2, r = 4 + Math.random() * 22;
    homes.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, phase: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() });
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
  const N = 90;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3), phase = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const a = Math.random() * Math.PI * 2, r = 5 + Math.random() * 26;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = 0.6 + Math.random() * 2.4;
    pos[i * 3 + 2] = Math.sin(a) * r;
    phase[i] = Math.random() * Math.PI * 2;
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

function makeFish(scene) {
  // occasional ripple rings on the pond
  const N = 3;
  const geo = new THREE.RingGeometry(0.3, 0.42, 24);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ color: 0xdff2f0, transparent: true, opacity: 0.0, side: THREE.DoubleSide });
  const rings = [];
  for (let i = 0; i < N; i++) {
    const mesh = new THREE.Mesh(geo, mat.clone());
    const a = Math.random() * Math.PI * 2, r = Math.random() * 3.6;
    mesh.position.set(-11 + Math.cos(a) * r, -0.28, -6 + Math.sin(a) * r);
    scene.add(mesh);
    rings.push({ mesh, phase: i * 2.4 + Math.random() * 2 });
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
  renderer.toneMappingExposure = 1.05;
  const W = () => container.clientWidth || 2, H = () => container.clientHeight || 2;
  renderer.setSize(W(), H());
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfd9e8);
  scene.fog = new THREE.Fog(0xbfd9e8, 30, 95);

  const camera = new THREE.PerspectiveCamera(55, W() / H(), 0.1, 240);

  const sun = new THREE.DirectionalLight(0xfff2d8, 2.4);
  sun.position.set(28, 42, 18);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -50; sun.shadow.camera.right = 50;
  sun.shadow.camera.top = 50; sun.shadow.camera.bottom = -50;
  sun.shadow.camera.far = 120;
  sun.shadow.bias = -0.0006;
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xbfd9e8, 0x4a5d3a, 0.9));

  scene.add(makeTerrain());
  scene.add(makePond());
  scatterTrees(scene);
  makeGrass(scene);
  makeRocks(scene);
  const tickBirds = makeBirds(scene);
  const tickButterflies = makeButterflies(scene);
  const tickFireflies = makeFireflies(scene);
  const tickFish = makeFish(scene);

  // canopy light dust
  // (fireflies double as dust motes in daylight)

  // ---- camera: orbit around a recenterable target, bounded zone ----
  const ZONE_R = 20;
  const target = new THREE.Vector3(0, 1.2, 0);
  const cam = { az: 0.7, pol: 1.12, dist: 16 };
  const camGoal = { az: cam.az, pol: cam.pol, dist: cam.dist, tx: target.x, ty: target.y, tz: target.z };
  const MIN_D = 3.5, MAX_D = 30, MIN_P = 0.32, MAX_P = 1.42;

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

  // pointer controls: drag orbits, wheel/pinch dollies, quick tap recenters
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
    tickFish(elapsed);
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
    home() { camGoal.az = 0.7; camGoal.pol = 1.12; camGoal.dist = 16; camGoal.tx = 0; camGoal.ty = 1.2; camGoal.tz = 0; },
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
