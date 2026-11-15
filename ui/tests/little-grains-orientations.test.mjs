import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';

const base=path.resolve('public/artifact-assets/2026-11-15-little-grains-orientations');
const context={window:{}};
for(const file of ['core.js','catalog.js','artwork.js']) vm.runInNewContext(fs.readFileSync(path.join(base,file),'utf8'),context);
const {GardenCore:core,HYBRID_JOURNEY_DATA:data,GARDEN_ARTWORK:art}=context.window;
const plain=value=>JSON.parse(JSON.stringify(value));

test('only Ocean and Nature ship, with all three lesson landmarks in both orientations',()=>{
  assert.deepEqual(Object.keys(data.themes).sort(),['nature','ocean']);
  assert.deepEqual(Object.keys(art.themes).sort(),['nature','ocean']);
  assert.deepEqual(plain(data.themes.ocean.lessons.map(l=>l.landmark)),['Coral garden','Reef crest','Deep lagoon']);
  assert.deepEqual(plain(data.themes.nature.lessons.map(l=>l.landmark)),['Old oak','Stream','Beaver lodge']);
  const hashes=new Set();
  for(const key of ['ocean','nature'])for(const direction of ['portrait','landscape']){
    const entry=art.themes[key][direction];
    assert.equal(entry.anchors.length,3);
    assert.ok(entry.vegetationPixels>10000);
    for(const point of entry.anchors)for(const value of point)assert.ok(value>0&&value<100);
    for(const variant of ['lush','dormant']){
      const asset=entry[variant],bytes=fs.readFileSync(path.join(base,asset.src));
      assert.equal(bytes.length,asset.bytes);
      const hash=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,12);
      assert.ok(asset.src.includes(hash));assert.ok(!hashes.has(hash));hashes.add(hash);
      assert.ok(Math.abs(asset.width/asset.height-(direction==='portrait'?3/4:16/9))<0.002);
    }
    assert.equal(entry.lush.width,entry.dormant.width);assert.equal(entry.lush.height,entry.dormant.height);
  }
  assert.equal(hashes.size,8);
});
test('orientation follows viewport shape, including a tall desktop and a wide phone',()=>{
  assert.equal(core.orientation(1440,900),'landscape');assert.equal(core.orientation(390,844),'portrait');
  assert.equal(core.orientation(900,1100),'portrait');assert.equal(core.orientation(844,390),'landscape');
  assert.equal(core.orientation(800,800),'landscape');
});
test('each full painting fits without cropping at the supported viewport sizes',()=>{
  for(const [w,h]of [[320,568],[390,844],[900,1100],[1440,900],[844,390]]){
    const ratio=core.orientation(w,h)==='portrait'?3/4:16/9;
    const box=core.fit(w,h,ratio,{left:8,right:8,top:8,bottom:88});
    assert.ok(box.x>=8&&box.y>=8);assert.ok(box.x+box.width<=w-8+.001);assert.ok(box.y+box.height<=h-88+.001);
    assert.ok(Math.abs(box.width/box.height-ratio)<1e-9);
  }
});
test('labels keep fixed dimensions and avoid each other even on narrow screens',()=>{
  for(const [w,h]of [[320,568],[390,844],[900,1100],[1440,900]]){
    const points=[{x:w*.32,y:h*.63},{x:w*.75,y:h*.48},{x:w*.53,y:h*.27}];
    const bounds={left:10,right:w-10,top:100,bottom:h-120};
    const boxes=core.placeLabels(points,bounds);
    for(const b of boxes){assert.equal(b.width,148);assert.equal(b.height,48);assert.ok(b.x>=bounds.left&&b.x+b.width<=bounds.right);assert.ok(b.y>=bounds.top&&b.y+b.height<=bounds.bottom);}
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
      const a=boxes[i],b=boxes[j];assert.ok(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y);
    }
  }
});
test('deep links select a supported scene and malformed routes fall back to Ocean',()=>{
  assert.equal(core.parseRoute('#nature',data).theme,'nature');assert.equal(core.parseRoute('#ocean',data).theme,'ocean');
  assert.equal(core.parseRoute('#missing',data).theme,'ocean');
});
