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
const openEditor = async (name) => {
  await page.locator('.ml-track', { hasText: name }).getByRole('link', { name: 'Edit' }).click();
  await page.locator('.cm-content').waitFor();
  await page.waitForFunction(() => !document.querySelector('.ml-editor-page .ml-play')?.disabled, null, { timeout: 15000 });
  await settle(300);
};
const editorPlay = () => page.locator('.ml-editor-bar .ml-play').click();

// 1. Library renders all tracks.
const trackButtons = await page.locator('.ml-track').allTextContents();
check('library lists 3 tracks', trackButtons.length === 3, trackButtons.join(' | '));

// 2. Play boots the engine (this click is the required user gesture).
await page.locator('.ml-row-play').first().click();
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

// 5. Row play stops cleanly; the Edit link opens the separate editor page.
await page.locator('.ml-row-play.stop').click();
await settle(400);
await openEditor('First Light');
check('editor route opens', page.url().includes('/apps/music-library/edit/'), page.url());
const editorText = await page.locator('.cm-content').textContent();
check('second score loads', editorText.includes('First Light'), 'editor shows First Light code');

// 6. Editor Play hears the (unedited) score.
await editorPlay();
await settle(3000);
const replayNodes = await page.evaluate(() => window.__musicEngine.supersonic.getRawTree()?.nodeCount ?? -1);
check('second track plays', replayNodes > 3, `tree nodes: ${replayNodes}`);
await editorPlay(); // Stop
await page.goBack();
await page.getByRole('heading', { name: 'Music generation library' }).waitFor();

// 6b. Night Pursuit: percussion score schedules 808 kit nodes and renders.
await openEditor('Night Pursuit');
const pursuitCode = await page.locator('.cm-content').textContent();
check('pursuit score loads', pursuitCode.includes('Night Pursuit'), 'editor shows Night Pursuit code');
await editorPlay();
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

// 6b2. Playing edited, UNSAVED code: type a marker note and hear it.
await page.locator('.cm-content').click();
await page.keyboard.press('Control+Home');
await page.keyboard.type('m.play("blade", { note: "A3", dur: 6, amp: 0.3 });\n');
await settle(300);
check('unsaved edit is flagged', await page.getByText('Code changed', { exact: false }).isVisible(), 'banner visible while playing');
await editorPlay(); await settle(300); await editorPlay(); // stop, play again with the edit
await settle(2500);
const editedDefs = await page.evaluate(() => window.__musicEngine.supersonic.getRawTree().nodes.filter((n) => !n.isGroup).map((n) => n.defName));
check('edited (unsaved) code plays', editedDefs.some((d) => d.includes('blade')), `nodes: ${editedDefs.slice(0, 8).join(', ')}`);
await editorPlay(); // Stop
await page.goBack();
await page.getByRole('heading', { name: 'Music generation library' }).waitFor();

// 6d. Server-side library search (only when the API is reachable).
const searchBox = page.locator('.ml-search');
if (await searchBox.isVisible().catch(() => false)) {
  await searchBox.fill('pursuit');
  await settle(900); // debounce + fetch
  const hits = await page.locator('.ml-track').allTextContents();
  check('search filters library', hits.length === 1 && hits[0].includes('Night Pursuit'), hits.join('|'));
  await searchBox.fill('');
  await settle(900);
  const restored = await page.locator('.ml-track').count();
  check('clearing search restores list', restored === 3, `tracks: ${restored}`);
}

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

// 7. Screenshots: library list, then editor with the sounds pane.
await settle(400);
await page.screenshot({ path: '/tmp/music-library-1-list.png' });
await openEditor('Neon Rain');
await page.screenshot({ path: '/tmp/music-library-2-editor.png' });
await page.getByRole('button', { name: /Available sounds/ }).click();
await settle(600);
await page.screenshot({ path: '/tmp/music-library-3-pane.png' });
await page.goBack();

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
check('import: persisted definition creates a node', zawaNodes.some((n) => n.includes('zawa')), `nodes: ${zawaNodes.join(', ')}`);

// Measured audible output of the persisted preview, tapped after the final
// clip stage: it must be non-silent AND stay inside the hard bound.
const persistedAudio = await page.evaluate(async () => {
  const e = window.__musicEngine;
  const ctx = e.supersonic.audioContext;
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 4096;
  e.outputShaper.connect(analyser);
  await new Promise((r) => setTimeout(r, 1500));
  const buf = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(buf);
  let sum = 0; let peak = 0;
  for (const v of buf) { sum += v * v; peak = Math.max(peak, Math.abs(v)); }
  return { rms: Math.sqrt(sum / buf.length), peak };
});
check('import: persisted preview audibly renders', persistedAudio.rms > 0.005, `output RMS ${persistedAudio.rms.toFixed(4)}`);
check('import: persisted preview within hard bound', persistedAudio.peak <= 0.90, `peak ${persistedAudio.peak.toFixed(4)} (bound 0.89)`);

// The clip must hold for a signal that tries to exceed it: inject a 2.0x
// full-scale oscillator straight into the final stage and measure the peak.
const clipPeak = await page.evaluate(async () => {
  const e = window.__musicEngine;
  const ctx = e.supersonic.audioContext;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  gain.gain.value = 2.0;
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 4096;
  osc.connect(gain);
  gain.connect(e.outputShaper);
  e.outputShaper.connect(analyser);
  osc.start();
  await new Promise((r) => setTimeout(r, 1200));
  const buf = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(buf);
  osc.stop();
  osc.disconnect(); gain.disconnect();
  let peak = 0;
  for (const v of buf) peak = Math.max(peak, Math.abs(v));
  return peak;
});
check('output clip: over-range signal stays within bound', clipPeak <= 0.90, `peak ${clipPeak.toFixed(4)} with a 2.0x test signal (bound 0.89)`);

// 10. Editor palette on the DB catalogue (#555+#556+#557 combined): proves the
// palette consumes the instruments API rather than the static fallback (62
// rows = 61 seeded + the imported zawa), previews the persisted import through
// the output clip, and inserts a playable call at the cursor.
await page.evaluate(() => { const e = window.__musicEngine; e?.supersonic?.send('/g_freeAll', e.sourceGroup); });
await page.goto(page.url().replace(/\/apps\/music-library.*/, '/apps/music-library'));
await page.getByRole('heading', { name: 'Music generation library' }).waitFor();
await openEditor('Neon Rain');
const paneBtn = page.getByRole('button', { name: /Available sounds/ });
if (await paneBtn.count()) await paneBtn.click();
await page.locator('.ml-sound-palette .ml-search').waitFor();
await page.waitForFunction(() => document.querySelectorAll('.ml-sound-list li').length > 1, null, { timeout: 15000 });
const dbRows = await page.locator('.ml-sound-list li').count();
check('palette: serves the DB catalogue, not the fallback', dbRows === 62, `rows: ${dbRows}`);
await page.locator('.ml-sound-palette .ml-search').fill('zawa');
await settle(400);
const zawaRow = page.locator('.ml-sound-list li', { hasText: 'sonic-pi-zawa' });
check('palette: imported instrument listed', await zawaRow.count() === 1, 'sonic-pi-zawa row');
// The library list page boots the engine lazily on the first user gesture, so
// the first preview click starts the WASM boot; a second click once booted is
// the one measured for audible output through the clip stage.
await zawaRow.locator('.ml-sound-preview').click();
await page.waitForFunction(
  () => Boolean(window.__musicEngine?.supersonic?.audioContext && window.__musicEngine?.outputShaper),
  null,
  { timeout: 30000 },
);
await zawaRow.locator('.ml-sound-preview').click();
const palAudio = await page.evaluate(async () => {
  const e = window.__musicEngine;
  const ctx = e.supersonic.audioContext;
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 4096;
  e.outputShaper.connect(analyser);
  const buf = new Float32Array(analyser.fftSize);
  let peak = 0; let bestRms = 0;
  const t0 = performance.now();
  while (performance.now() - t0 < 4000) {
    await new Promise((r) => setTimeout(r, 150));
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (const v of buf) { sum += v * v; peak = Math.max(peak, Math.abs(v)); }
    bestRms = Math.max(bestRms, Math.sqrt(sum / buf.length));
  }
  return { rms: bestRms, peak };
});
check('palette: persisted import previews audibly', palAudio.rms > 0.005, `RMS ${palAudio.rms.toFixed(4)}`);
check('palette: preview within output clamp', palAudio.peak <= 0.90, `peak ${palAudio.peak.toFixed(4)} (bound 0.89)`);
await zawaRow.locator('.ml-sound-insert').click();
await settle(400);
const palEditor = await page.locator('.cm-content').innerText();
check('palette: import inserts a playable call', palEditor.includes('m.play("sonic-pi-zawa"'), 'm.play("sonic-pi-zawa", ...) in editor');
await page.screenshot({ path: '/tmp/music-library-7-palette.png' });
await page.getByRole('button', { name: /Hide sounds/ }).click();
check('sounds pane collapses', await page.locator('.ml-sound-pane').count() === 0, 'pane removed');
await page.goBack();

// 11. UI CRUD roundtrip against the API: create through the UI, edit, save,
// reload, and verify the edit persisted from the server.
await page.getByRole('link', { name: '+ New track' }).click();
await page.locator('.cm-content').waitFor();
await page.locator('.ml-details input').first().fill('Roundtrip Check Track');
await page.locator('.cm-content').click();
await page.keyboard.press('Control+End');
await page.keyboard.type('\n// roundtrip-marker-4815');
await page.getByRole('button', { name: 'Save new track' }).click();
await page.waitForURL(/\/apps\/music-library\/edit\/\d+/, { timeout: 10000, waitUntil: 'commit' });
check('ui: create track saves via API', true, page.url());
await page.locator('.cm-content').waitFor();
await page.waitForFunction(() => document.querySelector('.cm-content')?.innerText.includes('roundtrip-marker-4815'), null, { timeout: 10000 });
await page.locator('.cm-content').click();
await page.keyboard.press('Control+End');
await page.keyboard.type(' edit2');
await page.getByRole('button', { name: 'Save', exact: true }).click();
await page.getByText('Saved "Roundtrip Check Track".', { exact: false }).waitFor({ timeout: 10000 });
check('ui: edit track saves via API', true, 'updated');
await page.reload();
await page.locator('.cm-content').waitFor();
await page.waitForFunction(() => document.querySelector('.cm-content')?.innerText.includes('edit2'), null, { timeout: 10000 });
const persisted = await page.locator('.cm-content').innerText();
check('ui: edit survives reload from API', persisted.includes('roundtrip-marker-4815 edit2'), persisted.includes('roundtrip-marker-4815') ? 'code persisted' : `tail: ${persisted.slice(-80)}`);
await page.screenshot({ path: '/tmp/music-library-6-crud.png' });

await browser.close();
server.kill();

const failed = results.filter((r) => !r.ok);
console.log(failed.length === 0 ? '\nALL CHECKS PASSED' : `\n${failed.length} CHECK(S) FAILED`);
process.exit(failed.length === 0 ? 0 : 1);
