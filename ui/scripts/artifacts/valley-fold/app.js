/* Valley Fold - app: 3D viewport, step player, fold-along, notation. */
'use strict';
(function () {
  var E = VF.engine, MODELS = VF.models;
  var GOLD = '#d8a84e', TEAL = '#62c9da', INK = '#ece5d3';

  /* ---------------- state ---------------- */
  var params = new URLSearchParams(location.search);
  var modelIdx = Math.max(0, Math.min(MODELS.length - 1, parseInt(params.get('model') || '0', 10) || 0));
  var cur = { model: null, snaps: [], step: 0, t: 1, playing: false, playClock: 0 };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function buildModel(idx) {
    cur.model = MODELS[idx];
    var p = E.paper();
    cur.snaps = [E.clonePaper(p)];
    cur.model.steps.forEach(function (st) {
      st.ops.forEach(function (op) { E.commit(p, op); });
      cur.snaps.push(E.clonePaper(p));
    });
    cur.step = 0; cur.t = 1; cur.playing = false;
    renderStepUI();
    rebuildMeshes();
    updateDiagram();
  }

  /* ---------------- three setup ---------------- */
  var viewport = document.getElementById('viewport');
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  viewport.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  var cam = { yaw: -0.6, pitch: 0.95, dist: 4.4, tx: 0, ty: 0 };

  scene.add(new THREE.HemisphereLight(0xf3ead8, 0x0e1116, 0.55));
  var key = new THREE.DirectionalLight(0xfff2dd, 1.15);
  key.position.set(2.5, 3.2, 4.2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -3; key.shadow.camera.right = 3;
  key.shadow.camera.top = 3; key.shadow.camera.bottom = -3;
  key.shadow.radius = 5;
  key.shadow.bias = -0.002;
  key.shadow.normalBias = 0.02;
  scene.add(key);
  var rim = new THREE.DirectionalLight(0x62c9da, 0.3);
  rim.position.set(-3, 1.5, -2.5);
  scene.add(rim);

  // ground shadow catcher
  var ground = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.ShadowMaterial({ opacity: 0.32 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  ground.receiveShadow = true;
  scene.add(ground);

  // faint gold mat ring
  var ring = new THREE.Mesh(
    new THREE.RingGeometry(1.62, 1.64, 128),
    new THREE.MeshBasicMaterial({ color: 0xd8a84e, transparent: true, opacity: 0.28, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -0.015;
  scene.add(ring);

  var paperGroup = new THREE.Group();
  scene.add(paperGroup);
  var creaseGroup = new THREE.Group();
  scene.add(creaseGroup);

  /* ---------------- mesh building ---------------- */
  function colorFor(model, flip) {
    // flip even: normal side is original front (white); odd: paper color
    return model._white;
  }

  function rebuildMeshes() {
    while (paperGroup.children.length) {
      var c = paperGroup.children.pop();
      c.geometry.dispose(); c.material.dispose();
    }
    var faces = renderFaces();
    var front = [], back = [], fcol = [], bcol = [];
    var mc = new THREE.Color(cur.model.color);
    var wc = new THREE.Color('#f2ead8');
    faces.forEach(function (f) {
      var dz = 0.002;
      var nrm = normalOf(f.pts);
      for (var k = 0; k < 2; k++) {
        var up = k === 0; // triangle wound along current normal
        var col = up ? wc : mc;
        var arr = up ? front : back, cc = up ? fcol : bcol;
        var off = up ? dz : -dz;
        var idx = [0, 1, 2]; if (!up) idx = [0, 2, 1];
        for (var i = 0; i < 3; i++) {
          var p = f.pts[idx[i]];
          arr.push(p[0] + nrm[0] * off, p[2] + nrm[2] * off, -p[1] - nrm[1] * off);
          cc.push(col.r, col.g, col.b);
        }
      }
    });
    function mkMesh(pos, col) {
      if (!pos.length) return;
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      g.computeVertexNormals();
      var m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({
        vertexColors: true, roughness: 0.82, metalness: 0.04, side: THREE.FrontSide
      }));
      m.castShadow = true; m.receiveShadow = true;
      paperGroup.add(m);
    }
    mkMesh(front, fcol);
    mkMesh(back, bcol);
    buildCreaseOverlay();
  }

  function normalOf(pts) {
    var u = [pts[1][0] - pts[0][0], pts[1][1] - pts[0][1], pts[1][2] - pts[0][2]];
    var v = [pts[2][0] - pts[0][0], pts[2][1] - pts[0][1], pts[2][2] - pts[0][2]];
    var n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    var l = Math.hypot(n[0], n[1], n[2]) || 1;
    return [n[0] / l, n[1] / l, n[2] / l];
  }

  // world coords: paper (x,y,z) -> three (x, z, -y): paper z is up
  function renderFaces() {
    // state at cur.step / cur.t
    var p = E.clonePaper(cur.snaps[cur.step]);
    var st = cur.model.steps[cur.step - 1];
    if (st && cur.t < 1) {
      var n = st.ops.length;
      for (var i = 0; i < n; i++) {
        var ti = Math.max(0, Math.min(1, cur.t * n - i));
        if (ti >= 1) { E.commit(p, st.ops[i]); continue; }
        if (ti <= 0) break;
        var r = E.applyAt(p, st.ops[i], ti);
        r.moving.forEach(function (f, j) { f.z = 4000 + j; });
        p.faces = r.faces;
        break;
      }
    }
    return E.bake(p);
  }

  function refreshGeometry() {
    // cheap path: rebuild (face counts are small)
    rebuildMeshes();
  }

  /* ---------------- crease + arrow overlay ---------------- */
  function buildCreaseOverlay() {
    while (creaseGroup.children.length) {
      var c = creaseGroup.children.pop();
      c.geometry.dispose(); c.material.dispose();
    }
    var st = cur.model.steps[cur.step - 1];
    if (!st || cur.t >= 1) return;
    var i = Math.min(st.ops.length - 1, Math.floor(cur.t * st.ops.length));
    var op = st.ops[i];
    if (!op || op.spinZ || op.flipX) return;
    // crease line: sample the crease, keep points over paper
    var a = op.a, b = op.b;
    var d = [b[0] - a[0], b[1] - a[1]];
    var L = Math.hypot(d[0], d[1]); d = [d[0] / L, d[1] / L];
    var faces = renderFaces();
    var pts = [];
    for (var s = -2.2; s <= 2.2; s += 0.05) {
      var x = a[0] + d[0] * s, y = a[1] + d[1] * s;
      if (overPaper(faces, x, y)) pts.push([x, y]);
    }
    if (pts.length > 1) {
      var valley = op.angle * op.move > 0;
      var pos = [];
      pts.forEach(function (p) { pos.push(p[0], 0.03, -p[1]); });
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      var mat = valley
        ? new THREE.LineDashedMaterial({ color: 0xd8a84e, dashSize: 0.07, gapSize: 0.05, linewidth: 2 })
        : new THREE.LineDashedMaterial({ color: 0x62c9da, dashSize: 0.1, gapSize: 0.035, dashScale: 0.5, linewidth: 2 });
      var line = new THREE.Line(g, mat);
      line.computeLineDistances();
      creaseGroup.add(line);
    }
  }

  function overPaper(faces, x, y) {
    for (var i = 0; i < faces.length; i++) {
      var p = faces[i].pts;
      if (pointInTri([x, y], p[0], p[1], p[2])) return true;
    }
    return false;
  }
  function pointInTri(pt, a, b, c) {
    var d1 = (pt[0] - b[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (pt[1] - b[1]);
    var d2 = (pt[0] - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (pt[1] - c[1]);
    var d3 = (pt[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (pt[1] - a[1]);
    var neg = (d1 < 0) || (d2 < 0) || (d3 < 0), pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    return !(neg && pos);
  }

  /* ---------------- camera + orbit ---------------- */
  function recenter() {
    var b = E.bounds(cur.snaps[cur.step]);
    cam.tx = (b.min[0] + b.max[0]) / 2;
    cam.ty = -(b.min[1] + b.max[1]) / 2;
  }
  function applyCam() {
    var sp = Math.sin(cam.pitch), cp = Math.cos(cam.pitch);
    camera.position.set(
      cam.tx + cam.dist * sp * Math.sin(cam.yaw),
      cam.dist * cp,
      cam.ty + cam.dist * sp * Math.cos(cam.yaw)
    );
    camera.up.set(0, 1, 0);
    camera.lookAt(cam.tx, 0, cam.ty);
  }
  function resize() {
    var w = viewport.clientWidth, h = viewport.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);

  var ptrs = new Map();
  var lastPinch = 0;
  viewport.addEventListener('pointerdown', function (e) {
    ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener('pointermove', function (e) {
    if (!ptrs.has(e.pointerId)) return;
    var prev = ptrs.get(e.pointerId);
    ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.size === 1) {
      cam.yaw -= (e.clientX - prev[0]) * 0.008;
      cam.pitch = Math.max(0.15, Math.min(1.5, cam.pitch + (e.clientY - prev[1]) * 0.008));
    } else if (ptrs.size === 2) {
      var ps = Array.from(ptrs.values());
      var d = Math.hypot(ps[0][0] - ps[1][0], ps[0][1] - ps[1][1]);
      if (lastPinch) cam.dist = Math.max(1.6, Math.min(9, cam.dist * lastPinch / d));
      lastPinch = d;
    }
  });
  function ptrUp(e) { ptrs.delete(e.pointerId); lastPinch = 0; }
  viewport.addEventListener('pointerup', ptrUp);
  viewport.addEventListener('pointercancel', ptrUp);
  viewport.addEventListener('wheel', function (e) {
    e.preventDefault();
    cam.dist = Math.max(1.6, Math.min(9, cam.dist * (1 + e.deltaY * 0.001)));
  }, { passive: false });
  viewport.addEventListener('dblclick', function () {
    cam.yaw = -0.6; cam.pitch = 0.95; cam.dist = fitDist();
  });

  function fitDist() {
    var b = E.bounds(cur.snaps[cur.snaps.length - 1]);
    var r = Math.max(1, Math.hypot(b.max[0] - b.min[0], b.max[1] - b.min[1]) / 2);
    return Math.max(3.2, r * 3.1);
  }

  /* ---------------- animation loop ---------------- */
  var lastT = performance.now();
  var needsRender = true;
  function frame(now) {
    var dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
    if (cur.playing) {
      cur.playClock += dt;
      var dur = 1.5;
      if (cur.t < 1) {
        cur.t = Math.min(1, cur.t + dt / dur);
        refreshGeometry(); updateScrubUI();
        if (cur.t >= 1) cur.playClock = 0;
      } else if (cur.playClock > 0.9) {
        cur.playClock = 0;
        if (cur.step < cur.model.steps.length) { gotoStep(cur.step + 1, 0, true); }
        else { cur.playing = false; renderStepUI(); }
      }
      needsRender = true;
    }
    applyCam();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  /* ---------------- UI ---------------- */
  var el = function (id) { return document.getElementById(id); };

  function gotoStep(step, t, keepPlay) {
    step = Math.max(0, Math.min(cur.model.steps.length, step));
    cur.step = step; cur.t = (t == null ? 1 : t);
    recenter();
    if (!keepPlay) cur.playing = false;
    rebuildMeshes(); renderStepUI(); updateDiagram();
  }

  function renderStepUI() {
    var n = cur.model.steps.length;
    el('step-count').textContent = cur.step === 0 ? 'Start' : ('Step ' + cur.step + ' of ' + n);
    el('step-text').textContent = cur.step === 0
      ? 'A fresh square, ' + (cur.model.startNote || 'white side up') + '. Press play or step forward.'
      : cur.model.steps[cur.step - 1].text;
    el('prev').disabled = cur.step === 0;
    el('next').disabled = cur.step === n;
    el('play').textContent = cur.playing ? '❚❚' : '▶';
    el('play').setAttribute('aria-label', cur.playing ? 'Pause fold-along' : 'Play fold-along');
    updateScrubUI();
    document.title = 'Valley Fold - ' + cur.model.name;
  }
  function updateScrubUI() {
    var n = cur.model.steps.length;
    el('scrub').value = String(((cur.step - 1 + cur.t) / n) * 1000);
    el('scrub').setAttribute('aria-valuetext', 'Step ' + cur.step + ' of ' + n);
  }

  function updateDiagram() {
    var svg = el('diagram');
    var st = cur.model.steps[cur.step - 1];
    if (!st) { svg.innerHTML = ''; return; }
    var faces = E.bake(cur.snaps[cur.step - 1]);
    var b = E.bounds(cur.snaps[cur.step - 1]);
    var pad = 0.25;
    var x0 = b.min[0] - pad, y0 = b.min[1] - pad, w = b.max[0] - b.min[0] + 2 * pad, h = b.max[1] - b.min[1] + 2 * pad;
    var s = '';
    s += '<svg viewBox="' + x0 + ' ' + (-(y0 + h)) + ' ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg">';
    s += '<g transform="scale(1,-1)">';
    faces.forEach(function (f) {
      var pts = f.pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' ');
      s += '<polygon points="' + pts + '" fill="rgba(236,229,211,0.05)" stroke="rgba(236,229,211,0.28)" stroke-width="0.012"/>';
    });
    var op = null;
    for (var i = 0; i < st.ops.length; i++) if (!st.ops[i].spinZ && !st.ops[i].flipX) { op = st.ops[i]; break; }
    if (op) {
      var valley = op.angle * op.move > 0;
      var d = [op.b[0] - op.a[0], op.b[1] - op.a[1]];
      var L = Math.hypot(d[0], d[1]) || 1; d = [d[0] / L, d[1] / L];
      var p1 = [op.a[0] - d[0] * 2, op.a[1] - d[1] * 2], p2 = [op.a[0] + d[0] * 2, op.a[1] + d[1] * 2];
      var dash = valley ? '0.07 0.05' : '0.12 0.04 0.02 0.04';
      var col = valley ? GOLD : TEAL;
      s += '<line x1="' + p1[0] + '" y1="' + p1[1] + '" x2="' + p2[0] + '" y2="' + p2[1] +
        '" stroke="' + col + '" stroke-width="0.03" stroke-dasharray="' + dash + '"/>';
    }
    s += '</g></svg>';
    svg.innerHTML = s;
  }

  /* model tabs */
  var tabs = el('tabs');
  MODELS.forEach(function (m, i) {
    var b = document.createElement('button');
    b.className = 'tab';
    b.innerHTML = '<span class="tab-name">' + (i + 1) + '. ' + m.name + '</span>' +
      '<span class="dots">' + '●'.repeat(m.diff) + '<span class="off">' + '●'.repeat(5 - m.diff) + '</span></span>';
    b.addEventListener('click', function () { modelIdx = i; selectTab(); buildModel(i); });
    tabs.appendChild(b);
  });
  function selectTab() {
    Array.from(tabs.children).forEach(function (c, i) { c.classList.toggle('on', i === modelIdx); });
    el('blurb').textContent = MODELS[modelIdx].blurb;
  }

  el('prev').addEventListener('click', function () { gotoStep(cur.step - 1, 1); });
  el('next').addEventListener('click', function () { gotoStep(cur.step + 1, 0); if (!cur.playing) { cur.t = 0; rebuildMeshes(); } });
  el('play').addEventListener('click', function () {
    if (cur.step >= cur.model.steps.length) gotoStep(1, 0, true);
    cur.playing = !cur.playing; cur.playClock = 0; renderStepUI();
  });
  el('restart').addEventListener('click', function () { gotoStep(0, 1); });
  el('scrub').addEventListener('input', function (e) {
    var n = cur.model.steps.length;
    var v = (parseFloat(e.target.value) / 1000) * n;
    var step = Math.min(n, Math.floor(v) + 1);
    var t = Math.min(1, v - Math.floor(v));
    if (v <= 0) { step = 0; t = 1; }
    cur.step = step; cur.t = step === 0 ? 1 : Math.max(0.02, t);
    cur.playing = false;
    rebuildMeshes(); renderStepUI(); updateDiagram();
  });
  var legend = el('legend');
  el('legend-btn').addEventListener('click', function () {
    legend.hidden = !legend.hidden;
  });

  /* debug/testing hooks */
  VF.app = {
    gotoStep: gotoStep,
    state: function () { return { model: modelIdx, step: cur.step, t: cur.t, faces: cur.snaps[cur.step].faces.length }; },
    bounds: function () { return E.bounds(cur.snaps[cur.snaps.length - 1]); },
    buildModel: buildModel,
    stepBounds: function (k) { return E.bounds(cur.snaps[k]); }
  };

  /* ---------------- boot ---------------- */
  selectTab();
  buildModel(modelIdx);
  if (params.get('step') != null) {
    gotoStep(parseInt(params.get('step'), 10) || 0, params.get('t') != null ? parseFloat(params.get('t')) : 1);
  }
  if (params.get('top') === '1') { cam.pitch = 0.03; cam.yaw = 0; }
  cam.dist = fitDist();
  resize();
  requestAnimationFrame(frame);
})();
