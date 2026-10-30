import test from 'node:test';
import assert from 'node:assert/strict';
import { pressureKpa, readDiscoveries, saveDiscoveries, stops, sources } from '../src/apps/little-drops/content.js';
test('Little Drops pressure is linear and non-negative',()=>{assert.equal(pressureKpa(0),0);assert.equal(pressureKpa(20),196.20000000000002);assert.equal(pressureKpa(40),pressureKpa(20)*2);assert.equal(pressureKpa(-4),0);});
test('Little Drops ignores damaged and unknown local progress',()=>{assert.deepEqual(readDiscoveries({getItem:()=>'{broken'}),[]);assert.deepEqual(readDiscoveries({getItem:()=>JSON.stringify(['source','unknown','source','tap'])}),['source','tap']);assert.deepEqual(readDiscoveries(null),[]);assert.doesNotThrow(()=>saveDiscoveries(null,['tap']));});
test('Each journey stop has verified source metadata and a unique identifier',()=>{assert.equal(stops.length,5);assert.equal(new Set(stops.map(s=>s.id)).size,5);stops.forEach(s=>assert.ok(sources[s.source]?.url.startsWith('https://')));});
