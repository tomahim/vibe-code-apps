import test from "node:test";
import assert from "node:assert/strict";
import { buildComparisons } from "../src/apps/garmin-stats/comparisons.js";

const synthetic = {
  totals: { km: 1000, hours: 100, elevation_m: 10000, steps: 1_000_000, kcal: 57_000, runs: 100 },
  records: { marathon_plus_count: 1 },
  span_days: 730,
};

function cards() {
  return buildComparisons(synthetic).flatMap((group) => group.cards);
}

test("pizza slice card divides recorded kcal by 285 kcal per slice", () => {
  const card = cards().find((c) => c.label.startsWith("pizza slices"));
  assert.equal(card.value, 57_000 / 285);
  assert.match(card.caption, /285 kcal/);
  assert.match(card.source, /USDA/);
});

test("meringue card uses nest + 2 tbsp double cream and states it", () => {
  const card = cards().find((c) => c.label.startsWith("meringues"));
  assert.equal(card.value, 57_000 / (53 + 140));
  assert.match(card.caption, /53 kcal/);
  assert.match(card.caption, /140 kcal/);
});

test("food cards are zero, not NaN, without calorie data", () => {
  const empty = buildComparisons({ ...synthetic, totals: { ...synthetic.totals, kcal: undefined } })
    .flatMap((g) => g.cards)
    .filter((c) => /pizza|meringue/.test(c.label));
  assert.equal(empty.length, 2);
  for (const c of empty) assert.equal(c.value, 0);
});

test("the Parisian step benchmark comparison stays removed", () => {
  // Run-only steps vs an all-day benchmark read as like-for-like; replaced
  // by the top-5 step days section fed by the API's top_step_days.
  assert.ok(!cards().some((c) => /Parisian/.test(c.label)));
  assert.ok(!cards().some((c) => /Parisian/.test(c.caption || "")));
});
