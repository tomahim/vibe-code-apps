import { test, expect } from '@playwright/test';
const route='/artifacts/2026-11-16-cultive-living-homepages';
const mechanisms=['pin','portal','stack','horiz','mosaic','seasons','museum','path','ritual','phone'];
async function open(page){await page.goto(route);const v=page.frameLocator('iframe[title="Cultive - Ten Living Homepages"]');await expect(v.locator('.lab-tabs button')).toHaveCount(10);return v;}
// Compute scroll targets from the real layout, not by assigning animation state.
async function anchors(v){return v.locator('.story').evaluate(s=>{const st=s.querySelector('.story-stage');return {m:s.dataset.mech,top:s.getBoundingClientRect().top+scrollY,height:s.offsetHeight,stage:st?.offsetHeight||0,offset:st?parseFloat(getComputedStyle(st).top):0,chrome:parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--chrome')),vh:innerHeight,items:[...s.querySelectorAll('.sheet,.block,.stop')].map(e=>({top:e.getBoundingClientRect().top+scrollY,height:e.offsetHeight}))}});}
async function scrollStep(v,a,i){let y;if(a.stage)y=a.top-a.offset+(a.height-a.stage)*(i+.4)/6;else if(a.m==='stack')y=a.items[i].top-a.chrome-14-i*9;else if(a.m==='path')y=a.items[i].top+a.items[i].height/2-a.chrome-(a.vh-a.chrome)/2;else y=a.items[i].top-a.chrome;await v.locator('body').evaluate((_,y)=>scrollTo({top:y,behavior:'instant'}),y);await expect(v.locator('.sc.active').first()).toHaveAttribute('data-scene',String(i));}
for(const [name,width,height] of [['desktop',1440,900],['short desktop',1280,720],['phone',390,844],['small phone',360,740],['landscape phone',844,390]]){
 test(`ten concepts keep signup visible in gallery on ${name}`,async({page})=>{
  test.setTimeout(60000);await page.setViewportSize({width,height});const v=await open(page);
  for(let i=0;i<10;i++){await v.locator('.lab-tabs button').nth(i).click();const email=v.locator('#signup-email');await expect(email).toBeVisible();expect(await email.evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}),`concept ${i+1}`).toBe(true);expect(await v.locator('body').evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
 });
}
for(const [name,width,height] of [['desktop',1440,900],['phone',390,844]]){
 test(`ten separate mechanisms expose six illustrated steps by real scrolling on ${name}`,async({page})=>{
  test.setTimeout(120000);await page.setViewportSize({width,height});const errors=[];page.on('pageerror',e=>errors.push(e.message));const v=await open(page);
  for(let c=0;c<10;c++){
   await v.locator('.lab-tabs button').nth(c).click();await expect(v.locator('.story')).toHaveAttribute('data-mech',mechanisms[c]);await expect(v.locator('.scroll-story,.story-pin')).toHaveCount(0);
   const a=await anchors(v);for(let i=0;i<6;i++){await scrollStep(v,a,i);const scene=v.locator(`.sc.active[data-scene="${i}"]`).first();await expect(scene.locator('.illustration')).toHaveCount(1);expect(await scene.locator('.illustration').evaluate(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0})).toBe(true);}
  }expect(errors).toEqual([]);
 });
}
test('five working placeholder pages in every direction',async({page})=>{
 test.setTimeout(90000);const v=await open(page);for(let c=0;c<10;c++){await v.locator('.lab-tabs button').nth(c).click();for(const name of ['How it works','Pricing','FAQ','Blog','Course Library']){await v.locator('.navlinks a').filter({hasText:new RegExp('^'+name+'$')}).click();await expect(v.locator('.placeholder h1')).toHaveText(name);await expect(v.locator('.status')).toContainText('placeholder');await v.locator('.placeholder [data-page="Home"]').first().click();}}
});
test('motion is not just renamed: actual transforms, masks and assembly change',async({page})=>{
 test.setTimeout(60000);const v=await open(page);
 for(const [c,selector,property] of [[1,'.p-scene','transform'],[3,'.track','transform'],[5,'.bg-lush','clipPath'],[6,'.drum','transform']]){await v.locator('.lab-tabs button').nth(c).click();const a=await anchors(v);await scrollStep(v,a,0);const before=await v.locator(selector).first().evaluate((e,p)=>getComputedStyle(e)[p],property);await scrollStep(v,a,4);const after=await v.locator(selector).first().evaluate((e,p)=>getComputedStyle(e)[p],property);expect(after).not.toBe(before);}
 await v.locator('.lab-tabs button').nth(4).click();let a=await anchors(v);await scrollStep(v,a,0);await expect(v.locator('.tile.on')).toHaveCount(1);await scrollStep(v,a,5);await expect(v.locator('.tile.on')).toHaveCount(6);
 await v.locator('.lab-tabs button').nth(8).click();a=await anchors(v);await scrollStep(v,a,1);await expect(v.locator('.rite.passed')).toHaveCount(1);
});
test('wheel gestures stay in the iframe; no duplicated outer-page scroll',async({page})=>{
 const v=await open(page);await v.locator('.lab-tabs button').nth(1).click();const a=await anchors(v);await scrollStep(v,a,0);const initial=await v.locator('body').evaluate(()=>scrollY);const box=await page.locator('iframe').boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height*.6);await page.mouse.wheel(0,500);await expect.poll(()=>v.locator('body').evaluate(()=>scrollY)).toBeGreaterThan(initial+100);expect(await page.evaluate(()=>scrollY)).toBe(0);
});
test('reduced motion shows all six full illustrated chapters; signup remains local',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});const v=await open(page);for(let c=0;c<10;c++){await v.locator('.lab-tabs button').nth(c).click();await expect(v.locator('.reduced-chapter')).toHaveCount(6);await expect(v.locator('.reduced-art .illustration')).toHaveCount(6);}
 await v.locator('.lab-tabs button').nth(0).focus();await page.keyboard.press('ArrowRight');await expect(v.locator('.lab-tabs button').nth(1)).toHaveAttribute('aria-selected','true');
 const submissions=[];page.on('request',r=>{if(r.method()==='POST')submissions.push(r.url())});await v.locator('#signup-email').fill('preview@example.com');await v.locator('.signup button').click();await expect(v.locator('.toast')).toContainText('not been sent or saved');expect(submissions).toEqual([]);await v.locator('[data-answer="correct"]').click();await expect(v.locator('.quiz-feedback')).toContainText('Yes.');
});
