import { test, expect } from '@playwright/test';
test.beforeEach(async({page})=>{await page.goto('/apps/little-drops');await expect(page.getByRole('heading',{name:'Follow something small.' ,exact:false})).toBeVisible();});
test('journey, cutaway, discoveries and local persistence',async({page})=>{
  await expect(page.locator('.ld-scene canvas')).toBeVisible();
  await page.getByRole('button',{name:'04 Below ground'}).click();
  await expect(page.getByRole('heading',{name:'The street has a basement'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Street peeled back'})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Look a little closer'}).click();
  await expect(page.getByText('1 of 5 discoveries opened.')).toBeVisible();
  await page.reload();await expect(page.getByText('1 of 5 discoveries opened.')).toBeVisible();
  await page.getByRole('button',{name:'Rotate city right'}).click();
  await page.getByRole('navigation',{name:'Journey stops'}).getByRole('button',{name:'Below ground',exact:false}).click();await page.waitForTimeout(800);await page.screenshot({path:'/downloads/little-drops-desktop.png',fullPage:true});
});
test('pressure experiment and treatment sequence',async({page})=>{
  await page.locator('#ld-height').fill('40');await expect(page.locator('.ld-pressure-value strong')).toHaveText('392');
  await page.getByText('Make a prediction').click();await page.getByRole('button',{name:'It doubles',exact:true}).click();await expect(page.locator('#ld-panel-pressure p[role=status]')).toContainText('Yes.');
  await page.getByRole('button',{name:'Inside treatment',exact:true}).click();await page.getByRole('button',{name:'4. Disinfect'}).click();await expect(page.locator('.ld-lab')).toContainText('Disinfection kills remaining germs.');
  await page.getByRole('button',{name:'Play journey'}).click();await expect(page.getByRole('button',{name:'Pause journey'})).toBeVisible();await page.getByRole('button',{name:'Pause journey'}).click();
});
test('mobile layout, keyboard access and no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:393,height:851});await page.getByRole('button',{name:'03 The tower'}).click();await page.getByRole('button',{name:'Look a little closer'}).click();
 await expect(page.locator('.ld-detail')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Peel back the street'}).click();await page.waitForTimeout(800);await page.screenshot({path:'/downloads/little-drops-mobile.png',fullPage:true});
 await page.locator('#ld-height').focus();await page.keyboard.press('ArrowRight');await expect(page.locator('#ld-height')).toHaveValue('26');
});
test('WebGL disabled retains complete reading and experiments',async({browser})=>{
 const context=await browser.newContext();await context.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind,...args){return kind.includes('webgl')?null:original.call(this,kind,...args);};});const page=await context.newPage();await page.goto('/apps/little-drops');await expect(page.getByText('The journey still works.')).toBeVisible();await page.getByRole('button',{name:'05 Your tap'}).click();await expect(page.getByRole('heading',{name:'An ordinary little miracle'})).toBeVisible();await context.close();
});

test('gallery exposes Little Drops without API support',async({page})=>{await page.route('**/api/apps/',route=>route.fulfill({json:{apps:[]}}));await page.goto('/');await page.getByRole('searchbox',{name:'Search apps'}).fill('little drops');await expect(page.locator('.app-card')).toHaveCount(1);await page.locator('.app-card').click();await expect(page).toHaveURL(/apps\/little-drops/);});
