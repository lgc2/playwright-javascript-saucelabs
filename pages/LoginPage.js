export class LoginPage {
    constructor(page) {
        this.page = page;
        this.loginLogo = page.locator('.login_logo');
        this.iptUserName = page.locator('[data-test="username"]');
        this.iptPassword = page.locator('[data-test="password"]');
        this.btnLogin = page.locator('[data-test="login-button"]');
    }

    async navigate() {
        await this.page.goto('/');
    }

    async login(username, password) {
        await this.iptUserName.fill(username);
        await this.iptPassword.fill(password);
        await this.btnLogin.click();
    }
}