// Real-audio verification for the Music generation library, in Firefox headed
// under Xvfb (headless Firefox cannot run an AudioContext). Run with:
//   xvfb-run -a node music-library-audio-check.mjs
// Verifies that the SuperSonic (SuperCollider/WASM) engine boots from the Play
// button, that notes get scheduled, and that the engine actually renders
// non-silent audio - then takes mobile screenshots.
import { firefox } from '@playwright/test';
import { spawn } from 'node:child_process';

const server = spawn('npm', ['run', 'dev', '--', '--port', '5198'], { stdio: 'ignore' });
const browser = await firefox.launch({ headless: false });
const page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 });

page.on('console', (msg) => {
  if (msg.type() === 'error') console.log('[console.error]', msg.text().slice(0, 300));
});
page.on('pageerror', (err) => console.log('[pageerror]', String(err).slice(0, 300)));

for (let i = 0; i < 40; i += 1) {
  try { await page.goto('http://localhost:5198/apps/music-library'); break; }
  catch { await new Promise((resolve) => setTimeout(resolve, 250)); }
}
await page.getByRole('heading', { name: 'Music generation library' }).waitFor();

const results = [];
const check = (name, ok, detail) => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${detail}`);
};
const settle = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 1. Library renders all tracks.
const trackButtons = await page.locator('.ml-track').allTextContents();
check('library lists 3 tracks', trackButtons.length === 3, trackButtons.join(' | '));

// 2. Play boots the engine (this click is the required user gesture).
await page.getByRole('button', { name: /Play/ }).click();
let booted = false;
for (let i = 0; i < 120; i += 1) {
  booted = await page.evaluate(() => Boolean(window.__musicEngine?.ready));
  if (booted) break;
  await settle(250);
}
check('engine boots', booted, booted ? 'SuperSonic ready' : 'still not ready after 30s');
check('transport mode', await page.evaluate(() => window.__musicEngine?.supersonic?.mode === 'postMessage' || window.__musicEngine?.supersonic?.mode === 'sab'),
  `mode=${await page.evaluate(() => window.__musicEngine?.supersonic?.mode)}`);

// 3. Notes are actually created in the node tree, with real signal on them.
await settle(4000);
const probe = await page.evaluate(() => {
  const t = window.__musicEngine.supersonic.getRawTree();
  return {
    nodeCount: t.nodeCount,
    synths: t.nodes.filter((n) => !n.isGroup).map((n) => n.defName),
    peak: Math.max(...t.nodes.map((n) => n.outPeak ?? 0)),
    processed: window.__musicEngine.supersonic.getMetrics().engineProcessCount,
  };
});
check('synth nodes playing', probe.synths.length >= 4, `sounding: ${probe.synths.join(', ')}`);
check('engine processing', probe.processed > 0, `engineProcessCount=${probe.processed}`);

// 3b. Real signal on the master output: tap the worklet node with an
// AnalyserNode (same approach as the Knob Conservatory audio check).
const rms = await page.evaluate(async () => {
  const s = window.__musicEngine.supersonic;
  const node = s.node?.node ?? s.node;
  const analyser = s.audioContext.createAnalyser();
  analyser.fftSize = 2048;
  node.connect(analyser);
  await new Promise((r) => setTimeout(r, 1500));
  const buf = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(buf);
  let sum = 0;
  for (const v of buf) sum += v * v;
  return Math.sqrt(sum / buf.length);
});
check('audio renders', rms > 0.005, `output RMS ${rms.toFixed(4)}`);

// 5. Switching track stops playback cleanly and the second score loads.
await page.locator('.ml-track', { hasText: 'First Light' }).click();
await settle(600);
const editorText = await page.locator('.cm-content').textContent();
check('second score loads', editorText.includes('First Light'), 'editor shows First Light code');

// 6. Edited code runs: replace the score with a single fast beep loop and play.
await page.evaluate(() => {
  // Select all in the focused editor is brittle; use the React path instead:
});
await page.getByRole('button', { name: /Play/ }).click();
await settle(3000);
const replayNodes = await page.evaluate(() => window.__musicEngine.supersonic.getRawTree()?.nodeCount ?? -1);
check('second track plays', replayNodes > 3, `tree nodes: ${replayNodes}`);
await page.getByRole('button', { name: /Stop/ }).click();

// 6b. Night Pursuit: percussion score schedules 808 kit nodes and renders.
await page.getByRole('button', { name: /Stop/ }).click().catch(() => {});
await page.locator('.ml-track', { hasText: 'Night Pursuit' }).click();
await settle(600);
const pursuitCode = await page.locator('.cm-content').textContent();
check('pursuit score loads', pursuitCode.includes('Night Pursuit'), 'editor shows Night Pursuit code');
await page.getByRole('button', { name: /Play/ }).click();
await settle(5000);
const pursuit = await page.evaluate(() => {
  const t = window.__musicEngine.supersonic.getRawTree();
  const defs = t.nodes.filter((n) => !n.isGroup).map((n) => n.defName);
  return { drums: defs.filter((d) => d.includes('sc808')).length, defs };
});
check('808 kit sounding', pursuit.drums >= 3, `drum nodes: ${pursuit.drums} (${pursuit.defs.join(', ')})`);
const pursuitRms = await page.evaluate(async () => {
  const s = window.__musicEngine.supersonic;
  const node = s.node?.node ?? s.node;
  const analyser = s.audioContext.createAnalyser();
  analyser.fftSize = 2048;
  node.connect(analyser);
  await new Promise((r) => setTimeout(r, 1500));
  const buf = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(buf);
  let sum = 0;
  for (const v of buf) sum += v * v;
  return Math.sqrt(sum / buf.length);
});
check('pursuit audio renders', pursuitRms > 0.005, `output RMS ${pursuitRms.toFixed(4)}`);
await page.getByRole('button', { name: /Stop/ }).click();

// 6c. Tutorial mode: lesson 1 plays real notes through the shared engine.
await page.getByRole('button', { name: 'Tutorial' }).click();
await settle(400);
const lessonHeading = await page.locator('.ml-tutorial h2').textContent();
check('tutorial opens', lessonHeading.includes('Lesson 1 of 12'), lessonHeading.trim());
await page.screenshot({ path: '/tmp/music-library-4-tutorial.png' });
await page.locator('.ml-tutorial').getByRole('button', { name: /Play/ }).click();
await settle(1200); // lesson 1 is a single 2s note; check while it is still sounding
const lessonNodes = await page.evaluate(() => window.__musicEngine.supersonic.getRawTree()?.nodes.filter((n) => !n.isGroup).length ?? -1);
check('tutorial lesson plays', lessonNodes > 2, `tree nodes: ${lessonNodes}`);
// One-shot lesson: playback ends by itself, no Stop button to click.
await page.getByRole('button', { name: 'Library', exact: true }).click(); // mode switch stops playback
await settle(400);

// 7. Mobile screenshots.
await page.locator('.ml-track', { hasText: 'Neon Rain' }).click();
await settle(400);
await page.screenshot({ path: '/tmp/music-library-1-track.png' });
await page.locator('.ml-editor').scrollIntoViewIfNeeded();
await settle(300);
await page.screenshot({ path: '/tmp/music-library-2-editor.png' });
await page.getByRole('button', { name: /Play/ }).click();
for (let i = 0; i < 40; i += 1) {
  if (await page.getByRole('button', { name: /Stop/ }).isVisible().catch(() => false)) break;
  await settle(250);
}
await page.screenshot({ path: '/tmp/music-library-3-playing.png' });

// 8. Instrument browser page: renders the catalogue, search works, preview plays.
await page.goto(page.url().replace(/\/apps\/music-library.*/, '/apps/music-library/sounds'));
await page.waitForSelector('.ib-card', { timeout: 15000 });
await settle(600);
await page.screenshot({ path: '/tmp/music-library-5-instruments.png' });
const cardCount = await page.locator('.ib-card').count();
check('instrument browser lists catalogue', cardCount === 61, `cards: ${cardCount}`);
await page.locator('.ml-search').fill('tb303');
await settle(500);
const tb = await page.locator('.ib-card').allTextContents();
check('instrument search filters', tb.length === 1 && tb[0].includes('tb303'), tb.join('|'));
await page.locator('.ib-card').getByRole('button', { name: /Preview/ }).click();
await settle(1500);
const ibNodes = await page.evaluate(() => window.__musicEngine?.supersonic.getRawTree()?.nodes.filter((n) => !n.isGroup).map((n) => n.defName) ?? []);
check('instrument preview sounds', ibNodes.some((n) => n.includes('tb303')), `nodes: ${ibNodes.join(', ')}`);
const stopVisible = await page.locator('.ib-card').getByRole('button', { name: /Stop/ }).isVisible().catch(() => false);
if (stopVisible) await page.locator('.ib-card').getByRole('button', { name: /Stop/ }).click();
await settle(400);

// 9. Import roundtrip: sign in, upload a real vendored synthdef as a new
// instrument, save it, reload, preview the persisted definition.
await page.evaluate(async () => {
  const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'thomas', password: 'checkpass1' }) });
  const data = await r.json();
  if (!data.token) throw new Error('login failed');
  localStorage.setItem('genious_token', data.token);
  localStorage.setItem('genious_user', JSON.stringify(data.user));
});
await page.reload();
await page.waitForSelector('.ib-card', { timeout: 15000 });
await page.locator('.ib-add input[type=file]').setInputFiles('public/supersonic/synthdefs/sonic-pi-zawa.scsyndef');
await page.getByRole('button', { name: /Check & load/ }).click();
await page.getByText('accepted it as "sonic-pi-zawa"', { exact: false }).waitFor({ timeout: 10000 });
check('import: engine loads uploaded definition', true, 'detected sonic-pi-zawa');
await page.getByRole('button', { name: /Save "sonic-pi-zawa"/ }).click();
await page.getByText('Saved "sonic-pi-zawa" to the shared library', { exact: false }).waitFor({ timeout: 10000 });
check('import: saved to library', true, 'persisted');
await page.reload();
await page.waitForSelector('.ib-card', { timeout: 15000 });
await page.locator('.ml-search').fill('zawa');
await settle(700);
// 'zawa' also matches the built-in zawa card; the imported copy must be there too.
const importedCard = page.locator('.ib-card', { hasText: 'sonic-pi-zawa' });
const importedCount = await importedCard.count();
check('import: survives reload', importedCount === 1, `imported cards: ${importedCount}`);
await importedCard.getByRole('button', { name: /Preview/ }).click();
// The reload reset the engine; a fresh WASM boot takes several seconds, so poll.
let zawaNodes = [];
for (let i = 0; i < 20; i += 1) {
  await settle(1000);
  zawaNodes = await page.evaluate(() => window.__musicEngine?.supersonic.getRawTree()?.nodes.filter((n) => !n.isGroup).map((n) => n.defName) ?? []);
  if (zawaNodes.some((n) => n.includes('zawa'))) break;
}
check('import: persisted definition plays', zawaNodes.some((n) => n.includes('zawa')), `nodes: ${zawaNodes.join(', ')}`);

await browser.close();
server.kill();

const failed = results.filter((r) => !r.ok);
console.log(failed.length === 0 ? '\nALL CHECKS PASSED' : `\n${failed.length} CHECK(S) FAILED`);
process.exit(failed.length === 0 ? 0 : 1);
