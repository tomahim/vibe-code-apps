import test from 'node:test';
import assert from 'node:assert/strict';
import {pipeView} from '../src/artifacts/little-drops-source/flow-view.js';
test('open travel spans the pipe and closed travel never crosses the gate',()=>{
 assert.deepEqual(pipeView(0,true),{z:10,blocked:false});assert.deepEqual(pipeView(100,true),{z:-12,blocked:false});
 for(let t=0;t<=100;t++){const v=pipeView(t,false);assert.ok(v.z>=1);assert.equal(v.blocked,10-t*.22 < 1);}
 assert.deepEqual(pipeView(100,false),{z:1,blocked:true});assert.equal(pipeView(35,true).z,pipeView(35,false).z);
});
test('camera inputs are bounded without mutating the requested travel',()=>{
 assert.equal(pipeView(-10,true).z,10);assert.equal(pipeView(200,true).z,-12);assert.equal(pipeView(NaN,true).z,10);
});
