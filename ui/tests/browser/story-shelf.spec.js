import { test, expect } from '@playwright/test';

test('story room gallery, category shelves, closed book and complete reader', async ({ page, browserName }) => {
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/api/apps/',r=>r.fulfill({json:{apps:[]}}));
  await page.goto('/');
  await page.getByRole('button',{name:/The Story Room/}).click();
  await expect(page).toHaveURL(/\/apps\/story-shelf/);
  await expect(page.getByRole('heading',{name:'Every spine.'})).toBeVisible();
  await expect(page.getByRole('button',{name:/^Read /})).toHaveCount(4);
  await expect(page.locator('.ss-room-canvas canvas')).toHaveAttribute('data-ready','true');
  await page.screenshot({path:`/downloads/${browserName}-story-room-desktop-shelves.png`,fullPage:true});
  await page.getByRole('button',{name:'Nature',exact:true}).click();
  await expect(page.getByRole('button',{name:/^Read /})).toHaveCount(1);
  await page.getByRole('button',{name:/Read The Acorn/}).click();
  await expect(page.getByRole('button',{name:/Open The Acorn/})).toBeVisible();
  await page.screenshot({path:`/downloads/${browserName}-story-room-desktop-closed.png`,fullPage:true});
  await page.getByRole('button',{name:/Open The Acorn/}).click();
  await expect(page.getByText('Page 1 of 5',{exact:true})).toBeVisible();
  await expect(page.locator('.ss-diorama canvas')).toBeVisible();
  await page.screenshot({path:`/downloads/${browserName}-story-room-desktop-open.png`,fullPage:true});
  await page.getByRole('button',{name:'Next page'}).click();
  await expect(page.getByText('Page 2 of 5',{exact:true})).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByText('Page 1 of 5',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Go to page 5'}).click();
  await expect(page.getByRole('button',{name:'Return to shelves'})).toBeVisible();
  await page.getByRole('button',{name:'Return to shelves'}).click();
  await expect(page.getByRole('button',{name:/Read The Acorn/})).toBeFocused();
  expect(errors).toEqual([]);
});

test('mobile reading, every book and no horizontal overflow', async ({ page, browserName }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/apps/story-shelf');
  await expect(page.getByRole('button',{name:/^Read /})).toHaveCount(4);
  await expect(page.locator('.ss-room-canvas canvas')).toHaveAttribute('data-ready','true');
  await page.screenshot({path:`/downloads/${browserName}-story-room-mobile-shelves.png`,fullPage:true});
  const names=await page.getByRole('button',{name:/^Read /}).allTextContents();
  for(let i=0;i<4;i++) {
    await page.getByRole('button',{name:/^Read /}).nth(i).click();
    if(i===0) await page.screenshot({path:`/downloads/${browserName}-story-room-mobile-closed.png`,fullPage:true});
    await page.locator('.ss-closed-book').click();
    await expect(page.locator('.ss-story-illustration')).toBeVisible();
    await expect(page.locator('.ss-diorama canvas')).toBeVisible();
    if(i===0) await page.screenshot({path:`/downloads/${browserName}-story-room-mobile-open.png`,fullPage:true});
    for(let n=1;n<=5;n++) {
      await page.getByRole('button',{name:`Go to page ${n}`}).click();
      await expect(page.getByText(`Page ${n} of 5`,{exact:true})).toBeVisible();
      await expect(page.locator('.ss-story-illustration')).toHaveJSProperty('complete',true);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    }
    await page.keyboard.press('Escape');
  }
  expect(names.length).toBe(4);
});

test('reduced motion and WebGL unavailable preserve the whole story', async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=()=>null;});
  await page.goto('/apps/story-shelf');
  await page.getByRole('button',{name:/Read Mary/}).click();
  await page.locator('.ss-closed-book').click();
  await expect(page.getByText('The paper sculpture needs WebGL.',{exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Next page'}).click();
  await expect(page.getByText('Page 2 of 5',{exact:true})).toBeVisible();
  await expect(page.locator('.ss-turn-leaf')).toHaveCount(0);
});

 test('narrow 320px layout and page turn animation',async({page})=>{
  await page.setViewportSize({width:320,height:700});await page.goto('/apps/story-shelf');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:/Read A Mountain/}).click();await page.locator('.ss-closed-book').click();
  await page.getByRole('button',{name:'Next page'}).click();
  await expect(page.locator('.ss-turn-leaf')).toBeVisible();
  await expect(page.getByText('Page 2 of 5',{exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('real 3D shelf book can be picked with pointer raycasting', async({page})=>{
  await page.goto('/apps/story-shelf');
  const canvas=page.locator('.ss-room-canvas canvas');
  await expect(canvas).toHaveAttribute('data-ready','true');
  await canvas.scrollIntoViewIfNeeded();
  const box=await canvas.boundingBox();
  // First book on the upper shelf, from the visually checked fixed camera.
  await page.mouse.click(box.x+box.width*.345,box.y+box.height*.22);
  await expect(page.getByRole('button',{name:/Open The Printer/})).toBeVisible();
});
