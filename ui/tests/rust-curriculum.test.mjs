import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { checkRun, diagnosticLocation, exercisesFor, prepareRun } from '../src/apps/rust-learning-path/checks.js';
const root = new URL('../src/apps/rust-learning-path/lessons/', import.meta.url);
const chapters = readdirSync(root).filter((name) => name.endsWith('.json')).map((name) => JSON.parse(readFileSync(new URL(name, root), 'utf8')));

test('Rust curriculum has stable IDs, all check types, and complete exercises', () => {
  const ids = new Set(), types = new Set(), orders = new Set();
  for (const chapter of chapters) {
    assert.ok(chapter.id && chapter.title && chapter.subtitle);
    assert.ok(!orders.has(chapter.order)); orders.add(chapter.order);
    for (const lesson of chapter.lessons) {
      assert.ok(!ids.has(lesson.id)); ids.add(lesson.id);
      assert.equal(lesson.edition, '2021');
      assert.ok(lesson.minutes >= 2 && lesson.minutes <= 9);
      assert.ok(lesson.concept && lesson.body.every((item) => typeof item === 'string' && item));
      assert.ok(lesson.reference.url.startsWith('https://doc.rust-lang.org/'));
      for (const exercise of exercisesFor(lesson)) {
        for (const field of ['title', 'task', 'hint', 'code', 'solution']) assert.ok(typeof exercise[field] === 'string' && exercise[field], `${lesson.id}.${field}`);
        assert.notEqual(exercise.code, exercise.solution);
        types.add(exercise.check.type);
        if (exercise.check.type === 'tests') assert.match(exercise.check.tests, /#\[test\]/);
        else assert.ok(exercise.check.expected);
        if (exercise.check.type === 'compile_error') assert.match(exercise.check.expected, /^E\d{4}$/);
      }
    }
  }
  assert.ok(ids.size >= 19);
  for (const id of ['functions', 'hello-world', 'move-semantics', 'variables-immutable']) assert.ok(ids.has(id));
  assert.deepEqual([...types].sort(), ['compile_error', 'stdout', 'tests']);
});

test('checks require successful execution, exact output, actual compiler errors and passing tests', () => {
  const output = { success: true, stdout: ' 10\n', stderr: '' };
  const check = { type: 'stdout', expected: '10', requires: ['let mut'] };
  assert.equal(checkRun(check, output, 'let mut x = 10;'), true);
  assert.equal(checkRun(check, output, '// let mut\nprintln!("let mut");'), false);
  assert.equal(checkRun(check, { ...output, success: false }, 'let mut x'), false);
  assert.equal(checkRun(check, { ...output, stdout: '100' }, 'let mut x'), false);
  assert.equal(checkRun({ type: 'compile_error', expected: 'E0382' }, { success: false, stdout: '', stderr: 'error[E0382]: moved value' }), true);
  assert.equal(checkRun({ type: 'compile_error', expected: 'E0382' }, { success: true, stdout: 'E0382', stderr: '' }), false);
  assert.equal(checkRun({ type: 'compile_error', expected: 'E0382' }, { success: false, stdout: '', stderr: 'error[E0502]' }), false);
  assert.equal(checkRun({ type: 'tests' }, { success: true, stdout: 'test result: ok. 3 passed; 0 failed;', stderr: '' }), true);
  assert.equal(checkRun({ type: 'tests' }, { success: true, stdout: 'test result: ok. 0 passed; 0 failed;', stderr: '' }), false);
});

test('test harness is appended outside the editable source, and diagnostic links stay within it', () => {
  assert.deepEqual(prepareRun({ check: { type: 'tests', tests: '#[test] fn example() {}' } }, 'fn main() {}'), { code: 'fn main() {}\n\n#[test] fn example() {}', mode: 'test' });
  assert.deepEqual(diagnosticLocation(' --> src/main.rs:4:12', 7), { line: 4, column: 12 });
  assert.equal(diagnosticLocation(' --> src/main.rs:20:12', 7), null);
});


test('exercise sequencing keeps diagnostics and all additional steps in order', () => {
  const diagnostic = { title: 'Observe' }, second = { title: 'Refine' }, third = { title: 'Apply' };
  const lesson = { title: 'Build', diagnostic, steps: [second, third] };
  assert.deepEqual(exercisesFor(lesson), [diagnostic, lesson, second, third]);
  assert.deepEqual(exercisesFor({ title: 'Single' }), [{ title: 'Single' }]);
});
