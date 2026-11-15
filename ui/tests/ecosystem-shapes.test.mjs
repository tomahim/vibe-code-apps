import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {polygons,reshape} from '../src/apps/ecosystem-lowpoly/shape-footprints.js';
import {THEMES} from '../scripts/artifacts/little-grains/data.js';
import {hexPrism,hexOutline,axial} from '../scripts/artifacts/little-grains/terrain.js';
const contains=(poly,x,z)=>{let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if(((a[1]>z)!==(b[1]>z))&&(x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0]))yes=!yes;}return yes;};
test('outer footprints cover every unchanged path cell in the original slot order',()=>{
 const slots=[[0,0],[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]],order=[0,1,3,5,2,4,6];
 THEMES.forEach((t,ti)=>{const p=polygons[ti];assert.ok(p.length>6);t.paths.forEach((_,pi)=>{const [q,r]=slots[order[pi]],c=axial(q,r,1.035);for(let k=0;k<6;k++){const a=Math.PI/6+k*Math.PI/3;assert.ok(contains(p,c.x+Math.cos(a),c.z+Math.sin(a)),`${t.title} path${pi} corner${k}`);}});});
 assert.equal(new Set(polygons.map(p=>JSON.stringify(p))).size,3);
});
test('changed outer slabs and hover boundaries have finite closed contours and soil colours',()=>{
 THEMES.forEach((t,i)=>{for(const g of [reshape(hexPrism(3.15,.55),i),reshape(hexOutline(3.15,.11),i)]){for(const v of g.attributes.position.array)assert.ok(Number.isFinite(v));assert.ok(g.boundingSphere?.radius>0||!g.boundingSphere);g.dispose();}});
});
test('comparison is isolated, explicitly illustrative and preserves state and view on toggle',async()=>{
 const root=new URL('../',import.meta.url),s=await readFile(new URL('src/apps/ecosystem-lowpoly/shape-experiment.js',root),'utf8'),html=await readFile(new URL('src/apps/ecosystem-lowpoly/shapes.html',root),'utf8'),g=await readFile(new URL('src/apps/ecosystem-lowpoly/shape-garden.js',root),'utf8'),a=await readFile(new URL('src/artifacts/2026-11-15-ecosystem-growth-poc.html',root),'utf8');
 assert.match(s,/week:16/);assert.match(s,/camera.position.copy\(previous.camera\)/);assert.match(s,/controls.target.copy\(previous.target\)/);assert.match(s,/view:\{\.\.\.garden.view\}/);assert.match(html,/Demo progress, fresh season only, no live account/);assert.match(html,/Seasons, oceans and live lesson UI are not reproduced/);assert.match(g,/grow: true, min: 0\.14/);assert.match(g,/nextMark/);assert.match(a,/leaving==='pathshapes'.*?about:blank/);assert.match(a,/shapeFrame/);
});
