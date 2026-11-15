// Run after npm run build. Checks the shipped artifact in its real opaque iframe.
// Chromium native touch emulation is not an Android hardware test. Firefox uses
// PointerEvent sequences, plus real mouse wheel/taps/keyboard and rendered pixels.
import { chromium, firefox } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const dist=path.resolve('dist'),shots=process.env.ZOOM_SHOTS||'/tmp/hybrid-zoom';await mkdir(shots,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'};
const server=createServer(async(req,res)=>{try{let f=path.join(dist,decodeURIComponent(new URL(req.url,'http://local').pathname));try{if(!(await stat(f)).isFile())throw Error();}catch{f=path.join(dist,'index.html');}res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');res.end(await readFile(f));}catch{res.writeHead(500);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
let assertions=0;
function check(value,message){assert.ok(value,message);assertions++;}
async function pointer(frame,type,id,x,y,target='#painting'){
 await frame.locator(target).first().dispatchEvent(type,{pointerId:id,pointerType:'touch',button:0,buttons:type==='pointerup'?0:1,clientX:x,clientY:y,bubbles:true});
}
try{for(const engine of (process.env.ZOOM_ENGINE?[process.env.ZOOM_ENGINE]:['chromium','firefox'])){
 const browser=await (engine==='chromium'?chromium:firefox).launch({headless:true,...(engine==='chromium'&&process.env.PLAYWRIGHT_CHROME_PATH?{executablePath:process.env.PLAYWRIGHT_CHROME_PATH,args:['--no-sandbox']}: {})});
 try{for(const [width,height] of (process.env.ZOOM_SIZE?[process.env.ZOOM_SIZE.split('x').map(Number)]:[[390,844],[360,640],[844,390],[1440,1000]])){
  console.log('starting',engine,width,height);const context=await browser.newContext({viewport:{width,height},hasTouch:true});const page=await context.newPage();page.setDefaultTimeout(10000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/artifacts/2026-11-15-ecosystem-growth-poc');const shell=page.frameLocator('iframe');
  // Mobile experiment selector replaces tabs at narrow widths.
  await shell.locator('#mobileExperiment').waitFor({state:'attached'});
  if(await shell.locator('.mobile-experiment').isVisible())await shell.locator('.mobile-experiment').selectOption('hybridjourney');else await shell.locator('#tab-hybridjourney').click();
  const f=await (await shell.locator('#hjFrame').elementHandle()).contentFrame();await f.waitForFunction(()=>window.hybridJourneyState?.().ready);console.log('ready');
  check(await page.locator('iframe').getAttribute('sandbox')==='allow-scripts','opaque artifact sandbox');
  const state=()=>f.evaluate(()=>window.hybridJourneyState());
  const ready=()=>f.waitForFunction(()=>window.hybridJourneyState().ready);
  for(const mode of ['overview','patches','painted','biology']){console.log('mode',mode);
   if(mode==='patches'){await f.locator('#themeStrip button').first().click();await ready();}
   if(mode==='painted'){await f.locator('#paintedNature').click();await ready();}
   if(mode==='biology'){await f.locator('#back').click();await ready();await f.locator('#themeStrip button').nth(1).click();await ready();}
   if(mode==='patches')check((await state()).patches,'Nature patches selected');
   if(mode==='painted'||mode==='patches'){const title=await f.locator('#interiorTitle').boundingBox(),modes=await f.locator('#natureModes').boundingBox();check(title.y+title.height<=modes.y,'fixed title clears the Nature mode switch');}
   if(mode==='biology')check(!(await state()).patches&&!!(await state()).theme,'non-Nature interior');
   if(process.env.FULLSCREEN_ONLY){
    const previous=await state();await f.locator('#imageOnly').click();await f.waitForFunction(()=>document.fullscreenElement===document.documentElement);await f.locator('html.image-only').waitFor();
    const stillFull=()=>f.waitForFunction(()=>document.fullscreenElement===document.documentElement);
    check(await f.locator('footer').isHidden(),'growth chrome hidden');check(await f.locator('.journey-head').isHidden(),'navigation hidden');check(await f.locator('#exitImageOnly').isVisible(),'exit remains visible');
    check(await f.locator('#markers').isVisible(),'floating labels stay visible in fullscreen');check((await f.locator('.map-marker').count())>0,'fullscreen shows theme or lesson labels');
    const full=await f.evaluate(()=>({width:innerWidth,height:innerHeight,screenW:screen.width,screenH:screen.height}));console.log('native fullscreen',engine,mode,full);
    await f.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await f.locator('html').screenshot({path:`${shots}/${engine}-${width}-${height}-${mode}-fullscreen.png`});
    const tappable=async()=>await f.locator('.map-marker').evaluateAll(nodes=>nodes.findIndex(e=>{const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit&&(e.contains(hit)||hit.contains(e));}));
    if(mode==='overview'){
     // A floating theme label enters its theme without leaving fullscreen.
     const pick=await tappable();check(pick>=0,'a theme label has a clear tap target in fullscreen');
     await f.locator('.map-marker').nth(pick).click();await ready();await stillFull();
     check(!!(await state()).theme,'tapping a theme label enters the theme in fullscreen');
     check(await f.locator('#back').isVisible(),'a way back is kept in fullscreen');
     await f.locator('html').screenshot({path:`${shots}/${engine}-${width}-${height}-${mode}-fullscreen-interior.png`});
     const lessonPick=await tappable();check(lessonPick>=0,'a lesson label has a clear tap target in fullscreen');
     await f.locator('.map-marker').nth(lessonPick).click();check(await f.locator('#lessonDialog').evaluate(e=>e.open),'tapping a lesson label opens it in fullscreen');await stillFull();
     await f.locator('#lessonDialog .done').click();await f.locator('#back').click();await ready();await stillFull();
     check((await state()).theme===null,'back returns to the group without leaving fullscreen');
    }else{
     // Interior fullscreen: the same floating behaviour covers lesson labels.
     check(await f.locator('#back').isVisible(),'a way back is kept in fullscreen');
     const lessonPick=await tappable();check(lessonPick>=0,'a lesson label has a clear tap target in fullscreen');
     await f.locator('.map-marker').nth(lessonPick).click();check(await f.locator('#lessonDialog').evaluate(e=>e.open),'tapping a lesson label opens it in fullscreen');await stillFull();
     await f.locator('#lessonDialog .done').click();
    }
    const area=await f.locator('#landscape').boundingBox();
    const label=()=>f.locator('.map-marker').first();
    const sizeBefore=await label().boundingBox();
    await page.mouse.move(area.x+area.width/2,area.y+area.height/2);await page.mouse.wheel(0,-250);await f.waitForFunction(()=>window.hybridJourneyState().viewport.zoom>1);check((await state()).viewport.zoom>1,'zoom retained in fullscreen');
    const sizeAfter=await label().boundingBox();
    check(Math.abs(sizeAfter.width-sizeBefore.width)<2&&Math.abs(sizeAfter.height-sizeBefore.height)<2,'label size stays fixed under fullscreen zoom');
    const anchored=await label().evaluate(e=>{const p=document.querySelector('#painting').getBoundingClientRect(),r=e.getBoundingClientRect();return Math.abs((r.x+r.width/2-p.x)/p.width-parseFloat(e.style.left)/100)<.002;});
    check(anchored,'label does not drift from its scene position under zoom');
    await f.locator('html').screenshot({path:`${shots}/${engine}-${width}-${height}-${mode}-fullscreen-zoomed.png`});
    await page.mouse.down();await page.mouse.move(area.x+area.width/2+40,area.y+area.height/2+20,{steps:5});await page.mouse.up();check(Math.abs((await state()).viewport.x)>0,'fullscreen pan works');
    await f.locator('#exitImageOnly').click();await f.waitForFunction(()=>!document.fullscreenElement);await f.locator('html:not(.image-only)').waitFor();
    check((await state()).theme===previous.theme&&(await state()).state===previous.state,'exit preserves theme and growth');check(await f.locator('footer').isVisible(),'exit restores controls');
    await f.locator('#zoomReset').click();continue;
   }
   await f.locator('#zoomReset').click();
   const before=await f.locator('#painting').boundingBox(),head=await f.locator('.journey-head').boundingBox(),foot=await f.locator('footer').boundingBox();
   await page.screenshot({path:`${shots}/${engine}-${width}-${height}-${mode}-before.png`});
   // Pinch starting on a scene marker. Native multi-touch on Chromium, equivalent
   // Pointer Events on Firefox (desktop Firefox has no native touch injection).
   const marker=await f.locator('.map-marker').first().boundingBox();const area=await f.locator('#landscape').boundingBox();
   const cx=Math.max(area.x+65,Math.min(area.x+area.width-65,marker.x+marker.width/2)),cy=Math.max(area.y+20,Math.min(area.y+area.height-20,marker.y+marker.height/2));
   const oldGroup=(await state()).group,oldTheme=(await state()).theme;
   if(engine==='chromium'){
    const cdp=await context.newCDPSession(page);const tp=(x,id)=>({x,y:cy,id,radiusX:4,radiusY:4});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[tp(cx-22,1),tp(cx+22,2)]});
    for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[tp(cx-22-i*4,1),tp(cx+22+i*4,2)]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
   }else{
    const loc=await f.locator('#landscape').evaluate(e=>({left:e.getBoundingClientRect().left,top:e.getBoundingClientRect().top,width:e.clientWidth,height:e.clientHeight}));
    const x=loc.left+loc.width/2,y=loc.top+loc.height/2;
    await pointer(f,'pointerdown',1,x-22,y,'.map-marker');await pointer(f,'pointerdown',2,x+22,y,'.map-marker');
    await pointer(f,'pointermove',1,x-54,y);await pointer(f,'pointermove',2,x+54,y);await pointer(f,'pointerup',1,x-54,y);await pointer(f,'pointerup',2,x+54,y);
   }
   const afterState=await state(),after=await f.locator('#painting').boundingBox();
   check(afterState.viewport.zoom>1.5,`${engine} ${mode}: pinch zooms scene`);check(after.width>before.width*1.5,'actual scene bounds grow');
   check(afterState.group===oldGroup&&afterState.theme===oldTheme,'pinch never changes destination');check(!await f.locator('#lessonDialog').evaluate(e=>e.open),'pinch never opens lesson');
   check(JSON.stringify(await f.locator('.journey-head').boundingBox())===JSON.stringify(head),'header stays fixed');check(JSON.stringify(await f.locator('footer').boundingBox())===JSON.stringify(foot),'growth and zoom controls stay fixed');
   const alignment=await f.locator('.map-marker').first().evaluate(e=>{const p=document.querySelector('#painting').getBoundingClientRect(),r=e.getBoundingClientRect();return Math.abs((r.x+r.width/2-p.x)/p.width-parseFloat(e.style.left)/100)<.002;});check(alignment,'marker stays attached to its painting coordinate');
   // Residual click after gesture is blocked; keyboard access is retained.
   await f.locator('.map-marker').first().dispatchEvent('click',{detail:1,bubbles:true});check((await state()).theme===oldTheme&&!await f.locator('#lessonDialog').evaluate(e=>e.open),'residual pointer click suppressed');
   await page.screenshot({path:`${shots}/${engine}-${width}-${height}-${mode}-zoomed.png`});
   // Drag pans rather than switching groups while zoomed.
   const paintingState=(await state()).viewport;const rect=await f.locator('#landscape').boundingBox();
   await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);await page.mouse.down();await page.mouse.move(rect.x+rect.width/2+45,rect.y+rect.height/2+15,{steps:5});await page.mouse.up();
   check((await state()).group===oldGroup,'zoomed drag does not swipe groups');check(Math.abs((await state()).viewport.x-paintingState.x)>1,'drag changes scene pan');
   await f.locator('#zoomReset').click();check((await state()).viewport.zoom===1&&(await state()).viewport.x===0,'reset restores fitted scene');
   await f.locator('#zoomIn').click();check((await state()).viewport.zoom===1.25,'zoom button works');
   await f.locator('#zoomOut').click();check((await state()).viewport.zoom===1,'zoom out works');
   await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);await page.mouse.wheel(0,-180);await f.waitForFunction(()=>window.hybridJourneyState().viewport.zoom>1,{},{timeout:3000});check((await state()).viewport.zoom>1,'real wheel zooms');
   await f.locator('#zoomReset').click();
   if(mode!=='overview'){const tappable=await f.locator('.map-marker').evaluateAll(nodes=>nodes.findIndex(e=>{const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit&&e.contains(hit);}));check(tappable>=0,'at least one scene marker has a clear tap target');await f.locator('.map-marker').nth(tappable).click();check(await f.locator('#lessonDialog').evaluate(e=>e.open),'fresh deliberate marker tap works');await f.locator('#lessonDialog .done').click();await f.locator('#lessonStrip button').first().click();check(await f.locator('#lessonDialog').evaluate(e=>e.open),'fixed lesson list remains usable');await f.locator('#lessonDialog .done').click();await f.locator('.map-marker').first().focus();await page.keyboard.press('Enter');check(await f.locator('#lessonDialog').evaluate(e=>e.open),'keyboard marker remains usable');await f.locator('#lessonDialog .done').click();}
  }
  check(errors.length===0,`no page errors: ${errors}`);await context.close();console.log(`${engine} ${width}x${height}: overview, patch, painted and other interior passed`);
 }}finally{await browser.close();}
}}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
console.log(`${assertions} checks passed. Screenshots: ${shots}`);
