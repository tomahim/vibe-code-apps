import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=new URL('../src/apps/story-shelf/',import.meta.url);
const manifest=JSON.parse(fs.readFileSync(new URL('manifest.json',base)));
test('four unique books across three shelves, each with five complete Markdown pages and six local pictures',()=>{
  assert.equal(manifest.length,4);assert.equal(new Set(manifest.map(b=>b.slug)).size,4);
  assert.deepEqual([...new Set(manifest.map(b=>b.category))],['History','Nature','Mountains']);
  for(const b of manifest){
    const md=fs.readFileSync(new URL(`books/${b.slug}.md`,base),'utf8');
    const pages=md.trim().split('\n---page---\n');assert.equal(pages.length,5,b.slug);
    for(const p of pages){assert.match(p,/^# .+/);assert.match(p,/\n\n> .+/);assert.ok(p.split(/\s+/).length>=65,`${b.slug}: short page`);}
    for(let i=0;i<6;i++)assert.ok(fs.statSync(new URL(`images/${b.art}-${i}.webp`,base)).size>1000);
  }
});
test('all content is local, history fiction labeled, educational sources visible',()=>{
  const jsx=fs.readFileSync(new URL('StoryShelf.jsx',base),'utf8');
  assert.match(jsx,/Historical fiction|historical fiction/);assert.match(jsx,/AI-generated/);
  for(const domain of ['nhm.ac.uk','usgs.gov','rhs.org.uk','dnb.de'])assert.ok(jsx.includes(domain));
  assert.doesNotMatch(jsx,/fetch\(/);
});
