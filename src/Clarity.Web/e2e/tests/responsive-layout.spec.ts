import { test, expect } from '@playwright/test';
import { AppLayoutPage } from '../page-objects/app-layout.page';
import { LoginPage } from '../page-objects/login.page';

test.describe('Responsive Layout - Desktop', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Desktop only');
  });

  let layout: AppLayoutPage;

  test.beforeEach(async ({ page }) => {
    layout = new AppLayoutPage(page);
    await layout.goto();
    await layout.waitForLayout();
  });

  test('should show sidebar on desktop', async () => {
    await expect(layout.sidebar).toBeVisible();
    await expect(layout.header).not.toBeVisible();
  });

  test('should display sidebar logo', async () => {
    await expect(layout.sidebarLogo).toHaveText('Clarity');
  });

  test('should display navigation items in sidebar', async () => {
    const expectedItems = ['Boards', 'My Tickets', 'Team', 'Settings'];
    const count = await layout.sidebarNavItems.count();
    expect(count).toBe(4);
    for (let i = 0; i < expectedItems.length; i++) {
      await expect(layout.sidebarNavItems.nth(i)).toContainText(expectedItems[i]);
    }
  });

  test('should display user profile in sidebar', async () => {
    await expect(layout.sidebarUserName).toHaveText('Quinntyne Brown');
  });

  test('should show search button text on desktop', async ({ page }) => {
    const searchText = page.locator('.search-text');
    await expect(searchText).toBeVisible();
  });

  test('should show kanban columns side by side on desktop', async ({ page }) => {
    await page.locator('.kanban-column').first().waitFor({ state: 'visible', timeout: 15000 });
    const columns = page.locator('.kanban-column');
    const count = await columns.count();
    expect(count).toBe(3);

    // Verify columns are laid out horizontally (each column's x should increase)
    const firstBox = await columns.nth(0).boundingBox();
    const secondBox = await columns.nth(1).boundingBox();
    expect(firstBox).toBeTruthy();
    expect(secondBox).toBeTruthy();
    expect(secondBox!.x).toBeGreaterThan(firstBox!.x);
  });

  test('should sign out from desktop and navigate to login', async ({ page }) => {
    await layout.openDesktopUserMenu();
    await page.locator('.sign-out-item').waitFor({ state: 'visible' });
    await layout.clickSignOut();
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Responsive Layout - Mobile', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'desktop', 'Mobile only');
  });

  let layout: AppLayoutPage;

  test.beforeEach(async ({ page }) => {
    layout = new AppLayoutPage(page);
    await layout.goto();
    await layout.waitForLayout();
  });

  test('should show header on mobile', async () => {
    await expect(layout.header).toBeVisible();
    await expect(layout.sidebar).not.toBeVisible();
  });

  test('should display app title in header', async () => {
    await expect(layout.headerTitle).toHaveText('Clarity');
  });

  test('should display user avatar in header', async () => {
    await expect(layout.headerAvatar).toBeVisible();
  });

  test('should hide search button text on mobile', async ({ page }) => {
    const searchText = page.locator('.search-text');
    await expect(searchText).not.toBeVisible();
  });

  test('should stack kanban columns vertically on mobile', async ({ page }) => {
    await page.locator('.kanban-column').first().waitFor({ state: 'visible', timeout: 15000 });
    const columns = page.locator('.kanban-column');

    // Verify columns are laid out vertically (each column's y should increase)
    const firstBox = await columns.nth(0).boundingBox();
    const secondBox = await columns.nth(1).boundingBox();
    expect(firstBox).toBeTruthy();
    expect(secondBox).toBeTruthy();
    expect(secondBox!.y).toBeGreaterThan(firstBox!.y);
  });

  test('should open mobile user menu', async ({ page }) => {
    await layout.openMobileUserMenu();
    await expect(page.locator('.sign-out-item')).toBeVisible();
  });

  test('should sign out from mobile and navigate to login', async ({ page }) => {
    await layout.openMobileUserMenu();
    await page.locator('.sign-out-item').waitFor({ state: 'visible' });
    await layout.clickSignOut();
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show board title on mobile', async ({ page }) => {
    const boardTitle = page.locator('.board-title');
    await expect(boardTitle).toBeVisible();
  });

  test('should show add ticket button on mobile', async ({ page }) => {
    const addBtn = page.locator('.add-btn');
    await expect(addBtn).toBeVisible();
  });
});
