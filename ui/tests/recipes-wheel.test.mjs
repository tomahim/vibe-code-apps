import test from 'node:test';
import assert from 'node:assert/strict';
import { ingredientNames, recipeQuery, wheelRecipes, landingRotation, STEP, TAU } from '../src/apps/recipes/wheel.js';
const recipes = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, title: `Recipe ${i + 1}` }));
test('filters normalize duplicates and encode the AND ingredient query', () => {
  assert.deepEqual(ingredientNames(' Tomato, PASTA ,tomato, ,'), ['tomato', 'pasta']);
  assert.equal(recipeQuery([]), '');
  assert.equal(new URLSearchParams(recipeQuery(['salt & pepper', 'pasta']).slice(1)).get('ingredients'), 'salt & pepper,pasta');
});
test('empty lists stay empty and small collections repeat to ten slots', () => {
  assert.deepEqual(wheelRecipes([]), []);
  for (let n = 1; n <= 10; n++) {
    const wheel = wheelRecipes(recipes.slice(0, n));
    assert.equal(wheel.length, 10);
    assert.equal(new Set(wheel.map((r) => r.id)).size, n);
    assert.ok(wheel.every((r) => r.id <= n));
  }
});
test('large collections use ten distinct candidates and always include the API winner', () => {
  const seen = new Set();
  for (const winner of recipes) {
    const wheel = wheelRecipes(recipes, winner);
    assert.equal(wheel.length, 10);
    assert.equal(new Set(wheel.map((r) => r.id)).size, 10);
    assert.ok(wheel.includes(winner));
    wheel.forEach((r) => seen.add(r.id));
  }
  assert.equal(seen.size, 30);
  const added = { id: 99, title: 'New recipe' };
  assert.ok(wheelRecipes(recipes, added).includes(added));
});
test('every target ends exactly under the right-hand pointer over repeated spins', () => {
  let angle = 0;
  for (let i = 0; i < 100; i++) {
    const index = i % 10;
    const next = landingRotation(angle, index);
    assert.ok(next - angle >= TAU * 5 - 1e-10);
    assert.ok(Math.abs(Math.sin(next + index * STEP)) < 1e-10);
    assert.ok(Math.cos(next + index * STEP) > .99999);
    angle = next;
  }
});
