import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../src/artifacts/2026-11-08-one-ordinary-day.html',import.meta.url),'utf8');
const stories=JSON.parse(html.match(/<script id="story-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
test('One Ordinary Day has ten distinct real-person dated accounts',()=>{
 assert.equal(stories.length,10);assert.equal(new Set(stories.map(s=>s.id)).size,10);assert.equal(new Set(stories.map(s=>s.name)).size,10);
 for(const s of stories){for(const key of ['id','name','date','role','place','title','intro','context','source','edition','limit'])assert.ok(s[key],`${s.id}: ${key}`);assert.match(s.source,/^https:\/\//);assert.ok(s.beats.length>=4);assert.ok(s.beats.some(b=>b.status==='gap'));assert.ok(s.objects.length===3)}
});
test('Every documented moment has source text; every gap stays a gap',()=>{
 let documented=0,gaps=0;
 for(const s of stories)for(const b of s.beats){assert.ok(b.title&&b.time&&b.text);assert.ok(['documented','gap'].includes(b.status));if(b.status==='documented'){assert.ok(b.evidence.trim());documented++}else{assert.equal(b.evidence,'');gaps++}}
 assert.equal(documented,44);assert.equal(gaps,11);
});
test('The artifact is standalone and does not weaken the shared sandbox or persist data',()=>{
 assert.doesNotMatch(html,/<script[^>]+src=/i);assert.doesNotMatch(html,/<(?:img|iframe|link)[^>]+(?:src|href)=/i);
 assert.doesNotMatch(html,/\b(?:fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage|indexedDB)\b/);
 assert.match(html,/canvas/);assert.match(html,/getContext\('webgl'/);assert.match(html,/prefers-reduced-motion/);assert.match(html,/Source address/);assert.match(html,/window\.parent===window/);
});
test('Editorial limits are present for sensitive source details',()=>{
 const get=id=>stories.find(s=>s.id===id);
 assert.match(get('cooper').context,/enslaved/);assert.match(get('turner').context,/not fully accurate/);
 assert.match(get('pepys').date,/1659\/60/);assert.match(get('davis').context,/border states/);assert.match(get('last').limit,/not proof/);
});
