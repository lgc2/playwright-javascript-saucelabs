export class CommonPage {
    constructor(page) {
        this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    }

    async isShoppingCartBadgeVisible() {
        return await this.shoppingCartBadge.isVisible();
    }
}
