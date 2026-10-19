import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { landingRotation, STEP, TAU } from './wheel.js';

const colors = ['#164e50', '#f4e8cc'];

function linesFor(ctx, title) {
  const words = title.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (ctx.measureText(`${line} ${word}`).width > 185 && line) {
      lines.push(line);
      line = word;
    } else line = `${line} ${word}`.trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 3).map((text, i) => {
    let result = text;
    while (ctx.measureText(result).width > 185) result = result.slice(0, -1);
    return result !== text || (i === 2 && lines.length > 3) ? `${result.slice(0, -1)}…` : result;
  });
}

function faceTexture(recipes) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  ctx.translate(512, 512);
  recipes.forEach((recipe, i) => {
    const angle = -i * STEP;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 505, angle - STEP / 2, angle + STEP / 2);
    ctx.closePath();
    ctx.fillStyle = colors[i % 2];
    ctx.fill();
    ctx.strokeStyle = '#be9b5f';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.save();
    ctx.rotate(angle);
    ctx.translate(340, 0);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = i % 2 ? '#214c4c' : '#fff0d0';
    ctx.strokeStyle = i % 2 ? '#96723d' : '#e7cb8c';
    // A lightweight, hand-drawn serving cloche on every segment.
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -35, 24, Math.PI, 0);
    ctx.moveTo(-30, -33); ctx.lineTo(30, -33);
    ctx.moveTo(-4, -62); ctx.lineTo(4, -62);
    ctx.moveTo(0, -62); ctx.lineTo(0, -59);
    ctx.stroke();
    ctx.font = '600 22px sans-serif';
    ctx.textAlign = 'center';
    linesFor(ctx, recipe.title).forEach((line, row) => ctx.fillText(line, 4, row * 25));
    ctx.restore();
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function RecipeWheel({ recipes, spin, onComplete }) {
  const host = useRef(null);
  const engine = useRef(null);
  const rotation = useRef(0);
  const complete = useRef(onComplete);
  complete.current = onComplete;
  const [fallback, setFallback] = useState(false);
  const [fallbackAngle, setFallbackAngle] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const element = host.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
    catch { setFallback(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, .1, 30);
    camera.position.set(0, 0, 9);
    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const light = new THREE.DirectionalLight(0xffedce, 3);
    light.position.set(-3, 5, 8);
    scene.add(light);
    const mount = new THREE.Group();
    mount.rotation.set(.08, -.12, 0);
    mount.position.y = .2;
    scene.add(mount);
    const wheel = new THREE.Group();
    wheel.rotation.z = rotation.current;
    mount.add(wheel);
    const gold = new THREE.MeshStandardMaterial({ color: '#caa56a', metalness: .7, roughness: .3 });
    const teal = new THREE.MeshStandardMaterial({ color: '#194d4f', metalness: .3, roughness: .4 });
    function mesh(geometry, material, parent, x = 0, y = 0, z = 0) {
      const item = new THREE.Mesh(geometry, material);
      item.position.set(x, y, z);
      parent.add(item);
      return item;
    }
    const body = mesh(new THREE.CylinderGeometry(2.4, 2.4, .22, 80), teal, wheel);
    body.rotation.x = Math.PI / 2;
    const face = mesh(new THREE.CircleGeometry(2.3, 80), new THREE.MeshBasicMaterial(), wheel, 0, 0, .12);
    mesh(new THREE.TorusGeometry(2.37, .065, 8, 80), gold, wheel, 0, 0, .14);
    mesh(new THREE.TorusGeometry(.66, .045, 8, 48), gold, wheel, 0, 0, .2);
    mesh(new THREE.CircleGeometry(.64, 48), gold, wheel, 0, 0, .19);
    for (let i = 0; i < 20; i++) {
      const a = i * TAU / 20;
      mesh(new THREE.SphereGeometry(.035, 8, 6), gold, wheel, Math.cos(a) * 2.37, Math.sin(a) * 2.37, .21);
    }
    const pointer = new THREE.Shape();
    pointer.moveTo(2.12, 0); pointer.lineTo(2.67, .19); pointer.lineTo(2.67, -.19); pointer.closePath();
    mesh(new THREE.ExtrudeGeometry(pointer, { depth: .12, bevelEnabled: true, bevelSize: .03, bevelThickness: .03, bevelSegments: 1, steps: 1 }), gold, mount, 0, 0, .3);
    mesh(new THREE.BoxGeometry(.24, .65, .3), gold, scene, 0, -2.32, -.2);
    mesh(new THREE.BoxGeometry(1.5, .14, .65), gold, scene, 0, -2.66, -.1);
    const render = () => renderer.render(scene, camera);
    const resize = () => { renderer.setSize(element.clientWidth, element.clientHeight); render(); };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    const lost = (event) => { event.preventDefault(); setFallback(true); };
    renderer.domElement.addEventListener('webglcontextlost', lost);
    engine.current = { wheel, face, render };
    resize();
    return () => {
      observer.disconnect();
      engine.current = null;
      renderer.domElement.removeEventListener('webglcontextlost', lost);
      scene.traverse((item) => {
        item.geometry?.dispose();
        if (item.material) { item.material.map?.dispose(); item.material.dispose(); }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    if (!engine.current) return;
    const { face, render } = engine.current;
    face.material.map?.dispose();
    face.material.map = faceTexture(recipes);
    face.material.needsUpdate = true;
    render();
  }, [recipes]);

  useEffect(() => {
    if (!spin) return;
    const start = rotation.current;
    const end = landingRotation(start, spin.index);
    const milliseconds = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 4400;
    setDuration(milliseconds);
    setFallbackAngle(-end * 180 / Math.PI);
    const started = performance.now();
    let frame;
    function tick(now) {
      const progress = Math.min((now - started) / milliseconds, 1);
      rotation.current = start + (end - start) * (1 - Math.pow(1 - progress, 4));
      if (engine.current && !fallback) {
        engine.current.wheel.rotation.z = rotation.current;
        engine.current.render();
      }
      if (progress < 1) frame = requestAnimationFrame(tick);
      else complete.current(spin.recipe);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [spin, fallback]);

  return <div className="recipe-wheel" role="img" aria-label="Ten-segment recipe wheel. The gold pointer on the right marks the winner.">
    <div ref={host} className="recipe-wheel-canvas" hidden={fallback} />
    {fallback && <svg viewBox="-280 -280 560 560" className="recipe-wheel-fallback" aria-hidden="true">
      <g style={{ transform: `rotate(${fallbackAngle}deg)`, transition: `transform ${duration}ms cubic-bezier(.16,1,.3,1)` }}>
        {recipes.map((recipe, i) => {
          const a = -i * STEP;
          const x1 = 240 * Math.cos(a - STEP / 2), y1 = 240 * Math.sin(a - STEP / 2);
          const x2 = 240 * Math.cos(a + STEP / 2), y2 = 240 * Math.sin(a + STEP / 2);
          return <g key={i}><path d={`M0 0L${x1} ${y1}A240 240 0 0 1 ${x2} ${y2}Z`} fill={colors[i % 2]} stroke="#caa56a" />
            <g transform={`translate(${165 * Math.cos(a)},${165 * Math.sin(a)}) rotate(${90 - i * 36})`} fill={i % 2 ? '#214c4c' : '#fff0d0'} textAnchor="middle">
              <path d="M-14 -12A14 14 0 0 1 14 -12M-18 -10H18M-3 -29H3M0 -29V-26" fill="none" stroke="currentColor" style={{ color: i % 2 ? '#96723d' : '#e7cb8c' }} strokeWidth="2" /><text fontSize="10">{recipe.title.length > 20 ? `${recipe.title.slice(0, 19)}…` : recipe.title}</text>
            </g></g>;
        })}<circle r="65" fill="#caa56a" /><circle r="242" fill="none" stroke="#caa56a" strokeWidth="8" />
      </g><path d="M215 0L268 -18V18Z" fill="#caa56a" />
    </svg>}
    <span className="recipe-wheel-hub" aria-hidden="true">À TABLE<small>ETCHEBEST</small></span>
  </div>;
}
