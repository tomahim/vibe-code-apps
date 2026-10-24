import * as B from './bikeparts.mjs';
import { readFileSync, writeFileSync } from 'fs';

// ---------- bike baked figure (initial pose) ----------
const g = (part, extra, inner) => `<g class="it" data-part="${part}"${extra || ""}>${inner}</g>`;
const bikeBody = [
  g("ground", "", B.groundSvg()),
  g("frame", "", B.frameSvg()),
  `<g class="it" data-part="ghost" data-b-ghost>${B.ghostSvg()}</g>`,
  g("fwheel", "", B.wheelStaticSvg(B.FH)),
  `<g class="it" data-part="fwheel" data-b-fspokes>${B.spokesSvg(B.FH, 0)}</g>`,
  g("wheel", "", B.wheelStaticSvg(B.RH)),
  `<g class="it" data-part="wheel" data-b-rspokes>${B.spokesSvg(B.RH, 0)}</g>`,
  `<g class="it" data-part="cog" data-b-cog>${B.cogSvg(0)}</g>`,
  `<g class="it" data-part="pawls" data-b-pawls>${B.pawlSvg(0, 1)}</g>`,
  `<g class="it" data-part="chain"><path class="iso-line chain" data-b-chainpath d="${B.chainPathD()}"/></g>`,
  `<g class="it" data-part="chain" data-b-pins>${B.chainPinsSvg(0)}</g>`,
  `<g class="it" data-part="crank" data-b-arms>${B.crankArmsSvg(-0.6)}</g>`,
  `<g class="it" data-part="ring" data-b-ring>${B.ringSvg(-0.6)}</g>`,
  `<g class="it" data-part="crank" data-b-pedals>${B.pedalsSvg(-0.6, 0)}</g>`,
  g("mesh", "", B.meshDotsSvg()),
  `<g>${B.labelsSvg()}</g>`,
  `<text class="tickword" data-click opacity="0" x="0" y="0">click · click · click</text>`,
].join("");
// position the click word near the rear hub
const [clx, cly] = [B.RH.x, B.RH.z];
import * as E from './engine.mjs';
const [csx, csy] = E.iso([clx + 60, 0, cly + 60], B.PB);
const bikeBodyFinal = bikeBody.replace('<text class="tickword" data-click opacity="0" x="0" y="0"',
  `<text class="tickword" data-click opacity="0" x="${csx.toFixed(1)}" y="${csy.toFixed(1)}"`);

const sw = (mark) => E.swatchSvg(mark);
const bikePanel = `<div class="tab-panel" data-panel="bike" id="panel-bike" role="tabpanel" aria-labelledby="tab-bike" hidden><figure class="iso-figure"><div class="iso-plate"><div class="iso-plate-corners" aria-hidden="true"><span class="iso-plate-corner" data-corner="fig">Fig 2</span><span class="iso-plate-corner" data-corner="title">The bicycle drivetrain</span><span class="iso-plate-corner" data-corner="hint">Seven steps · arrows work too</span><span class="iso-plate-corner" data-corner="readout" data-readout>Push · still · 0 rpm</span></div><div class="iso-stage-outer">
<div class="watch-grid">
  <div class="steps" role="group" aria-label="Steps of the drivetrain"><button type="button" data-step="0">Push</button><button type="button" data-step="1">Ring</button><button type="button" data-step="2">Chain</button><button type="button" data-step="3">Cogs</button><button type="button" data-step="4">Freewheel</button><button type="button" data-step="5">Wheel</button><button type="button" data-step="6">Ride</button></div>
  <div class="iso-stage" tabindex="0" role="group" aria-label="Bicycle drivetrain figure: arrow keys move between the seven steps"><svg xmlns="http://www.w3.org/2000/svg" class="iso-svg" viewBox="0 0 ${B.VIEW_W} ${B.VIEW_H}" role="img" aria-label="A side elevation of a road bicycle's drivetrain: legs push 172.5 mm cranks turning a 50-tooth chainring; a chain carries the pull to a 15-tooth cog on the rear wheel; spring pawls inside the hub drive the wheel one way and click when you coast; each wheel turn rolls 2.1 metres of road.">${bikeBodyFinal}</svg></div>
</div>
<div class="gauges" aria-hidden="true">
  <div class="gauge"><span>Cadence</span><strong data-b-cad>0 rpm</strong><i><b data-b-cad-bar style="width:0%"></b></i></div>
  <div class="gauge"><span>Gear</span><strong data-b-gear>50:15 · ×3.3</strong></div>
  <div class="gauge"><span>Speed</span><strong data-b-speed>0.0 km/h</strong><i><b data-b-speed-bar style="width:0%"></b></i></div>
  <div class="gauge"><span>Distance</span><strong data-b-dist>0 m</strong></div>
</div>
<p class="bigidea" data-idea></p>
<span class="sr" data-say aria-live="polite"></span>
</div></div><figcaption class="iso-legend"><span class="iso-keys"><span class="iso-key">${sw("lit")}The parts this step is about</span><span class="iso-key">${sw("dim")}The rest of the bike, still drawn</span><span class="iso-key">${sw("red")}Where chain meets teeth</span><span class="iso-key">${sw("green")}Your foot's push</span></span><span class="iso-caption">A road bike's drivetrain in side elevation, drawn to scale where it counts: 50-tooth ring, 15-tooth cog, 172.5 mm cranks, 700C wheels - 2.1 metres of road a turn. The dashed circles are the cassette's range, 11 to 28 teeth. The rider, brakes and derailleur are left off the page; the bottom chain run is drawn taut, though a real one sags a little.</span></figcaption></figure></div>`;

// ---------- read original ----------
const orig = readFileSync('/home/sandbox/repo/ui/src/artifacts/2026-10-23-swiss-watch.html', 'utf8');
const scriptOpen = '<script type="module">';
const si = orig.indexOf(scriptOpen);
let head = orig.slice(0, si);                       // doctype..body + main + watch figure
let script = orig.slice(si + scriptOpen.length, orig.indexOf('</script></body></html>'));

// ---------- body: wrap watch figure in panel, prepend tabs, append bike panel ----------
const mainOpen = '<main class="iso-page">';
head = head.replace(mainOpen, mainOpen + `<div class="tabs" role="tablist" aria-label="Choose a machine"><button type="button" role="tab" id="tab-watch" data-tab="watch" aria-selected="true" aria-controls="panel-watch">Swiss lever watch</button><button type="button" role="tab" id="tab-bike" data-tab="bike" aria-selected="false" aria-controls="panel-bike" tabindex="-1">Bicycle drivetrain</button></div><div class="tab-panel" data-panel="watch" id="panel-watch" role="tabpanel" aria-labelledby="tab-watch">`);
head = head.replace('</main>', `</div>${bikePanel}</main>`);
head = head.replace('<title>The Swiss Lever Watch</title>', '<title>The Swiss Lever Watch &amp; the Bicycle Drivetrain</title>');

// ---------- CSS additions ----------
const addCss = `
.tabs{display:flex;gap:4px;margin-top:8px;border-bottom:1px solid var(--anatomy-faint)}
.tabs button{font:650 11px var(--anatomy-mono);letter-spacing:.08em;text-transform:uppercase;padding:8px 12px 10px;background:none;border:0;border-bottom:2px solid transparent;color:var(--anatomy-muted);cursor:pointer}
.tabs button[aria-selected="true"]{color:var(--anatomy-strong);border-bottom-color:var(--anatomy-strong)}
.tabs button:focus-visible{outline:2px solid var(--anatomy-strong);outline-offset:2px}
.tab-panel[hidden]{display:none}
.iso-line.tube{stroke-width:7;stroke-linecap:round}
.iso-line.stay{stroke-width:4;stroke-linecap:round}
.iso-line.spoke{stroke-width:1}
.iso-line.crank{stroke-width:8;stroke-linecap:round}
.iso-line.spider{stroke-width:5;stroke-linecap:round}
.iso-line.chain{stroke-width:2.6}
.iso-line.arrow-force{stroke:var(--anatomy-green);stroke-width:3}
.iso-solid.tire>.iso-fill{fill:var(--anatomy-shade-1)}
.iso-solid.hub>.iso-fill{fill:var(--anatomy-face)}
.iso-solid.hubcap>.iso-fill{fill:var(--anatomy-paper)}
.iso-solid.chainring>.iso-fill{fill:var(--anatomy-face)}
.iso-solid.cog>.iso-fill{fill:var(--anatomy-face)}
.iso-solid.pedal>.iso-fill{fill:var(--anatomy-shade-3)}
.iso-solid.pawl>.iso-fill{fill:var(--anatomy-lit-top)}
.iso-solid.saddle>.iso-fill{fill:var(--anatomy-shade-1)}
[data-panel="bike"] .iso-stage .it[data-part="ghost"]{opacity:0;transition:opacity .5s}
[data-panel="bike"] .iso-stage[data-focus] .it[data-part="ghost"][data-on]{opacity:.9}
`;
head = head.replace('</style>', addCss + '</style>');

// ---------- script: scope watch runtime, inline bikeparts, append bike runtime + tabs ----------
const cut = script.indexOf('const stage = document.querySelector(".iso-stage");');
let engine = script.slice(0, cut);
let watchRt = script.slice(cut);
watchRt = 'const watchPanel = document.querySelector(\'[data-panel="watch"]\');\n' + watchRt
  .replaceAll('document.querySelector(".iso-stage")', 'watchPanel.querySelector(".iso-stage")')
  .replaceAll('document.querySelector("[data-readout]")', 'watchPanel.querySelector("[data-readout]")')
  .replaceAll('document.querySelector("[data-idea]")', 'watchPanel.querySelector("[data-idea]")')
  .replaceAll('document.querySelector("[data-say]")', 'watchPanel.querySelector("[data-say]")')
  .replaceAll('document.querySelector("[data-g-reserve]")', 'watchPanel.querySelector("[data-g-reserve]")')
  .replaceAll('document.querySelector("[data-g-amp]")', 'watchPanel.querySelector("[data-g-amp]")')
  .replaceAll('document.querySelector("[data-g-rate]")', 'watchPanel.querySelector("[data-g-rate]")')
  .replaceAll('document.querySelector("[data-g-beat]")', 'watchPanel.querySelector("[data-g-beat]")')
  .replaceAll('document.querySelector("[data-g-reserve-bar]")', 'watchPanel.querySelector("[data-g-reserve-bar]")')
  .replaceAll('document.querySelector("[data-g-amp-bar]")', 'watchPanel.querySelector("[data-g-amp-bar]")')
  .replaceAll('document.querySelectorAll("[data-step]")', 'watchPanel.querySelectorAll("[data-step]")')
  .replaceAll('el.dataset.on = STEPS[s].parts.includes(el.dataset.part) ? "1" : "";', 'el.toggleAttribute("data-on", STEPS[s].parts.includes(el.dataset.part));')
  .replaceAll('b.dataset.on = Number(b.dataset.step) === i ? "1" : "";', 'b.toggleAttribute("data-on", Number(b.dataset.step) === i);');

let bikepartsSrc = readFileSync('/tmp/bike/bikeparts.mjs', 'utf8');
bikepartsSrc = bikepartsSrc
  .replace(/import \{[^}]*\} from '\.\/engine\.mjs';\n/, '')  // drop import statement
  .replaceAll('export const ', 'const ').replaceAll('export function ', 'function ');
const bikeRt = readFileSync('/tmp/bike/bikeruntime.js', 'utf8');
const tabsJs = `
// ---- tabs ----
const tabList = document.querySelector('.tabs');
const tabBtns = [...tabList.querySelectorAll('[data-tab]')];
function activateTab(name, focus) {
  tabBtns.forEach((b) => {
    const on = b.dataset.tab === name;
    b.setAttribute('aria-selected', on ? 'true' : 'false');
    b.tabIndex = on ? 0 : -1;
    if (on && focus) b.focus();
  });
  document.querySelectorAll('.tab-panel').forEach((p) => { p.hidden = p.dataset.panel !== name; });
}
tabBtns.forEach((b) => b.addEventListener('click', () => activateTab(b.dataset.tab, false)));
tabList.addEventListener('keydown', (event) => {
  const i = tabBtns.findIndex((b) => b.getAttribute('aria-selected') === 'true');
  if (event.key === 'ArrowRight') { event.preventDefault(); const n = tabBtns[(i + 1) % tabBtns.length]; activateTab(n.dataset.tab, true); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); const n = tabBtns[(i + tabBtns.length - 1) % tabBtns.length]; activateTab(n.dataset.tab, true); }
});
`;
const out = head + scriptOpen + engine + bikepartsSrc + watchRt + bikeRt + tabsJs + '</scr' + 'ipt></body></html>';
writeFileSync('/home/sandbox/repo/ui/src/artifacts/2026-10-23-swiss-watch.html', out);
console.log('final bytes', out.length);
