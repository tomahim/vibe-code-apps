import {test,expect} from '@playwright/test';
const path='/artifacts/2026-10-25-maison-des-heures';
async function ready(page){await page.goto(path);const f=page.frameLocator('iframe');await expect(f.locator('#loading')).toBeHidden();return f;}
async function settle(f){await f.locator('canvas').evaluate(()=>new Promise(resolve=>{const tick=()=>window.__maison.state.transition?setTimeout(tick,50):resolve();tick();}));await f.locator('canvas').evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await new Promise(r=>setTimeout(r,800));}
test('offline sandbox and presentation controls',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const f=await ready(page);
 expect(await f.locator('canvas').evaluate(()=>({levels:window.__maison.levels,rooms:window.__maison.rooms}))).toEqual({levels:5,rooms:15});
 await expect(page.locator('iframe')).toHaveAttribute('sandbox','allow-scripts');
 await settle(f);await page.screenshot({path:'/downloads/maison-final-desktop.png'});
 await f.locator('#explode').fill('1');await expect(f.locator('#separation')).toHaveText('100%');await settle(f);await f.locator('canvas').evaluate(()=>new Promise(resolve=>{const t=()=>window.__maison.state.explode>.98?resolve():setTimeout(t,50);t();}));await page.screenshot({path:'/downloads/maison-exploded.png'});
 await f.locator('#reset').click();await settle(f);await expect(f.locator('#room-nav')).toBeHidden();await expect(f.locator('#explode')).toBeEnabled();
 await f.locator('#facade').click();await expect(f.locator('#facade')).toHaveAttribute('aria-pressed','true');await f.locator('#facade').click();
 await f.locator('#light').click();await expect(f.locator('body')).toHaveAttribute('data-night','true');await page.waitForTimeout(1500);await page.screenshot({path:'/downloads/maison-evening.png'});
 await f.locator('#motion').click();await expect(f.locator('#motion')).toHaveAttribute('aria-pressed','false');expect(errors).toEqual([]);
});
test('phone layouts and reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [390,320]){await page.setViewportSize({width,height:844});const f=await ready(page);await expect(f.locator('#motion')).toHaveAttribute('aria-pressed','false');await settle(f);await page.screenshot({path:`/downloads/maison-mobile-${width}.png`});
 await f.locator('[data-level="0"]').click();await settle(f);await page.screenshot({path:`/downloads/maison-mobile-floor-${width}.png`});await f.locator('[data-room="1"]').click();await settle(f);await page.screenshot({path:`/downloads/maison-mobile-room-${width}.png`});
 expect(await f.locator('body').evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await f.locator('#reset').click();await f.locator('#explode').fill('1');await settle(f);await page.screenshot({path:`/downloads/maison-mobile-exploded-${width}.png`});
 }
});

for(let l=0;l<5;l++)test(`floor ${l}: all furnished room views`,async({page})=>{const f=await ready(page);await f.locator(`[data-level="${l}"]`).click();await settle(f);await expect(f.locator("#room-nav button")).toHaveCount(3);for(let r=0;r<3;r++){await f.locator(`[data-room="${r}"]`).click();await settle(f);await expect(f.locator(`[data-room="${r}"]`)).toHaveAttribute("aria-pressed","true");await page.screenshot({path:`/downloads/maison-room-${l}-${r}.png`});}});
