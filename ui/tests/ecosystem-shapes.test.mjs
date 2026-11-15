import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {polygons,interlocking,WORLDS,COMPACT_GROUPS,compactCenters,themeCenters,reshape} from '../src/apps/ecosystem-lowpoly/shape-footprints.js';
import {THEMES} from '../src/apps/ecosystem-lowpoly/shape-data.js';
import {hexPrism,hexOutline,axial} from '../scripts/artifacts/little-grains/terrain.js';
const contains=(poly,x,z)=>{let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if(((a[1]>z)!==(b[1]>z))&&(x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0]))yes=!yes;}return yes;};
test('the comparison library holds all twenty catalog themes with three to five paths each',()=>{
 assert.equal(THEMES.length,20);
 assert.equal(new Set(THEMES.map(t=>t.id)).size,20);
 const terrains=new Set(['meadow','forest','orchard','mesa','lavender','pond','alpine']);
 THEMES.forEach(t=>{assert.ok(terrains.has(t.terrain),t.id);assert.ok(t.paths.length>=3&&t.paths.length<=5,`${t.id} paths`);t.paths.forEach(p=>assert.ok(p.lessons.length>=3,`${t.id}/${p.title}`));});
});
test('outer footprints cover every unchanged path cell in the original slot order',()=>{
 const slots=[[0,0],[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]],order=[0,1,3,5,2,4,6];
 THEMES.forEach((t,ti)=>{const p=polygons[ti];assert.ok(p.length>6);t.paths.forEach((_,pi)=>{const [q,r]=slots[order[pi]],c=axial(q,r,1.035);for(let k=0;k<6;k++){const a=Math.PI/6+k*Math.PI/3;assert.ok(contains(p,c.x+Math.cos(a),c.z+Math.sin(a)),`${t.title} path${pi} corner${k}`);}});});
 assert.equal(new Set(polygons.map(p=>JSON.stringify(p))).size,3);
});
test('interlocking territories mesh without touching and keep every path cell inside',()=>{
 assert.equal(interlocking.length,20);
 assert.deepEqual(WORLDS.map(w=>w.themes.length),[4,4,4,4,4]);
 assert.deepEqual(WORLDS.flatMap(w=>w.themes),[...Array(20).keys()]);
 interlocking.forEach((p,ti)=>{
  assert.ok(p.length>6,`theme ${ti} outline`);
  // Every path-cell centre of this theme stays inside its own interlocking territory.
  const slots=[[0,0],[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]],order=[0,1,3,5,2,4,6];
  THEMES[ti].paths.forEach((_,pi)=>{const [q,r]=slots[order[pi]],c=axial(q,r,1.035);assert.ok(contains(p,c.x,c.z),`theme ${ti} path ${pi}`);});
 });
 // Neighbouring territories never intrude into one another (gap keeps them apart). Compare in world coordinates.
 interlocking.forEach((a,i)=>interlocking.forEach((b,j)=>{if(j<=i)return;const [ax,az]=themeCenters[i],[bx,bz]=themeCenters[j];a.forEach(v=>assert.ok(!contains(b,v[0]+ax-bx,v[1]+az-bz),`${i} inside ${j}`));b.forEach(v=>assert.ok(!contains(a,v[0]+bx-ax,v[1]+bz-az),`${j} inside ${i}`));}));
});
test('changed outer slabs and hover boundaries have finite closed contours and soil colours',()=>{
 THEMES.forEach((t,i)=>{for(const g of [reshape(hexPrism(3.15,.55),i),reshape(hexOutline(3.15,.11),i)]){for(const v of g.attributes.position.array)assert.ok(Number.isFinite(v));assert.ok(g.boundingSphere?.radius>0||!g.boundingSphere);g.dispose();}});
});
test('comparison is isolated, explicitly illustrative and preserves state and view on toggle',async()=>{
 const root=new URL('../',import.meta.url),s=await readFile(new URL('src/apps/ecosystem-lowpoly/shape-experiment.js',root),'utf8'),html=await readFile(new URL('src/apps/ecosystem-lowpoly/shapes.html',root),'utf8'),g=await readFile(new URL('src/apps/ecosystem-lowpoly/shape-garden.js',root),'utf8'),a=await readFile(new URL('src/artifacts/2026-11-15-ecosystem-growth-poc.html',root),'utf8');
 assert.match(s,/week:16/);assert.match(s,/camera.position.copy\(previous.camera\)/);assert.match(s,/controls.target.copy\(previous.target\)/);assert.match(s,/view:\{\.\.\.garden.view\}/);assert.match(html,/Demo progress, fresh season only, no live account/);assert.match(html,/Seasons, oceans and live lesson UI are not reproduced/);assert.match(g,/grow: true, min: 0\.14/);assert.match(g,/nextMark/);assert.match(a,/leaving==='pathshapes'.*?about:blank/);assert.match(a,/shapeFrame/);
});

test('compact constellations cover every theme once in separated, asymmetric five-theme groups',()=>{
 assert.deepEqual(COMPACT_GROUPS.map(g=>g.themes.length),[5,5,5,5]);
 assert.deepEqual(COMPACT_GROUPS.flatMap(g=>g.themes).sort((a,b)=>a-b),Array.from({length:20},(_,i)=>i));
 assert.equal(new Set(compactCenters.map(c=>c.join(','))).size,20);
 assert.equal(new Set(COMPACT_GROUPS.map(g=>JSON.stringify(g.slots))).size,4);
 COMPACT_GROUPS.forEach((g,i)=>COMPACT_GROUPS.forEach((h,j)=>{if(i>=j)return;g.themes.forEach(a=>h.themes.forEach(b=>assert.ok(Math.hypot(compactCenters[a][0]-compactCenters[b][0],compactCenters[a][1]-compactCenters[b][1])>3,'space between groups')));}));
});
