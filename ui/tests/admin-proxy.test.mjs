import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import config from '../vite.config.js';

test('development forwards Django and Unfold static assets to the API', () => {
  for (const path of ['/static/admin/js/core.js', '/static/unfold/css/styles.css', '/static/unfold/fonts/inter/styles.css']) {
    const prefix = Object.keys(config.server.proxy).find((key) => path.startsWith(key));
    assert.ok(prefix, `Missing proxy for ${path}`);
    assert.equal(config.server.proxy[prefix], config.server.proxy['/admin']);
  }
});

test('production forwards the complete Django static namespace', async () => {
  const nginx = await readFile(new URL('../nginx/default.conf.template', import.meta.url), 'utf8');
  // Both admin/ and unfold/ must reach the API, not the SPA fallback.
  assert.match(nginx, /location \/static\/\s*\{\s*proxy_pass \$api_upstream;/);
});

test('production uses IPv4 ingress and refreshes the API address', async () => {
  const nginx = await readFile(new URL('../nginx/default.conf.template', import.meta.url), 'utf8');
  assert.match(nginx, /listen 0\.0\.0\.0:\$\{PORT\};/);
  assert.doesNotMatch(nginx, /listen\s+\[.*\]/);
  assert.match(nginx, /resolver \[fd12::10\] ipv6=off valid=5s;/);
  assert.match(nginx, /set \$api_upstream \$\{API_UPSTREAM\};/);
  for (const path of ['api', 'admin', 'static']) {
    assert.match(nginx, new RegExp(`location /${path}/ \\{[\\s\\S]*?proxy_pass \\$api_upstream;`));
  }
});

test('development preserves the browser host for Django CSRF validation', () => {
  assert.equal(config.server.proxy['/admin'].changeOrigin, false);
});
