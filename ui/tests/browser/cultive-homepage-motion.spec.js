import { test, expect } from '@playwright/test';
const route='/artifacts/2026-11-16-cultive-living-homepages';
async function open(page){await page.goto(route);const view=page.frameLocator('iframe[title="Cultive - Ten Living Homepages"]');await expect(view.locator('.lab-tabs button')).toHaveCount(10);return view;}
for(const [name,width,height] of [['desktop',1440,900],['short desktop',1280,720],['phone',390,844],['small phone',360,740],['landscape phone',844,390]]){
 test(`ten concepts keep signup visible in gallery on ${name}`,async({page})=>{
  test.setTimeout(60000);await page.setViewportSize({width,height});const v=await open(page);
  for(let i=0;i<10;i++){
   await v.locator('.lab-tabs button').nth(i).click();
   const email=v.locator('#signup-email');await expect(email).toBeVisible();
   const withinFrame=await email.evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight});expect(withinFrame,`concept ${i+1}`).toBe(true);
   expect(await v.locator('body').evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
 });
}
test('all ten directions have five real placeholder pages and six working illustrated stages',async({page})=>{
 test.setTimeout(90000);await page.setViewportSize({width:390,height:844});const v=await open(page);
 for(let i=0;i<10;i++){
  await v.locator('.lab-tabs button').nth(i).click();
  for(const name of ['How it works','Pricing','FAQ','Blog','Course Library']){
   await v.locator('.navlinks a').filter({hasText:new RegExp('^'+name+'$')}).click();await expect(v.locator('.placeholder h1')).toHaveText(name);await expect(v.locator('.status')).toContainText('placeholder');await v.locator('.placeholder [data-page="Home"]').first().click();
  }
  await v.locator('.scroll-story').evaluate(el=>window.scrollTo({top:el.offsetTop-180,behavior:'instant'}));
  for(let step=0;step<6;step++){await v.locator(`[data-step="${step}"]`).click();await expect(v.locator('.workflow-scene.active')).toHaveAttribute('data-scene',String(step));await expect(v.locator(`[data-step="${step}"]`)).toHaveAttribute('aria-pressed','true');}
 }
});
test('actual scrolling advances all six scenes, without console errors',async({page})=>{
 test.setTimeout(60000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width:1440,height:900});const v=await open(page);
 for(let i=0;i<10;i++){
  await v.locator('.lab-tabs button').nth(i).click();
  for(let step=0;step<6;step++){
   await v.locator('.scroll-story').evaluate((el,step)=>{let p=(step+.35)/6,pin=el.querySelector('.story-pin'),top=parseFloat(getComputedStyle(pin).top);window.scrollTo({top:el.offsetTop-top+(el.offsetHeight-pin.offsetHeight)*p,behavior:'instant'})},step);
   await expect(v.locator('.workflow-scene.active')).toHaveAttribute('data-scene',String(step));
  }
 }
 expect(errors).toEqual([]);
});
test('reduced motion, keyboard navigation, local-only signup and playable quiz',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});const v=await open(page);
 await v.locator('.lab-tabs button').nth(0).focus();await page.keyboard.press('ArrowRight');await expect(v.locator('.lab-tabs button').nth(1)).toHaveAttribute('aria-selected','true');
 await v.locator('[data-step="4"]').click();await expect(v.locator('.workflow-scene.active')).toHaveAttribute('data-scene','4');
 const submissions=[];page.on('request',r=>{if(r.method()==='POST')submissions.push(r.url())});await v.locator('#signup-email').fill('preview@example.com');await v.locator('.signup button').click();await expect(v.locator('.toast')).toContainText('not been sent or saved');expect(submissions).toEqual([]);
 await v.locator('[data-answer="correct"]').click();await expect(v.locator('.quiz-feedback')).toContainText('Yes.');
});
