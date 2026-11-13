// Production-build regression: insecure HTTP fails clearly, local HTTPS plays
// real audio. No Railway, Tailscale account, public certificate or browser
// secure-origin override is used. Run after `cd ui && npm ci && npm run build`:
// node infra/tailscale-router/music-https-check.mjs
import assert from 'node:assert/strict';
import { chromium } from '../../ui/node_modules/@playwright/test/index.mjs';
import { createServer as httpServer } from 'node:http';
import { createServer as httpsServer } from 'node:https';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, extname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const temp = await mkdtemp(join(tmpdir(), 'music-https-'));
const dist = new URL('../../ui/dist/', import.meta.url).pathname;
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.wasm': 'application/wasm', '.json': 'application/json', '.scsyndef': 'application/octet-stream' };
const serve = async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://local').pathname);
  const file = resolve(dist, '.' + path);
  if (!file.startsWith(dist)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(file).catch(() => readFile(join(dist, 'index.html')));
    res.writeHead(200, { 'content-type': mime[extname(path)] || (path.includes('.') ? 'application/octet-stream' : 'text/html') });
    res.end(body);
  } catch { res.writeHead(500).end(); }
};
let browser, http, https;
try {
  execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '1', '-keyout', join(temp, 'key.pem'), '-out', join(temp, 'cert.pem'), '-subj', '/CN=music.test', '-addext', 'subjectAltName=DNS:music.test'], { stdio: 'ignore' });
  http = httpServer(serve);
  https = httpsServer({ key: await readFile(join(temp, 'key.pem')), cert: await readFile(join(temp, 'cert.pem')) }, serve);
  await Promise.all([http, https].map(s => new Promise(r => s.listen(0, '127.0.0.1', r))));
  browser = await chromium.launch({
    ...(process.env.PLAYWRIGHT_CHROME_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROME_PATH } : {}),
    args: ['--host-resolver-rules=MAP music.test 127.0.0.1', '--no-proxy-server'],
  });
  const context = await browser.newContext({ ignoreHTTPSErrors: true }); // local self-signed cert only; not proof of the live certificate chain
  await context.addInitScript(() => {
    const connect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function(destination, ...args) {
      if (destination === this.context.destination && !window.__musicAudioProbe) {
        const analyser = this.context.createAnalyser();
        analyser.fftSize = 2048;
        connect.call(this, analyser);
        window.__musicAudioProbe = { analyser, context: this.context };
      }
      return connect.call(this, destination, ...args);
    };
  });
  const page = await context.newPage();
  await page.goto(`http://music.test:${http.address().port}/apps/music-library`);
  await page.getByRole('heading', { name: 'Music generation library' }).waitFor();
  assert.equal(await page.evaluate(() => isSecureContext), false);
  await page.getByRole('button', { name: /Play/ }).click();
  await page.locator('.ml-error').filter({ hasText: 'plain HTTP' }).waitFor();
  console.log('PASS production HTTP on non-localhost: secure-context error shown');

  await page.goto(`https://music.test:${https.address().port}/apps/music-library`);
  await page.getByRole('heading', { name: 'Music generation library' }).waitFor();
  assert.equal(await page.evaluate(() => isSecureContext && typeof AudioWorklet === 'function'), true);
  await page.getByRole('button', { name: /Play/ }).click();
  await page.getByRole('button', { name: /Stop/ }).waitFor({ timeout: 30000 });
  await page.waitForFunction(() => window.__musicAudioProbe?.context.state === 'running');
  const rms = await page.evaluate(async () => {
    const { analyser } = window.__musicAudioProbe;
    const buf = new Float32Array(analyser.fftSize);
    let peak = 0;
    for (let i = 0; i < 40; i++) {
      analyser.getFloatTimeDomainData(buf);
      peak = Math.max(peak, Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length));
      if (peak > 0.005) return peak;
      await new Promise(r => setTimeout(r, 200));
    }
    return peak;
  });
  assert.ok(rms > 0.005, `Expected non-silent engine output, RMS=${rms}`);
  console.log(`PASS production HTTPS on non-localhost: AudioContext running, real output RMS=${rms.toFixed(4)}`);
  if (process.env.MUSIC_SCREENSHOT) await page.screenshot({ path: process.env.MUSIC_SCREENSHOT, fullPage: true });
  await page.getByRole('button', { name: /Stop/ }).click();
  await page.getByRole('button', { name: /Play/ }).waitFor();
  console.log('PASS Stop returns the player to Play');
} finally {
  await browser?.close();
  await Promise.all([http, https].filter(Boolean).map(s => new Promise(r => s.close(r))));
  await rm(temp, { recursive: true, force: true });
}
