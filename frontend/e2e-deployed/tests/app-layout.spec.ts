// Acceptance Test
// Traces to: L2-003, L2-037, L2-038
// Description: Verify responsive layout, sidebar/header visibility, navigation, and user menu

import { test, expect } from '@playwright/test';
import { AppLayoutPage } from '../page-objects/app-layout.page';

test.describe('App Layout', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should display sidebar on desktop', async ({ page }) => {
      const layout = new AppLayoutPage(page);
      await layout.goto();
      await layout.waitForLayout();

      await expect(layout.sidebar).toBeVisible();
      await expect(layout.sidebarLogo).toBeVisible();
    });

    test('should display sidebar navigation items', async ({ page }) => {
      const layout = new AppLayoutPage(page);
      await layout.goto();
      await layout.waitForLayout();

      await expect(layout.sidebarNavItems.first()).toBeVisible();
      const count = await layout.sidebarNavItems.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('should display user profile section in sidebar', async ({ page }) => {
      const layout = new AppLayoutPage(page);
      await layout.goto();
      await layout.waitForLayout();

      await expect(layout.sidebarUserProfile).toBeVisible();
      await expect(layout.sidebarUserName).toBeVisible();
    });

    test('should open user menu on desktop', async ({ page }) => {
      const layout = new AppLayoutPage(page);
      await layout.goto();
      await layout.waitForLayout();

      await layout.openDesktopUserMenu();
      await expect(page.locator('[mat-menu-item]', { hasText: 'My Profile' })).toBeVisible();
      await expect(page.locator('[mat-menu-item]', { hasText: 'Settings' })).toBeVisible();
      await expect(page.locator('.sign-out-item')).toBeVisible();
    });

    test('should navigate to profile from user menu', async ({ page }) => {
      const layout = new AppLayoutPage(page);
      await layout.goto();
      await layout.waitForLayout();

      await layout.openDesktopUserMenu();
      await page.locator('[mat-menu-item]', { hasText: 'My Profile' }).click();
      await page.waitForURL('**/profile', { timeout: 10000 });
      expect(page.url()).toContain('/profile');
    });

    test('should navigate to settings from user menu', async ({ page }) => {
      const layout = new AppLayoutPage(page);
      await layout.goto();
      await layout.waitForLayout();

      await layout.openDesktopUserMenu();
      await page.locator('[mat-menu-item]', { hasText: 'Settings' }).click();
      await page.waitForURL('**/settings', { timeout: 10000 });
      expect(page.url()).toContain('/settings');
    });

    test('should sign out from user menu', async ({ page }) => {
      const layout = new AppLayoutPage(page);
      await layout.goto();
      await layout.waitForLayout();

      await layout.openDesktopUserMenu();
      await layout.clickSignOut();
      await page.waitForURL('**/login', { timeout: 10000 });
      expect(page.url()).toContain('/login');
    });

    test('should highlight active nav item', async ({ page }) => {
      const layout = new AppLayoutPage(page);
      await layout.goto();
      await layout.waitForLayout();

      const activeItems = page.locator('.nav-item.active');
      await expect(activeItems.first()).toBeVisible();
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should display header instead of sidebar on mobile', async ({ page }) => {
      const layout = new AppLayoutPage(page);
      await layout.goto();
      await layout.waitForLayout();

      await expect(layout.header).toBeVisible();
      await expect(layout.sidebar).toBeHidden();
    });

    test('should display header title and avatar on mobile', async ({ page }) => {
      const layout = new AppLayoutPage(page);
      await layout.goto();
      await layout.waitForLayout();

      await expect(layout.headerTitle).toBeVisible();
      await expect(layout.headerAvatar).toBeVisible();
    });

    test('should open mobile user menu', async ({ page }) => {
      const layout = new AppLayoutPage(page);
      await layout.goto();
      await layout.waitForLayout();

      await layout.openMobileUserMenu();
      await expect(page.locator('[mat-menu-item]', { hasText: 'My Profile' })).toBeVisible();
      await expect(page.locator('[mat-menu-item]', { hasText: 'Settings' })).toBeVisible();
    });

    test('should sign out on mobile', async ({ page }) => {
      const layout = new AppLayoutPage(page);
      await layout.goto();
      await layout.waitForLayout();

      await layout.openMobileUserMenu();
      await layout.clickSignOut();
      await page.waitForURL('**/login', { timeout: 10000 });
      expect(page.url()).toContain('/login');
    });
  });
});
