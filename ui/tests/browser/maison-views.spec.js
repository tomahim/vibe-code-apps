import {test,expect} from '@playwright/test';
test('final separated and evening pixels',async({page})=>{
 await page.goto('/artifacts/2026-10-25-maison-des-heures');const f=page.frameLocator('iframe');await expect(f.locator('#loading')).toBeHidden();
 await f.locator('#explode').fill('1');await f.locator('canvas').evaluate(()=>new Promise(resolve=>{const t=()=>window.__maison.state.explode>.98&&!window.__maison.state.transition?resolve():setTimeout(t,100);t();}));await page.waitForTimeout(2000);await page.screenshot({path:'/downloads/maison-final-exploded.png'});
 await f.locator('#reset').click();await f.locator('#light').click();await f.locator('canvas').evaluate(()=>new Promise(resolve=>{const t=()=>window.__maison.state.nightMix>.95&&!window.__maison.state.transition?resolve():setTimeout(t,100);t();}));await page.waitForTimeout(2000);await page.screenshot({path:'/downloads/maison-final-evening.png'});
});
