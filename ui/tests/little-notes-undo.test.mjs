import test from 'node:test';
import assert from 'node:assert/strict';
import { planUndo } from '../src/apps/little-notes/undo.js';

test('categorizing from the Inbox restores the Inbox on undo', () => {
  // The API removed Inbox when the category was added.
  assert.deepEqual(planUndo(['inbox'], ['to-implement']), [
    { slug: 'to-implement', enabled: false },
    { slug: 'inbox', enabled: true },
  ]);
});

test('archiving from the Inbox undoes back to the Inbox', () => {
  assert.deepEqual(planUndo(['inbox'], ['archive']), [
    { slug: 'archive', enabled: false },
    { slug: 'inbox', enabled: true },
  ]);
});

test('"Back to inbox" undoes back to the Archive', () => {
  assert.deepEqual(planUndo(['archive'], ['inbox']), [
    { slug: 'inbox', enabled: false },
    { slug: 'archive', enabled: true },
  ]);
});

test('undo keeps unrelated categories that never moved', () => {
  assert.deepEqual(planUndo(['inbox', 'favorite'], ['favorite', 'to-implement']), [
    { slug: 'to-implement', enabled: false },
    { slug: 'inbox', enabled: true },
  ]);
});

test('undo restores the state recorded before the move, even after later moves', () => {
  // The object moved Inbox -> To implement -> Archive; undo of the last move
  // restores the set captured before it (To implement), not the original.
  assert.deepEqual(planUndo(['to-implement'], ['archive']), [
    { slug: 'archive', enabled: false },
    { slug: 'to-implement', enabled: true },
  ]);
});

test('removals always come before additions so exclusive pairs stay exclusive', () => {
  const plan = planUndo(['archive', 'favorite'], ['inbox', 'to-implement']);
  assert.deepEqual(plan, [
    { slug: 'inbox', enabled: false },
    { slug: 'to-implement', enabled: false },
    { slug: 'archive', enabled: true },
    { slug: 'favorite', enabled: true },
  ]);
});

test('nothing to undo produces no steps', () => {
  assert.deepEqual(planUndo(['inbox'], ['inbox']), []);
  assert.deepEqual(planUndo(['favorite', 'to-implement'], ['to-implement', 'favorite']), []);
});
