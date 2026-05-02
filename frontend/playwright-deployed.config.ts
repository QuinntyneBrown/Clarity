import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for running E2E tests against a deployed instance.
 *
 * Required environment variables:
 *   DEPLOYED_BASE_URL  – the root URL of the deployed frontend (e.g. https://clarity.example.com)
 *
 * Optional:
 *   DEPLOYED_API_URL   – API base URL, used only by smoke checks
 */
export default defineConfig({
  testDir: './e2e-deployed/tests',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  reporter: 'html',
  timeout: 60000,
  use: {
    baseURL: process.env['DEPLOYED_BASE_URL'] || 'http://localhost:4201',
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
    actionTimeout: 15000,
  },
  projects: [
    {
      name: 'desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 812 },
      },
    },
  ],
});
