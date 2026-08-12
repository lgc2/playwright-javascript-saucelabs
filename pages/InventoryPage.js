export class InventoryPage {
    constructor(page) {
        this.page = page;
        this.pageTitle = page.locator('[data-test="title"]');
        this.inventoryItems = page.locator('[data-test="inventory-item"]');
        this.inventoryItemNames = page.locator('[data-test="inventory-item"] [data-test="inventory-item-name"]');
    }
}