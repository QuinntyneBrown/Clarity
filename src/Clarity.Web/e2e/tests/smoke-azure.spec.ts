import { test, expect } from '@playwright/test';

const AZURE_API_URL = process.env['AZURE_API_URL'];
const AZURE_APP_URL = process.env['AZURE_APP_URL'];

test.describe('Azure Smoke Test', () => {
  test.skip(!AZURE_API_URL || !AZURE_APP_URL, 'Set AZURE_API_URL and AZURE_APP_URL env vars to run');

  test('API health check - swagger responds', async ({ request }) => {
    const response = await request.get(`${AZURE_API_URL}/swagger/v1/swagger.json`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.info.title).toBe('Clarity');
  });

  test('API returns boards', async ({ request }) => {
    const response = await request.get(`${AZURE_API_URL}/api/1.0/board`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.boards).toBeDefined();
    expect(Array.isArray(body.boards)).toBeTruthy();
  });

  test('API returns board states', async ({ request }) => {
    const response = await request.get(`${AZURE_API_URL}/api/1.0/boardstate`);
    expect(response.ok()).toBeTruthy();
  });

  test('Frontend loads', async ({ page }) => {
    await page.goto(AZURE_APP_URL!);
    await expect(page).toHaveTitle(/.*/);
  });

  test('Frontend renders kanban board', async ({ page }) => {
    await page.goto(AZURE_APP_URL!);
    await expect(page.locator('app-kanban-board-controls span')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('app-kanban-board-controls span')).toHaveText(/Default/);
  });

  test('Frontend renders board columns', async ({ page }) => {
    await page.goto(AZURE_APP_URL!);
    await page.locator('.kanban-board__column').first().waitFor({ state: 'visible', timeout: 30000 });
    const columns = page.locator('.kanban-board__column');
    expect(await columns.count()).toBe(3);
  });
});
