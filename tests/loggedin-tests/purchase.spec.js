import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage.js';
import { CartPage } from '../../pages/CartPage.js';
import { CommonPage } from '../../pages/CommonPage.js';

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

test('Should add items to cart successfully', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const commonPage = new CommonPage(page);

    await page.goto('/inventory.html');
    await page.waitForLoadState('networkidle');

    await inventoryPage.inventoryItems.first().waitFor({ state: 'visible' });

    await cartPage.cleanUpShoppingCart();

    const productNames = ['Sauce Labs Backpack', 'Sauce Labs Bolt T-Shirt'];

    await inventoryPage.addProductToCart(productNames[0]);
    await inventoryPage.addProductToCart(productNames[1]);
    await expect(commonPage.shoppingCartBadge).toHaveText('2');

    await commonPage.shoppingCartBadge.click();
    await cartPage.inventoryItemName.first().waitFor({ state: 'visible' });
    const cartItems = await cartPage.inventoryItemName.count();
    expect(cartItems).toBe(2);
    for (let i = 0; i < productNames.length; i++) {
        await expect(cartPage.inventoryItemName.nth(i)).toHaveText(productNames[i]);
        await expect(cartPage.inventoryItemQuantity.nth(i)).toHaveText('1');
    }
});
