import { createGarden } from './garden.js';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const state = { week: 7, playing: false };
const tabs = [...document.querySelectorAll('[role="tab"]')], panes = { desktop: document.querySelector('#pane-desktop'), mobile: document.querySelector('#pane-mobile') };
const loading = document.querySelector('#loading');
let current = null, name = null;
function select(n, focus) {
  if (n === name) return;
  current?.dispose(); current = null; name = n;
  tabs.forEach((t) => { const on = t.dataset.tab === n; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
  Object.entries(panes).forEach(([k, el]) => { el.hidden = k !== n; });
  document.body.dataset.tab = n; loading.hidden = false;
  requestAnimationFrame(() => setTimeout(() => { current = createGarden({ container: panes[n].querySelector('.mount'), profile: n, state, reduced }); window.__garden = current; loading.hidden = true; }, 30));
}
tabs.forEach((t, i) => { t.addEventListener('click', () => select(t.dataset.tab)); t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') select(tabs[(i + 1) % tabs.length].dataset.tab, true); }); });
select(matchMedia('(max-width: 760px)').matches ? 'mobile' : 'desktop');
