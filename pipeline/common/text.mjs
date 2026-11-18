// Save the rendered HTML of a page and print its visible text.
// Usage: node pipeline/common/text.mjs <url> <out.html, for example raw/economy/pib/page.html> [maxchars]
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const [url, out, max] = process.argv.slice(2);
const browser = await chromium.launch({ headless: true, channel: 'chrome' }).catch(() => chromium.launch({ headless: true }));
const page = await (await browser.newContext({ userAgent: 'IndiaByNumbers/1.0 (+https://indiabynumbers.org/about/)' })).newPage();
await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(e => console.error(e.message));
await page.waitForTimeout(2500);
fs.writeFileSync(out, await page.content());
const t = (await page.evaluate(() => document.body.innerText)).replace(/\n{2,}/g, '\n');
console.log(t.slice(0, Number(max || 6000)));
await browser.close();
