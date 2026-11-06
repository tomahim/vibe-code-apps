import { test, expect } from '@playwright/test';
for (const width of [393, 1440]) {
 test(`bilingual glossary navigation and readable cards at ${width}px`, async ({ page }) => {
  await page.setViewportSize({width, height: 900});
  await page.goto('/apps/lithotheque');
  await page.getByRole('button', {name:'Glossaire · Glossary', exact:true}).click();
  await expect(page.getByRole('heading', {name:'Glossaire géologique'})).toBeVisible();
  const card = page.locator('[data-term="affleurement"]');
  await expect(card.getByRole('heading')).toHaveText('Affleurement');
  await expect(card.getByRole('link', {name:'Source',exact:true})).toHaveAttribute('href','https://fr.wikipedia.org/wiki/Affleurement');
  await card.getByRole('button', {name:/read in English/}).click();
  await expect(card.getByRole('heading')).toHaveText('Outcrop');
  await expect(card.getByRole('link', {name:'Source',exact:true})).toHaveAttribute('href','https://en.wikipedia.org/wiki/Outcrop');
  await card.getByRole('button').focus(); await page.keyboard.press('Enter');
  await expect(card.getByRole('heading')).toHaveText('Affleurement');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({path:`/downloads/lithotheque-glossary-fr-${width}.png`});
  await card.screenshot({path:`/downloads/lithotheque-card-fr-${width}.png`, animations: 'disabled'});
  await card.getByRole('button').click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({path:`/downloads/lithotheque-glossary-en-${width}.png`});
  await card.screenshot({path:`/downloads/lithotheque-card-en-${width}.png`, animations: 'disabled'});
  await page.getByRole('button', {name:'Roches & sédiments',exact:true}).click();
  await expect(page.locator('.gcard')).toHaveCount(17);
  await page.getByRole('searchbox').fill('gres');
  await expect(page.getByRole('heading', {name:'Grès',exact:true})).toBeVisible();
  await expect(page.locator('.gcard')).toHaveCount(1);
  await page.getByRole('searchbox').fill('sandstone');
  await expect(page.locator('.gcard')).toHaveCount(1);
  await page.getByRole('searchbox').fill('zzzz'); await expect(page.getByText('Aucun mot trouvé · No terms found.')).toBeVisible();
  await page.getByRole('searchbox').fill('');
  await page.getByRole('button', {name:'Planète Terre',exact:true}).click();
  await expect(page.getByRole('heading', {name:'Lithosphère',exact:true})).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', {name:'Catalogue',exact:true}).click();
  await expect(page.locator('.litho-benchcard')).toHaveCount(6);
 });
}

for (const width of [393, 1440]) {
 test(`GEO petrography follow-up preserves plural and fits at ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:900});
  await page.goto('/apps/lithotheque');
  await page.getByRole('button',{name:'Glossaire · Glossary',exact:true}).click();
  await page.getByRole('button',{name:'Méthodes & métiers',exact:true}).click();
  await expect(page.locator('.gcard')).toHaveCount(2);
  await expect(page.getByRole('heading',{name:'Pétrographie',exact:true})).toBeVisible();
  const card=page.locator('[data-term="litholamelleurs"]');
  await expect(card.getByRole('heading')).toHaveText('Litholamelleurs');
  await expect(card.locator('img')).toBeVisible();
  await page.locator('.gcard img').evaluateAll(async images=>{await Promise.all(images.map(i=>i.decode().catch(()=>{})))});
  await page.screenshot({path:`/downloads/lithotheque-petro-fr-${width}.png`,fullPage:true});
  await card.getByRole('button').click();
  await expect(card.getByRole('heading')).toHaveText('Thin section technicians');
  await expect(card.getByRole('link',{name:'Source',exact:true})).toHaveAttribute('href','https://le.ac.uk/people/annika-burns');
  await card.screenshot({path:`/downloads/lithotheque-technicians-en-${width}.png`});
  await page.getByRole('searchbox').fill('petrographie');
  await expect(page.locator('.gcard')).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}

test('silica bilingual card is searchable and readable on mobile',async ({page})=>{
 await page.setViewportSize({width:393,height:900});
 await page.goto('/apps/lithotheque');
 await page.getByRole('button',{name:'Glossaire · Glossary',exact:true}).click();
 await page.getByRole('searchbox').fill('silice');
 const c=page.locator('[data-term="silice"]');
 await expect(page.locator('.gcard')).toHaveCount(1);
 await expect(c.getByRole('heading')).toHaveText('Silice');
 await c.locator('img').evaluate(i=>i.decode());
 await c.screenshot({path:'/downloads/lithotheque-silica-fr.png'});
 await c.getByRole('button').click();
 await expect(c.getByRole('heading')).toHaveText('Silica');
 await expect(c.getByRole('link',{name:'Source',exact:true})).toHaveAttribute('href','https://en.wikipedia.org/wiki/Silicon_dioxide');
 await c.screenshot({path:'/downloads/lithotheque-silica-en.png'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
