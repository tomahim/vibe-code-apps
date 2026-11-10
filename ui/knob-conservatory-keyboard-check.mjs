// Behavior + visual check for Knob Conservatory: computer-keyboard playing,
// the lesson sidebar beside the synth, ear-check verdicts on the knob
// tooltips, presets saved from lessons mode, and default-on power under both
// permissive and real browser autoplay policies.
// Run with: node knob-conservatory-keyboard-check.mjs
// Screenshots land in KC_SCREENSHOTS or /tmp/kc-keyboard-screenshots.
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const server = spawn('npm', ['run', 'dev', '--', '--port', '5196'], { stdio: 'ignore' });
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
const screenshots = process.env.KC_SCREENSHOTS || '/tmp/kc-keyboard-screenshots';
fs.mkdirSync(screenshots, { recursive: true });

const results = [];
const check = (name, ok, detail) => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${detail}`);
};

const shelf = { presets: [] };
const PRESETS_ROUTE = async (route) => {
  const request = route.request();
  if (request.method() === 'GET') await route.fulfill({ json: { presets: shelf.presets } });
  else if (request.method() === 'POST') {
    const body = JSON.parse(request.postData() ?? '{}');
    shelf.presets.push({ id: `preset-${shelf.presets.length + 1}`, name: body.name ?? 'preset', settings: body.settings ?? {} });
    await route.fulfill({ status: 201, json: {} });
  } else await route.fulfill({ status: 204 });
};
const seed = () => {
  localStorage.setItem('genious_token', 'visual-fixture-only');
  // Lesson 1 already passed, so the path list has a second lesson to pick.
  localStorage.setItem('knob-conservatory:v1', JSON.stringify({
    currentLesson: 'the-wah-in-the-wire',
    tries: {},
    passed: { 'open-the-curtain': { score: 100, at: '2026-11-10T09:00:00Z' } },
  }));
};

async function openApp(page) {
  await page.addInitScript(seed);
  await page.route('**/api/apps/knob-conservatory/**', PRESETS_ROUTE);
  for (let i = 0; i < 30; i += 1) {
    try { await page.goto('http://localhost:5196/apps/knob-conservatory'); break; }
    catch { await new Promise((resolve) => setTimeout(resolve, 200)); }
  }
  await page.getByRole('heading', { name: 'Knob Conservatory' }).waitFor();
}

const settle = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------- Desktop context: playing behavior + guidance ----------
const page = await browser.newPage();
await openApp(page);
await page.setViewportSize({ width: 1280, height: 900 });
const engine = (fn) => page.evaluate(fn);

// 1. Power is on by default: no switch flip needed before playing.
check('power on by default', await page.getByRole('button', { name: 'On', exact: true }).isVisible(), 'header switch shows On on load');
await page.keyboard.down('a');
await settle(250);
check('A plays C4', await engine(() => window.__kcEngine.gateOpen && window.__kcEngine.currentMidi === 60), `midi ${await engine(() => window.__kcEngine.currentMidi)}`);
const sounding = await engine(() => window.__kcEngine.outputLevel());
check('note sounds', sounding.rms > 0.005, `rms ${sounding.rms.toFixed(4)}`);
check('key lights up', await page.locator('.kc-key-white.kc-key-active').count() === 1, 'one active white key');

// 3. Last-note priority: hold A, press S (D4), release S, still sounding C4.
await page.keyboard.down('s');
await settle(120);
check('S takes over', await engine(() => window.__kcEngine.currentMidi === 62), 'D4 while both held');
await page.keyboard.up('s');
await settle(120);
check('falls back to C4', await engine(() => window.__kcEngine.gateOpen && window.__kcEngine.currentMidi === 60), 'C4 after releasing S');
await page.keyboard.up('a');
await settle(120);
check('release closes gate', await engine(() => !window.__kcEngine.gateOpen), 'silent after last key up');

// 2. Powering off still silences the synth; powering back on restores it.
await page.getByRole('button', { name: 'On', exact: true }).click();
await page.getByRole('button', { name: 'Power', exact: true }).waitFor();
await page.keyboard.down('a');
await page.keyboard.up('a');
check('unpowered keys ignored', await engine(() => !window.__kcEngine.gateOpen), 'no gate while off');
await page.getByRole('button', { name: 'Power', exact: true }).click();
await page.getByRole('button', { name: 'On', exact: true }).waitFor();

// 3. Black key + AZERTY aliases.
await page.keyboard.down('w');
await settle(80);
check('W plays C#4', await engine(() => window.__kcEngine.currentMidi === 61), 'C#4');
await page.keyboard.up('w');
await page.keyboard.down('q');
await settle(80);
check('Q (AZERTY) plays C4', await engine(() => window.__kcEngine.currentMidi === 60), 'C4 from q');
await page.keyboard.up('q');

// 4. Arrows shift the octave, note follows.
await page.keyboard.press('ArrowUp');
await settle(80);
await page.keyboard.down('a');
await settle(80);
check('ArrowUp raises octave', await engine(() => window.__kcEngine.currentMidi === 72), 'C5 after ArrowUp');
await page.keyboard.up('a');
await page.keyboard.press('ArrowDown');
await settle(80);

// 5. Typing in the preset-name input never plays notes (workshop shelf).
await page.getByRole('button', { name: 'Workshop' }).click();
await page.getByPlaceholder('Name this instrument…').click();
await page.keyboard.type('bass pad', { delay: 20 });
check('typing plays nothing', await engine(() => !window.__kcEngine.gateOpen), 'gate stayed closed while typing');
check('text went to the input', (await page.getByPlaceholder('Name this instrument…').inputValue()) === 'bass pad', 'input has the text');
await page.getByRole('button', { name: 'Lessons' }).click();

// 6. Desktop: key letters + hint visible, callout inside viewport.
check('key letters shown (desktop)', (await page.locator('.kc-key-letter:visible').count()) === 13, 'letters on all 13 keys');
check('hint line shown (desktop)', await page.locator('.kc-keys-hint').isVisible(), 'mapping hint visible');
{
  const tip = page.locator('.kc-tip');
  await tip.waitFor();
  const box = await tip.boundingBox();
  check('callout inside viewport at 1280', Boolean(box && box.x >= 0 && box.x + box.width <= 1280), box ? `x ${Math.round(box.x)}..${Math.round(box.x + box.width)}` : 'no box');
}
await page.keyboard.down('d');
await settle(250);
await page.screenshot({ path: `${screenshots}/desktop-key-pressed.png` });
await page.keyboard.up('d');

// 7. Desktop narrow (fine pointer, 390px): letters still shown (not a touch
// device), callout still inside the viewport.
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => window.scrollTo(0, 0));
{
  const box = await page.locator('.kc-tip').boundingBox();
  check('callout inside viewport at 390 (fine pointer)', Boolean(box && box.x >= 0 && box.x + box.width <= 390), box ? `x ${Math.round(box.x)}..${Math.round(box.x + box.width)}` : 'no box');
}
await page.setViewportSize({ width: 1280, height: 900 });
await page.evaluate(() => window.scrollTo(0, 0));

// 8. Sidebar layout: the steps ride beside the synth, not above it.
{
  const side = await page.locator('.kc-sidebar').boundingBox();
  const panel = await page.locator('.kc-panel').boundingBox();
  check('sidebar beside panel (desktop)', Boolean(side && panel && side.x + side.width <= panel.x + 2 && Math.abs(side.y - panel.y) < 40),
    side && panel ? `sidebar ${Math.round(side.x)}..${Math.round(side.x + side.width)} vs panel ${Math.round(panel.x)}` : 'no box');
  check('goal bar hidden on desktop', await page.locator('.kc-mobilebar').isHidden(), 'mobilebar display none at 1280');
}

// 9. Failed check: the verdict lands on the knob's own tooltip.
await page.getByRole('button', { name: 'Check my ear' }).click();
await page.locator('.kc-tip-status').first().waitFor();
check('verdict on the knob tooltip', (await page.locator('.kc-tip-status').count()) === 1, 'one goal knob flagged');
const verdict = await page.locator('.kc-tip-status').first().innerText();
check('verdict is a closeness word', /far|very close|close|matched/.test(verdict), verdict);
{
  const knob = await page.locator('.kc-control-guided').first().boundingBox();
  const tip = await page.locator('.kc-tip-status').first().boundingBox();
  check('verdict sits at its knob', Boolean(knob && tip && Math.abs((tip.x + tip.width / 2) - (knob.x + knob.width / 2)) < 130),
    knob && tip ? `knob cx ${Math.round(knob.x + knob.width / 2)} tip cx ${Math.round(tip.x + tip.width / 2)}` : 'no box');
}
check('sidebar shows the score', await page.locator('.kc-match').isVisible(), 'summary in sidebar');
await page.screenshot({ path: `${screenshots}/desktop-failed-check.png` });

// 10. After three tries, "Reveal the gap" adds the direction to the tooltip.
await page.getByRole('button', { name: 'Check my ear' }).click();
await page.getByRole('button', { name: 'Check my ear' }).click();
await page.getByRole('button', { name: 'Reveal the gap' }).click();
check('tooltip shows the direction', (await page.locator('.kc-tip-status').first().innerText()).includes('turn'), await page.locator('.kc-tip-status').first().innerText());
await page.screenshot({ path: `${screenshots}/desktop-gap-revealed.png` });

// 11. Turning the knob clears the stale verdict until the next check.
{
  const box = await page.getByRole('slider', { name: 'Resonance' }).boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 - 40, { steps: 5 });
  await page.mouse.up();
  check('verdict clears while adjusting', (await page.locator('.kc-tip-status').count()) === 0, 'flag gone after drag');
}

// 12. Lessons mode saves presets from the sidebar shelf.
await page.getByPlaceholder('Name this instrument…').fill('wah keeper');
await page.getByRole('button', { name: 'Save' }).click();
await page.locator('.kc-preset-name', { hasText: 'wah keeper' }).waitFor();
check('preset saved from lessons mode', await page.locator('.kc-preset-name', { hasText: 'wah keeper' }).isVisible(), 'wah keeper on the shelf');
await page.close();

// ---------- Touch emulation: real coarse pointer ----------
// Geometry assertions: after a lesson pick, the guided knob (full box,
// label included) and its callout must sit entirely inside the usable band
// between the sticky step bar and the pinned piano.
async function assertGuidedGeometry(page, label, heights) {
  const geo = await page.evaluate(() => {
    const bar = document.querySelector('.kc-mobilebar');
    const barBottom = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().bottom : 0;
    const keys = document.querySelector('.kc-keyboard-row').getBoundingClientRect();
    const knob = document.querySelector('.kc-control-guided').getBoundingClientRect();
    const tip = document.querySelector('.kc-tip').getBoundingClientRect();
    return {
      bandTop: barBottom, bandBottom: keys.top,
      knobTop: knob.top, knobBottom: knob.bottom,
      tipTop: tip.top, tipBottom: tip.bottom,
      viewport: window.innerHeight,
    };
  });
  const knobInside = geo.knobTop >= geo.bandTop - 1 && geo.knobBottom <= geo.bandBottom + 1;
  check(`${label}: guided knob fully in usable band`, knobInside,
    `knob ${Math.round(geo.knobTop)}..${Math.round(geo.knobBottom)} vs band ${Math.round(geo.bandTop)}..${Math.round(geo.bandBottom)}`);
  const tipInside = geo.tipTop >= geo.bandTop - 1 && geo.tipBottom <= geo.knobTop + 1;
  check(`${label}: callout fully above knob, below bar`, tipInside,
    `tip ${Math.round(geo.tipTop)}..${Math.round(geo.tipBottom)}`);
  check(`${label}: goal bar stuck to top`, Math.abs(await page.evaluate(() => document.querySelector('.kc-mobilebar').getBoundingClientRect().top)) < 2, 'bar top 0');
  check(`${label}: no horizontal overflow`, !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)), 'scrollWidth fits');
}

for (const height of [844, 420]) {
  const touch = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height } });
  const m = await touch.newPage();
  await openApp(m);
  check(`touch ${height}: coarse pointer matches`, await m.evaluate(() => matchMedia('(pointer: coarse)').matches), '(pointer: coarse) true under touch emulation');
  check(`touch ${height}: key letters hidden`, (await m.locator('.kc-key-letter:visible').count()) === 0, 'no letters on the keys');
  check(`touch ${height}: hint line hidden`, (await m.locator('.kc-keys-hint:visible').count()) === 0, 'no hint line');
  check(`touch ${height}: goal bar pinned`, await m.locator('.kc-mobilebar').isVisible(), 'goal + actions pinned on phones');
  {
    const side = await m.locator('.kc-sidebar').boundingBox();
    const panel = await m.locator('.kc-panel').boundingBox();
    check(`touch ${height}: sidebar above panel`, Boolean(side && panel && side.y + side.height <= panel.y + 2),
      side && panel ? `sidebar bottom ${Math.round(side.y + side.height)} vs panel top ${Math.round(panel.y)}` : 'no box');
  }
  // Pick the other lesson from the path -> auto-scroll must place it well.
  await m.locator('.kc-path li button', { hasText: 'Open the curtain' }).first().tap();
  await settle(1100); // smooth scroll + render
  await assertGuidedGeometry(m, `touch ${height}`);
  await m.screenshot({ path: `${screenshots}/touch-${height}-guided-knob.png` });
  // Failed check on touch: the verdict lands on the knob's own tooltip.
  await m.getByRole('button', { name: 'Check my ear' }).tap();
  await m.locator('.kc-tip-status').first().waitFor();
  check(`touch ${height}: verdict on the knob tooltip`, (await m.locator('.kc-tip-status').count()) === 1, 'one goal knob flagged');
  await m.screenshot({ path: `${screenshots}/touch-${height}-failed-check.png` });
  // Touch playing works without flipping the switch first: tap the C key.
  await m.getByRole('button', { name: 'C4' }).tap();
  await settle(250);
  check(`touch ${height}: on-screen keyboard plays by default`, await m.evaluate(() => window.__kcEngine.currentMidi === 60), 'tap played C4');
  check(`touch ${height}: engine running by default`, await m.evaluate(() => window.__kcEngine.context?.state === 'running'), 'context running after tap');
  await touch.close();
}

await browser.close();

// ---------- Real autoplay policy: default-on survives a suspended start ----------
// Chrome's default policy parks a new AudioContext until a user gesture. The
// switch must still read On and the first key press must start the sound.
const strictBrowser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const strict = await strictBrowser.newPage();
await openApp(strict);
await strict.setViewportSize({ width: 1280, height: 900 });
check('autoplay: switch shows On', await strict.getByRole('button', { name: 'On', exact: true }).isVisible(), 'On under default autoplay policy');
await settle(2400); // let the mount-time powerOn lose its 2s race while parked
check('autoplay: context starts suspended', await strict.evaluate(() => window.__kcEngine.context?.state === 'suspended'), `state ${await strict.evaluate(() => window.__kcEngine.context?.state)}`);
await strict.keyboard.down('a');
await settle(400);
check('autoplay: first key resumes the engine', await strict.evaluate(() => window.__kcEngine.context?.state === 'running' && window.__kcEngine.gateOpen), 'resumed by the gesture');
const strictLevel = await strict.evaluate(() => window.__kcEngine.outputLevel());
check('autoplay: first note actually sounds', strictLevel.rms > 0.005, `rms ${strictLevel.rms.toFixed(4)}`);
await strict.keyboard.up('a');
await strict.screenshot({ path: `${screenshots}/autoplay-first-note.png` });
await strictBrowser.close();

server.kill();
const failed = results.filter((r) => !r.ok);
console.log(failed.length ? `\n${failed.length} FAILURES` : '\nALL PASS');
process.exit(failed.length ? 1 : 0);
