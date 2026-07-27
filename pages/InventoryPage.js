class InventoryPage {
    constructor(page) {
        this.page = page;
        this.pageTitle = page.locator('[data-test="title"]');
    }
}

module.exports = { InventoryPage };