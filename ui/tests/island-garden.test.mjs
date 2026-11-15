import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
const base = path.resolve('public/artifact-assets/2026-11-15-island-garden');
const hj = path.resolve('public/artifact-assets/2026-11-15-ecosystem-growth-poc/hybrid-journey');
const read = name => fs.readFileSync(path.join(base, name), 'utf8');
const context = { window: {} };
vm.runInNewContext(read('island-data.js'), context);
vm.runInNewContext(read('island-assets.js'), context);
const data = context.window.ISLAND_GARDEN_DATA, assets = context.window.ISLAND_GARDEN_ASSETS;

function checkAsset(a, dir) {
  assert.match(a.src, /^(\.\.\/2026-11-15-ecosystem-growth-poc\/hybrid-journey\/)?assets\/[\w-]+-[a-f\d]{12}\.webp$/);
  const file = a.src.startsWith('..') ? path.join(hj, a.src.replace('../2026-11-15-ecosystem-growth-poc/hybrid-journey/', '')) : path.join(dir, a.src);
  const bytes = fs.readFileSync(file);
  assert.equal(a.bytes, bytes.length);
  assert.ok(a.src.includes(crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 12)));
}

test('Island garden covers the seven groups and twenty established themes', () => {
  assert.equal(data.groups.length, 7);
  const keys = JSON.parse(JSON.stringify(data.groups.flatMap(g => g.themes)));
  assert.equal(new Set(keys).size, 20);
  assert.deepEqual(keys.slice().sort(), Object.keys(JSON.parse(JSON.stringify(data.themes))).sort());
  assert.equal(Object.keys(assets.themes).length, 20);
  assert.equal(assets.groups.length, 7);
});

test('Every theme lesson stop stays at bounded scenery coordinates', () => {
  for (const t of Object.values(data.themes)) {
    assert.equal(t.lessons.length, 3);
    for (const l of t.lessons) { assert.ok(l.title && l.landmark); assert.ok(l.x >= 5 && l.x <= 95 && l.y >= 5 && l.y <= 95); }
  }
});

test('Island-cut landscape interiors exist with byte counts and content hashes', () => {
  for (const pair of Object.values(assets.themes)) {
    for (const key of ['lush', 'sparse']) checkAsset(pair.landscape[key], base);
  }
});

test('Group worlds pair the approved square paintings with the generated wide compositions', () => {
  for (const pair of assets.groups) {
    for (const key of ['lush', 'sparse']) {
      checkAsset(pair.portrait[key], base);
      checkAsset(pair.landscape[key], base);
    }
  }
  // Distinct portrait interior compositions landed on 2026-11-16 after the
  // daily image limit reset; both orientations are now real painted pairs.
  for (const pair of Object.values(assets.themes)) {
    for (const key of ['lush', 'sparse']) checkAsset(pair.portrait[key], base);
  }
});

test('Portrait lesson anchors and wide group spots stay on the paintings', () => {
  for (const t of Object.values(data.themes)) {
    for (const l of t.lessons) { assert.ok(l.px >= 3 && l.px <= 97 && l.py >= 3 && l.py <= 97); }
  }
  for (const g of data.groups) {
    assert.equal(g.wideSpots.length, g.themes.length);
    for (const [x, y] of g.wideSpots) { assert.ok(x >= 3 && x <= 97 && y >= 3 && y <= 97); }
  }
});

test('The app shell, orientation engine and floating interface are wired', () => {
  const js = read('island.js'), html = read('index.html'), css = read('island.css');
  assert.match(js, /stageOrientation/);
  assert.match(js, /pair\[want\]/);
  assert.match(js, /imageCache\.size > 8/);
  assert.match(js, /requestIdleCallback/);
  assert.match(js, /window\.islandGardenState/);
  assert.match(html, /id="panel"/);
  assert.match(html, /id="bottomNav"/);
  assert.match(html, /id="growthDock"/);
  assert.match(css, /@media\(max-width:700px\)/);
  const shell = fs.readFileSync('src/artifacts/2026-11-15-island-garden.html', 'utf8');
  assert.match(shell, /\/artifact-assets\/2026-11-15-island-garden\/index\.html/);
});

test('Only the hashed island artwork directory receives long-lived private caching', () => {
  const config = fs.readFileSync('nginx/default.conf.template', 'utf8');
  assert.match(config, /location \^~ \/artifact-assets\/2026-11-15-island-garden\/assets\/ \{\s*add_header Cache-Control "private, max-age=31536000, immutable";\s*try_files \$uri =404;/);
});
