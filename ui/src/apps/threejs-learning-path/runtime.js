import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// This bundle runs only inside the opaque-origin, script-only lesson iframe.
const token = window.__LESSON_TOKEN__;
const send = (type, data = {}) => parent.postMessage({ type, token, ...data }, '*');
let dispose = () => {};
let paused = false;
let currentRun = 0;
let currentCameraReset = () => {};
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

function disposeScene(scene) {
  const resources = new Set();
  scene.traverse((object) => {
    if (object.geometry) resources.add(object.geometry);
    for (const material of [object.material].flat().filter(Boolean)) {
      resources.add(material);
      Object.values(material).forEach((value) => { if (value?.isTexture) resources.add(value); });
      Object.values(material.uniforms || {}).forEach((uniform) => { if (uniform.value?.isTexture) resources.add(uniform.value); });
    }
    if (object.shadow) resources.add(object.shadow);
  });
  if (scene.background?.isTexture) resources.add(scene.background);
  if (scene.environment) resources.add(scene.environment);
  resources.forEach((resource) => resource.dispose());
  scene.clear();
}

async function run({ code, check, revision }) {
  const runId = ++currentRun;
  dispose();
  document.body.replaceChildren();
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  } catch {
    send('result', { revision, error: 'The viewer needs WebGL 2. Enable hardware acceleration in your browser, then reload the preview.' });
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor('#10141f');
  document.body.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(4, 3, 6);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);
  controls.update();
  let activeCamera = camera;
  let frame = 0;
  let failed = false;
  let elapsed = 0;
  let lastTime = performance.now();
  let lastReport = 0;
  let lastPassed;
  let achieved = false;
  const frames = [];
  const cleanups = [];
  const pointer = new THREE.Vector2(9, 9);
  const raycaster = new THREE.Raycaster();
  const onFrame = (callback) => frames.push(callback);
  const onCleanup = (callback) => cleanups.push(callback);
  const reportError = (error) => {
    failed = true;
    send('result', { revision, error: String(error?.message || error) });
  };
  const onPointer = (type, callback) => {
    const handler = (event) => { try { callback(event); } catch (error) { reportError(error); } };
    renderer.domElement.addEventListener(type, handler);
    onCleanup(() => renderer.domElement.removeEventListener(type, handler));
  };
  const movePointer = (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
  };
  onPointer('pointermove', movePointer);
  onPointer('pointerdown', movePointer);
  onPointer('pointerleave', () => pointer.set(9, 9));
  const resize = () => {
    const width = innerWidth || 1, height = innerHeight || 1;
    renderer.setSize(width, height);
    if (activeCamera.isPerspectiveCamera) activeCamera.aspect = width / height;
    else {
      const halfHeight = (activeCamera.top - activeCamera.bottom) / 2;
      activeCamera.left = -halfHeight * width / height;
      activeCamera.right = halfHeight * width / height;
    }
    activeCamera.updateProjectionMatrix();
  };
  const useCamera = (nextCamera) => { activeCamera = nextCamera; controls.object = nextCamera; controls.update(); resize(); };
  addEventListener('resize', resize);
  resize();
  const contextLost = (event) => { event.preventDefault(); reportError(new Error('The graphics context was lost. Use Restart preview to continue.')); };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  renderer.debug.onShaderError = (gl, program, vertex, fragment) => reportError(new Error(gl.getShaderInfoLog(vertex) || gl.getShaderInfoLog(fragment) || gl.getProgramInfoLog(program) || 'Shader compilation failed.'));
  let disposed = false;
  dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    removeEventListener('resize', resize);
    renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    cleanups.forEach((cleanup) => { try { cleanup(); } catch { /* Continue freeing other resources. */ } });
    controls.dispose();
    disposeScene(scene);
    renderer.dispose();
    renderer.forceContextLoss();
  };
  try {
    const setup = new AsyncFunction('THREE', 'scene', 'camera', 'renderer', 'controls', 'onFrame', 'onCleanup', 'pointer', 'raycaster', 'onPointer', 'useCamera', 'GLTFLoader',
      `${code}\n;return () => Boolean(${check});\n//# sourceURL=lesson.js`);
    const validate = await setup(THREE, scene, camera, renderer, controls, onFrame, onCleanup, pointer, raycaster, onPointer, useCamera, GLTFLoader);
    if (runId !== currentRun) { disposeScene(scene); return; }
    controls.saveState();
    currentCameraReset = () => controls.reset();
    const animate = (time) => {
      if (disposed) return;
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      try {
        if (!paused && !failed) {
          elapsed += delta;
          frames.forEach((callback) => callback({ elapsed, delta }));
        }
        const autoRotate = controls.autoRotate;
        const damping = controls.enableDamping;
        controls.autoRotate = autoRotate && !paused;
        controls.enableDamping = damping && !paused;
        controls.update();
        controls.autoRotate = autoRotate;
        controls.enableDamping = damping;
        renderer.render(scene, activeCamera);
        if (time - lastReport > 250 && !failed) {
          lastReport = time;
          let passed = false;
          try { passed = achieved || validate(); } catch { /* An unfinished exercise is not a runtime error. */ }
          achieved = passed;
          if (passed !== lastPassed) {
            lastPassed = passed;
            send('result', { revision, passed, error: null });
          }
          send('stats', { revision, calls: renderer.info.render.calls, triangles: renderer.info.render.triangles });
        }
      } catch (error) { reportError(error); }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
  } catch (error) { reportError(error); }
}

addEventListener('message', (event) => {
  if (event.source !== parent || event.data?.token !== token) return;
  if (event.data.type === 'run') run(event.data);
  if (event.data.type === 'pause') paused = event.data.paused;
  if (event.data.type === 'reset-camera') currentCameraReset();
});
addEventListener('error', (event) => send('fatal', { error: event.message }));
send('ready');
