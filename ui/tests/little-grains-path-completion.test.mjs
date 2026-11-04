import { test } from 'node:test';
import assert from 'node:assert/strict';
import { finishedPaths, newlyCompletedPaths, pathFinished } from '../src/apps/little-grains/path-completion.js';
const garden = (...paths) => ({ themes: [{ learning_paths: paths }] });
const path = (id, read, total = 3) => ({ id, title: `Path ${id}`, progress: { cards_completed: read, cards_total: total, lessons_total: 3 } });
test('a path is finished once every card is read, whatever the questions', () => {
  assert.equal(pathFinished(path('a', 3)), true);
  assert.equal(pathFinished(path('a', 2)), false);
  assert.equal(pathFinished(path('a', 0, 0)), false);
  assert.equal(pathFinished({ id: 'a' }), false);
});
test('only known unfinished to finished paths celebrate', () => {
  assert.deepEqual(newlyCompletedPaths(garden(path('a', 2)), garden(path('a', 3))), [{ id: 'a', title: 'Path a', lessons: 3 }]);
});
test('initial load, existing completions, unchanged and new paths stay quiet', () => {
  assert.deepEqual(newlyCompletedPaths(null, garden(path('a', 3))), []);
  assert.deepEqual(newlyCompletedPaths(garden(path('a', 3)), garden(path('a', 3), path('new', 3))), []);
  assert.deepEqual(newlyCompletedPaths(garden(path('a', 2)), garden(path('a', 2))), []);
});
test('queues all newly finished paths, ignores absent progress and removals', () => {
  assert.deepEqual(newlyCompletedPaths(garden(path('a', 2), path('b', 2), path('gone', 2), { id: 'x' }), garden(path('b', 3), path('a', 3), path('x', 3))).map(p => p.id), ['b', 'a']);
});
test('the one-time catch-up lists every finished path of a snapshot', () => {
  assert.deepEqual(finishedPaths(garden(path('a', 3), path('b', 1), { id: 'x' })), [{ id: 'a', title: 'Path a', lessons: 3 }]);
  assert.deepEqual(finishedPaths(null), []);
});
