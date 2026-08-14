import { expect } from '@playwright/test';
import { CommonPage } from '../pages/CommonPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import playwrightConfig from '../playwright.config.js';

export class CartPage {
    constructor(page) {
        this.page = page;
        this.inventoryItemName = page.locator('[data-test="inventory-item-name"]');
        this.inventoryItemQuantity = page.locator('[data-test="item-quantity"]');
        this.btnRemove = page.locator('[data-test^="remove-"]');
    }

    async cleanUpShoppingCart() {
        const commonPage = new CommonPage(this.page);
        const inventoryPage = new InventoryPage(this.page);

        if (await commonPage.isShoppingCartBadgeVisible()) {
            await commonPage.shoppingCartBadge.click();

            await this.inventoryItemName.first().waitFor({ state: 'visible' });

            let numberOfItems = await this.btnRemove.count();
            expect(numberOfItems).toBeGreaterThan(0);

            for (let i = 0; i < numberOfItems; i++) {
                await this.btnRemove.first().click();
            }

            numberOfItems = await this.btnRemove.count();
            expect(numberOfItems).toBe(0);

            await this.page.goto(`${playwrightConfig?.use?.baseURL}inventory.html`);
            await inventoryPage.inventoryItems.first().waitFor({ state: 'visible' });
        }
    }
}
