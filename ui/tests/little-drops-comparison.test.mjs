import test from 'node:test';
import assert from 'node:assert/strict';
import {storageSummary} from '../src/apps/little-drops/storage.js';
test('completed comparison conserves volumes for every supported setting',()=>{
 for(let capacity=4;capacity<=20;capacity+=2)for(let inflow=0;inflow<=8;inflow++){
  const s=storageSummary(capacity,inflow);assert.equal(s.starting+6*inflow,s.delivered+s.overflow+s.final);assert.equal(s.delivered+s.shortage,27);assert.equal(s.capacity,capacity);assert.equal(s.inflow,inflow);
 }
});
test('saved summaries are independent results with explicit starting reserve',()=>{
 const a=storageSummary(4,5),b=storageSummary(12,5);assert.equal(a.shortage,1);assert.equal(b.shortage,0);assert.equal(a.starting,2);assert.equal(b.starting,6);a.final=999;assert.notEqual(storageSummary(4,5).final,999);assert.throws(()=>storageSummary(-1,5),RangeError);
});
