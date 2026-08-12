import { chromium, firefox, webkit } from 'playwright';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import playwrightConfig from './playwright.config.js';

dotenv.config();

const USERNAME = process.env.SAUCEDEMO_USERNAME;
const PASSWORD = process.env.SAUCEDEMO_PASSWORD;

async function makeAuth(browserType, outPath, baseURL) {
  const browser = await browserType.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(baseURL, { waitUntil: 'load' });
    // perform login
    await page.fill('[data-test="username"]', USERNAME);
    await page.fill('[data-test="password"]', PASSWORD);
    await page.click('[data-test="login-button"]');
    await page.waitForURL('**/inventory.html', { timeout: 10000 });
    await context.storageState({ path: outPath });
  } finally {
    await browser.close();
  }
}

export default async function globalSetup() {
  const baseURL = playwrightConfig?.use?.baseURL;

  const authDir = path.join(process.cwd(), 'playwright', '.auth');
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

  const browser = {
    name: 'loggedin-data-storage', type: chromium, out: path.join(authDir, 'loggedin-data-storage.json')
  };

  try {
    // eslint-disable-next-line no-console
    console.log(`global-setup: creating storage for ${browser.name}`);
    await makeAuth(browser.type, browser.out, baseURL);
    // eslint-disable-next-line no-console
    console.log(`global-setup: wrote ${browser.out}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    throw new Error(`global-setup: failed for ${browser.name}:`, e && e.message ? e.message : e);
  }
}
