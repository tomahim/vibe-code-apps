// Pin the product rule on the frontend: lesson and learning-path completion
// mean every card read, independent of question results (Thomas, 2026-11-11;
// refs #465) - and the frontend never computes that rule itself: it shows the
// server-owned progress.completed flag and never re-derives completion from
// card counts or timestamps (Thomas, 2026-11-11). Same mock as
// api/apps/learning/tests_completion_rule.py:
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
// moves either expression, the extraction fails loudly and the test switches
// to a plain import of the shared helper.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { finishedPaths, newlyCompletedPaths, pathFinished } from '../src/apps/little-grains/path-completion.js';

// The garden's per-lesson rule, evaluated from the shipped source.
const gardenSource = readFileSync(new URL('../src/apps/little-grains/garden/garden.js', import.meta.url), 'utf8');
const lessonFinishedMatch = gardenSource.match(/const lessonFinished = (\(progress\) => [^;]+);/);
assert.ok(lessonFinishedMatch, 'lessonFinished no longer found inline in garden.js: import the shared helper here instead');
const lessonFinished = eval(lessonFinishedMatch[1]);

// The reader's "was already complete when opened" snapshot, from the shipped source.
const readerSource = readFileSync(new URL('../src/apps/little-grains/LittleGrains.jsx', import.meta.url), 'utf8');
const fullyReadMatch = readerSource.match(/fullyReadAtOpen\.current = ([^;]+);/);
assert.ok(fullyReadMatch, 'fullyReadAtOpen computation no longer found inline in LittleGrains.jsx: import the shared helper here instead');
const fullyReadAtOpen = new Function('result', `return (${fullyReadMatch[1]});`);

// Shared mock: lesson payloads carry card reads only, never question state.
const lesson = (id, read, total) => ({ id, progress: { cards_completed: read, cards_total: total, started: read > 0 } });
const card = (read) => ({ id: Math.random().toString(36), completed_at: read ? '2026-11-11T09:00:00Z' : null });

test('the celebration helper follows the server completion flag', () => {
  // All 5 cards of L1+L2 read, questions untouched: the server says completed.
  assert.equal(pathFinished({ id: 'p', progress: { cards_completed: 5, cards_total: 5, lessons_total: 2, completed: true } }), true);
  assert.equal(pathFinished({ id: 'p', progress: { cards_completed: 4, cards_total: 5, lessons_total: 2, completed: false } }), false);
  // Anti-regression: client-side card counting must never override the server
  // (e.g. a visible empty lesson, #465) - and the flag alone suffices.
  assert.equal(pathFinished({ id: 'p', progress: { cards_completed: 5, cards_total: 5, lessons_total: 2, completed: false } }), false);
  assert.equal(pathFinished({ id: 'p', progress: { cards_completed: 0, cards_total: 5, lessons_total: 2, completed: true } }), true);
});

test('the celebration fires on the server-flag transition, questions never consulted', () => {
  const garden = (paths) => ({ themes: [{ learning_paths: paths }] });
  const before = garden([{ id: 'p', title: 'Path', progress: { cards_completed: 4, cards_total: 5, lessons_total: 2, completed: false } }]);
  const after = garden([{ id: 'p', title: 'Path', progress: { cards_completed: 5, cards_total: 5, lessons_total: 2, completed: true } }]);
  assert.deepEqual(newlyCompletedPaths(before, after), [{ id: 'p', title: 'Path', lessons: 2 }]);
  assert.deepEqual(finishedPaths(after), [{ id: 'p', title: 'Path', lessons: 2 }]);
});

test('the garden lesson rule shows the server completion flag', () => {
  // Same mock, per-lesson progress exactly as the API ships it. The flag
  // decides; card counts without it must not finish a lesson (#465).
  assert.equal(lessonFinished({ ...lesson('l1', 3, 3).progress, completed: true }), true);
  assert.equal(lessonFinished({ ...lesson('l1', 3, 3).progress, completed: false }), false);
  assert.equal(lessonFinished({ ...lesson('l1', 2, 3).progress, completed: false }), false);
  assert.equal(lessonFinished({ cards_completed: 0, cards_total: 0, completed: false }), false);
  assert.equal(lessonFinished(undefined), false);
});

test('the reader snapshot shows the server completion flag', () => {
  assert.equal(fullyReadAtOpen({ lesson: { progress: { completed: true } }, cards: [card(true)] }), true);
  assert.equal(fullyReadAtOpen({ lesson: { progress: { completed: false } }, cards: [card(true)] }), false);
  // Anti-regression: cards that all look read cannot finish a lesson the
  // server calls incomplete.
  assert.equal(fullyReadAtOpen({ lesson: { progress: { completed: false } }, cards: [card(true), card(true), card(true)] }), false);
});

test('characterization: a visible empty lesson blocks completion everywhere', () => {
  // The intended empty-lesson rule is UNRESOLVED (#465): the backend treats a
  // zero-card lesson as never fully read. Now that the frontend shows the
  // server flag instead of its own aggregate, the old celebration split is
  // gone: a path with L1 (3 cards, all read) + a visible zero-card lesson is
  // not finished anywhere. This pins the consistent behavior without
  // endorsing the policy; changing it is a backend-only decision
  // (lesson_fully_read). Backend half: EmptyLessonCharacterizationTests.
  const celebrated = pathFinished({ id: 'p', progress: { cards_completed: 3, cards_total: 3, lessons_total: 2, completed: false } });
  const perLessonDone = [{ ...lesson('l1', 3, 3).progress, completed: true }, { cards_completed: 0, cards_total: 0, completed: false }].every((p) => lessonFinished(p));
  assert.equal(celebrated, false);
  assert.equal(perLessonDone, false);
});
