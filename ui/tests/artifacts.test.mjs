import test from 'node:test';
import assert from 'node:assert/strict';
import { createCatalog, filterArtifacts } from '../src/pages/artifact-catalog.js';

test('single HTML files need no registration; metadata enriches matching filenames', () => {
  let loads = 0;
  const load = () => { loads++; return Promise.resolve('<html></html>'); };
  const catalog = createCatalog({ './2026-10-23-devflow.html': load, './2026-10-24-color-play.html': load }, {
    './2026-10-23-devflow.json': { title: 'DevFlow', description: 'Review workspace', tags: [' Dark ', 'dark', 'Dashboard'], date: '2025-12-01' },
    './unrelated.json': { title: 'Not an artifact' },
  });
  assert.equal(loads, 0, 'discovery must not load or execute HTML');
  assert.equal(catalog.length, 2);
  assert.equal(catalog[0].date, '2025-12-01');
  assert.deepEqual(catalog[0].tags, ['dark', 'dashboard']);
  assert.equal(catalog[1].title, 'Color Play');
  assert.equal(catalog[1].date, '2026-10-24');
});

test('date ordering is chronological in both directions with undated files last', () => {
  const catalog = createCatalog(Object.fromEntries(['undated', '2026-10-23-new', '2024-02-29-leap', '2026-02-30-invalid', '2026-10-23-alpha'].map(name => [`./${name}.html`, () => {}])));
  assert.deepEqual(filterArtifacts(catalog).map(entry => entry.title), ['Alpha', 'New', 'Leap', 'Invalid', 'Undated']);
  assert.deepEqual(filterArtifacts(catalog, { order: 'oldest' }).map(entry => entry.title), ['Leap', 'Alpha', 'New', 'Invalid', 'Undated']);
  assert.equal(catalog.find(entry => entry.title === 'Invalid').date, null);
});

test('search words, tag and year combine without mutating the catalog', () => {
  const catalog = createCatalog({ './2026-10-23-devflow.html': () => {}, './2025-01-01-play.html': () => {} }, {
    './2026-10-23-devflow.json': { title: 'DevFlow', description: 'Review workspace', tags: ['dark', 'dashboard'] },
    './2025-01-01-play.json': { title: 'Play', tags: ['dark'] },
  });
  assert.equal(filterArtifacts(catalog, { query: '  REVIEW dark  ', tag: 'dashboard', year: '2026' }).length, 1);
  assert.equal(filterArtifacts(catalog, { query: '2025' })[0].title, 'Play');
  assert.equal(filterArtifacts(catalog, { query: 'DevFlow', year: '2025' }).length, 0);
  assert.equal(filterArtifacts(catalog, { tag: 'unknown' }).length, 0);
  assert.equal(catalog.length, 2);
  assert.deepEqual(createCatalog({}), []);
});
