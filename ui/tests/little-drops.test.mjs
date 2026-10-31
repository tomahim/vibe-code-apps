import test from 'node:test';
import assert from 'node:assert/strict';
import { pressureKpa, readDiscoveries, saveDiscoveries, stops, sources } from '../src/apps/little-drops/content.js';
test('Little Drops pressure is linear and non-negative',()=>{assert.equal(pressureKpa(0),0);assert.equal(pressureKpa(20),196.20000000000002);assert.equal(pressureKpa(40),pressureKpa(20)*2);assert.equal(pressureKpa(-4),0);});
test('Little Drops ignores damaged and unknown local progress',()=>{assert.deepEqual(readDiscoveries({getItem:()=>'{broken'}),[]);assert.deepEqual(readDiscoveries({getItem:()=>JSON.stringify(['source','unknown','source','tap'])}),['source','tap']);assert.deepEqual(readDiscoveries(null),[]);assert.doesNotThrow(()=>saveDiscoveries(null,['tap']));});
test('Each journey stop has verified source metadata and a unique identifier',()=>{assert.equal(stops.length,5);assert.equal(new Set(stops.map(s=>s.id)).size,5);stops.forEach(s=>assert.ok(sources[s.source]?.url.startsWith('https://')));});
import { reachableNodes, connectedEdges } from '../src/apps/little-drops/network.js';
test('All eight valve combinations agree with the two-route connectivity rule',()=>{
 for(const main of [false,true]) for(const home of [false,true]) for(const side of [false,true]) {
  const valves={main,home,'loop-in':side}, reached=reachableNodes(valves),edges=connectedEdges(valves);
  assert.equal(reached.has('house'),home&&(main||side));
  assert.equal(reached.has('east'),main||side);
  assert.equal(edges.has('main'),main);assert.equal(edges.has('home'),home&&(main||side));
 }
});
import { storageStep, runStorageCycle } from '../src/apps/little-drops/storage.js';
test('Storage balance conserves water, counts shortages and clips overflow',()=>{
 assert.deepEqual(storageStep(2,5,8,4),{level:0,delivered:7,shortage:1,overflow:0});
 assert.deepEqual(storageStep(4,5,2,4),{level:4,delivered:2,shortage:0,overflow:3});
 for(const cap of [4,8,12,20]) for(const pump of [0,3,5,8]) for(const row of runStorageCycle(cap,pump)){
  assert.equal(row.before+pump,row.level+row.delivered+row.overflow);assert.equal(row.demand,row.delivered+row.shortage);assert.ok(row.level>=0&&row.level<=cap);
 }
 assert.ok(runStorageCycle(4,5).some(r=>r.shortage>0));assert.ok(runStorageCycle(12,5).every(r=>r.shortage===0));
 assert.throws(()=>storageStep(-1,2,3,4),RangeError);assert.throws(()=>storageStep(5,2,3,4),RangeError);assert.throws(()=>storageStep(1,NaN,3,4),RangeError);
});
