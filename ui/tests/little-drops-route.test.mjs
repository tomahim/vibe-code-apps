import {test} from 'node:test';
import assert from 'node:assert/strict';
import {findOpenRoute,networkEdges,reachableNodes} from '../src/apps/little-drops/network.js';
test('all valve combinations produce only a contiguous open route or no route',()=>{
 for(let bits=0;bits<8;bits++){
  const valves={main:Boolean(bits&1),home:Boolean(bits&2),'loop-in':Boolean(bits&4)};
  const route=findOpenRoute(valves);assert.equal(Boolean(route),reachableNodes(valves).has('house'));
  if(!route)continue;
  assert.equal(route.nodes[0],'tower');assert.equal(route.nodes.at(-1),'house');assert.equal(route.nodes.length,route.edges.length+1);assert.equal(new Set(route.nodes).size,route.nodes.length);
  route.edges.forEach((id,i)=>{const e=networkEdges.find(e=>e.id===id);assert.ok(!e.valve||valves[id]);assert.deepEqual(new Set([e.from,e.to]),new Set(route.nodes.slice(i,i+2)));});
 }
});
test('trace changes to side street and handles disconnected or invalid endpoints',()=>{
 assert.deepEqual(findOpenRoute({main:true,home:true,'loop-in':true}).edges,['supply','main','home']);
 assert.deepEqual(findOpenRoute({main:false,home:true,'loop-in':true}).nodes,['tower','west','loop','east','house']);
 assert.equal(findOpenRoute({main:true,home:false,'loop-in':true}),null);
 assert.equal(findOpenRoute({},'unknown'),null);assert.deepEqual(findOpenRoute({},'tower','tower'),{nodes:['tower'],edges:[]});
});
