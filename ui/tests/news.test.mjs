import test from 'node:test';
import assert from 'node:assert/strict';
import { dateLabel, safeLink, selectItems, uniqueItems } from '../src/apps/news/model.js';
const items = [
  { id: 'a', title: 'First', url: 'https://example.com/a', added: '2026-10-26', topics: ['AI'], author: 'A', source: 'One', why_it_matters: 'Coding' },
  { id: 'b', title: 'Second', url: 'https://example.com/b', added: '2026-10-25', topics: ['Science'], author: 'B', source: 'Two', why_it_matters: 'Research' },
];
test('inbox includes old and new unarchived entries, preserving server order', () => {
  assert.deepEqual(selectItems(items, { topic: '', query: '' }), items);
});
test('topic and text filtering compose', () => {
  assert.deepEqual(selectItems(items, { topic: 'AI', query: 'coding' }), [items[0]]);
  assert.equal(selectItems(items, { topic: 'Science', query: 'coding' }).length, 0);
});
test('unsafe links and unknown dates are honest', () => {
  assert.equal(safeLink('javascript:alert(1)'), null);
  assert.equal(safeLink('https://u:p@example.com'), null);
  assert.equal(dateLabel(null), 'Date unknown');
});
test('tracking aliases are deduplicated', () => {
  assert.equal(uniqueItems([...items, { ...items[0], id: 'c', url: 'https://example.com/a?utm_campaign=x#section' }]).length, 2);
});
