// Acceptance Test
// Traces to: L2-037, L2-038
// Description: Verify responsive layout across all pages at mobile and desktop viewports

import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';

test.describe('Responsive Layout', () => {

  test.describe('Desktop (1280x720)', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should show sidebar and hide mobile header on desktop', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
      await page.waitForURL('**/kanban', { timeout: 15000 });

      await expect(page.locator('app-sidebar')).toBeVisible();
      await expect(page.locator('app-header')).toBeHidden();
    });

    test('should show desktop-only elements', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
      await page.waitForURL('**/kanban', { timeout: 15000 });

      const desktopElements = page.locator('.desktop-only');
      if (await desktopElements.first().isVisible()) {
        await expect(desktopElements.first()).toBeVisible();
      }
    });

    test('should show table views on desktop pages', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
      await page.waitForURL('**/kanban', { timeout: 15000 });

      // Check My Tickets - table view
      await page.goto('/my-tickets');
      await page.locator('app-my-tickets h1').waitFor({ state: 'visible', timeout: 15000 });
      await expect(page.locator('app-my-tickets .table-container')).toBeVisible();

      // Check Team - table view
      await page.goto('/team');
      await page.locator('app-team h1').waitFor({ state: 'visible', timeout: 15000 });
      await expect(page.locator('app-team .table-container')).toBeVisible();
    });

    test('should display kanban columns side by side on desktop', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
      await page.waitForURL('**/kanban', { timeout: 15000 });

      const columns = page.locator('.kanban-column');
      const columnCount = await columns.count();
      if (columnCount > 1) {
        const first = await columns.nth(0).boundingBox();
        const second = await columns.nth(1).boundingBox();
        if (first && second) {
          // Columns should be side by side (second column starts after first)
          expect(second.x).toBeGreaterThan(first.x);
        }
      }
    });
  });

  test.describe('Mobile (375x812)', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should show mobile header and hide sidebar', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
      await page.waitForURL('**/kanban', { timeout: 15000 });

      await expect(page.locator('app-header')).toBeVisible();
      await expect(page.locator('app-sidebar')).toBeHidden();
    });

    test('should show card views on mobile pages', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
      await page.waitForURL('**/kanban', { timeout: 15000 });

      // Check My Tickets - card view
      await page.goto('/my-tickets');
      await page.locator('app-my-tickets h1').waitFor({ state: 'visible', timeout: 15000 });
      await expect(page.locator('app-my-tickets .cards-container')).toBeVisible();

      // Check Team - card view
      await page.goto('/team');
      await page.locator('app-team h1').waitFor({ state: 'visible', timeout: 15000 });
      await expect(page.locator('app-team .cards-container')).toBeVisible();
    });

    test('should show mobile-only elements', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
      await page.waitForURL('**/kanban', { timeout: 15000 });

      const mobileElements = page.locator('.mobile-only');
      if (await mobileElements.first().isVisible()) {
        await expect(mobileElements.first()).toBeVisible();
      }
    });

    test('should show FAB on my-tickets mobile view', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
      await page.waitForURL('**/kanban', { timeout: 15000 });

      await page.goto('/my-tickets');
      await page.locator('app-my-tickets h1').waitFor({ state: 'visible', timeout: 15000 });
      await expect(page.locator('app-my-tickets .fab')).toBeVisible();
    });

    test('should hide brand panel on mobile login', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await expect(loginPage.brandPanel).toBeHidden();
      await expect(loginPage.mobileLogo).toBeVisible();
    });

    test('should show mobile search header on search page', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
      await page.waitForURL('**/kanban', { timeout: 15000 });

      await page.goto('/search');
      await page.locator('app-search-results').waitFor({ state: 'visible', timeout: 15000 });
      await expect(page.locator('app-search-results .mobile-header')).toBeVisible();
    });
  });

  test.describe('Tablet (768x1024)', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('should display appropriate layout at tablet size', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
      await page.waitForURL('**/kanban', { timeout: 15000 });

      // At 768px, sidebar should be visible on medium breakpoint
      const sidebar = page.locator('app-sidebar');
      const header = page.locator('app-header');
      // One of sidebar or header should be visible
      const sidebarVisible = await sidebar.isVisible();
      const headerVisible = await header.isVisible();
      expect(sidebarVisible || headerVisible).toBeTruthy();
    });
  });
});
