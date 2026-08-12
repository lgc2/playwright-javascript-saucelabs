import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage.js';

test('Should show products after login', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await page.goto('/inventory.html');
    await page.waitForLoadState('networkidle');

    const items = inventoryPage.inventoryItems;
    const itemNames = inventoryPage.inventoryItemNames;

    await items.first().waitFor({ state: 'visible' });

    const numberOfProducts = await items.count();
    expect(numberOfProducts).toBeGreaterThan(1);

    for (let i = 0; i < numberOfProducts; i++) {
        await expect(itemNames.nth(i)).toBeVisible();
    }
});
