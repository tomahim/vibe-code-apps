import test from 'node:test';
import assert from 'node:assert/strict';
import {territories,MAP_SEEDS,MAP_EDGE,TOUR_SEEDS,TOUR_EDGE} from '../src/apps/ecosystem-lowpoly/territories.js';
import {THEMES as SCENES,buildTheme,applyStage} from '../src/apps/ecosystem-lowpoly/scenes.js';
import * as THREE from 'three';
test('packed territories have finite non-degenerate geometry including the glacier cell',()=>{
 for(const [seeds,edge] of [[MAP_SEEDS,MAP_EDGE],[TOUR_SEEDS,TOUR_EDGE]]){
  const cells=territories(seeds,edge);assert.equal(cells.length,seeds.length);
  for(const c of cells){assert.ok(Number.isFinite(c.radius)&&c.radius>1);assert.ok(c.poly.length>=3);for(const p of c.poly)assert.ok(p.every(Number.isFinite));}
  assert.ok(new Set(cells.map(c=>c.poly.length)).size>1,'irregular outlines differ');
 }
});
test('all ecosystem scene vertices and smooth intermediate growth remain finite',()=>{
 for(const key of Object.keys(SCENES)){
  const root=new THREE.Group(),entry=buildTheme(root,key,'ov',0,0,3,null);
  for(const stage of [1,1.5,2.25,5.7,10]){applyStage(entry,stage);root.traverse(o=>{assert.ok(o.position.toArray().every(Number.isFinite),key);assert.ok(o.scale.toArray().every(Number.isFinite),key);});}
  root.traverse(o=>{if(o.geometry){for(const n of o.geometry.attributes.position.array)assert.ok(Number.isFinite(n),key);}});
 }
});
