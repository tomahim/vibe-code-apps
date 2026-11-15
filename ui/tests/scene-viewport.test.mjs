import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync('public/artifact-assets/2026-11-15-ecosystem-growth-poc/hybrid-journey/scene-viewport.js','utf8');
function fixture(){
 const rootEvents={},docEvents={},swipes=[];let changed=0;
 const root={clientWidth:400,clientHeight:300,style:{},ownerDocument:{addEventListener:(type,fn)=>docEvents[type]=fn},addEventListener:(type,fn)=>rootEvents[type]=fn,setPointerCapture(){}};
 const layer={offsetWidth:400,offsetHeight:300,style:{setProperty(){}},getBoundingClientRect(){const [x=0,y=0,z=1]=(this.style.transform?.match(/-?[\d.]+/g)||[]).map(Number);return {left:200+x-200*z,top:150+y-150*z,width:400*z,height:300*z};}};
 const zoomIn={},zoomOut={},reset={},level={},window={};vm.runInNewContext(source,{window});
 const api=window.SceneViewport.install({root,layer,zoomIn,zoomOut,reset,level,swipe:d=>swipes.push(d),changed:()=>changed++});
 function event(type,id,x,y){const e={type,pointerId:id,clientX:x,clientY:y,button:0,target:{closest:()=>null},preventDefault(){}};(rootEvents[type]||docEvents[type])(e);}
 return {api,root,layer,zoomIn,zoomOut,reset,level,swipes,event,rootEvents,changed:()=>changed};
}
test('zoom controls scale only the scene, clamp at 1-3.5 and reset pan',()=>{
 const f=fixture();f.zoomIn.onclick();assert.equal(f.api.state().zoom,1.25);assert.equal(f.level.value,'125%');assert.match(f.layer.style.transform,/scale\(1.25\)/);
 for(let i=0;i<20;i++)f.zoomIn.onclick();assert.equal(f.api.state().zoom,3.5);assert.equal(f.zoomIn.disabled,true);
 f.reset.onclick();assert.equal(f.api.state().zoom,1);assert.equal(f.api.state().x,0);assert.equal(f.zoomOut.disabled,true);
});
test('two pointers zoom immediately, never trigger the overview swipe and release cleanly',()=>{
 const f=fixture();f.event('pointerdown',1,150,150);f.event('pointerdown',2,250,150);
 f.event('pointermove',1,100,150);f.event('pointermove',2,300,150);assert.equal(f.api.state().zoom,2);assert.ok(f.changed()>0);
 f.event('pointerup',1,100,150);f.event('pointerup',2,300,150);assert.deepEqual(f.swipes,[]);assert.equal(f.api.state().pointers,0);
});
test('single finger swipes groups only at fitted zoom; zoomed drag pans and stays bounded',()=>{
 const f=fixture();f.event('pointerdown',1,250,150);f.event('pointerup',1,100,150);assert.deepEqual(f.swipes,[1]);
 f.zoomIn.onclick();f.event('pointerdown',1,100,100);f.event('pointermove',1,1000,1000);f.event('pointerup',1,1000,1000);
 assert.equal(f.api.state().x,50);assert.equal(f.api.state().y,37.5);assert.deepEqual(f.swipes,[1]);
});
test('canceled touches cannot leave a stuck pan or navigate',()=>{
 const f=fixture();f.event('pointerdown',1,100,100);f.event('pointerdown',2,200,100);f.event('pointercancel',1,100,100);f.event('pointercancel',2,200,100);
 assert.equal(f.api.state().pointers,0);assert.deepEqual(f.swipes,[]);f.event('pointermove',1,400,400);assert.equal(f.api.state().zoom,1);
});
test('wheel zoom is anchored at the pointer and preserves fitted lower bound',()=>{
 const f=fixture();let prevented=false;f.rootEvents.wheel({deltaY:-200,clientX:300,clientY:150,preventDefault(){prevented=true;}});
 assert.ok(prevented);assert.ok(f.api.state().zoom>1);assert.ok(f.api.state().x<0);assert.equal(f.api.state().y,0);
 f.rootEvents.wheel({deltaY:5000,clientX:300,clientY:150,preventDefault(){}});assert.equal(f.api.state().zoom,1);assert.equal(f.api.state().x,0);
});
