import { test, expect } from '@playwright/test';
test('valves can isolate the home and the side street restores an alternate route',async({page})=>{
 await page.setViewportSize({width:393,height:851});await page.goto('/apps/little-drops');await page.getByRole('button',{name:'Valves & routes'}).click();
 await expect(page.getByRole('button',{name:'Street peeled back'})).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.ld-network-status')).toContainText('Home connected');
 await page.getByRole('button',{name:'Try a street closure'}).click();await expect(page.locator('.ld-network-status')).toContainText('Home disconnected');
 await page.getByRole('button',{name:'Side street valve'}).click();await expect(page.locator('.ld-network-status')).toContainText('Home connected');await expect(page.locator('.ld-network-challenge')).toContainText('Route found');
 await page.getByRole('button',{name:'Home connection valve'}).click();await expect(page.locator('.ld-network-status')).toContainText('Home disconnected');await page.getByRole('button',{name:'Home connection valve'}).click();
 await page.getByRole('button',{name:'Side street valve'}).focus();await page.keyboard.press('Space');await expect(page.locator('.ld-network-status')).toContainText('Home disconnected');await page.keyboard.press('Space');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'/downloads/little-drops-network-mobile.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1100});await page.getByRole('button',{name:'04 Below ground'}).click();await page.waitForTimeout(600);await page.screenshot({path:'/downloads/little-drops-network-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Reset valves'}).click();await expect(page.getByRole('button',{name:'Main street valve'})).toHaveAttribute('aria-pressed','true');await expect(page.getByRole('button',{name:'Side street valve'})).toHaveAttribute('aria-pressed','false');
});
test('guided playback advances and finishes even with WebGL disabled',async({browser})=>{
 const context=await browser.newContext();await context.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind,...args){return kind.includes('webgl')?null:original.call(this,kind,...args);};});const page=await context.newPage();await page.goto('/apps/little-drops');await expect(page.getByText('The journey still works.')).toBeVisible();await page.getByRole('button',{name:'04 Below ground'}).click();await page.getByRole('button',{name:'Play journey'}).click();await expect(page.getByRole('heading',{name:'An ordinary little miracle'})).toBeVisible({timeout:6500});await expect(page.getByRole('button',{name:'Play journey'})).toBeVisible();await context.close();
});
