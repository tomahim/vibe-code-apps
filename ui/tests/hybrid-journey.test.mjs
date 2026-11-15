import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
const base=path.resolve('public/artifact-assets/2026-11-15-ecosystem-growth-poc/hybrid-journey');
const read=name=>fs.readFileSync(path.join(base,name),'utf8');
const context={window:{}};vm.runInNewContext(read('journey-data.js'),context);vm.runInNewContext(read('journey-assets.js'),context);
const data=context.window.HYBRID_JOURNEY_DATA,assets=context.window.HYBRID_JOURNEY_ASSETS;
test('Hybrid journey has seven disjoint groups covering exactly the twenty established themes',()=>{
 assert.equal(data.groups.length,7);assert.deepEqual(Array.from(data.groups,g=>g.themes.length),[3,3,3,3,3,3,2]);
 const keys=Array.from(data.groups).flatMap(g=>Array.from(g.themes));assert.equal(new Set(keys).size,20);assert.deepEqual(keys.slice().sort(),Object.keys(data.themes).sort());
});
test('Every theme has an interior and three fictional lesson stops at bounded scenery coordinates',()=>{
 for(const [key,t]of Object.entries(data.themes)){assert.ok(assets.interiors[key]);assert.equal(t.lessons.length,3);for(const l of t.lessons){assert.ok(l.title&&l.landmark);assert.ok(l.x>=5&&l.x<=95);assert.ok(l.y>=5&&l.y<=95);}}
});
test('All endpoint assets exist, have byte counts and immutable content hashes',()=>{
 const entries=[...assets.groups,...Object.values(assets.interiors)];
 for(const entry of entries)for(const key of ['lush','sparse']){const a=entry[key];assert.match(a.src,/^assets\/[\w-]+-[a-f\d]{12}\.webp$/);const b=fs.readFileSync(path.join(base,a.src));assert.equal(a.bytes,b.length);assert.ok(a.src.includes(crypto.createHash('sha256').update(b).digest('hex').slice(0,12)));}
});
test('The new tab is separate, unloaded until selected, and the original phone crop is removed',()=>{
 const shell=fs.readFileSync('src/artifacts/2026-11-15-ecosystem-growth-poc.html','utf8');
 assert.match(shell,/id="tab-hybrid"/);assert.match(shell,/id="tab-hybridjourney"/);assert.match(shell,/id="hjFrame"[^>]*src="about:blank"/);
 assert.ok(!shell.includes('.hy-scene { width: min(150vw'));
 assert.match(shell,/name === "hybridjourney" && name !== leaving/);
});
test('Growth, motion, modal lessons and bounded caching are explicit',()=>{
 const html=read('index.html'),js=read('journey.js');
 assert.match(html,/id="growth"[^>]*min="1" max="10" step="1"/);assert.match(html,/id="lessonDialog"/);assert.match(js,/imageCache.size > 5/);assert.match(js,/1000\/30/);assert.match(js,/prefers-reduced-motion/);assert.match(read('scene-viewport.js'),/pointercancel/);assert.match(js,/token !== version/);
});
test('Only the hashed artwork directory receives long-lived private caching',()=>{
 const config=fs.readFileSync('nginx/default.conf.template','utf8');
 assert.match(config,/location \^~ \/artifact-assets\/2026-11-15-ecosystem-growth-poc\/hybrid-journey\/assets\/ \{\s*add_header Cache-Control "private, max-age=31536000, immutable";\s*try_files \$uri =404;/);
 assert.ok(!/location \/ \{[^}]*immutable/s.test(config));
});

test('Nature uses real hashed partial assets with bounded encoded and decoded payloads',()=>{
 vm.runInNewContext(read('patch-assets.js'),context);
 const a=context.window.HYBRID_PATCH_ASSETS;
 assert.equal(Object.keys(a.sprites).length,8);assert.equal(a.regions.length,3);
 let bytes=0,pixels=0;
 for(const asset of[a.base,...Object.values(a.sprites)]){
  const b=fs.readFileSync(path.join(base,asset.src));bytes+=b.length;pixels+=asset.width*asset.height;
  assert.equal(asset.bytes,b.length);assert.ok(asset.src.includes(crypto.createHash('sha256').update(b).digest('hex').slice(0,12)));
 }
 assert.ok(bytes<550*1024);assert.ok(pixels*4<5*1048576);
});
test('One slider drives monotonic fast, steady and late lesson progress with mixed middle states',()=>{
 vm.runInNewContext(read('lesson-patches.js'),context);const p=context.window.HybridLessonPatches.progress;
 assert.deepEqual(Array.from(p(1)),[0,0,0]);assert.deepEqual(Array.from(p(10)),[1,1,1]);
 assert.ok(p(5)[0]>.79&&p(5)[1]>.36&&p(5)[1]<.38);assert.equal(p(5)[2],0);
 for(let s=2;s<=10;s++)for(let i=0;i<3;i++)assert.ok(p(s)[i]>=p(s-1)[i]);
 assert.equal(p(6)[0],1);assert.ok(p(6)[1]<1&&p(6)[2]<.2);
});
test('Patch composition leaves the base fixed and adds deterministic alpha pieces without a whole-scene mask',()=>{
 const engine=context.window.HybridLessonPatches,a=context.window.HYBRID_PATCH_ASSETS;
 const sprites=Object.fromEntries(Object.entries(a.sprites).map(([k,v])=>[k,{...v,key:k}]));
 const loaded={base:{key:'base'},sprites};let calls=[];
 const ctx={clearRect(){},drawImage(...args){calls.push(args);}};
 engine.draw(ctx,840,800,1,loaded);assert.equal(calls.length,1);assert.equal(calls[0][0],loaded.base);
 calls=[];engine.draw(ctx,840,800,5,loaded);const middle=calls.slice();
 calls=[];engine.draw(ctx,840,800,10,loaded);assert.ok(calls.length>middle.length);
 for(const c of middle)assert.ok(calls.some(full=>full.every((value,i)=>value===c[i])));
 for(const[,x,y,w,h]of calls.slice(1)){assert.ok(x>=0&&y>=0&&x+w<=840&&y+h<=800);}
});
