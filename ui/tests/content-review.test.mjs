import test from 'node:test';
import assert from 'node:assert/strict';
import { bodyLines, diffLines, inlineSegments, unitSections } from '../src/apps/content-review/review-utils.js';

test('inlineSegments splits bold markers', () => {
  assert.deepEqual(inlineSegments("**Let's go.** Slowly"), [
    { bold: true, text: "Let's go." },
    { bold: false, text: ' Slowly' },
  ]);
  assert.deepEqual(inlineSegments('plain'), [{ bold: false, text: 'plain' }]);
});

test('bodyLines classifies quotes, blanks and text', () => {
  const lines = bodyLines('**Hello.**\n\n> *Bonjour.*\nplain');
  assert.equal(lines[0].type, 'text');
  assert.equal(lines[1].type, 'blank');
  assert.equal(lines[2].type, 'quote');
  assert.deepEqual(lines[2].segments, [{ bold: false, text: 'Bonjour.' }]);
  assert.equal(lines[3].type, 'text');
});

test('diffLines classifies patch lines', () => {
  const lines = diffLines('@@ -1 +1 @@\n-old\n+new\n same');
  assert.deepEqual(lines.map((l) => l.type), ['hunk', 'del', 'add', 'context']);
  assert.deepEqual(diffLines(''), []);
});

test('unitSections groups units by breadcrumb chain', () => {
  const units = [
    { key: 'a', breadcrumbs: ['Language', 'English'], title: 'English' },
    { key: 'b', breadcrumbs: ['Language', 'English', 'Bath time'], title: 'Card 1' },
    { key: 'c', breadcrumbs: ['Language', 'English', 'Bath time'], title: 'Card 2' },
  ];
  const sections = unitSections(units);
  assert.equal(sections.length, 2);
  assert.equal(sections[0].title, 'English');
  assert.equal(sections[1].title, 'Bath time');
  assert.equal(sections[1].depth, 3);
  assert.deepEqual(sections[1].units.map((u) => u.key), ['b', 'c']);
});
