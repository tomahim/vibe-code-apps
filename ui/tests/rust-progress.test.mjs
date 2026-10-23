import test from 'node:test';
import assert from 'node:assert/strict';
import { readProgress, writeProgress, STORAGE_KEY } from '../src/apps/rust-learning-path/progress.js';
const lessons = [
  { id: 'one', steps: [{}, {}] },
  { id: 'two', diagnostic: {}, steps: [{}] },
];

test('saved lesson, step, drafts, and checks survive reload while stale steps are removed', () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
  const state = { current: 'two', step: 2, drafts: { 'one:0': 'my code', 'two:2': 'next code', 'gone:0': 'old' }, passed: { 'one:0': true, 'two:2': true, 'gone:0': true, 'one:1': false } };
  assert.equal(writeProgress(storage, state), true);
  assert.ok(values.has(STORAGE_KEY));
  assert.deepEqual(readProgress(storage, lessons), { current: 'two', step: 2, drafts: { 'one:0': 'my code', 'two:2': 'next code' }, passed: { 'one:0': true, 'two:2': true } });
  assert.equal(writeProgress(storage, { current: 'one', step: 0, drafts: {}, passed: {} }), true);
  assert.deepEqual(readProgress(storage, lessons), { current: 'one', step: 0, drafts: {}, passed: {} });
});

test('invalid and unavailable storage cannot prevent opening the course', () => {
  for (const storage of [{ getItem: () => '{bad' }, { getItem: () => { throw new Error('blocked'); } }]) {
    assert.deepEqual(readProgress(storage, lessons), { current: 'one', step: 0, drafts: {}, passed: {} });
  }
  assert.deepEqual(readProgress({ getItem: () => JSON.stringify({ current: 'gone', step: 900, drafts: { 'one:9': 'stale' }, passed: { 'one:9': true } }) }, lessons), { current: 'one', step: 0, drafts: {}, passed: {} });
  assert.equal(writeProgress({ setItem: () => { throw new Error('quota'); } }, {}), false);
});
