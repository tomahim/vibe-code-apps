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
  assert.match(nginx, /location \/static\/\s*\{\s*proxy_pass \$\{API_UPSTREAM\};/);
});

test('development preserves the browser host for Django CSRF validation', () => {
  assert.equal(config.server.proxy['/admin'].changeOrigin, false);
});
