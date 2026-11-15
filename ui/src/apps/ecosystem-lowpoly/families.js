// Garden family preview: the five proposed landscape families rendered by the real garden
// scene in the untouched Compact + focus layout. Demo progress only; no account integration.
import { createGarden } from './shape-garden.js';
import { FAMILY_WORLD, FAMILY_GROUPS } from './family-data.js';

const params = new URLSearchParams(location.search);
const state = { week: params.has('week') ? Math.max(0, Math.min(16, Number(params.get('week')) || 0)) : 16, playing: false, group: -1 };
const mount = document.querySelector('#mount');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || params.has('still');

const garden = createGarden({
  container: mount,
  profile: innerWidth < 700 || params.has('phone') ? 'mobile' : 'desktop',
  state, reduced,
  compact: true, groupFocus: true, world: FAMILY_WORLD,
});
window.__familyGarden = garden;
if (params.has('still')) garden.controls.autoRotate = false;

const buttons = [...document.querySelectorAll('[data-family]')];
function select(id, ms = 900) {
  const k = FAMILY_GROUPS.findIndex((g) => g.id === id);
  if (k < 0) garden.clearGroup(ms); else garden.setGroup(k, ms);
  buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.family === id)));
  if (location.hash.slice(1) !== id) history.replaceState(null, '', '#' + id);
}
buttons.forEach((b) => (b.onclick = () => select(b.dataset.family)));
const initial = location.hash.slice(1) || params.get('family') || 'all';
select(FAMILY_GROUPS.some((g) => g.id === initial) ? initial : 'all', 0);

// Swipe between families, matching the focused-group navigation of the shape comparison.
new ResizeObserver(([e]) => { mount.style.top = e.target.getBoundingClientRect().height + 'px'; }).observe(document.querySelector('.experiment-bar'));
