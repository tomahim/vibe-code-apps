import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newlyCompletedPaths } from '../src/apps/little-grains/path-completion.js';
const garden = (...paths) => ({ themes: [{ learning_paths: paths }] });
const path = (id, completed) => ({ id, title: `Path ${id}`, progress: { completed, lessons_total: 3 } });
test('only known incomplete to completed paths celebrate', () => {
  assert.deepEqual(newlyCompletedPaths(garden(path('a', false)), garden(path('a', true))), [{ id: 'a', title: 'Path a', lessons: 3 }]);
});
test('initial load, existing completions, unchanged and new paths stay quiet', () => {
  assert.deepEqual(newlyCompletedPaths(null, garden(path('a', true))), []);
  assert.deepEqual(newlyCompletedPaths(garden(path('a', true)), garden(path('a', true), path('new', true))), []);
  assert.deepEqual(newlyCompletedPaths(garden(path('a', false)), garden(path('a', false))), []);
});
test('queues all newly finished paths, ignores absent progress and removals', () => {
  assert.deepEqual(newlyCompletedPaths(garden(path('a', false), path('b', false), path('gone', false), { id: 'x' }), garden(path('b', true), path('a', true), path('x', true))).map(p => p.id), ['b', 'a']);
});
