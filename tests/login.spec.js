import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const username = process.env.SAUCEDEMO_USERNAME;
const password = process.env.SAUCEDEMO_PASSWORD;

test('Should login successfully', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await expect(page.locator('.login_logo')).toHaveText('Swag Labs');

  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
  await expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('[data-test="title"]')).toHaveText('Products');
});
