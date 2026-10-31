import {test,expect} from '@playwright/test';
async function runCycle(page){for(let i=0;i<6;i++)await page.locator('.ld-storage-actions .ld-discover').click();}
test('storage buffers a fictional rush and the balance table agrees',async({page})=>{
 await page.goto('/apps/little-drops');await page.getByRole('button',{name:'Storage & demand',exact:true}).click();await expect(page.locator('.ld-storage-status')).toContainText('Ready.');
 await page.getByRole('button',{name:'Small tank · 4 units',exact:true}).click();await runCycle(page);await expect(page.locator('.ld-storage-status')).toContainText('1 unit of demand unmet');await expect(page.getByRole('button',{name:'Cycle complete'})).toBeDisabled();
 await page.getByText('Show the balance, step by step').click();await expect(page.locator('.ld-storage-details tbody tr')).toHaveCount(6);await expect(page.locator('.ld-storage-details tbody tr').nth(3)).toContainText('One more shower');
 await page.getByRole('button',{name:'Larger tank · 12 units'}).click();await expect(page.locator('.ld-storage-status')).toContainText('Ready.');await runCycle(page);await expect(page.locator('.ld-storage-status')).toContainText('All demand met so far');
 await page.screenshot({path:'/downloads/little-drops-storage-desktop.png',fullPage:true});
 await page.locator('#ld-pump').fill('0');await expect(page.locator('.ld-storage-status')).toContainText('Ready.');await runCycle(page);await expect(page.locator('.ld-storage-status')).toContainText('21 units of demand unmet');
});
test('mobile storage lab is keyboard accessible without horizontal overflow',async({page})=>{
 await page.setViewportSize({width:393,height:851});await page.goto('/apps/little-drops');await page.getByRole('button',{name:'Storage & demand',exact:true}).click();await page.locator('#ld-pump').focus();await page.keyboard.press('ArrowRight');await expect(page.locator('#ld-pump')).toHaveValue('6');await page.getByRole('button',{name:'Small tank · 4 units',exact:true}).click();await runCycle(page);await page.getByText('Show the balance, step by step').click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'/downloads/little-drops-storage-mobile.png',fullPage:true});
});
