// Render an NCRB page in English: post to /api/language/set as the page's own switch does,
// reload, save the HTML, and print each table row with its links.
// Usage: node pipeline/crime/ncrb_files.mjs <ncrb year page url> <out.html>
// NCRB serves Hindi by default, and the Hindi year pages list only part of each report.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const [url, out] = process.argv.slice(2);
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ userAgent: 'IndiaByNumbers/1.0 (+https://indiabynumbers.org/about/)' });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(e => console.error(e.message));
const r = await page.evaluate(async () => {
  const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
  const body = new URLSearchParams({ lang: 'en', slug: 'x', _csrf: csrf });
  const res = await fetch((window.baseHttpPath || location.origin) + '/api/language/set', { method: 'POST', body, credentials: 'include', headers: { 'X-Requested-With': 'XMLHttpRequest' } });
  return res.status + ' ' + (await res.text()).slice(0, 200);
});
console.error('lang/set', r);
await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(e => console.error(e.message));
await page.waitForTimeout(2000);
fs.writeFileSync(out, await page.content());
const rows = await page.evaluate(() => [...document.querySelectorAll('table tr')].map(tr => [...tr.querySelectorAll('td,th')].map(td => td.innerText.trim()).join(' | ') + ' || ' + [...tr.querySelectorAll('a')].map(a => a.href).join(' ')));
console.log(rows.join('\n'));
await browser.close();
