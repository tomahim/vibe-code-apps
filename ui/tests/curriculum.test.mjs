import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { readProgress, writeProgress, STORAGE_KEY } from '../src/apps/threejs-learning-path/progress.js';

const root = new URL('../src/apps/threejs-learning-path/lessons/', import.meta.url);
const files = (await readdir(root)).filter((file) => file.endsWith('.json'));
const chapters = await Promise.all(files.map(async (file) => JSON.parse(await readFile(new URL(file, root), 'utf8'))));
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

test('every static lesson is discoverable, uniquely addressable, atomic, and runnable', () => {
  const ids = new Set(), chapterIds = new Set(), orders = new Set();
  assert.ok(chapters.length >= 12);
  for (const chapter of chapters) {
    assert.ok(!chapterIds.has(chapter.id), `Duplicate chapter ${chapter.id}`);
    assert.ok(!orders.has(chapter.order), `Duplicate chapter order ${chapter.order}`);
    chapterIds.add(chapter.id); orders.add(chapter.order);
    assert.ok(chapter.title && chapter.subtitle && chapter.lessons.length);
    for (const lesson of chapter.lessons) {
      assert.match(lesson.id, /^[a-z0-9-]+$/);
      assert.ok(!ids.has(lesson.id), `Duplicate lesson ${lesson.id}`); ids.add(lesson.id);
      assert.ok(lesson.minutes >= 1 && lesson.minutes <= 3, lesson.id);
      for (const key of ['title', 'concept', 'task', 'hint', 'code', 'solution', 'check']) assert.ok(typeof lesson[key] === 'string' && lesson[key].length, `${lesson.id}.${key}`);
      assert.ok(lesson.body.length > 0 && lesson.body.every((p) => typeof p === 'string' && p.length));
      assert.notEqual(lesson.code, lesson.solution, `Unchanged solution for ${lesson.id}`);
      assert.ok(lesson.quiz.options.length >= 2 && lesson.quiz.answer >= 0 && lesson.quiz.answer < lesson.quiz.options.length);
      assert.ok(lesson.quiz.question && lesson.quiz.explanation);
      assert.ok(lesson.reference.url.startsWith('https://threejs.org/'));
      for (const code of [lesson.code, lesson.solution]) assert.doesNotThrow(() => new AsyncFunction(`${code}\n;return () => Boolean(${lesson.check});`), lesson.id);
    }
  }
  assert.ok(ids.size >= 60);
});

test('saved progress survives additions while removing unknown IDs and invalid data', () => {
  const storage = { getItem: () => JSON.stringify({ current: 'gone', completed: ['one', 'gone', 'one'], drafts: { one: 'my draft', gone: 'old', two: 123 }, answers: { one: 1, two: 'bad' } }) };
  assert.deepEqual(readProgress(storage, ['one', 'two', 'new']), { current: 'one', completed: ['one'], drafts: { one: 'my draft' }, answers: { one: 1 } });
});
test('corrupt or inaccessible storage does not prevent opening a lesson', () => {
  for (const storage of [{ getItem: () => '{broken' }, { getItem: () => { throw new Error('blocked'); } }]) {
    assert.deepEqual(readProgress(storage, ['one']), { current: 'one', completed: [], drafts: {}, answers: {} });
  }
});
test('quota failures are reported and valid progress round-trips', () => {
  assert.equal(writeProgress({ setItem: () => { throw new Error('quota'); } }, {}), false);
  const values = new Map();
  const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
  const progress = { current: 'two', completed: ['one'], drafts: { two: 'scene.add(mesh)' }, answers: { one: 0 } };
  assert.equal(writeProgress(storage, progress), true);
  assert.ok(values.has(STORAGE_KEY));
  assert.deepEqual(readProgress(storage, ['one', 'two']), progress);
});
