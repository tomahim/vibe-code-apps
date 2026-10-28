import test from 'node:test';
import assert from 'node:assert/strict';
import { bodyLines, canEdit, diffLines, draftFromUnit, editChanges, inlineSegments, mergeSavedUnit, treeRows, unitSections } from '../src/apps/content-review/review-utils.js';

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

const question = {
  kind: 'question',
  change: 'added',
  parse_error: null,
  question: {
    prompt: 'Q?',
    explanation: 'Because.',
    answer: 'b',
    options: ['a', 'b', 'c', 'd'].map((id) => ({ id, text: `opt ${id}` })),
  },
};
const lesson = { kind: 'lesson', change: 'modified', parse_error: null, title: 'T', description: 'D', body: 'B' };

test('canEdit allows content kinds that parse and are not removed', () => {
  assert.equal(canEdit(question), true);
  assert.equal(canEdit(lesson), true);
  assert.equal(canEdit({ ...lesson, change: 'removed' }), false);
  assert.equal(canEdit({ ...lesson, parse_error: 'bad' }), false);
  assert.equal(canEdit({ ...lesson, kind: 'theme' }), true);
  assert.equal(canEdit({ ...question, question: { ...question.question, options: [] } }), false);
});

test('editChanges sends only changed fields', () => {
  assert.deepEqual(editChanges(lesson, draftFromUnit(lesson)), {});
  assert.deepEqual(editChanges(lesson, { ...draftFromUnit(lesson), title: 'New', body: 'B ' }), { title: 'New' });
  const draft = draftFromUnit(question);
  assert.deepEqual(editChanges(question, draft), {});
  draft.options[2].text = 'changed';
  draft.answer = 'c';
  const changes = editChanges(question, draft);
  assert.deepEqual(Object.keys(changes).sort(), ['choices', 'correct_choice_id']);
  assert.equal(changes.choices.length, 4);
  assert.equal(changes.choices[0].id, 'a');
});

test('mergeSavedUnit keeps breadcrumbs and diff', () => {
  const merged = mergeSavedUnit({ ...lesson, breadcrumbs: ['x'], patch: 'p' }, { title: 'N', description: 'd', body: 'b', question: null, parse_error: null });
  assert.equal(merged.title, 'N');
  assert.deepEqual(merged.breadcrumbs, ['x']);
  assert.equal(merged.patch, 'p');
});


test('theme drafts and changes contain only the description', () => {
  const theme = { ...lesson, kind: 'theme' };
  assert.deepEqual(draftFromUnit(theme), { description: 'D' });
  assert.deepEqual(editChanges(theme, draftFromUnit(theme)), {});
  assert.deepEqual(editChanges(theme, { description: 'New summary' }), { description: 'New summary' });
  assert.equal(canEdit({ ...theme, change: 'removed' }), false);
  assert.equal(canEdit({ ...theme, parse_error: 'bad' }), false);
});

test('treeRows nests cards and questions under their lesson', () => {
  const crumbs = ['Language', 'English'];
  const units = [
    { key: 'l', kind: 'lesson', title: 'Bath', breadcrumbs: crumbs },
    { key: 'c', kind: 'card', title: 'Card 1', breadcrumbs: [...crumbs, 'Bath'] },
    { key: 'q', kind: 'question', title: 'Q', breadcrumbs: [...crumbs, 'Bath'] },
    { key: 'c2', kind: 'card', title: 'Card', breadcrumbs: [...crumbs, 'Sleep'] },
  ];
  const rows = treeRows(units);
  assert.deepEqual(rows.map((r) => [r.type, r.key, r.depth]), [
    ['heading', 'heading:Language', 0],
    ['heading', 'heading:Language\u0001English', 1],
    ['unit', 'l', 2],
    ['unit', 'c', 3],
    ['unit', 'q', 3],
    ['heading', 'heading:Language\u0001English\u0001Sleep', 2],
    ['unit', 'c2', 3],
  ]);
});
