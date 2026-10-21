import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { sortNewestFirst, createdAt } from '../src/apps/app-ideas/sort.js';
import { parseFrontmatter } from '../src/apps/app-ideas/frontmatter.js';
import { sortForView, validRating, viewOf } from '../src/apps/app-ideas/rating.js';

const DOMAIN_TAGS = new Set(['PROD', 'SPORT', 'HIST', '3D', 'GAME', 'LEARN', 'WRITE', 'MEDIA']);

const root = new URL('../src/apps/app-ideas/ideas/', import.meta.url);
const files = (await readdir(root)).filter((file) => file.endsWith('.md'));
const ideas = await Promise.all(files.map(async (file) => ({ file, ...(parseFrontmatter(await readFile(new URL(file, root), 'utf8'))) })));

test('every idea file parses with the required frontmatter fields', () => {
  assert.ok(ideas.length > 0, 'no idea files found');
  const names = new Set();
  for (const { file, meta, body } of ideas) {
    assert.ok(typeof meta.name === 'string' && meta.name.length, `${file} missing name`);
    assert.ok(typeof meta.tagline === 'string' && meta.tagline.length, `${file} missing tagline`);
    assert.ok(typeof meta.pitch === 'string' && meta.pitch.length, `${file} missing pitch`);
    assert.ok(!meta.pitch.includes('\n'), `${file} pitch must be one line`);
    assert.ok(Array.isArray(meta.domains) && meta.domains.length, `${file} missing domains`);
    for (const tag of meta.domains) assert.ok(DOMAIN_TAGS.has(tag), `${file} unknown domain ${tag}`);
    assert.match(meta.created, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, `${file} bad created datetime`);
    assert.ok(meta.rating === undefined || [1, 2, 3].includes(meta.rating), `${file} rating must be 1, 2 or 3`);
    assert.ok(!names.has(meta.name), `duplicate idea name ${meta.name}`);
    names.add(meta.name);
    assert.ok(body.length > 200, `${file} body looks truncated`);
  }
});

test('frontmatter parser handles scalars, lists and integers', () => {
  const { meta, body } = parseFrontmatter('---\nname: X\ndomains: [PROD, 3D]\nissue: 46\n---\n\nBody text\n');
  assert.deepEqual(meta, { name: 'X', domains: ['PROD', '3D'], issue: 46 });
  assert.equal(body, 'Body text');
});

test('ideas sort newest first by creation datetime, ', () => {
  const list = [
    { slug: 'a', created: '2026-10-20T07:00:00Z' },
    { slug: 'b', created: '2026-10-20T09:00:00Z' },
    { slug: 'c', created: '2026-10-21T00:00:00Z' },
    { slug: 'd', created: '2026-10-19T23:59:59Z' },
  ];
  assert.deepEqual(sortNewestFirst(list).map((i) => i.slug), ['c', 'b', 'a', 'd']);
  assert.equal(createdAt({ created: 'nope' }), 0);
});

test('rating decides the view: none = inbox, 1 = archive, 2-3 = promising', () => {
  assert.deepEqual([undefined, 0, 4, 'x', 1, 2, 3].map(viewOf), ['inbox', 'inbox', 'inbox', 'inbox', 'archive', 'promising', 'promising']);
  assert.equal(validRating(2), 2);
  assert.equal(validRating(7), 0);
});

test('promising sorts 3 stars, then 2, then newest first; other views newest first', () => {
  const list = [
    { slug: 'a', rating: 2, created: '2026-10-22T00:00:00Z' },
    { slug: 'b', rating: 3, created: '2026-10-19T00:00:00Z' },
    { slug: 'c', rating: 3, created: '2026-10-21T00:00:00Z' },
    { slug: 'd', rating: 2, created: '2026-10-20T00:00:00Z' },
  ];
  assert.deepEqual(sortForView(list, 'promising').map((i) => i.slug), ['c', 'b', 'a', 'd']);
  assert.deepEqual(sortForView(list, 'inbox').map((i) => i.slug), ['a', 'c', 'd', 'b']);
});

test('frontmatter parser reads the rating as a number', () => {
  assert.equal(parseFrontmatter('---\nname: X\nrating: 3\n---\nBody').meta.rating, 3);
});
