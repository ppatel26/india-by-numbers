import { expect, test } from '@playwright/test'
import { SAMPLE } from './site'

test('no script errors on any sample page @mobile', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  for (const path of SAMPLE) await page.goto(path)
  expect(errors).toEqual([])
})

test('chart tabs switch views, by mouse and keyboard', async ({ page }) => {
  await page.goto('/prices/')
  const frame = page.locator('[data-chart="cpi-inflation-by-state"]')
  await expect(frame.getByRole('tabpanel')).toHaveAttribute('id', /-map$/)
  await frame.getByRole('tab', { name: 'Table' }).click()
  await expect(frame.getByRole('table')).toBeVisible()
  await frame.getByRole('tab', { name: 'Table' }).press('ArrowLeft')
  await expect(frame.getByRole('tab', { name: 'Chart' })).toHaveAttribute('aria-selected', 'true')
  await expect(frame.getByRole('tab', { name: 'Chart' })).toBeFocused()
})

test('?tab=table opens the table on a chart page', async ({ page }) => {
  await page.goto('/charts/cpi-inflation/?tab=table')
  await expect(page.getByRole('table').first()).toBeVisible()
})

test('the tooltip shows a value on hover', async ({ page }) => {
  await page.goto('/prices/')
  await page.locator('[data-chart="cpi-inflation-by-state"] .tile[data-geo="kerala"]').first().hover()
  await expect(page.locator('.tip')).toContainText(/Kerala: -?\d+(\.\d+)?%/)
})

test('the number switch changes crore to million and is remembered', async ({ page }) => {
  await page.goto('/population/')
  const figure = page.locator('header .figure .value').first()
  await expect(figure).toContainText('crore')
  await page.getByRole('button', { name: 'Million' }).first().click()
  await expect(figure).toContainText(/million|billion/)
  await page.goto('/education/')
  await expect(page.getByRole('button', { name: 'Million' }).first()).toHaveAttribute('aria-pressed', 'true')
})

test('choosing a state marks it on every chart and carries to other pages', async ({ page }) => {
  await page.goto('/prices/')
  const picker = page.locator('[data-pick="select"]').first()
  await picker.locator('.trigger').click()
  await page.keyboard.type('kera')
  await page.keyboard.press('Enter')
  await expect(picker.locator('[data-pick-name]')).toHaveText('Kerala')
  await expect(page.locator('.row[data-geo="kerala"].is-sel').first()).toBeAttached()
  await expect(page.locator('[data-state-name]').first()).toHaveText('Kerala')
  await page.goto('/jobs/')
  await expect(page.locator('[data-geo="kerala"].is-sel').first()).toBeAttached()
})

test('search suggests topics, states and charts, in Hindi too @mobile', async ({ page, isMobile }) => {
  await page.goto(isMobile ? '/search/' : '/')
  const box = page.locator(isMobile ? '#page-q' : '#home-q')
  await box.fill('महंगाई')
  if (isMobile) await box.press('Enter')
  else await expect(page.locator('.typeahead a').first()).toContainText('Prices')
  await page.goto('/search/?q=kerala')
  await expect(page.locator('[data-search-results] a').first()).toHaveAttribute('href', '/states/kerala/')
})

test('a state page shows its names, ranks and the switch to other states', async ({ page }) => {
  await page.goto('/states/tamil-nadu/')
  await expect(page.locator('.names')).toContainText('தமிழ்நாடு')
  await expect(page.getByRole('row', { name: /Inflation, rural and urban/ })).toContainText(/\d+(st|nd|rd|th) (highest|lowest) of 36/)
  await page.locator('[data-pick="nav"] .trigger').click()
  await page.getByRole('option', { name: /Kerala/ }).click()
  await expect(page).toHaveURL(/\/states\/kerala\/$/)
  await expect(page.locator('.names')).toContainText('കേരളം')
})

test('Report a problem stores the report and says so', async ({ page }) => {
  await page.goto('/corrections/?chart=cpi-inflation')
  await page.getByLabel(/what looks wrong/i).fill('The October value looks off by one decimal.')
  await page.getByRole('button', { name: /send|report|submit/i }).click()
  await expect(page).toHaveURL(/sent=1/)
  await expect(page.getByRole('status').filter({ hasText: 'Thank you' })).toBeVisible()
})

test('pages fit a phone screen without sideways scrolling @mobile', async ({ page, isMobile }) => {
  test.skip(!isMobile)
  for (const path of ['/', '/prices/', '/charts/cpi-inflation-by-state/', '/states/tamil-nadu/', '/states/']) {
    await page.goto(path)
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(over, path).toBeLessThanOrEqual(0)
  }
})

test('the timeline steps the state map back to January', async ({ page }) => {
  await page.goto('/charts/cpi-inflation-by-state/')
  const slider = page.locator('[data-timeline] input[type="range"]')
  await slider.fill('0')
  await expect(page.locator('[data-timeline] output')).toHaveText('Jan 2026')
  await expect(page.locator('[data-timeline] [data-step="0"]')).toBeVisible()
  await expect(page.locator('[data-timeline] [data-step="9"]')).toBeHidden()
})

test('filtering all charts hides topics with no match and says when nothing matches', async ({ page }) => {
  await page.goto('/charts/')
  const box = page.getByPlaceholder(/Filter \d+ charts/)
  await box.fill('price')
  await expect(page.locator('section[aria-labelledby="t-prices"]')).toBeVisible()
  await expect(page.locator('section[aria-labelledby="t-population"]')).toBeHidden()
  await expect(page.locator('[data-filter-empty]')).toBeHidden()
  await box.fill('zzqx')
  await expect(page.locator('[data-filter-empty]')).toBeVisible()
  await box.fill('')
  await expect(page.locator('section[aria-labelledby="t-population"]')).toBeVisible()
})

test('the period switch shows the rupee since 1998 in place, in the open view', async ({ page }) => {
  await page.goto('/economy/')
  const daily = page.locator('#usd-inr-daily')
  const monthly = page.locator('#usd-inr-monthly')
  await expect(monthly).toBeHidden()
  await daily.getByRole('tab', { name: 'Table' }).click()
  await daily.locator('[data-period="usd-inr-monthly"]').click()
  await expect(daily).toBeHidden()
  await expect(monthly).toBeVisible()
  await expect(monthly.getByRole('tab', { name: 'Table' })).toHaveAttribute('aria-selected', 'true')
  await expect(monthly.locator('[data-period="usd-inr-monthly"]')).toBeFocused()
  await page.goto('/charts/usd-inr-monthly/')
  await page.locator('[data-period="usd-inr-annual"]').click()
  await expect(page).toHaveURL(/\/charts\/usd-inr-annual\/$/)
})

test('the change log filters by kind and topic, and says when nothing matches', async ({ page }) => {
  await page.goto('/releases/')
  const rows = page.locator('.log tbody tr:visible')
  const all = await rows.count()
  await page.locator('[data-topic="climate"]').click()
  await expect(page.locator('[data-topic="climate"]')).toHaveAttribute('aria-pressed', 'true')
  const climate = await rows.count()
  expect(climate).toBeGreaterThan(0)
  expect(climate).toBeLessThan(all)
  for (const r of await rows.all()) await expect(r).toHaveAttribute('data-row-topics', /\bclimate\b/)
  await page.locator('[data-kind="Correction"]').click()
  if ((await rows.count()) === 0) await expect(page.locator('[data-none]')).toBeVisible()
  await page.locator('[data-kind=""]').click()
  await page.locator('[data-topic=""]').click()
  await expect(rows).toHaveCount(all)
  await expect(page.locator('[data-none]')).toBeHidden()
})
