// Pin the product rule on the frontend: lesson and learning-path completion
// mean every card read, independent of question results (Thomas, 2026-11-11;
// refs #465). Same mock as api/apps/learning/tests_completion_rule.py:
//
//   path P
//     lesson L1: 3 cards, questions q1a and q1b (pooled alternatives)
//     lesson L2: 2 cards, question q2
//
// The learner read all 5 cards. Question state never appears in these
// payloads on purpose: completion must not depend on it.
//
// garden.js keeps lessonFinished module-private and LittleGrains.jsx tracks
// fullyReadAtOpen inline, so those two checks extract the exact shipped
// expression from the source and evaluate it against the mock. If a refactor
// moves either expression (the #465 fix should), the extraction fails loudly
// and the test switches to a plain import of the shared helper.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { finishedPaths, newlyCompletedPaths, pathFinished } from '../src/apps/little-grains/path-completion.js';

// The garden's per-lesson rule, evaluated from the shipped source.
const gardenSource = readFileSync(new URL('../src/apps/little-grains/garden/garden.js', import.meta.url), 'utf8');
const lessonFinishedMatch = gardenSource.match(/const lessonFinished = (\(progress\) => [^;]+);/);
assert.ok(lessonFinishedMatch, 'lessonFinished no longer found inline in garden.js: import the shared helper here instead');
const lessonFinished = eval(lessonFinishedMatch[1]);

// The reader's "was already fully read when opened" snapshot, from the shipped source.
const readerSource = readFileSync(new URL('../src/apps/little-grains/LittleGrains.jsx', import.meta.url), 'utf8');
const fullyReadMatch = readerSource.match(/fullyReadAtOpen\.current = (result\.cards[^;]+);/);
assert.ok(fullyReadMatch, 'fullyReadAtOpen computation no longer found inline in LittleGrains.jsx: import the shared helper here instead');
const fullyReadAtOpen = new Function('result', `return (${fullyReadMatch[1]});`);

// Shared mock: lesson payloads carry card reads only, never question state.
const lesson = (id, read, total) => ({ id, progress: { cards_completed: read, cards_total: total, started: read > 0 } });
const card = (read) => ({ id: Math.random().toString(36), completed_at: read ? '2026-11-11T09:00:00Z' : null });

test('the celebration helper finishes a path once every card is read', () => {
  // All 5 cards of L1+L2 read, questions untouched.
  assert.equal(pathFinished({ id: 'p', progress: { cards_completed: 5, cards_total: 5, lessons_total: 2 } }), true);
  assert.equal(pathFinished({ id: 'p', progress: { cards_completed: 4, cards_total: 5, lessons_total: 2 } }), false);
});

test('the celebration fires on the read-transition, questions never consulted', () => {
  const garden = (paths) => ({ themes: [{ learning_paths: paths }] });
  const before = garden([{ id: 'p', title: 'Path', progress: { cards_completed: 4, cards_total: 5, lessons_total: 2 } }]);
  const after = garden([{ id: 'p', title: 'Path', progress: { cards_completed: 5, cards_total: 5, lessons_total: 2 } }]);
  assert.deepEqual(newlyCompletedPaths(before, after), [{ id: 'p', title: 'Path', lessons: 2 }]);
  assert.deepEqual(finishedPaths(after), [{ id: 'p', title: 'Path', lessons: 2 }]);
});

test('the garden lesson rule finishes a lesson once every card is read', () => {
  // Same mock, per-lesson progress exactly as the API ships it. A strict
  // server "completed: false" flag (questions open) must not hold a fully
  // read lesson back.
  assert.equal(lessonFinished(lesson('l1', 3, 3).progress), true);
  assert.equal(lessonFinished({ ...lesson('l1', 3, 3).progress, completed: false }), true);
  assert.equal(lessonFinished(lesson('l1', 2, 3).progress), false);
  assert.equal(lessonFinished({ cards_completed: 0, cards_total: 0 }), false);
  assert.equal(lessonFinished(undefined), false);
});

test('the reader snapshot finishes a lesson once every card is read', () => {
  assert.equal(fullyReadAtOpen({ cards: [card(true), card(true), card(true)] }), true);
  assert.equal(fullyReadAtOpen({ cards: [card(true), card(false), card(true)] }), false);
  assert.equal(fullyReadAtOpen({ cards: [] }), false);
});

test('characterization: a visible empty lesson splits celebration from the rest', () => {
  // The intended empty-lesson rule is UNRESOLVED (#465). This pins today's
  // split; it does not endorse it. Backend half: EmptyLessonCharacterizationTests.
  // Path with L1 (3 cards, all read) + a visible zero-card lesson:
  // the celebration aggregates cards (3/3) and says finished...
  const celebrated = pathFinished({ id: 'p', progress: { cards_completed: 3, cards_total: 3, lessons_total: 2 } });
  // ...while the garden's per-lesson rule says the empty lesson is not finished...
  const perLessonDone = [lesson('l1', 3, 3), lesson('empty', 0, 0)].every((l) => lessonFinished(l.progress));
  // ...so the tree celebrates a path the lesson list still shows unfinished.
  assert.equal(celebrated, true);
  assert.equal(perLessonDone, false);
});
