import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-admin/tests',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4202',
    trace: 'on-first-retry',
  },
  timeout: 120_000,
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
  webServer: [
    {
      command: 'dotnet run --project ../backend/src/Clarity.Api/Clarity.Api.csproj -- dropdb migratedb seeddb',
      url: 'https://localhost:50124/swagger/v1/swagger.json',
      ignoreHTTPSErrors: true,
      reuseExistingServer: !process.env['CI'],
      timeout: 120_000,
      env: {
        ASPNETCORE_ENVIRONMENT: 'Development',
      },
    },
    {
      command: 'npx ng serve clarity-admin --port 4202',
      url: 'http://localhost:4202',
      reuseExistingServer: !process.env['CI'],
      timeout: 120_000,
    },
  ],
});
