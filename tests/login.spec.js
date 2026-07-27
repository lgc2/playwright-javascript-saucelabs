import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import dotenv from 'dotenv';

dotenv.config();

const username = process.env.SAUCEDEMO_USERNAME;
const password = process.env.SAUCEDEMO_PASSWORD;

test('Should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  
  await loginPage.navigate();
  await expect(loginPage.loginLogo).toHaveText('Swag Labs');

  await loginPage.login(username, password);
  await expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');
  await expect(inventoryPage.pageTitle).toHaveText('Products');
});
