// Secure-context verification for the Music generation library, in Chrome.
//
// The SuperSonic engine needs AudioWorklet, which browsers only expose in
// secure contexts (HTTPS, or localhost). The deployed app is reached over
// plain HTTP on the Tailscale network, where Chrome hides the API and Play
// used to fail with "Missing required features for postMessage mode:
// audioWorklet". This check covers all three relevant situations:
//
//   A. plain HTTP on a non-localhost host (like the deployed Tailscale
//      origin): the page must explain the real cause and the HTTPS remedy,
//      not show the cryptic engine error.
//   B. secure context (localhost): the engine must boot in Chrome and render
//      real, non-silent audio.
//   C. plain HTTP + Chrome's --unsafely-treat-insecure-origin-as-secure flag
//      (the interim user-side workaround until HTTPS is set up): the origin
//      becomes a secure context and the engine must start.
//
// Headless Chrome ignores the flag in scenario C, so run headed under Xvfb:
//   npm run build && xvfb-run -a node music-library-secure-context-check.mjs
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

// Scenarios A and C use the production build (dist/) behind a dumb static
// server, because the vite dev server rejects unknown Host headers.
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm', '.scsyndef': 'application/octet-stream', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const dist = new URL('./dist/', import.meta.url).pathname;
const staticServer = createServer(async (req, res) => {
  const path = req.url.split('?')[0];
  for (const file of [join(dist, path), join(dist, 'index.html')]) {
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
      return;
    } catch { /* try next */ }
  }
});
await new Promise((r) => staticServer.listen(5199, '127.0.0.1', r));

const server = spawn('npm', ['run', 'dev', '--', '--port', '5198', '--strictPort'], { stdio: 'ignore' });

const settle = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, detail) => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${detail}`);
};

const caps = (page) => page.evaluate(() => ({
  secure: window.isSecureContext,
  audioWorklet: typeof AudioWorklet,
  worker: typeof Worker,
}));

async function openPage(browser, url) {
  const page = await browser.newPage();
  page.on('pageerror', (err) => console.log('[pageerror]', String(err).slice(0, 200)));
  for (let i = 0; i < 40; i += 1) {
    try { await page.goto(url); break; } catch { await settle(250); }
  }
  await page.getByRole('heading', { name: 'Music generation library' }).waitFor();
  return page;
}

const resolverArgs = ['--host-resolver-rules=MAP genious.internal 127.0.0.1'];

// ---------- A: plain HTTP, non-localhost host (like the deployed origin) ----------
{
  const browser = await chromium.launch({ args: resolverArgs });
  const page = await openPage(browser, 'http://genious.internal:5199/apps/music-library');
  const before = await caps(page);
  check('A: insecure context hides AudioWorklet',
    before.secure === false && before.audioWorklet === 'undefined',
    JSON.stringify(before));

  await page.getByRole('button', { name: /Play/ }).click();
  let errorText = '';
  for (let i = 0; i < 40; i += 1) {
    errorText = (await page.locator('.ml-error').textContent().catch(() => '')) || '';
    if (errorText) break;
    await settle(250);
  }
  check('A: actionable HTTPS guidance shown',
    errorText.includes('plain HTTP') && errorText.includes('HTTPS'),
    errorText.trim());
  check('A: cryptic engine error gone',
    !errorText.includes('Missing required features'),
    errorText.trim());
  await page.screenshot({ path: '/tmp/music-library-secure-context-A.png' });
  await browser.close();
}

// ---------- B: secure context (localhost) boots and renders real audio ----------
{
  const browser = await chromium.launch();
  const page = await openPage(browser, 'http://localhost:5198/apps/music-library');
  const before = await caps(page);
  check('B: secure context exposes AudioWorklet',
    before.secure === true && before.audioWorklet === 'function',
    JSON.stringify(before));

  await page.getByRole('button', { name: /Play/ }).click();
  let booted = false;
  for (let i = 0; i < 120; i += 1) {
    booted = await page.evaluate(() => Boolean(window.__musicEngine?.ready));
    if (booted) break;
    await settle(250);
  }
  check('B: engine boots in Chrome', booted, booted ? 'SuperSonic ready' : 'not ready after 30s');

  await settle(4000);
  const probe = await page.evaluate(() => {
    const s = window.__musicEngine.supersonic;
    const t = s.getRawTree();
    return {
      mode: s.mode,
      ctxState: s.audioContext?.state,
      synths: t.nodes.filter((n) => !n.isGroup).length,
      processed: s.getMetrics().engineProcessCount,
    };
  });
  check('B: engine processing', probe.processed > 0 && probe.ctxState === 'running', JSON.stringify(probe));

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
  check('B: real audio renders', rms > 0.005, `output RMS ${rms.toFixed(4)}`);
  await page.screenshot({ path: '/tmp/music-library-secure-context-B.png' });
  await browser.close();
}

// ---------- C: plain HTTP + Chrome secure-origin flag (interim workaround) ----------
{
  const browser = await chromium.launch({
    headless: false, // the flag is ignored by the headless shell; run under xvfb
    args: [...resolverArgs, '--unsafely-treat-insecure-origin-as-secure=http://genious.internal:5199'],
  });
  const page = await openPage(browser, 'http://genious.internal:5199/apps/music-library');
  const before = await caps(page);
  check('C: flag makes the origin a secure context',
    before.secure === true && before.audioWorklet === 'function',
    JSON.stringify(before));

  await page.getByRole('button', { name: /Play/ }).click();
  let stopVisible = false;
  for (let i = 0; i < 120; i += 1) {
    stopVisible = await page.getByRole('button', { name: /Stop/ }).isVisible().catch(() => false);
    if (stopVisible) break;
    await settle(250);
  }
  const errText = (await page.locator('.ml-error').textContent().catch(() => '')) || '';
  check('C: engine starts on the flagged origin', stopVisible && !errText,
    `stopVisible=${stopVisible} err=${errText.trim()}`);
  await page.screenshot({ path: '/tmp/music-library-secure-context-C.png' });
  await browser.close();
}

server.kill();
staticServer.close();

const failed = results.filter((r) => !r.ok);
console.log(failed.length === 0 ? '\nALL CHECKS PASSED' : `\n${failed.length} CHECK(S) FAILED`);
process.exit(failed.length === 0 ? 0 : 1);
