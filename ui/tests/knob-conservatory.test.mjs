import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  CONTROLS, CONTROL_BY_ID, SECTIONS, defaultPatch, normalizePatch, normalizedValue,
} from "../src/apps/knob-conservatory/synth/params.js";
import { scoreMatch, closenessLabel } from "../src/apps/knob-conservatory/synth/matching.js";
import { readProgress, writeProgress, STORAGE_KEY } from "../src/apps/knob-conservatory/progress.js";

const here = dirname(fileURLToPath(import.meta.url));
const lessonsDir = join(here, "../src/apps/knob-conservatory/lessons");
const chapters = readdirSync(lessonsDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(readFileSync(join(lessonsDir, file), "utf8")))
  .sort((a, b) => a.order - b.order);
const lessons = chapters.flatMap((chapter) => chapter.lessons.map((lesson) => ({ ...lesson, chapterId: chapter.id })));

test("control registry is coherent", () => {
  const ids = CONTROLS.map((control) => control.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate control ids");
  for (const control of CONTROLS) {
    if (control.kind === "knob") {
      assert.ok(control.min < control.max, `${control.id} range`);
      assert.ok(control.default >= control.min && control.default <= control.max, `${control.id} default in range`);
    } else {
      assert.ok(control.choices.includes(control.default), `${control.id} default is a choice`);
    }
  }
  assert.ok(SECTIONS.length >= 6, "the panel reads like a real monosynth");
});

test("normalizePatch clamps, coerces and drops unknown keys", () => {
  const patch = normalizePatch({ cutoff: 999999, resonance: -1, osc1_wave: "noise", bogus: 5 });
  const control = CONTROL_BY_ID.get("cutoff");
  assert.equal(patch.cutoff, control.max);
  assert.equal(patch.resonance, CONTROL_BY_ID.get("resonance").min);
  assert.equal(patch.osc1_wave, "sawtooth");
  assert.equal(patch.bogus, undefined);
  assert.deepEqual(Object.keys(patch).sort(), Object.keys(defaultPatch()).sort());
});

test("normalizedValue handles log scales", () => {
  const cutoff = CONTROL_BY_ID.get("cutoff");
  assert.equal(normalizedValue(cutoff, cutoff.min), 0);
  assert.equal(normalizedValue(cutoff, cutoff.max), 1);
  const mid = normalizedValue(cutoff, Math.sqrt(cutoff.min * cutoff.max));
  assert.ok(Math.abs(mid - 0.5) < 1e-9, "log midpoint sits at 0.5");
});

test("every lesson is valid and the path teaches one step at a time", () => {
  const seen = new Set();
  for (const lesson of lessons) {
    assert.ok(lesson.id && !seen.has(lesson.id), `unique lesson id ${lesson.id}`);
    seen.add(lesson.id);
    assert.ok(lesson.unlocks.length >= 1, `${lesson.id} unlocks something`);
    for (const id of lesson.unlocks) assert.ok(CONTROL_BY_ID.has(id), `${lesson.id} unlocks unknown control ${id}`);
    const goalParams = Object.keys(lesson.goal.params);
    assert.ok(goalParams.length >= 1, `${lesson.id} has a sound goal`);
    for (const id of goalParams) {
      assert.ok(lesson.unlocks.includes(id), `${lesson.id} goal ${id} is a control it just unlocked`);
    }
    // The base patch plus goal targets must survive normalization unchanged
    // for goal params (targets inside range).
    const merged = normalizePatch({ ...lesson.base_patch, ...lesson.goal.params });
    for (const [id, value] of Object.entries(lesson.goal.params)) {
      assert.equal(merged[id], value, `${lesson.id} target ${id} is reachable`);
    }
    assert.ok(lesson.body.length >= 1 && lesson.goal.hint, `${lesson.id} has teaching text and a hint`);
  }
  // The whole panel stays within the registered controls.
  const allUnlocks = new Set(lessons.flatMap((lesson) => lesson.unlocks));
  for (const id of allUnlocks) assert.ok(CONTROL_BY_ID.has(id));
});

test("scoreMatch passes inside tolerance and fails outside", () => {
  const goal = { cutoff: 4500 };
  const patch = { ...defaultPatch(), cutoff: 4500 };
  const pass = scoreMatch(goal, patch);
  assert.equal(pass.passed, true);
  assert.equal(pass.score, 100);

  const far = scoreMatch(goal, { ...defaultPatch(), cutoff: 60 });
  assert.equal(far.passed, false);
  assert.ok(far.score < 60);
  assert.equal(far.checks[0].direction, "up");

  // No direction leak until the reveal: closeness labels never say up/down.
  assert.equal(closenessLabel(far.checks[0]), "far");
  const near = scoreMatch(goal, { ...defaultPatch(), cutoff: 4300 });
  assert.equal(near.passed, true, "within tolerance counts");
});

test("scoreMatch treats selectors as exact matches", () => {
  const goal = { osc1_wave: "square" };
  assert.equal(scoreMatch(goal, { ...defaultPatch(), osc1_wave: "square" }).passed, true);
  assert.equal(scoreMatch(goal, { ...defaultPatch(), osc1_wave: "sawtooth" }).passed, false);
});

test("progress storage is migration-safe", () => {
  const store = new Map();
  const storage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
  };
  assert.deepEqual(readProgress(storage, lessons), { currentLesson: null, passed: {}, tries: {} });
  const progress = { currentLesson: lessons[0].id, passed: { [lessons[0].id]: { score: 92 }, ghost: { score: 10 } }, tries: { [lessons[0].id]: 2, ghost: 1 } };
  writeProgress(storage, progress);
  const read = readProgress(storage, lessons);
  assert.equal(read.currentLesson, lessons[0].id);
  assert.deepEqual(Object.keys(read.passed), [lessons[0].id], "unknown lesson ids are dropped");
  assert.deepEqual(read.tries, { [lessons[0].id]: 2 });
  storage.setItem(STORAGE_KEY, "not json");
  assert.deepEqual(readProgress(storage, lessons), { currentLesson: null, passed: {}, tries: {} });
});
