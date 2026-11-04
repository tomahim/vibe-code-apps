import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const server=spawn('npm',['run','dev','--','--port','5199'],{stdio:'ignore'});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage();
const screenshots=process.env.CURATOR_SCREENSHOTS || "/tmp/little-notes-screenshots";
const CATS=[['inbox','Inbox',[]],['archive','Archive',[]],['favorite','Favorite',[]],['promising','Promising',['idea']],['to-improve','To improve',['idea']],['inspiration','Inspiration',['bookmark']]]
 .map(([slug,name,types],i)=>({slug,name,is_system:i<3,position:i,types}));
const records=[{id:'11111111-1111-4111-8111-111111111111',type:'idea',title:'A small cabinet for big ideas',subtitle:'Make room for the things you might build.',summary:'Collect ideas from anywhere. Keep the promising ones, improve the rough ones, and clear a little space for what comes next.',saved_on:'2026-11-04',external_url:'https://example.com',body_markdown:'## The thought\n\nA useful idea needs a place to wait. This is your one-object decision stage.\n\n- Keep it\n- Improve it\n- Come back later',updated_at:'2026-11-04T18:00:00Z',categories:[{slug:'inbox',name:'Inbox'}],tags:[{slug:'topic-coding-agents-x',name:'Coding agents'}]},...['bookmark','news','daily-note','idea','bookmark','news'].map((type,i)=>({id:`item${i}`,type,title:['A field guide to quiet interfaces','What the newest maps can tell us','Wednesday: notes from the day','The archive is a garden','A collection worth revisiting','New ways to see the landscape'][i],saved_on:'2026-11-03',summary:'A thought saved for later.',updated_at:'2026-11-04T18:00:00Z',categories:[{slug:'inbox',name:'Inbox'}],tags:[]}))];
await page.addInitScript(()=>localStorage.setItem('genious_token','visual-fixture-only'));
let archived=false;
await page.route('**/api/apps/little-notes/**',async route=>{
 const u=new URL(route.request().url());let body;
 if(u.pathname.endsWith('/taxonomy/'))body={types:[['idea','Ideas'],['bookmark','Bookmarks'],['news','News'],['daily-note','Daily notes']].map(([slug,name])=>({slug,name})),categories:CATS,tags:[{slug:'topic-coding-agents-x',name:'Coding agents',is_system:false}],months:[{month:'2026-11',count:7},{month:'2026-10',count:10}]};
 else if(u.pathname.endsWith('/categories/')){archived=true;body={...records[0],categories:[{slug:'archive',name:'Archive'}]};}
 else if(u.pathname.endsWith('/content/'))body=route.request().method()==='POST'?{...records[0]}:{items:u.searchParams.get('q')==='nomatch'||archived?[]:records,total:u.searchParams.get('q')==='nomatch'||archived?0:7,page:1,next_page:null};
 else body=records.find(i=>u.pathname.includes(i.id))||records[0];
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
// type-linked tabs: Ideas selected shows Promising/To improve, not Inspiration
await page.setViewportSize({width:390,height:844});
await page.getByRole('button',{name:'Types',exact:false}).click();await page.getByRole('button',{name:'Ideas',exact:false}).click();
await page.getByRole('button',{name:'Promising',exact:true}).waitFor();
if(await page.getByRole('button',{name:'Inspiration',exact:true}).count())throw new Error('Inspiration tab visible for Ideas');
await page.screenshot({path:`${screenshots}/tabs-ideas-390.png`,fullPage:true});
// Bookmarks selected shows Inspiration, not Promising/To improve
await page.getByRole('button',{name:'Types',exact:false}).click();await page.getByRole('button',{name:'Bookmarks',exact:false}).click();
await page.getByRole('button',{name:'Inspiration',exact:true}).waitFor();
if(await page.getByRole('button',{name:'Promising',exact:true}).count())throw new Error('Promising tab visible for Bookmarks');
await page.screenshot({path:`${screenshots}/tabs-bookmarks-390.png`,fullPage:true});
await page.getByRole('button',{name:'Types',exact:false}).click();await page.getByRole('button',{name:'Daily notes',exact:false}).click();
await page.getByRole('button',{name:'+ Capture'}).click();await page.getByLabel('Title',{exact:true}).fill('A daily thought');
await page.screenshot({path:`${screenshots}/capture-390.png`,fullPage:true});
await page.keyboard.press('Escape');if(await page.getByRole('dialog').count())throw new Error('Escape did not close capture');
await page.getByLabel('Search content').fill('nomatch');await page.getByRole('heading',{name:'A little breathing room.'}).waitFor();await page.screenshot({path:`${screenshots}/empty-390.png`,fullPage:true});
await page.getByRole('button',{name:'See everything'}).click();await page.getByRole('heading',{name:'A small cabinet for big ideas'}).waitFor();
await page.getByRole('button',{name:'Archive ↗',exact:true}).click();await page.getByRole('status').waitFor();
console.log('PASS desktop/mobile320/390; type-linked category tabs; filters/capture/Escape/search/empty/reset/archive; no horizontal overflow');
await browser.close();server.kill('SIGTERM'); await new Promise(resolve => server.once('exit', resolve));
