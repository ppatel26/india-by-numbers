// List the documents in one group of the MoRTH "Reports/Presentation and Publications" page.
// morth.gov.in is a JavaScript app with no static list, and it serves Hindi by default.
// The script opens the page, clicks "View all" on the group, and saves every JSON response the app
// fetches, so the document titles, dates and file paths come from the publisher's own API.
// Usage: node pipeline/transport/morth_reports.mjs <out-dir, for example raw/transport/morth/pages> [group title]
// Default group: "भारत में सड़क दुर्घटनाएँ" (Road Accidents in India).
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const [out, group = 'भारत में सड़क दुर्घटनाएँ'] = process.argv.slice(2);
if (!out) { console.error('usage: morth_reports.mjs <out-dir> [group title]'); process.exit(2); }
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' }).catch(() => chromium.launch({ headless: true }));
const page = await (await browser.newContext({ userAgent: 'IndiaByNumbers/1.0 (+https://indiabynumbers.org/about/)' })).newPage();
let n = 0;
page.on('response', async r => {
  const type = r.headers()['content-type'] || '';
  if (!type.includes('json')) return;
  try {
    const body = await r.text();
    n += 1;
    const name = `api-${String(n).padStart(3, '0')}.json`;
    fs.writeFileSync(path.join(out, name), body);
    fs.appendFileSync(path.join(out, '_api.tsv'), `${name}\t${r.request().method()}\t${r.url()}\t${r.request().postData() || ''}\n`);
  } catch { /* a redirect has no body */ }
});
await page.goto('https://morth.gov.in/#/documents/reports', { waitUntil: 'networkidle', timeout: 90000 }).catch(e => console.error(e.message));
await page.waitForTimeout(2500);
const row = page.locator('.list_det_bx', { hasText: group }).first();
await row.locator('a.viw').first().click();
await page.waitForLoadState('networkidle').catch(() => {});
await page.waitForTimeout(4000);
fs.writeFileSync(path.join(out, 'group.html'), await page.content());
console.log((await page.evaluate(() => document.body.innerText)).replace(/\n{2,}/g, '\n').slice(0, 6000));
await browser.close();
