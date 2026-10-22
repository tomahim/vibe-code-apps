import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';

// Run against real nginx: unit tests cannot detect request-body truncation or
// accidental IPv6 listeners. Docker is also available on the UI CI runner.
const id = `recipe-proxy-${process.pid}`;
const network = `${id}-net`;
const backend = `${id}-backend`;
const proxy = `${id}-nginx`;
const docker = (...args) => execFileSync('docker', args, { encoding: 'utf8', timeout: 120_000, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
let directory;
let origin;

after(async () => {
  for (const name of [proxy, backend]) {
    try { docker('rm', '-f', name); } catch { /* Already removed or never started. */ }
  }
  try { docker('network', 'rm', network); } catch { /* Setup may have failed. */ }
  if (directory) await rm(directory, { recursive: true, force: true });
});

before(async () => {
  directory = await mkdtemp(join(tmpdir(), 'recipe-proxy-'));
  const template = await readFile(new URL('../../nginx/default.conf.template', import.meta.url), 'utf8');
  const config = template.replaceAll('${PORT}', '8080')
    .replaceAll('${API_UPSTREAM}', 'http://backend:8000')
    // Use Docker's private DNS in place of Railway's private DNS.
    .replace('[fd12::10]', '127.0.0.11');
  await writeFile(join(directory, 'default.conf'), config);
  await writeFile(join(directory, 'backend.cjs'), `
    const http = require('node:http');
    const { createHash } = require('node:crypto');
    http.createServer(async (req, res) => {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ path: req.url, method: req.method, host: req.headers.host,
        type: req.headers['content-type'], bytes: body.length,
        sha256: createHash('sha256').update(body).digest('hex') }));
    }).listen(8000, '0.0.0.0');
  `);
  docker('network', 'create', network);
  docker('run', '-d', '--name', backend, '--network', network, '--network-alias', 'backend',
    '-v', `${directory}:/test:ro`, 'node:22-alpine', 'node', '/test/backend.cjs');
  docker('run', '-d', '--name', proxy, '--network', network, '-p', '127.0.0.1::8080',
    '-v', `${directory}/default.conf:/etc/nginx/conf.d/default.conf:ro`, 'nginx:stable-alpine');
  const port = docker('port', proxy, '8080/tcp').split(':').at(-1);
  // localhost may resolve IPv6 first; clients must fall back to IPv4.
  origin = `http://localhost:${port}`;
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const response = await fetch(`${origin}/admin/`);
      if (response.ok) return;
    } catch { /* Container is starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Proxy did not start: ${docker('logs', proxy)}`);
});

test('IPv6 fails at connection setup, before a browser can submit a body', () => {
  assert.throws(() => docker('exec', proxy, 'wget', '-q', '-T', '2', '-O', '-', 'http://[::1]:8080/health/'));
  assert.equal(docker('exec', proxy, 'wget', '-q', '-O', '-', 'http://127.0.0.1:8080/health/'), '{"status":"ok"}');
});

for (const path of ['/admin/recipes/recipe/add/', '/admin/recipes/recipe/4/change/']) {
  for (const size of [256, 256 * 1024, 5 * 1024 * 1024]) {
    test(`${path} preserves a multipart upload of ${size} bytes`, async () => {
      const form = new FormData();
      form.set('title', 'Proxy regression');
      form.set('image', new Blob([Buffer.alloc(size, 0x61)], { type: 'image/png' }), 'recipe.png');
      // Encode once so the expected hash includes the exact multipart boundary.
      const request = new Request(`${origin}${path}`, { method: 'POST', body: form });
      const body = Buffer.from(await request.arrayBuffer());
      const response = await fetch(request.url, { method: 'POST', body, headers: request.headers });
      assert.equal(response.status, 200);
      const forwarded = await response.json();
      assert.equal(forwarded.path, path);
      assert.equal(forwarded.method, 'POST');
      assert.equal(forwarded.host, new URL(origin).host);
      assert.equal(forwarded.type, request.headers.get('content-type'));
      assert.equal(forwarded.bytes, body.length);
      assert.equal(forwarded.sha256, createHash('sha256').update(body).digest('hex'));
    });
  }
}

test('admin bodies above 6 MiB are rejected by nginx', async () => {
  const response = await fetch(`${origin}/admin/recipes/recipe/add/`, {
    method: 'POST', body: Buffer.alloc(6 * 1024 * 1024 + 1),
  });
  assert.equal(response.status, 413);
});

test('recipe batch import preserves a 50 MiB ZIP and multipart overhead', async () => {
  const path = '/admin/recipes/recipe/import/';
  const form = new FormData();
  form.set('archive', new Blob([Buffer.alloc(50 * 1024 * 1024, 0x61)], { type: 'application/zip' }), 'recipes.zip');
  const request = new Request(`${origin}${path}`, { method: 'POST', body: form });
  const body = Buffer.from(await request.arrayBuffer());
  const response = await fetch(request.url, { method: 'POST', body, headers: request.headers });
  assert.equal(response.status, 200);
  const forwarded = await response.json();
  assert.equal(forwarded.path, path);
  assert.equal(forwarded.method, 'POST');
  assert.equal(forwarded.host, new URL(origin).host);
  assert.equal(forwarded.type, request.headers.get('content-type'));
  assert.equal(forwarded.bytes, body.length);
  assert.equal(forwarded.sha256, createHash('sha256').update(body).digest('hex'));
});

test('recipe batch import bodies above 51 MiB are rejected by nginx', async () => {
  const response = await fetch(`${origin}/admin/recipes/recipe/import/`, {
    method: 'POST', body: Buffer.alloc(51 * 1024 * 1024 + 1),
  });
  assert.equal(response.status, 413);
});
