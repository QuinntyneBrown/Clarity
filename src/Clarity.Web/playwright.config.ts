import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4201',
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: [
    {
      command: 'dotnet run --project ../Clarity.Api/Clarity.Api.csproj -- --urls "https://localhost:50124" dropdb migratedb seeddb',
      url: 'https://localhost:50124/swagger/v1/swagger.json',
      reuseExistingServer: !process.env['CI'],
      timeout: 120000,
      ignoreHTTPSErrors: true,
      env: { ASPNETCORE_ENVIRONMENT: 'Development' },
    },
    {
      command: 'npx ng serve clarity --port 4201',
      url: 'http://localhost:4201',
      reuseExistingServer: !process.env['CI'],
      timeout: 120000,
    },
  ],
});
