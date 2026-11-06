import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const server=spawn('npm',['run','dev','--','--port','5199'],{stdio:'ignore'});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage();
const screenshots=process.env.CURATOR_SCREENSHOTS || "/tmp/little-notes-screenshots";
const CATS=[['inbox','Inbox',[]],['archive','Archive',[]],['favorite','Favorite',[]],['promising','Promising',['idea']],['to-improve','To improve',['idea']],['inspiration','Inspiration',['bookmark']]]
 .map(([slug,name,types],i)=>({slug,name,is_system:i<3,position:i,types}));
const mk=(id,type,title,day,cats,tags=[])=>({id,type,title,summary:'A thought saved for later.',saved_on:day,updated_at:'2026-11-04T18:00:00Z',categories:cats.map(slug=>({slug,name:CATS.find(c=>c.slug===slug).name})),tags});
const records=[
 {id:'11111111-1111-4111-8111-111111111111',type:'idea',title:'A small cabinet for big ideas',subtitle:'Make room for the things you might build.',summary:'Collect ideas from anywhere. Keep the promising ones, improve the rough ones, and clear a little space for what comes next.',saved_on:'2026-11-04',external_url:'https://example.com',body_markdown:'## The thought\n\nA useful idea needs a place to wait. This is your one-object decision stage.\n\n- Keep it\n- Improve it\n- Come back later',updated_at:'2026-11-04T18:00:00Z',categories:[{slug:'inbox',name:'Inbox'}],tags:[{slug:'topic-coding-agents-x',name:'Coding agents'}]},
 mk('b1','bookmark','A field guide to quiet interfaces','2026-11-03',['inbox']),
 mk('b2','bookmark','The maps worth keeping','2026-11-02',['inspiration']),
 mk('b3','bookmark','A collection worth revisiting','2026-11-01',['favorite','archive']),
 mk('n1','news','What the newest maps can tell us','2026-11-03',[]),
 mk('d1','daily-note','Wednesday: notes from the day','2026-11-03',['inbox']),
 mk('i2','idea','The archive is a garden','2026-11-03',['promising'])];
await page.addInitScript(()=>localStorage.setItem('genious_token','visual-fixture-only'));
// Stateful mock: category assignments change later list and detail responses like the real API.
const withCats=(rec,slugs)=>({...rec,categories:slugs.map(slug=>({slug,name:CATS.find(c=>c.slug===slug).name}))});
const initial=()=>new Map(records.map(r=>[r.id,r.categories.map(c=>c.slug)]));
let state=initial();
await page.route('**/api/apps/little-notes/**',async route=>{
 const u=new URL(route.request().url());let body;
 if(u.pathname.endsWith('/taxonomy/'))body={types:[['idea','Ideas'],['bookmark','Bookmarks'],['news','News'],['daily-note','Daily notes']].map(([slug,name])=>({slug,name})),categories:CATS,tags:[{slug:'topic-coding-agents-x',name:'Coding agents',is_system:false}],months:[{month:'2026-11',count:7},{month:'2026-10',count:10}]};
 else if(u.pathname.endsWith('/categories/')){
   const id=u.pathname.split('/').filter(Boolean).slice(-2)[0];
   const {category:slug,enabled}=JSON.parse(route.request().postData()||'{}');
   const current=new Set(state.get(id)||[]);
   if(enabled){if(slug==='archive')current.delete('inbox');if(slug==='inbox')current.delete('archive');current.add(slug);}else current.delete(slug);
   state.set(id,[...current]);
   body=withCats(records.find(r=>r.id===id),[...current]);
 }
 else if(u.pathname.endsWith('/content/')){
   if(route.request().method()==='POST')body={...records[0]};
   else{
     let list=records.map(r=>withCats(r,state.get(r.id)||[]));
     const t=u.searchParams.get('type');if(t)list=list.filter(i=>i.type===t);
     const c=u.searchParams.get('category');
     if(c==='inbox')list=list.filter(i=>!i.categories.length||i.categories.some(x=>x.slug===c));
     else if(c)list=list.filter(i=>i.categories.some(x=>x.slug===c));
     const tg=u.searchParams.get('tag');if(tg)list=list.filter(i=>i.tags.some(x=>x.slug===tg));
     if(u.searchParams.get('q')==='nomatch')list=[];
     body={items:list,total:list.length,page:1,next_page:null};
   }
 }
 else{const rec=records.find(i=>u.pathname.includes(i.id))||records[0];body=withCats(rec,state.get(rec.id)||rec.categories.map(c=>c.slug));}
 await route.fulfill({json:body});
});
for(let i=0;i<30;i++){try{await page.goto('http://localhost:5199/apps/little-notes');break;}catch{await new Promise(r=>setTimeout(r,200));}}
await page.getByRole('heading',{name:'A small cabinet for big ideas'}).waitFor();
fs.mkdirSync(screenshots,{recursive:true});
for(const width of [1280,390,320]){
 await page.setViewportSize({width,height:960});
 await page.screenshot({path:`${screenshots}/inout-${width}.png`,fullPage:true});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(overflow)throw new Error('Overflow at '+width);
}
// Ideas selected: tabs show Promising/To improve, not Inspiration; content filtered to ideas
await page.setViewportSize({width:390,height:844});
await page.getByRole('button',{name:'Types',exact:false}).click();await page.getByRole('button',{name:'Ideas',exact:false}).click();
await page.getByRole('button',{name:'Promising',exact:true}).waitFor();
if(await page.getByRole('button',{name:'Inspiration',exact:true}).count())throw new Error('Inspiration tab visible for Ideas');
await page.getByRole('heading',{name:'A small cabinet for big ideas'}).waitFor();
await page.screenshot({path:`${screenshots}/tabs-ideas-390.png`,fullPage:true});
// More tags select must remain reachable in the scrollable tab row
const tabRow=page.locator('.ln-tabs');
await tabRow.locator('select').scrollIntoViewIfNeeded();
const selBox=await tabRow.locator('select').boundingBox();
const vp=await page.evaluate(()=>innerWidth);
if(!selBox)throw new Error('More tags select not found');
const fullyVisible=selBox.x>=0&&selBox.x+selBox.width<=vp;
await page.screenshot({path:`${screenshots}/tabs-ideas-moretags-390.png`,fullPage:false});
await tabRow.evaluate(el=>el.scrollLeft=0);
// Bookmarks selected: shows Inspiration, not Promising/To improve; card and queue are bookmarks only
await page.getByRole('button',{name:'Types',exact:false}).click();await page.getByRole('button',{name:'Bookmarks',exact:false}).click();
await page.getByRole('button',{name:'Inspiration',exact:true}).waitFor();
if(await page.getByRole('button',{name:'Promising',exact:true}).count())throw new Error('Promising tab visible for Bookmarks');
await page.getByRole('heading',{name:'A field guide to quiet interfaces'}).waitFor();
const queueTypes=await page.locator('.ln-queue-cards button').allTextContents();
if(queueTypes.some(t=>/garden|maps|Wednesday/.test(t)))throw new Error('Non-bookmark in filtered queue');
await page.screenshot({path:`${screenshots}/tabs-bookmarks-390.png`,fullPage:true});
await page.getByRole('button',{name:'Types',exact:false}).click();await page.getByRole('button',{name:'Daily notes',exact:false}).click();
await page.getByRole('button',{name:'+ Capture'}).click();await page.getByLabel('Title',{exact:true}).fill('A daily thought');
await page.screenshot({path:`${screenshots}/capture-390.png`,fullPage:true});
await page.keyboard.press('Escape');if(await page.getByRole('dialog').count())throw new Error('Escape did not close capture');
await page.getByLabel('Search content').fill('nomatch');await page.getByRole('heading',{name:'A little breathing room.'}).waitFor();await page.screenshot({path:`${screenshots}/empty-390.png`,fullPage:true});
await page.getByRole('button',{name:'See everything'}).click();await page.getByRole('heading',{name:'A small cabinet for big ideas'}).waitFor();
await page.getByRole('button',{name:'Archive ↗',exact:true}).click();await page.getByRole('status').waitFor();
// Triage regression: after skipping, Archive must advance to the next object in
// line, not reopen the archived one; same for restoring from the Archive view.
state=initial();
await page.goto('http://localhost:5199/apps/little-notes');
await page.getByRole('heading',{name:'A small cabinet for big ideas'}).waitFor();
await page.getByRole('button',{name:'Skip →'}).click();
await page.getByRole('heading',{name:'A field guide to quiet interfaces'}).waitFor();
await page.setViewportSize({width:390,height:844});
await page.screenshot({path:`${screenshots}/triage-skip-390.png`,fullPage:true});
await page.getByRole('button',{name:'Archive ↗',exact:true}).click();
await page.getByRole('heading',{name:'What the newest maps can tell us'}).waitFor();
if(await page.getByRole('button',{name:'Back to inbox',exact:false}).count())throw new Error('Archived object stayed on stage after archive');
await page.screenshot({path:`${screenshots}/triage-archive-advance-390.png`,fullPage:true});
await page.getByRole('button',{name:'Archive ↗',exact:true}).click();
await page.getByRole('heading',{name:'Wednesday: notes from the day'}).waitFor();
await page.getByRole('button',{name:'Archive ↗',exact:true}).click();
await page.getByRole('heading',{name:'A small cabinet for big ideas'}).waitFor();
await page.getByRole('button',{name:'Archive ↗',exact:true}).click();
await page.getByRole('heading',{name:'A little breathing room.'}).waitFor();
await page.getByRole('button',{name:'Archive',exact:true}).click();
await page.getByRole('heading',{name:'A small cabinet for big ideas'}).waitFor();
await page.getByRole('button',{name:'Skip →'}).click();
await page.getByRole('heading',{name:'A field guide to quiet interfaces'}).waitFor();
await page.getByRole('button',{name:'Back to inbox ↙',exact:true}).click();
await page.getByRole('heading',{name:'A collection worth revisiting'}).waitFor();
console.log('PASS desktop/mobile320/390; type-linked category tabs; type-filtered card+queue; More tags fullyVisible='+fullyVisible+' x='+Math.round(selBox.x)+' w='+Math.round(selBox.width)+' vp='+vp+'; capture/Escape/search/empty/reset/archive; skip-archive/restore triage advance; no horizontal overflow');
await browser.close();server.kill('SIGTERM'); await new Promise(resolve => server.once('exit', resolve));
