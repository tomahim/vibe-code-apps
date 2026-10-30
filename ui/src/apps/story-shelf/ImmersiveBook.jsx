import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { illustration } from './content';
import { buildModel } from './models';
import { createTextureStore } from './pageTextures';

// Immersive mode: the whole book is real WebGL. A physical book lies on a wooden
// table, its cover swings open, pages bend as they turn, and the paper sculpture of
// each page rises out of the gutter. Text and pictures are the same as readable mode.
const W = 2.1, H = 2.9, N = 28;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const back = t => { const c = 1.9, k = c + 1; return 1 + k * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const disposeTree = o => o.traverse(c => { c.geometry?.dispose(); if (c.material) [].concat(c.material).forEach(m => m.dispose()); });

function woodTexture() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 1024; const ctx = c.getContext('2d');
  ctx.fillStyle = '#5b3d26'; ctx.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 260; i++) {
    const y = i * 4 + Math.sin(i) * 3; ctx.strokeStyle = `rgba(${i % 2 ? 30 : 190},${i % 2 ? 18 : 140},${i % 2 ? 10 : 90},${.05 + (i % 7) * .012})`;
    ctx.lineWidth = 1 + (i % 3); ctx.beginPath(); ctx.moveTo(0, y);
    ctx.bezierCurveTo(300, y + Math.sin(i * 1.3) * 14, 700, y - Math.cos(i) * 12, 1024, y + Math.sin(i * .7) * 8); ctx.stroke();
  }
  for (let p = 0; p < 4; p++) { ctx.fillStyle = 'rgba(20,10,5,.5)'; ctx.fillRect(0, p * 256, 1024, 3); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); return t;
}

export default function ImmersiveBook({ book, opened, page, reduced, onNext, onPrev, onOpen, onUnavailable }) {
  const host = useRef(null);
  const live = useRef({}); live.current = { opened, page, reduced, onNext, onPrev, onOpen, book };
  useEffect(() => {
    const el = host.current; const scene = new THREE.Scene();
    let renderer, controls, frame, ro, io, store;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } catch { onUnavailable?.(); return undefined; }
    const dom = renderer.domElement; el.appendChild(dom);
    dom.setAttribute('role', 'img');
    dom.setAttribute('aria-label', 'Immersive 3D book on a table. Drag to look around, tap the right page for next and the left page for previous. Controls and the full text are also available below.');
    scene.background = new THREE.Color(0x1b1410); scene.fog = new THREE.Fog(0x1b1410, 9, 18);
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 60);
    controls = new OrbitControls(camera, dom);
    controls.enablePan = false; controls.enableZoom = false; controls.enableDamping = true;
    controls.minPolarAngle = .3; controls.maxPolarAngle = 1.15; controls.minAzimuthAngle = -.6; controls.maxAzimuthAngle = .6;
    controls.target.set(0, .15, .1); controls.autoRotate = false;
    dom.style.touchAction = 'pan-y';
    scene.add(new THREE.HemisphereLight(0xfff0d0, 0x2a1d14, .9));
    const lamp = new THREE.SpotLight(0xffd9a0, 62, 30, .7, .6, 1.4);
    lamp.position.set(-3.5, 8, 4); lamp.castShadow = true; lamp.shadow.mapSize.set(1536, 1536); lamp.shadow.bias = -.0005;
    lamp.target.position.set(0, 0, 0); scene.add(lamp, lamp.target);
    const glow = new THREE.PointLight(0xffc880, 0, 9, 1.6); glow.position.set(0, 1.4, .2); scene.add(glow);
    const table = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: .8 }));
    table.rotation.x = -Math.PI / 2; table.receiveShadow = true; scene.add(table);

    store = createTextureStore(renderer);
    const std = (map, extra = {}) => new THREE.MeshStandardMaterial({ map, roughness: .9, ...extra });
    const bookRoot = new THREE.Group(); scene.add(bookRoot);
    const cur = live.current;
    const coverColor = new THREE.Color(cur.book.color);
    const clothMat = new THREE.MeshStandardMaterial({ color: coverColor, roughness: .75 });
    const endpaper = new THREE.MeshStandardMaterial({ color: 0xe6d3a5, roughness: .9 });
    // Back board and right-hand page block (always present).
    const backBoard = new THREE.Mesh(new THREE.BoxGeometry(W + .1, .05, H + .1), clothMat); backBoard.position.set(W / 2, .025, 0);
    const rightBlock = new THREE.Mesh(new THREE.BoxGeometry(W - .02, .07, H - .04), std(null, { color: 0xf0e4c6 })); rightBlock.position.set(W / 2, .085, 0);
    const leftBlock = new THREE.Mesh(new THREE.BoxGeometry(W - .02, .07, H - .04), std(null, { color: 0xf0e4c6 }));
    const spine = new THREE.Mesh(new THREE.BoxGeometry(.1, .1, H + .1), clothMat); spine.position.set(-.04, .05, 0);
    for (const m of [backBoard, rightBlock, leftBlock, spine]) { m.castShadow = true; m.receiveShadow = true; bookRoot.add(m); }
    // Front cover hinged at the spine.
    const pivot = new THREE.Group(); bookRoot.add(pivot);
    const cover = new THREE.Mesh(new THREE.BoxGeometry(W + .1, .05, H + .1), [clothMat, clothMat, std(store.cover(cur.book)), endpaper, clothMat, clothMat]);
    cover.position.x = W / 2; cover.castShadow = true; cover.receiveShadow = true; pivot.add(cover);
    const planeGeo = new THREE.PlaneGeometry(W - .05, H - .09);
    const leftPage = new THREE.Mesh(planeGeo, std(null)); const rightPage = new THREE.Mesh(planeGeo, std(null));
    for (const [m, x] of [[leftPage, -W / 2], [rightPage, W / 2]]) { m.rotation.x = -Math.PI / 2; m.position.x = x; m.receiveShadow = true; bookRoot.add(m); }
    // The bending page. Two meshes share one deforming strip: picture on the front, text on the back.
    const pos = new THREE.BufferAttribute(new Float32Array((N + 1) * 2 * 3), 3); pos.setUsage(THREE.DynamicDrawUsage);
    const nor = new THREE.BufferAttribute(new Float32Array((N + 1) * 2 * 3), 3); nor.setUsage(THREE.DynamicDrawUsage);
    const uvF = new Float32Array((N + 1) * 2 * 2), uvB = new Float32Array((N + 1) * 2 * 2); const idx = [];
    for (let i = 0; i <= N; i++) { for (let k = 0; k < 2; k++) { const v = i * 2 + k; uvF[v * 2] = i / N; uvF[v * 2 + 1] = k; uvB[v * 2] = 1 - i / N; uvB[v * 2 + 1] = k; } }
    for (let i = 0; i < N; i++) { const a = i * 2, b = a + 1, c = a + 2, d = a + 3; idx.push(a, c, b, b, c, d); }
    const gF = new THREE.BufferGeometry(); gF.setAttribute('position', pos); gF.setAttribute('normal', nor); gF.setAttribute('uv', new THREE.BufferAttribute(uvF, 2)); gF.setIndex(idx);
    const gB = new THREE.BufferGeometry(); gB.setAttribute('position', pos); gB.setAttribute('normal', nor); gB.setAttribute('uv', new THREE.BufferAttribute(uvB, 2)); gB.setIndex(idx);
    const flipFront = new THREE.Mesh(gF, std(null, { side: THREE.FrontSide })); const flipBack = new THREE.Mesh(gB, std(null, { side: THREE.BackSide }));
    for (const m of [flipFront, flipBack]) { m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; m.visible = false; bookRoot.add(m); }
    function shape(theta, dir) {
      const baseY = .128; let x = 0, y = baseY; const ds = (W - .05) / N; const p = pos.array;
      for (let i = 0; i <= N; i++) {
        const s = i / N; const a = theta - dir * .85 * Math.sin(theta) * s * s + .2 * Math.sin(theta) * s * (dir > 0 ? 1 : -1) * 0;
        if (i > 0) { x += Math.cos(a) * ds; y += Math.sin(a) * ds; }
        for (let k = 0; k < 2; k++) { const v = (i * 2 + k) * 3; p[v] = x; p[v + 1] = y + .004; p[v + 2] = (k ? -1 : 1) * (H - .09) / 2; }
      }
      pos.needsUpdate = true; gF.computeVertexNormals(); nor.array.set(gF.attributes.normal.array); nor.needsUpdate = true;
    }
    const setMap = (mesh, tex) => { mesh.material.map = tex; mesh.material.needsUpdate = true; };
    const L = (i) => store.left(live.current.book, i), R = (i) => store.right(live.current.book, i, illustration(live.current.book, i));

    // Paper sculpture rising from the gutter, plus drifting glints.
    let model = null, modelKey = '', rise = 0, riseTarget = 0, sparkTime = 0;
    const sparkGeo = new THREE.BufferGeometry(); const SP = 70; const sp = new Float32Array(SP * 3);
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: 0xffe3a0, size: .05, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    sparks.frustumCulled = false; bookRoot.add(sparks);
    function placeModel(key) {
      if (model) { bookRoot.remove(model); disposeTree(model); }
      model = buildModel(live.current.book.model, live.current.page); modelKey = key; model.scale.setScalar(.001); model.children[0].visible = false; bookRoot.add(model);
    }

    // State machine.
    const S = { openT: live.current.opened ? 1 : 0, openTarget: live.current.opened ? 1 : 0, shown: live.current.page, flip: null };
    let lastTime = performance.now(), clock = 0;
    function applyStatic() {
      const o = S.openT; const th = Math.PI * ease(o);
      pivot.rotation.z = th; pivot.position.y = .145 - .12 * ease(o);
      bookRoot.position.x = -W / 2 * (1 - ease(o)) - .0;
      const lt = Math.max(.001, Math.min(1, (ease(o) - .5) * 2)); leftBlock.scale.y = lt; leftBlock.position.set(-W / 2, .05 + .035 * lt, 0);
      leftPage.position.y = .05 + .07 * lt + .002; leftPage.visible = o > .8; leftBlock.visible = ease(o) > .52; rightPage.position.y = .122; rightPage.visible = o > .02;
      rightPage.visible = true; spine.visible = true;
    }
    function setPages(p) { setMap(leftPage, L(p)); setMap(rightPage, R(p)); }
    setPages(S.shown); applyStatic(); if (live.current.opened) placeModel(`${live.current.book.slug}:${S.shown}`);
    function startFlip(dir) {
      const p = S.shown, q = p + dir;
      if (dir > 0) { setMap(flipFront, R(p)); setMap(flipBack, L(q)); setMap(rightPage, R(q)); }
      else { setMap(flipFront, R(q)); setMap(flipBack, L(p)); setMap(leftPage, L(q)); }
      S.flip = { dir, t: 0, from: p, to: q };
      flipFront.visible = flipBack.visible = true; shape(dir > 0 ? 0 : Math.PI, dir);
    }
    function finishFlip() {
      const f = S.flip; S.shown = f.to; S.flip = null; flipFront.visible = flipBack.visible = false; setPages(S.shown);
    }
    const dur = ms => (live.current.reduced ? 1 : ms);
    function tick(dt) {
      const { opened: want, page: target, reduced: rm } = live.current;
      S.openTarget = want ? 1 : 0;
      if (S.openT !== S.openTarget) {
        const step = dt / dur(1100) * (S.openTarget ? 1 : -1.3);
        S.openT = THREE.MathUtils.clamp(S.openT + step, 0, 1);
        if (S.openT === 0 || S.openT === 1) S.openT = S.openTarget;
        if (S.openT === 0 && S.shown !== target) { S.shown = target; setPages(S.shown); }
        applyStatic();
      }
      const isOpen = S.openT === 1;
      if (S.flip) {
        S.flip.t = Math.min(1, S.flip.t + dt / dur(950));
        const e = ease(S.flip.t); const th = S.flip.dir > 0 ? Math.PI * e : Math.PI * (1 - e);
        shape(th, S.flip.dir);
        if (S.flip.t >= 1) finishFlip();
      } else if (isOpen && S.shown !== target) startFlip(Math.sign(target - S.shown));
      const settled = isOpen && !S.flip && S.shown === target;
      riseTarget = settled ? 1 : 0;
      const key = `${live.current.book.slug}:${S.shown}`;
      if (model && modelKey !== key && rise <= .02) { bookRoot.remove(model); disposeTree(model); model = null; }
      if (!model && settled) { placeModel(key); rise = 0; }
      const speed = riseTarget ? dt / dur(1100) : dt / dur(260);
      rise = THREE.MathUtils.clamp(rise + (riseTarget > rise ? speed : -speed * 1.6), 0, 1);
      if (model) {
        const e = riseTarget ? back(rise) : rise; const sc = .34 * Math.max(.001, e);
        model.scale.setScalar(sc); const bob = rm ? 0 : Math.sin(clock * 1.6) * .03 * rise;
        model.position.set(.62, .2 + .5 * ease(rise) + bob, -.15); if (!rm) model.rotation.y += dt * .00035;
      }
      glow.intensity = 14 * rise; sparks.material.opacity = rm ? 0 : .85 * rise;
      sparkTime = clock;
      for (let i = 0; i < SP; i++) { const ph = (clock * .00022 + i / SP) % 1; const a = i * 2.4; const r = .25 + (i % 7) * .16;
        sp[i * 3] = .62 + Math.cos(a + clock * .0004) * r; sp[i * 3 + 1] = .3 + ph * 1.5; sp[i * 3 + 2] = -.1 + Math.sin(a + clock * .0004) * r * .7; }
      sparkGeo.attributes.position.needsUpdate = true;
      host.current?.setAttribute('data-open-t', S.openT.toFixed(2)); host.current?.setAttribute('data-flip-t', S.flip ? S.flip.t.toFixed(2) : '-'); host.current?.setAttribute('data-open', String(S.openT === 1)); host.current?.setAttribute('data-shown', String(S.shown));
      host.current?.setAttribute('data-flipping', String(!!S.flip)); host.current?.setAttribute('data-model', model ? String(rise > .95) : 'false');
    }

    // Click: right page next, left page previous, closed cover opens. Drags orbit.
    const ray = new THREE.Raycaster(); const ptr = new THREE.Vector2(); let down = null;
    dom.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    dom.addEventListener('pointerup', e => {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 7 || performance.now() - down.t > 600) { down = null; return; }
      down = null; const r = dom.getBoundingClientRect(); ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ptr, camera);
      if (S.openT < 1) { if (ray.intersectObject(cover).length) live.current.onOpen?.(); return; }
      const hit = ray.intersectObjects([leftPage, rightPage, rightBlock, leftBlock], false)[0];
      if (!hit) return; const x = bookRoot.worldToLocal(hit.point.clone()).x;
      if (x > 0) live.current.onNext?.(); else live.current.onPrev?.();
    });

    const resize = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1; renderer.setSize(w, h); camera.aspect = w / h;
      const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const dist = Math.max(2.6 / (tan * camera.aspect), 1.5 / tan) * 1.02;
      const dir = new THREE.Vector3().setFromSphericalCoords(1, .72, 0.0); camera.position.copy(controls.target).addScaledVector(dir, dist);
      camera.updateProjectionMatrix(); controls.update();
    };
    ro = new ResizeObserver(resize); ro.observe(el); resize();
    let active = true; io = new IntersectionObserver(([en]) => { active = en.isIntersecting; }); io.observe(el);
    let ready = false;
    const loop = now => {
      frame = requestAnimationFrame(loop); const dt = Math.min(60, now - lastTime); lastTime = now; clock += dt;
      if (!active || document.hidden) return;
      tick(dt); controls.update(); renderer.render(scene, camera);
      if (!ready) { ready = true; dom.setAttribute('data-ready', 'true'); }
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame); ro.disconnect(); io.disconnect(); controls.dispose(); store.dispose();
      scene.traverse(o => { o.geometry?.dispose(); if (o.material) [].concat(o.material).forEach(m => { m.map?.dispose?.(); m.dispose(); }); });
      renderer.dispose(); renderer.forceContextLoss(); dom.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.slug]);
  return <div className="ss-immersive" ref={host} />;
}
