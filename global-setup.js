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

  const browsers = [
    { name: 'loggedout-chromium', type: chromium, out: path.join(authDir, 'loggedout-chromium.json') },
    { name: 'loggedout-firefox', type: firefox, out: path.join(authDir, 'loggedout-firefox.json') },
    { name: 'loggedout-webkit', type: webkit, out: path.join(authDir, 'loggedout-webkit.json') },
  ];

  const failures = [];
  for (const b of browsers) {
    try {
      // eslint-disable-next-line no-console
      console.log(`global-setup: creating storage for ${b.name}`);
      await makeAuth(b.type, b.out, baseURL);
      // eslint-disable-next-line no-console
      console.log(`global-setup: wrote ${b.out}`);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`global-setup: failed for ${b.name}:`, e && e.message ? e.message : e);
      failures.push({ name: b.name, error: e });
    }
  }

  if (failures.length === browsers.length) {
    throw new Error(`globalSetup failed for all browsers: ${failures.map(f => f.name).join(', ')}`);
  }
}
