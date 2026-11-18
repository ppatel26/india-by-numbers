import { defineConfig, devices } from '@playwright/test'

/** End-to-end tests run against the real Worker (wrangler dev) serving the built site. Run `pnpm build` first. */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:8788', trace: 'retain-on-failure' },
  webServer: {
    command: 'pnpm exec wrangler d1 migrations apply india-by-numbers --local && pnpm exec wrangler dev --port 8788 --log-level warn',
    url: 'http://localhost:8788/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
  ],
})
