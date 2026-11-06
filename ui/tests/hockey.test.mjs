import test from 'node:test';
import assert from 'node:assert/strict';
import { toggleSelection, validateTransfer, completeCosts, weekDomain, adjacentWeeks } from '../src/apps/hockey/hockey-utils.js';
test('selection preserves filters, caps at eight, and permits removing at cap',()=>{
 const ids=[1,2,3,4,5,6,7,8];assert.deepEqual(toggleSelection(ids,9),ids);assert.deepEqual(toggleSelection(ids,3),[1,2,4,5,6,7,8]);assert.deepEqual(toggleSelection([2],1),[2,1]);
});
test('transfers require equal-size valid incoming/outgoing choices',()=>{
 const r=[{player:1},{player:2}];assert.ok(validateTransfer(r,[],[]));assert.ok(validateTransfer(r,[1],[2]));assert.ok(validateTransfer(r,[5],[3]));assert.ok(validateTransfer(r,[1],[1]));assert.ok(validateTransfer(r,[1],[3,4]));assert.equal(validateTransfer(r,[1],[3]),'');
});
test('missing costs never count as zero',()=>{assert.equal(completeCosts([]),false);assert.equal(completeCosts([{acquired_price_m:null}]),false);assert.equal(completeCosts([{acquired_price_m:''}]),false);assert.equal(completeCosts([{acquired_price_m:'0.0'}]),true);assert.equal(completeCosts([{acquired_price_m:'4.5'}]),true);});
test('weekly domain contains only imported weeks, no invented zero history',()=>{assert.deepEqual(weekDomain([{weeks:[{week:40},{week:38}]},{weeks:[{week:40},{week:39}]}]),[38,39,40]);});

test("season weeks cross January without inventing connected gaps",()=>{assert.deepEqual(weekDomain([{weeks:[{week:2},{week:40},{week:1}]}]),[40,1,2]);assert.equal(adjacentWeeks(38,40),false);assert.equal(adjacentWeeks(53,1),true);});

import { injuryLabel, nationalityLabel } from '../src/apps/hockey/hockey-utils.js';
test('injury labels map known hints and never claim health',()=>{
 assert.equal(injuryLabel('day_to_day'),'Day-to-day');
 assert.equal(injuryLabel('out'),'Out');
 assert.equal(injuryLabel('out_long'),'Long-term');
 assert.equal(injuryLabel('returning'),'Returning');
 assert.equal(injuryLabel('something-new'),'Reported');
});
test('nationality labels come only from the HM code, never inferred',()=>{
 assert.equal(nationalityLabel('ch'),'Swiss');
 assert.equal(nationalityLabel('CH'),'Swiss');
 assert.equal(nationalityLabel('fi'),'Foreign');
 assert.equal(nationalityLabel(null),'Unknown');
 assert.equal(nationalityLabel(''),'Unknown');
});

import { shotsPerMatch, shootingPct } from '../src/apps/hockey/hockey-utils.js';
test('shots per match and shooting percentage come only from imported shots',()=>{
 assert.equal(shotsPerMatch({games:3,shots_on_goal:9}),'3.0');
 assert.equal(shotsPerMatch({games:2,shots_on_goal:5}),'2.5');
 assert.equal(shotsPerMatch({games:0,shots_on_goal:9}),'-');
 assert.equal(shotsPerMatch({games:3}),'-');
 assert.equal(shotsPerMatch(null),'-');
 assert.equal(shootingPct({goals:2,shots_on_goal:9}),'22.2%');
 assert.equal(shootingPct({goals:0,shots_on_goal:5}),'0.0%');
 assert.equal(shootingPct({goals:2,shots_on_goal:0}),'-');
 assert.equal(shootingPct({goals:2}),'-');
 assert.equal(shootingPct(null),'-');
});
