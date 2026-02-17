import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';

test.describe('Local Smoke Test', () => {
  const API_BASE = 'https://localhost:50124';

  test('API is reachable and returns swagger', async ({ request }) => {
    const response = await request.get(`${API_BASE}/swagger/v1/swagger.json`, {
      ignoreHTTPSErrors: true,
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.info.title).toBe('Clarity');
  });

  test('API returns boards', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/1.0/board`, {
      ignoreHTTPSErrors: true,
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.boards).toBeDefined();
    expect(body.boards.length).toBeGreaterThan(0);
  });

  test('API returns board states', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/1.0/boardstate`, {
      ignoreHTTPSErrors: true,
    });
    expect(response.ok()).toBeTruthy();
  });

  test('Frontend loads and renders kanban board', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'password123');
    await page.waitForURL('**/kanban', { timeout: 10000 });
    await expect(page.locator('app-kanban-board-controls .board-title')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('app-kanban-board-controls .board-title')).toHaveText(/Default/);
  });

  test('Frontend renders board columns', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'password123');
    await page.waitForURL('**/kanban', { timeout: 10000 });
    await page.locator('.kanban-column').first().waitFor({ state: 'visible', timeout: 15000 });
    const columns = page.locator('.kanban-column');
    expect(await columns.count()).toBe(3);
  });

  test('Frontend has no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'password123');
    await page.waitForURL('**/kanban', { timeout: 10000 });
    await page.locator('app-kanban-board-controls .board-title').waitFor({ state: 'visible', timeout: 15000 });
    const criticalErrors = errors.filter(e => !e.includes('favicon'));
    expect(criticalErrors).toEqual([]);
  });
});
