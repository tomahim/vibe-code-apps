import assert from 'node:assert/strict';
import test from 'node:test';
import { shuffled } from '../src/apps/little-grains/shuffle.js';

const options = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];

test('returns a permutation without mutating the input', () => {
  const input = [...options];
  const result = shuffled(input);
  assert.deepEqual(input, options);
  assert.deepEqual([...result].sort((x, y) => x.id.localeCompare(y.id)), options);
});

test('random source controls the order', () => {
  assert.deepEqual(shuffled(options, () => 0).map((o) => o.id), ['b', 'c', 'd', 'a']);
  assert.deepEqual(shuffled(options, () => 0.999).map((o) => o.id), ['a', 'b', 'c', 'd']);
});

test('spreads each option across positions', () => {
  let seed = 42;
  const random = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  const runs = 12000;
  const counts = [0, 0, 0, 0];
  for (let n = 0; n < runs; n++) counts[shuffled(options, random).findIndex((o) => o.id === 'a')]++;
  for (const count of counts) {
    assert.ok(count > runs * 0.2 && count < runs * 0.3, `position counts ${counts}`);
  }
});

test('handles short lists', () => {
  assert.deepEqual(shuffled([]), []);
  assert.deepEqual(shuffled([{ id: 'x' }]), [{ id: 'x' }]);
});
