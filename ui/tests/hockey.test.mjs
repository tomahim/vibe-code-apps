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

import { hmTrend, nextRepricing } from '../src/apps/hockey/hockey-utils.js';
test('HM value trend follows the published repricing formula, verified against HM player details',()=>{
 // Cases checked live on hockeymanager.ch 2026-11-06 (icon next to price):
 assert.deepEqual(hmTrend({price_m:'15.0',points_season:360,matches:18}),{direction:'up',delta:1.5,eligible:true}); // Jarventie: 20.0 target, +1.5 cap, HM showed up
 assert.deepEqual(hmTrend({price_m:'17.0',points_season:298,matches:18}),{direction:'down',delta:-0.5,eligible:true}); // Malgin: 16.56->16.5 target, HM showed down although his last repricing was +1.5
 assert.deepEqual(hmTrend({price_m:'14.5',points_season:234,matches:16}),{direction:'stable',delta:0,eligible:true}); // Andrighetto: 14.625->14.5 = price, HM showed equals
 assert.deepEqual(hmTrend({price_m:'10.0',points_season:164,matches:16}),{direction:'up',delta:0.5,eligible:true}); // Shore: exactly 10.25 rounds UP to 10.5, HM showed up
 assert.deepEqual(hmTrend({price_m:'1.5',points_season:1,matches:1}),{direction:'stable',delta:0,eligible:false}); // Forget: <5 matches cannot move, HM showed equals
});
test('HM value trend caps the move at 1.5 M and uses 0.5 M steps',()=>{
 assert.deepEqual(hmTrend({price_m:'12.5',points_season:289,matches:18}),{direction:'up',delta:1.5,eligible:true}); // 16.06->16.0 target: +3.5 capped to +1.5
 assert.deepEqual(hmTrend({price_m:'14.0',points_season:100,matches:19}),{direction:'down',delta:-1.5,eligible:true}); // 5.26->5.5 target: -8.5 capped to -1.5
});
test('HM value trend is never invented from missing snapshot data',()=>{
 assert.equal(hmTrend(null),null);
 assert.equal(hmTrend({}),null);
 assert.equal(hmTrend({price_m:null,points_season:142,matches:19}),null);
 assert.equal(hmTrend({price_m:'8.5'}),null);
 assert.equal(hmTrend({price_m:'8.5',points_season:142,matches:null}),null);
 assert.equal(hmTrend({price_m:'abc',points_season:142,matches:19}),null);
});
test('next repricing date comes from the official published calendar only',()=>{
 assert.equal(nextRepricing(new Date('2026-11-06T12:00:00Z')),'2026-11-19');
 assert.equal(nextRepricing(new Date('2026-11-19T20:00:00Z')),'2026-11-19'); // date-level label
 assert.equal(nextRepricing(new Date('2026-11-20T12:00:00Z')),'2026-12-03');
 assert.equal(nextRepricing(new Date('2027-03-01T12:00:00Z')),null); // season calendar over: no invented date
});
