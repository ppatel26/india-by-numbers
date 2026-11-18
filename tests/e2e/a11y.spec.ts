import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { SAMPLE } from './site'

for (const path of SAMPLE) {
  test(`no serious accessibility problems on ${path} @mobile`, async ({ page }) => {
    await page.goto(path)
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(serious.map((v) => `${v.id}: ${v.nodes.length} (${v.nodes[0]?.target.join(' ')})`)).toEqual([])
  })
}
