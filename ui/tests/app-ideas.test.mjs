import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { parseFrontmatter } from '../src/apps/app-ideas/frontmatter.js';

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
    assert.ok(Array.isArray(meta.domains) && meta.domains.length, `${file} missing domains`);
    for (const tag of meta.domains) assert.ok(DOMAIN_TAGS.has(tag), `${file} unknown domain ${tag}`);
    assert.match(meta.date, /^\d{4}-\d{2}-\d{2}$/, `${file} bad date`);
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
