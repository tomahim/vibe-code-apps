// Compile only trusted, checked-in lesson fixtures. Never use this for user code.
import { mkdtempSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { checkRun, exercisesFor, prepareRun } from '../src/apps/rust-learning-path/checks.js';
const rustc = process.env.RUSTC || 'rustc';
const version = spawnSync(rustc, ['--version'], { encoding: 'utf8' });
assert.equal(version.status, 0, 'Install Rust 1.85.0 (or set RUSTC) to verify the curriculum.');
console.log(version.stdout.trim());
const root = new URL('../src/apps/rust-learning-path/lessons/', import.meta.url);
const directory = mkdtempSync(join(tmpdir(), 'rust-curriculum-'));
try {
  for (const file of readdirSync(root).filter((name) => name.endsWith('.json'))) {
    const chapter = JSON.parse(readFileSync(new URL(file, root), 'utf8'));
    for (const lesson of chapter.lessons) for (const [step, exercise] of exercisesFor(lesson).entries()) {
      for (const kind of ['code', 'solution']) {
        const source = exercise[kind], request = prepareRun(exercise, source);
        const filename = join(directory, 'main.rs'), binary = join(directory, 'lesson');
        writeFileSync(filename, request.code);
        const compiled = spawnSync(rustc, ['--edition', lesson.edition, ...(request.mode === 'test' ? ['--test'] : []), filename, '-o', binary], { encoding: 'utf8', timeout: 20000 });
        assert.ifError(compiled.error);
        let result = { success: compiled.status === 0, stdout: compiled.stdout, stderr: compiled.stderr };
        if (result.success) {
          const ran = spawnSync(binary, [], { encoding: 'utf8', timeout: 3000 });
          assert.ifError(ran.error);
          result = { success: ran.status === 0, stdout: ran.stdout, stderr: compiled.stderr + ran.stderr };
        }
        assert.equal(checkRun(exercise.check, result, source), kind === 'solution', `${lesson.id} step ${step + 1} ${kind}\n${result.stderr}\n${result.stdout}`);
        console.log(`✓ ${lesson.id} step ${step + 1}: ${kind}`);
      }
    }
  }
} finally { rmSync(directory, { recursive: true, force: true }); }
