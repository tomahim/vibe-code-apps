import {test,expect} from '@playwright/test';
const path='/artifacts/2026-11-08-one-ordinary-day';
test('all ten diary days work in the existing opaque gallery sandbox',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path);
 const f=page.frameLocator('iframe');await expect(page.locator('iframe')).toHaveAttribute('sandbox','allow-scripts');
 await expect(f.locator('#storyTitle')).toHaveText('Before the sun gets ahead');
 const stories=JSON.parse(await f.locator('#story-data').textContent());
 for(let i=0;i<10;i++){
  await f.locator('.spine').nth(i).click();await expect(f.locator('#sceneName')).toHaveText(stories[i].name);
  await f.locator('#fullButton').click();await expect(f.locator('.beat')).toHaveCount(stories[i].beats.length);
  await f.locator('.evidence summary').first().click();await expect(f.locator('.evidence input').first()).toHaveValue(stories[i].source);
  await f.locator('.evidence button').first().click();expect(await f.locator('.evidence input').first().evaluate(n=>n.selectionEnd-n.selectionStart)).toBe(stories[i].source.length);
 }
 await f.locator('#methodButton').click();await expect(f.locator('#method')).toBeVisible();await page.keyboard.press('Escape');await expect(f.locator('#method')).not.toBeVisible();
 await f.locator('#wake').fill('07:30');await expect(f.locator('#compareResult')).toContainText('07:30');await f.locator('#clearNotes').click();await expect(f.locator('#wake')).toHaveValue('');expect(errors).toEqual([]);
});
for(const width of [320,390,1440])test(`diary and expanded sources fit ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto(path);const f=page.frameLocator('iframe');await expect(f.locator('#storyTitle')).toBeVisible();
 for(let i=0;i<10;i++){
  if(width<681)await f.locator('#storySelect').selectOption(String(i));else await f.locator('.spine').nth(i).click();
  await f.locator('#fullButton').click();await f.locator('.evidence summary').first().click();await f.locator('#context summary').click();expect(await f.locator('body').evaluate(n=>n.scrollWidth<=innerWidth)).toBe(true);
 }
});
