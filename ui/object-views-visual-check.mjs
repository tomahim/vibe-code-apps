import { chromium, firefox } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5197'], { stdio: 'ignore' });
const dir = process.env.VIEW_SCREENSHOTS || '/tmp/little-notes-views-screenshots'; fs.mkdirSync(dir, { recursive: true });
let browser;
try {
 for (const engine of ['firefox','chromium']) {
  browser = await (engine === 'firefox' ? firefox.launch() : chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] }));
  const page = await browser.newPage({viewport:{width:390,height:844}}); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  const prefs={}; let failNext=false; const puts=[];
  const categories=[{slug:'inbox',name:'Inbox',types:[],is_system:true},{slug:'archive',name:'Archive',types:[],is_system:true},{slug:'favorite',name:'Favorite',types:[],is_system:true}];
  const records=Array.from({length:35},(_,i)=>({id:`synthetic-${i}`,type:'idea',title:i===0?'A small cabinet for big ideas':i===34?'The last object in the month':`A thought worth keeping ${i+1}`,summary:'Collect ideas from anywhere. Keep the promising ones and make room for what comes next.',saved_on:`2026-11-${String(i===34?30:i%15+1).padStart(2,'0')}`,updated_at:'2026-11-04T20:00:00Z',categories:[{slug:'inbox',name:'Inbox'}],tags:[{slug:'design',name:'Design'}],body_markdown:'## The thought\nA useful idea needs room to grow.',external_url:'https://example.com/story'}));
  records.push({...records[0],id:'bookmark-1',type:'bookmark',title:'A field guide to quiet interfaces'});
  await page.addInitScript(()=>{localStorage.setItem('genious_token','synthetic-test-token');if(!localStorage.getItem('little-notes-theme'))localStorage.setItem('little-notes-theme','light');});
  await page.route('**/api/apps/little-notes/**',async route=>{
   const u=new URL(route.request().url());
   if(u.pathname.includes('/preferences/')){const slug=u.pathname.split('/').at(-2),data=route.request().postDataJSON();puts.push(slug);if(failNext){failNext=false;return route.fulfill({status:503,json:{error:'Test save unavailable'}});}prefs[slug]=data.view;return route.fulfill({json:{type:slug,view:data.view}});}
   if(u.pathname.endsWith('/taxonomy/'))return route.fulfill({json:{types:[{slug:'idea',name:'Ideas'},{slug:'bookmark',name:'Bookmarks'}],categories,tags:[{slug:'design',name:'Design'}],months:[{month:'2026-11',count:36}],can_manage_taxonomy:true,view_preferences:{...prefs}}});
   if(u.pathname.endsWith('/content/')){let list=records;const type=u.searchParams.get('type'),month=u.searchParams.get('month');if(type)list=list.filter(i=>i.type===type);if(month)list=list.filter(i=>i.saved_on.startsWith(month));const n=Number(u.searchParams.get('page')||1);return route.fulfill({json:{items:list.slice((n-1)*30,n*30),total:list.length,page:n,next_page:n*30<list.length?n+1:null}});}
   return route.fulfill({json:records.find(i=>u.pathname.includes(i.id))||records[0]});
  });
  for(let i=0;i<40;i++){try{await page.goto('http://localhost:5197/apps/little-notes');break;}catch{await new Promise(r=>setTimeout(r,150));}}
  await page.getByRole('heading',{name:'A small cabinet for big ideas'}).waitFor();
  async function selectType(label){if(await page.getByRole('button',{name:'☰ Types',exact:true}).isVisible())await page.getByRole('button',{name:'☰ Types',exact:true}).click();await page.locator('.ln-sidebar>button').filter({hasText:label}).first().waitFor();await page.locator('.ln-sidebar>button').filter({hasText:label}).first().click();}
  await selectType('Ideas');
  for(const view of ['default','database','table','cards','calendar']){
   await page.getByLabel('Display view').selectOption(view);
   await page.getByRole('status').filter({hasText:'Saved for Ideas'}).waitFor();
   if(view==='calendar'){await page.getByRole('heading',{name:'November 2026'}).waitFor();await page.getByRole('button',{name:'2026-11-30: 1 objects',exact:true}).click();await page.getByRole('button',{name:'The last object in the month',exact:false}).waitFor();}
   else if(view==='default')await page.getByRole('heading',{name:'A small cabinet for big ideas'}).waitFor();
   else await page.locator(view==='cards'?'.ln-view-cards':'.ln-table-scroll').waitFor();
   for(const theme of ['light','dark']){
    if(await page.locator('.ln-app').getAttribute('class').then(c=>!c.includes(`ln-theme-${theme}`)))await page.getByRole('button',{name:`Switch to ${theme} mode`}).click();
    for(const width of [320,390,1280]){await page.setViewportSize({width,height:960});await page.screenshot({path:`${dir}/${engine}-${view}-${theme}-${width}.png`,fullPage:false});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error(`Overflow ${engine} ${view} ${theme} ${width}`);}
   }
  }
  await page.setViewportSize({width:390,height:844});
  await selectType('Bookmarks'); if(await page.getByLabel('Display view').inputValue()!=='default')throw new Error('Type preference leaked');
  await selectType('Ideas');if(await page.getByLabel('Display view').inputValue()!=='calendar')throw new Error('Preference not restored');
  await page.reload();await page.getByRole('heading',{name:'November 2026'}).waitFor();await selectType('Ideas');if(await page.getByLabel('Display view').inputValue()!=='calendar')throw new Error('Preference missing after reload');
  await page.getByLabel('Display view').selectOption('cards');await page.locator('.ln-view-cards').waitFor();await page.locator('.ln-view-cards>button').first().click();await page.getByRole('button',{name:'Close object ×'}).waitFor();await page.getByRole('button',{name:'Close object ×'}).click();
  failNext=true;await page.getByLabel('Display view').selectOption('table');await page.getByRole('alert').filter({hasText:'preference was not saved'}).waitFor();
  await selectType('Everything');const count=puts.length;await page.getByLabel('Display view').selectOption('database');await page.waitForTimeout(100);if(puts.length!==count)throw new Error('Everything persisted');
  // URL state restores filters, view, item and administration without writes.
  await selectType('Ideas');await page.getByLabel('Display view').selectOption('cards');await page.locator('.ln-view-cards').waitFor();await page.locator('.ln-view-cards>button').first().click();await page.getByRole('button',{name:'Close object ×'}).waitFor();
  const itemURL=page.url();await page.reload();await page.getByRole('button',{name:'Close object ×'}).waitFor();if(page.url()!==itemURL)throw new Error('Item URL lost');
  await page.getByRole('button',{name:'Close object ×'}).click();await page.goBack();await page.getByRole('button',{name:'Close object ×'}).waitFor();await page.goForward();await page.locator('.ln-view-cards').waitFor();
  await page.getByRole('button',{name:'☰ Types',exact:true}).click();await page.screenshot({path:`${dir}/${engine}-sidebar-390.png`,fullPage:false});await page.getByRole('button',{name:'Manage',exact:false}).click();await page.getByRole('heading',{name:'Make room for your vocabulary.'}).waitFor();await page.reload();await page.getByRole('heading',{name:'Make room for your vocabulary.'}).waitFor();
  if(errors.length)throw new Error(errors.join('\n'));
  await browser.close();browser=null;console.log(`${engine}: PASS all five views both palettes 390/1280; no overflow; full-month pagination35; per-type restore/reload; detail open/close; save-error; Everything local only`);
 }
}finally{if(browser)await browser.close();server.kill('SIGTERM');await new Promise(resolve=>server.once('exit',resolve));}
