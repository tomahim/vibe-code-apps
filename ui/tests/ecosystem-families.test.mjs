import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {THEMES} from '../src/apps/ecosystem-lowpoly/shape-data.js';
import {FAMILY_GROUPS,FAMILY_CENTERS,FAMILY_WORLD,familyStyle,familyOf} from '../src/apps/ecosystem-lowpoly/family-data.js';

test('five proposed families of four themes cover the whole catalog exactly once',()=>{
 assert.deepEqual(FAMILY_GROUPS.map(g=>g.id),['forest','prairie','mountains','oceans','desert']);
 FAMILY_GROUPS.forEach(g=>{assert.equal(g.themes.length,4,g.id);g.themes.forEach(ti=>assert.ok(Number.isInteger(ti)&&ti>=0&&ti<THEMES.length));});
 assert.deepEqual(FAMILY_GROUPS.flatMap(g=>g.themes).slice().sort((a,b)=>a-b),[...Array(THEMES.length).keys()]);
 FAMILY_GROUPS.forEach((g,k)=>g.themes.forEach(ti=>assert.equal(familyOf(ti),k)));
});

test('every family hex gets a finite center beside its siblings',()=>{
 assert.equal(FAMILY_CENTERS.length,THEMES.length);
 FAMILY_CENTERS.forEach((c,ti)=>{assert.ok(c&&Number.isFinite(c[0])&&Number.isFinite(c[1]),`center ${ti}`);});
 // Hexes inside a family keep visible breathing room and never overlap (bigger slabs, wider slots).
 FAMILY_GROUPS.forEach(g=>{
  const pts=g.themes.map(ti=>FAMILY_CENTERS[ti]);
  pts.forEach((a,i)=>pts.forEach((b,j)=>{if(j>i){const d=Math.hypot(a[0]-b[0],a[1]-b[1]);assert.ok(d>2.5&&d<6.6,`${g.id} spacing ${d}`);}}));
 });
});

test('every theme has art direction whose plants exist in the garden species set',async()=>{
 const src=await readFile(new URL('../scripts/artifacts/little-grains/plants.js',import.meta.url),'utf8');
 const known=new Set([...src.matchAll(/mk\('([a-zA-Z]+)'/g)].map(m=>m[1]));
 THEMES.forEach((t,ti)=>{
  const s=familyStyle(ti);
  assert.ok(s,`style for ${t.id}`);
  const names=[...(s.mix?.sig||[]),...(s.mix?.mid||[]),...(s.mix?.low||[]),s.mix?.lesson,s.mix?.flower,s.landmark?.name].filter(Boolean);
  assert.ok(names.length>4,`${t.id} mix`);
  names.forEach(n=>assert.ok(known.has(n),`${t.id} unknown plant ${n}`));
  assert.ok(s.landmark&&Number.isFinite(s.landmark.s),`${t.id} landmark`);
 });
});

test('the family world labels its groups as families and keeps family density ordering',()=>{
 assert.equal(FAMILY_WORLD.noun,'family');
 assert.equal(FAMILY_WORLD.groups,FAMILY_GROUPS);
 assert.equal(FAMILY_WORLD.centers,FAMILY_CENTERS);
 const mul=id=>{const m=FAMILY_GROUPS.find(g=>g.id===id).themes.map(ti=>familyStyle(ti).plantMul??1);return m.reduce((a,x)=>a+x,0)/m.length;};
 assert.ok(mul('forest')>mul('prairie'),'forest is the dense family');
 assert.ok(mul('prairie')>mul('desert'),'desert is the sparse family');
});
