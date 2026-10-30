// The Little Factory - timeline engine, choreography, HUD and interactions.
import * as THREE from 'three';
import { buildWorld, buildMachine, C } from './factory.js';
import { loadGuestRepo } from './github.js';
import homeData from './data.js';

const $ = (id) => document.getElementById(id);
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = matchMedia('(max-width:700px)').matches || /Android|iPhone|iPad/i.test(navigator.userAgent);

let world;
try { world = buildWorld($('scene'), { lite: isMobile }); }
catch (e) { $('loading').hidden = true; $('error').hidden = false; throw e; }

// ---------- dataset ----------
let ds = homeData;
let events = [];
let EP = 0;           // event position: float over the event list (event-index pacing)
let appliedIdx = 0;
let playing = false;
const SPEEDS = [1, 2, 4];
let speedIdx = 0;
let eventsPerSec = 6;
let mergedCount = 0, suppliesCount = 0;
let finaleShown = false;
let jobs = [];         // active PR jobs (in bays)
let queue = [];        // PR jobs waiting for a free bay
const ANIM_CAP = 26;   // max live crate animations; extra crates resolve instantly but still count

function buildEvents(data) {
  const ev = [];
  for (const pr of data.prs) {
    ev.push({ t: +new Date(pr.o), kind: 'open', pr });
    ev.push({ t: +new Date(pr.m), kind: 'merge', pr });
  }
  for (const c of data.direct) ev.push({ t: +new Date(c.d), kind: 'supply', c });
  ev.sort((a, b) => a.t - b.t);
  return ev;
}
function fmtDate(ms) { return new Date(ms).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
function displayTime() {
  if (!events.length) return Date.now();
  const i = Math.max(0, Math.min(events.length - 1, Math.floor(EP)));
  const frac = Math.min(1, Math.max(0, EP - i));
  const a = events[i].t, b = events[Math.min(events.length - 1, i + 1)].t;
  return a + frac * (b - a);
}
const totalEvents = () => events.length;
function gearSize(pr) { const a = pr.add == null ? 40 : pr.add + (pr.dele || 0); return .55 + Math.min(.6, Math.log10(a + 1) / 4.4); }

// ---------- HUD ----------
const tickBox = $('ticker');
function tick(html, tone) {
  const d = document.createElement('div');
  d.className = 'tick'; d.innerHTML = html;
  if (tone === 'merge') d.style.borderLeftColor = '#4ade80';
  if (tone === 'open') d.style.borderLeftColor = '#39d5ff';
  if (tone === 'supply') d.style.borderLeftColor = '#f08a24';
  tickBox.appendChild(d);
  requestAnimationFrame(() => d.classList.add('on'));
  while (tickBox.children.length > 3) tickBox.firstChild.remove();
  setTimeout(() => { d.classList.remove('on'); setTimeout(() => d.remove(), 500); }, 7000);
}
function setStats() {
  const d = fmtDate(displayTime());
  $('stat-date').textContent = d;
  $('stat-merged').textContent = String(mergedCount);
  $('stat-supplies').textContent = String(suppliesCount);
  $('scrub-date').textContent = d;
}

// ---------- PR jobs ----------
class PrJob {
  constructor(pr, instant) {
    this.pr = pr; this.mergeReady = false; this.done = false;
    this.cratesTotal = pr.c > 0 ? pr.c : 1;
    this.cratesDone = 0; this.crateTimer = 0;
    this.machine = null; this.bay = null; this.stage = 'queued';
    if (instant) this.stage = 'pending';
  }
  occupy(bay) {
    this.bay = bay; bay.busy = true;
    bay.line.group.visible = true;
    world.setFlag(bay, this.pr.b || ('pr-' + this.pr.n));
    this.machine = buildMachine(this.pr);
    this.machine.position.set(bay.x, .8, -3.6);
    this.machine.setProgress(.0001);
    world.scene.add(this.machine);
    this.stage = 'building';
    if (!reducedMotion()) world.sparks.burst(new THREE.Vector3(bay.x, 1.6, -4.5), 8, 1.4, 1.6);
  }
  release() {
    if (!this.bay) return;
    this.bay.busy = false; this.bay.line.group.visible = false;
    world.setFlag(this.bay, null);
    // drain crates still riding the branch line
    this.bay.line.items.length = 0;
    this.bay = null;
  }
  applyProgress() { this.machine && this.machine.setProgress(.0001 + .9999 * this.cratesDone / this.cratesTotal); }
  update(dt, animScale) {
    if (!this.bay || this.done) return;
    if (this.stage === 'building') {
      if (this.cratesDone >= this.cratesTotal) {
        this.stage = 'awaiting';
      } else {
        this.crateTimer -= dt * animScale;
        if (this.crateTimer <= 0) {
          this.crateTimer = .55;
          const bay = this.bay;
          if (jobs.reduce((n, j) => n + j.liveAnims, 0) > ANIM_CAP) {
            this.cratesDone++; this.applyProgress();
          } else {
            this.liveAnims++;
            world.spawnCrate(new THREE.Vector3(bay.x, 1.5, -7.2), new THREE.Vector3(bay.x, 1.35, -3.9), .7, this.pr.n + this.cratesDone, () => {
              this.liveAnims--;
              this.cratesDone++; this.applyProgress();
              world.sparks.burst(new THREE.Vector3(bay.x, 1.5, -3.7), 6, 1.2, 1.4);
            });
          }
        }
      }
    } else if (this.stage === 'awaiting') {
      if (this.mergeReady) { this.stage = 'shipping'; this.shipT = 0; }
    } else if (this.stage === 'shipping') {
      this.shipT += dt * animScale;
      const bay = this.bay, m = this.machine;
      if (this.shipT < .8) {
        // lift and arc onto the main belt entry
        const k = this.shipT / .8, e = 1 - Math.pow(1 - k, 3);
        m.position.set(bay.x + (bayHopX(bay) - bay.x) * e, .8 + Math.sin(k * Math.PI) * 1.6 + (1.25 - .8) * e, -3.6 + (2 - (-3.6)) * e);
        m.rotation.y = e * .4;
      } else {
        const machine = this.machine, pr = this.pr;
        this.release();
        world.mainBelt.attach(machine, (obj) => {
          world.scene.remove(obj);
          world.portalFlash();
          world.smoke.puff(world.hall.chimneyTop, 3);
          world.monument.addGear(gearSize(pr), false);
          world.sparks.burst(new THREE.Vector3(18.2, 1.5 + world.monument.count * .078, 7.5), 14, 1.8, 2.2);
          mergedCount++;
          tick(`<b>MERGED #${pr.n}</b> — ${escapeHtml(pr.t) || 'machine'} <span>shipped to production</span>`, 'merge');
          setStats();
          maybeFinale();
        });
        this.done = true;
        const i = jobs.indexOf(this); if (i >= 0) jobs.splice(i, 1);
        promoteQueue();
      }
    }
    this.machine && this.machine.update(dt, world.t);
  }
  liveAnims = 0;
}
function bayHopX(bay) { return Math.max(-15.6, bay.x - 2.2); }
function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

function promoteQueue() {
  for (const bay of world.bays) {
    if (bay.busy) continue;
    const job = queue.shift();
    if (!job) return;
    if (!jobs.includes(job)) jobs.push(job);
    job.occupy(bay);
  }
}

function applyEvent(ev, instant) {
  if (ev.kind === 'open') {
    const job = new PrJob(ev.pr, instant);
    if (instant) {
      // rebuild: place straight into a bay with partial progress
      const bay = world.bays.find(b => !b.busy);
      if (bay) { job.occupy(bay); job.stage = 'building'; }
      else { queue.push(job); }
      openJobs.set(ev.pr.n, job);
    } else {
      queue.push(job); openJobs.set(ev.pr.n, job);
      promoteQueue();
      tick(`<b>#${ev.pr.n}</b> branch <span>${escapeHtml(ev.pr.b || 'feature')} opened</span>`, 'open');
    }
  } else if (ev.kind === 'merge') {
    const job = openJobs.get(ev.pr.n);
    if (job) { job.mergeReady = true; if (instant) { job.machine && job.machine.setProgress(1); } }
    else if (instant) { /* merge applied in rebuild below */ }
  } else if (ev.kind === 'supply') {
    if (instant) { suppliesCount++; return; }
    suppliesCount++;
    if (jobs.reduce((n, j) => n + j.liveAnims, 0) <= ANIM_CAP && world.mainBelt.items.length < 22) {
      const crate = new THREE.Mesh(crateProto(), crateMat);
      crate.castShadow = true;
      world.scene.add(crate);
      world.mainBelt.attach(crate, (obj) => {
        world.scene.remove(obj);
        world.portalFlash();
      });
    }
    if (suppliesCount % 10 === 1 || suppliesCount <= 2) tick(`Supply run <span>${escapeHtml(ev.c.s)}</span>`, 'supply');
    setStats();
  }
}
let _crateProto = null;
function crateProto() {
  if (!_crateProto) {
    _crateProto = new THREE.BoxGeometry(.55, .5, .55);
  }
  return _crateProto;
}
const crateMat = new THREE.MeshStandardMaterial({ color: C.wood, roughness: .85 });

const openJobs = new Map();

// ---------- rebuild (scrub) ----------
function rebuild(toEP) {
  for (const j of jobs) { j.release(); j.machine && world.scene.remove(j.machine); }
  for (const j of queue) { j.machine && world.scene.remove(j.machine); }
  jobs = []; queue = []; openJobs.clear();
  if (!scrubbing) $('scrub').value = String(Math.round(1000 * toEP / Math.max(1, events.length)));
  world.clearCrates();
  for (const b of world.bays) { for (const it of b.line.items) world.scene.remove(it.obj); b.line.items.length = 0; }
  for (const it of world.mainBelt.items) world.scene.remove(it.obj);
  world.mainBelt.items.length = 0;
  world.monument.reset();
  mergedCount = 0; suppliesCount = 0; finaleShown = false;
  appliedIdx = 0;
  const k = Math.max(0, Math.min(events.length, Math.floor(toEP)));
  // fast-apply the first k events
  const openAt = new Map();
  while (appliedIdx < k) {
    const ev = events[appliedIdx];
    if (ev.kind === 'open') openAt.set(ev.pr.n, ev);
    else if (ev.kind === 'merge') {
      const o = openAt.get(ev.pr.n);
      if (o) {
        world.monument.addGear(gearSize(ev.pr), true);
        mergedCount++;
        openAt.delete(ev.pr.n);
      } else { world.monument.addGear(gearSize(ev.pr), true); mergedCount++; }
    } else if (ev.kind === 'supply') suppliesCount++;
    appliedIdx++;
  }
  // PRs open but not merged at toEP: show them mid-assembly
  for (const [, o] of openAt) {
    const bay = world.bays.find(b => !b.busy);
    if (!bay) break;
    const job = new PrJob(o.pr, true);
    job.occupy(bay);
    const span = Math.max(1, +new Date(o.pr.m) - +new Date(o.pr.o));
    const frac = Math.min(1, (displayTime() - o.t) / span);
    job.cratesDone = Math.floor(frac * job.cratesTotal);
    job.applyProgress();
    jobs.push(job); openJobs.set(o.pr.n, job);
  }
  setStats();
}

// ---------- finale ----------
function maybeFinale() {
  if (finaleShown || EP < totalEvents()) return;
  if (jobs.length || queue.length || world.mainBelt.items.length) return;
  finaleShown = true;
  world.monument.finale();
  world.smoke.puff(world.hall.chimneyTop, 8);
  world.sparks.burst(new THREE.Vector3(18.2, 8, 7.5), 60, 5, 6);
  world.sparks.burst(new THREE.Vector3(-3, 7, -2), 40, 6, 5);
  const total = ds.guest ? `${mergedCount} recent machines` : `${mergedCount} machines · ${suppliesCount} supply runs`;
  tick(`<b>TODAY</b> — line complete: ${total} <span>${escapeHtml(ds.repo)}</span>`, 'merge');
  setPlaying(false);
}

// ---------- transport ----------
function setPlaying(p) {
  playing = p;
  $('play').textContent = p ? '⏸' : '▶';
}
$('play').addEventListener('click', () => setPlaying(!playing));
$('restart').addEventListener('click', () => { EP = 0; rebuild(EP); setPlaying(true); });
$('today').addEventListener('click', () => { EP = totalEvents(); rebuild(EP); setPlaying(false); maybeFinale(); });
$('speed').addEventListener('click', () => { speedIdx = (speedIdx + 1) % SPEEDS.length; $('speed').textContent = SPEEDS[speedIdx] + '×'; });
let scrubbing = false;
$('scrub').addEventListener('pointerdown', () => scrubbing = true);
addEventListener('pointerup', () => scrubbing = false);
$('scrub').addEventListener('input', () => {
  EP = (+$('scrub').value / 1000) * totalEvents();
  rebuild(EP);
});
$('zoom-in').addEventListener('click', () => dolly(.8));
$('zoom-out').addEventListener('click', () => dolly(1.25));
$('reset-view').addEventListener('click', () => { world.camera.position.set(...CAM0); world.controls.target.set(...(world.lite ? [4, 2, -1.5] : [5, 1.8, -2])); introT = 0; });
function dolly(f) {
  const c = world.camera, t = world.controls.target;
  const v = c.position.clone().sub(t).multiplyScalar(f);
  const len = Math.min(23, Math.max(5, v.length())); v.setLength(len);
  c.position.copy(t).add(v);
}
addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' && e.target.type === 'text') return;
  if (e.code === 'Space') { e.preventDefault(); setPlaying(!playing); }
  else if (e.key === 'ArrowRight') { EP = Math.min(totalEvents(), EP + 1); rebuild(EP); }
  else if (e.key === 'ArrowLeft') { EP = Math.max(0, EP - 1); rebuild(EP); }
  else if (e.key === 'Home') { EP = 0; rebuild(EP); }
  else if (e.key === 'End') { EP = totalEvents(); rebuild(EP); maybeFinale(); }
  else if (e.key === '+') dolly(.8); else if (e.key === '-') dolly(1.25);
  else if (e.key >= '1' && e.key <= '4') flyTo(+e.key - 1);
});

// ---------- viewpoints ----------
const VIEWS = [
  { pos: [-13.5, 5, 6.5], tgt: [5, 1.8, -2] },   // down the production line (default)
  { pos: [-7.5, 3.2, 3.5], tgt: [-3.5, 1.8, -4] }, // robot arms at work
  { pos: [10.5, 6, 13], tgt: [17.5, 5, 6] },       // gear tower + portal
  { pos: [-2, 13, 17], tgt: [0, 1, -2] },          // hall overview
];
let camTween = null;
function flyTo(i) {
  const v = VIEWS[i]; if (!v) return;
  const k = world.lite ? 1.18 : 1;
  const p1 = new THREE.Vector3(v.pos[0] * k, v.pos[1] * k, v.pos[2] * k);
  const t1 = new THREE.Vector3(...v.tgt);
  document.querySelectorAll('.views button').forEach((b, j) => { b.classList.toggle('on', j === i); b.setAttribute('aria-pressed', String(j === i)); });
  introT = 0;
  if (reducedMotion()) { world.camera.position.copy(p1); world.controls.target.copy(t1); camTween = null; return; }
  camTween = { p0: world.camera.position.clone(), t0: world.controls.target.clone(), p1, t1, k: 0 };
}
document.querySelectorAll('.views button').forEach((b) => b.addEventListener('click', () => flyTo(+b.dataset.view)));
world.controls.addEventListener('start', () => { camTween = null; });

// ---------- picking ----------
const ray = new THREE.Raycaster(); const ptr = new THREE.Vector2();
let downAt = null;
world.renderer.domElement.addEventListener('pointerdown', (e) => downAt = [e.clientX, e.clientY]);
world.renderer.domElement.addEventListener('pointerup', (e) => {
  if (!downAt) return;
  const moved = Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]);
  downAt = null;
  if (moved > 8) return;
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ptr, world.camera);
  const roots = jobs.map(j => j.machine).concat(world.mainBelt.items.map(i => i.obj)).filter(Boolean);
  const hits = ray.intersectObjects(roots, true);
  if (!hits.length) return;
  let o = hits[0].object;
  while (o && !o.userData.pr) o = o.userData.prRoot || o.parent;
  const pr = o && o.userData.pr;
  if (pr) showInfo(pr);
});
function showInfo(pr) {
  $('info-num').textContent = `Machine · PR #${pr.n} · merged ${fmtDate(+new Date(pr.m))}`;
  $('info-title').textContent = pr.t || '(untitled)';
  const rows = [
    ['Branch', pr.b || '—'], ['Author', pr.a], ['Opened', fmtDate(+new Date(pr.o))],
  ];
  if (pr.c) rows.push(['Commits', String(pr.c)]);
  if (pr.add != null) rows.push(['Changes', `<span class="delta">+${pr.add}</span> / <span class="delta del">−${pr.dele}</span>`]);
  else rows.push(['Details', 'not loaded for guest factories']);
  $('info-dl').innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
  $('info').hidden = false;
}
$('info-close').addEventListener('click', () => $('info').hidden = true);

// ---------- gate (new factory) ----------
const gate = $('gate');
$('open-gate').addEventListener('click', () => { gate.hidden = false; $('gate-input').focus(); });
$('gate-cancel').addEventListener('click', () => { gate.hidden = true; $('gate-msg').textContent = ''; });
$('gate-home').addEventListener('click', () => { setDataset(homeData); gate.hidden = true; });
async function goGuest() {
  const val = $('gate-input').value;
  const btn = $('gate-go'); btn.disabled = true;
  try {
    const data = await loadGuestRepo(val, (s) => $('gate-msg').textContent = s);
    setDataset(data);
    gate.hidden = true; $('gate-msg').textContent = ''; $('gate-input').value = '';
    $('gate-home').hidden = false;
  } catch (err) {
    $('gate-msg').textContent = err.message;
  } finally { btn.disabled = false; }
}
$('gate-go').addEventListener('click', goGuest);
$('gate-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') goGuest(); });

function setDataset(data) {
  ds = data;
  const compact = matchMedia('(max-width: 700px)').matches;
  $('factory-name').textContent = compact ? data.repo.split('/').pop() : data.repo.replace('/', ' / ');
  $('factory-sub').textContent = data.guest
    ? (compact ? `Guest · ${data.prs.length} recent PRs${data.capped ? ' (capped)' : ''}` : `Guest factory · ${data.prs.length} recent merged PRs${data.capped ? ' (capped)' : ''} · live anonymous API`)
    : (compact ? 'Home · baked ' + data.snapshot : 'Home factory · snapshot baked ' + data.snapshot);
  events = buildEvents(data);
  eventsPerSec = Math.max(3.5, events.length / 95);
  EP = 0; rebuild(EP);
  setPlaying(!reducedMotion());
  document.body.dataset.rm = String(reducedMotion());
}

// ---------- main loop ----------
const CAM0 = world.lite ? [-13, 6, 8] : [-13.5, 5, 6.5];
let last = performance.now(), uiAccum = 0, introT = reducedMotion() ? 0 : 1;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(.1, (now - last) / 1000); last = now;
  if (playing && EP < totalEvents() && queue.length <= 14) {
    EP = Math.min(totalEvents(), EP + dt * eventsPerSec * SPEEDS[speedIdx]);
    while (appliedIdx < events.length && appliedIdx < Math.floor(EP)) {
      applyEvent(events[appliedIdx], false);
      appliedIdx++;
    }
    if (!scrubbing) $('scrub').value = String(Math.round(1000 * EP / Math.max(1, totalEvents())));
    uiAccum += dt;
    if (uiAccum > .25) { setStats(); uiAccum = 0; }
  }
  if (camTween) {
    camTween.k = Math.min(1, camTween.k + dt / 1.1);
    const e2 = 1 - Math.pow(1 - camTween.k, 3);
    world.camera.position.lerpVectors(camTween.p0, camTween.p1, e2);
    world.controls.target.lerpVectors(camTween.t0, camTween.t1, e2);
    if (camTween.k >= 1) camTween = null;
  }
  if (introT) {
    introT = Math.max(0, introT - dt / 2.2);
    const e = 1 - Math.pow(1 - (1 - introT), 3);
    world.camera.position.set(CAM0[0] + 8 * (1 - e), CAM0[1] + 5 * (1 - e), CAM0[2] + 9 * (1 - e));
  }
  const backlog = queue.length + jobs.length;
  const animScale = Math.min(6, 1 + backlog * .3);
  world.mainBelt.speed = 3.4 * Math.min(4.5, animScale);
  for (const b of world.bays) b.line.speed = 2.6 * animScale;
  for (const j of [...jobs]) j.update(dt, animScale);
  promoteQueue();
  if (EP >= totalEvents()) maybeFinale();
  world.update(dt);
}

// ---------- boot ----------
// defer the auto-play decision to the first frame so an emulated or late-applied
// reduced-motion preference is honored
$('loading').hidden = true;
requestAnimationFrame(() => { setDataset(homeData); requestAnimationFrame(frame); });

// test hook
window.__world = world;
window.__factory = {
  get state() { return { EP, total: totalEvents(), date: fmtDate(displayTime()), merged: mergedCount, supplies: suppliesCount, active: jobs.length, queue: queue.length, gears: world.monument.count, repo: ds.repo, guest: !!ds.guest, finale: finaleShown }; },
  play: () => setPlaying(true), pause: () => setPlaying(false),
  scrubTo(frac) { EP = frac * totalEvents(); rebuild(EP); },
  finish() { EP = totalEvents(); rebuild(EP); maybeFinale(); },
  stats: () => ({ calls: world.renderer.info.render.calls, triangles: world.renderer.info.render.triangles }),
  info(n) { const pr = ds.prs.find(p => p.n === n); if (pr) showInfo(pr); },
  guest: (name) => loadGuestRepo(name, () => {}).then(d => { setDataset(d); return d.prs.length; }),
  ready: () => events.length > 0,
  camera: () => world.camera.position.toArray(),
  target: () => world.controls.target.toArray(),
  view: (i) => flyTo(i),
};
