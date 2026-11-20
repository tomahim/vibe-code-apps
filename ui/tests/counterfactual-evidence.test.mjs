import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html=fs.readFileSync(new URL('../src/artifacts/2026-11-20-counterfactual-desk.html',import.meta.url),'utf8');
const events=vm.runInNewContext(html.slice(html.indexOf('const EVENTS='),html.indexOf('const state='))+';EVENTS');
test('ten dossiers each provide three concise sourced exhibits and embedded artwork',()=>{
 assert.equal(events.length,10);
 assert.equal(new Set(events.map(e=>e.id)).size,10);
 for(const e of events){
  assert.equal(e.exhibits.length,3);assert.match(e.scene,/^data:image\/webp;base64,/);assert.match(e.evidenceUrl,/^https:\/\//);
  for(const ex of e.exhibits){assert.ok(ex.title.length>0);assert.ok(ex.caption.length<400);
   assert.ok(Array.isArray(ex.facts)&&ex.facts.length>=3);for(const f of ex.facts)assert.ok(f.length>10&&f.length<260);}
  assert.equal(e.options.length,3);assert.ok(e.history.urls.every(u=>u.startsWith('https://')));
  assert.ok(Array.isArray(e.known)&&e.known.length>=3);assert.ok(Array.isArray(e.aftermath)&&e.aftermath.length>=3);
  assert.ok(e.body.length>=1&&e.stakes.length>0);
 }
});
test('generated visuals and explanatory diagrams are distinguished from records',()=>{
 for(const label of ['AI-generated scene illustration','Not an archive image','Modern explanatory diagram','Modern decision frame'])assert.ok(html.includes(label));
 assert.ok(!html.match(/<script[^>]+src=/));assert.ok(!html.includes('localStorage'));
});
test('launch-morning photograph is available only in the historical reveal',()=>{
 const e=events.find(e=>e.id==='challenger-1986');assert.ok(e.archive.caption.includes('postdates'));assert.match(e.archive.image,/^data:image\/webp;base64,/);
 const evidenceCode=html.slice(html.indexOf('function renderEvidence()'),html.indexOf('function renderDesk()'));
 assert.ok(!evidenceCode.includes('e.archive'));
});
test('decision step is framed as role play with period knowledge only',()=>{
 assert.ok(html.includes('You are ${esc(e.role)}.'));assert.ok(html.includes('What you know at this moment'));
 assert.ok(html.includes('What do you do?'));assert.ok(html.includes('From the record'));assert.ok(html.includes('In the record'));
 const decisionCode=html.slice(html.indexOf('function renderCase()'),html.indexOf('function choose('));
 assert.ok(!decisionCode.includes('e.aftermath'));assert.ok(!decisionCode.includes('e.history'));
});
test('briefing avoids hindsight and Kodak is not scored as one exact historical choice',()=>{
 const reactor=events.find(e=>e.id==='chernobyl-1986');assert.ok(!JSON.stringify(reactor.exhibits).includes('graphite'));assert.ok(reactor.history.outcome.includes('15-equivalent-rod'));
 const camera=events.find(e=>e.id==='kodak-1975');assert.equal(camera.hist,null);assert.ok(camera.exhibits[1].caption.includes('23 seconds'));assert.ok(camera.history.outcome.includes('invested substantially'));
});
