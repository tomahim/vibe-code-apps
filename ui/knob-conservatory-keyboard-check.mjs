// Behavior + visual check for computer-keyboard playing and the embedded
// lesson guidance (sticky step bar, knob callouts) in Knob Conservatory.
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

const PRESETS_ROUTE = async (route) => {
  if (route.request().method() === 'GET') await route.fulfill({ json: { presets: [] } });
  else await route.fulfill({ status: 201, json: {} });
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

// 1. Unpowered: computer keys do nothing.
await page.keyboard.down('a');
await page.keyboard.up('a');
check('unpowered keys ignored', await engine(() => !window.__kcEngine.gateOpen), 'no gate while off');

// 2. Power on and play C4 with the A key.
await page.getByRole('button', { name: 'Power' }).click();
await page.getByRole('button', { name: 'On', exact: true }).waitFor();
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

// 4. Black key + AZERTY aliases.
await page.keyboard.down('w');
await settle(80);
check('W plays C#4', await engine(() => window.__kcEngine.currentMidi === 61), 'C#4');
await page.keyboard.up('w');
await page.keyboard.down('q');
await settle(80);
check('Q (AZERTY) plays C4', await engine(() => window.__kcEngine.currentMidi === 60), 'C4 from q');
await page.keyboard.up('q');

// 5. Arrows shift the octave, note follows.
await page.keyboard.press('ArrowUp');
await settle(80);
await page.keyboard.down('a');
await settle(80);
check('ArrowUp raises octave', await engine(() => window.__kcEngine.currentMidi === 72), 'C5 after ArrowUp');
await page.keyboard.up('a');
await page.keyboard.press('ArrowDown');
await settle(80);

// 6. Typing in the preset-name input never plays notes (workshop shelf).
await page.getByRole('button', { name: 'Workshop' }).click();
await page.getByPlaceholder('Name this instrument…').click();
await page.keyboard.type('bass pad', { delay: 20 });
check('typing plays nothing', await engine(() => !window.__kcEngine.gateOpen), 'gate stayed closed while typing');
check('text went to the input', (await page.getByPlaceholder('Name this instrument…').inputValue()) === 'bass pad', 'input has the text');
await page.getByRole('button', { name: 'Lessons' }).click();

// 7. Desktop: key letters + hint visible, callout inside viewport.
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

// 8. Desktop narrow (fine pointer, 390px): letters still shown (not a touch
// device), callout still inside the viewport.
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => window.scrollTo(0, 0));
{
  const box = await page.locator('.kc-tip').boundingBox();
  check('callout inside viewport at 390 (fine pointer)', Boolean(box && box.x >= 0 && box.x + box.width <= 390), box ? `x ${Math.round(box.x)}..${Math.round(box.x + box.width)}` : 'no box');
}
await page.close();

// ---------- Touch emulation: real coarse pointer ----------
// Geometry assertions: after a lesson pick, the guided knob (full box,
// label included) and its callout must sit entirely inside the usable band
// between the sticky step bar and the pinned piano.
async function assertGuidedGeometry(page, label, heights) {
  const geo = await page.evaluate(() => {
    const bar = document.querySelector('.kc-step-bar').getBoundingClientRect();
    const keys = document.querySelector('.kc-keyboard-row').getBoundingClientRect();
    const knob = document.querySelector('.kc-control-guided').getBoundingClientRect();
    const tip = document.querySelector('.kc-tip').getBoundingClientRect();
    return {
      bandTop: bar.bottom, bandBottom: keys.top,
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
  check(`${label}: step bar stuck to top`, Math.abs(geo.bandTop - (await page.evaluate(() => document.querySelector('.kc-step-bar').getBoundingClientRect().bottom))) < 2
    && (await page.evaluate(() => document.querySelector('.kc-step-bar').getBoundingClientRect().top)) === 0, 'bar top 0');
  check(`${label}: no horizontal overflow`, !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)), 'scrollWidth fits');
}

for (const height of [844, 420]) {
  const touch = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height } });
  const m = await touch.newPage();
  await openApp(m);
  check(`touch ${height}: coarse pointer matches`, await m.evaluate(() => matchMedia('(pointer: coarse)').matches), '(pointer: coarse) true under touch emulation');
  check(`touch ${height}: key letters hidden`, (await m.locator('.kc-key-letter:visible').count()) === 0, 'no letters on the keys');
  check(`touch ${height}: hint line hidden`, (await m.locator('.kc-keys-hint:visible').count()) === 0, 'no hint line');
  // Pick the other lesson from the path -> auto-scroll must place it well.
  await m.locator('.kc-path summary').tap();
  await m.locator('.kc-path li button', { hasText: 'Open the curtain' }).first().tap();
  await settle(1100); // smooth scroll + render
  await assertGuidedGeometry(m, `touch ${height}`);
  await m.screenshot({ path: `${screenshots}/touch-${height}-guided-knob.png` });
  // Touch playing still works: tap the C key.
  await m.getByRole('button', { name: 'Power' }).tap();
  await m.getByRole('button', { name: 'On', exact: true }).waitFor();
  await m.getByRole('button', { name: 'C4' }).tap();
  check(`touch ${height}: on-screen keyboard still plays`, true, 'tap dispatched without error');
  await touch.close();
}

await browser.close();
server.kill();
const failed = results.filter((r) => !r.ok);
console.log(failed.length ? `\n${failed.length} FAILURES` : '\nALL PASS');
process.exit(failed.length ? 1 : 0);
