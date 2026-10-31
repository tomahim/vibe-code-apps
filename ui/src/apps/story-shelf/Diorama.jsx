import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { buildModel } from './models';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Original, low-poly paper sculptures. No external models or runtime requests.
export default function Diorama({ kind, page, reduced }) {
  const host = useRef(null);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    const el = host.current;
    let renderer, frame, observer, controls;
    const scene = new THREE.Scene();
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute('aria-label', `Interactive ${kind} paper sculpture. Drag to rotate; the story also works without it.`);
      renderer.domElement.setAttribute('role', 'img');
      el.appendChild(renderer.domElement);
      const camera = new THREE.PerspectiveCamera(34, 1, .1, 80);
      camera.position.set(5, 4, 7);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, .8, 0);
      controls.enablePan = false; controls.enableZoom = false;
      controls.minPolarAngle = .5; controls.maxPolarAngle = 1.5;
      controls.autoRotate = !reduced; controls.autoRotateSpeed = .65;
      scene.add(new THREE.HemisphereLight(0xfff6dc, 0x48626a, 3));
      const sun = new THREE.DirectionalLight(0xffe2ac, 4);
      sun.position.set(-4, 7, 5); sun.castShadow = true; sun.shadow.mapSize.set(512, 512);
      scene.add(sun);
      const model = buildModel(kind, page); scene.add(model);
      const resize = () => { const w=el.clientWidth,h=el.clientHeight; renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix(); };
      observer = new ResizeObserver(resize); observer.observe(el); resize();
      let active = true;
      const visibility = new IntersectionObserver(([entry]) => { active=entry.isIntersecting; }); visibility.observe(el);
      const render = () => { frame=requestAnimationFrame(render); if(active && !document.hidden) { controls.update(); renderer.render(scene,camera); } }; render();
      return () => { cancelAnimationFrame(frame); observer.disconnect(); visibility.disconnect(); controls.dispose(); scene.traverse(o=>{ o.geometry?.dispose(); if(o.material) o.material.dispose(); }); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); };
    } catch {
      setUnavailable(true); renderer?.dispose(); renderer?.domElement.remove();
    }
  }, [kind, page, reduced]);
  return <div className="ss-diorama" ref={host}>{unavailable && <span className="ss-model-fallback">The paper sculpture needs WebGL. The complete illustrated story is below.</span>}</div>;
}
