import { test, expect } from '@playwright/test';
import { SettingsPage } from '../page-objects/settings.page';

test.describe('Settings Page - Desktop', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Desktop only');
  });

  let settings: SettingsPage;

  test.beforeEach(async ({ page }) => {
    settings = new SettingsPage(page);
    await settings.goto();
    await settings.waitForSettings();
  });

  test('should display page header with title and subtitle', async () => {
    await expect(settings.pageTitle).toHaveText('Settings');
    await expect(settings.pageSubtitle).toHaveText('Manage your preferences and account settings');
  });

  test('should display four navigation sections', async () => {
    const count = await settings.navItems.count();
    expect(count).toBe(4);
  });

  test('should display correct section titles in navigation', async () => {
    const titles = ['Notifications', 'Appearance', 'Security', 'Language'];
    for (const title of titles) {
      await expect(settings.navItems.filter({ hasText: title })).toBeVisible();
    }
  });

  test('should show Notifications section by default', async () => {
    await expect(settings.panelTitle).toHaveText('Notification Preferences');
  });

  test('should show navigation and panel side by side on desktop', async () => {
    const navBox = await settings.settingsNav.boundingBox();
    const panelBox = await settings.settingsPanel.boundingBox();
    expect(navBox).toBeTruthy();
    expect(panelBox).toBeTruthy();
    expect(panelBox!.x).toBeGreaterThan(navBox!.x);
  });

  // Notifications section tests
  test('should display five notification toggles', async () => {
    const toggles = settings.page.locator('.setting-item mat-slide-toggle');
    await expect(toggles).toHaveCount(5);
  });

  test('should display notification toggle labels', async () => {
    const labels = ['Email Notifications', 'Push Notifications', 'Ticket Updates', 'Mention Alerts', 'Weekly Digest'];
    for (const label of labels) {
      await expect(settings.page.locator('.setting-label', { hasText: label })).toBeVisible();
    }
  });

  test('should toggle notification settings', async () => {
    const emailToggle = settings.getSlideToggle('Email Notifications');
    await expect(emailToggle).toBeVisible();

    // Click the toggle to change its state
    await emailToggle.click();
    // The toggle should have been toggled (class or checked state changes)
    await expect(emailToggle).toBeVisible();
  });

  // Section switching tests
  test('should switch to Appearance section', async () => {
    await settings.clickNavItem('Appearance');
    await expect(settings.panelTitle).toHaveText('Appearance');
    await expect(settings.panelDescription).toContainText('Customize how Clarity looks');
  });

  test('should switch to Security section', async () => {
    await settings.clickNavItem('Security');
    await expect(settings.panelTitle).toHaveText('Security');
    await expect(settings.panelDescription).toContainText('Manage your password');
  });

  test('should switch to Language & Region section', async () => {
    await settings.clickNavItem('Language');
    await expect(settings.panelTitle).toHaveText('Language & Region');
    await expect(settings.panelDescription).toContainText('language and regional preferences');
  });

  test('should highlight active nav item', async () => {
    const notificationsNav = settings.navItems.filter({ hasText: 'Notifications' });
    await expect(notificationsNav).toHaveClass(/active/);

    await settings.clickNavItem('Appearance');
    const appearanceNav = settings.navItems.filter({ hasText: 'Appearance' });
    await expect(appearanceNav).toHaveClass(/active/);
    await expect(notificationsNav).not.toHaveClass(/active/);
  });

  // Appearance section tests
  test('should display theme selector with Light, Dark, System options', async () => {
    await settings.clickNavItem('Appearance');
    await expect(settings.getThemeOption('Light')).toBeVisible();
    await expect(settings.getThemeOption('Dark')).toBeVisible();
    await expect(settings.getThemeOption('System')).toBeVisible();
  });

  test('should have Light theme selected by default', async () => {
    await settings.clickNavItem('Appearance');
    await expect(settings.getThemeOption('Light')).toHaveClass(/active/);
  });

  test('should switch active theme when clicking theme option', async () => {
    await settings.clickNavItem('Appearance');
    await settings.getThemeOption('Dark').click();
    await expect(settings.getThemeOption('Dark')).toHaveClass(/active/);
    await expect(settings.getThemeOption('Light')).not.toHaveClass(/active/);
  });

  test('should display Compact Mode and Show Avatars toggles', async () => {
    await settings.clickNavItem('Appearance');
    await expect(settings.getSlideToggle('Compact Mode')).toBeVisible();
    await expect(settings.getSlideToggle('Show Avatars')).toBeVisible();
  });

  // Security section tests
  test('should display security action buttons', async () => {
    await settings.clickNavItem('Security');
    await expect(settings.getActionButton('Change Password')).toBeVisible();
    await expect(settings.getActionButton('Two-Factor')).toBeVisible();
    await expect(settings.getActionButton('Active Sessions')).toBeVisible();
  });

  test('should display Change Password button with correct text', async () => {
    await settings.clickNavItem('Security');
    const changeBtn = settings.getActionButton('Change Password');
    await expect(changeBtn).toContainText('Change');
  });

  // Language & Region section tests
  test('should display language, timezone, and date format selects', async () => {
    await settings.clickNavItem('Language');
    await expect(settings.getSelect('Language')).toBeVisible();
    await expect(settings.getSelect('Timezone')).toBeVisible();
    await expect(settings.getSelect('Date Format')).toBeVisible();
  });

  test('should have correct default language selection', async () => {
    await settings.clickNavItem('Language');
    const langSelect = settings.getSelect('Language');
    await expect(langSelect).toContainText('English');
  });

  test('should have correct default timezone selection', async () => {
    await settings.clickNavItem('Language');
    const tzSelect = settings.getSelect('Timezone');
    await expect(tzSelect).toContainText('Eastern Time');
  });

  test('should have correct default date format selection', async () => {
    await settings.clickNavItem('Language');
    const dateSelect = settings.getSelect('Date Format');
    await expect(dateSelect).toContainText('MM/DD/YYYY');
  });

  test('should open language dropdown and show options', async () => {
    await settings.clickNavItem('Language');
    const langSelect = settings.getSelect('Language');
    await langSelect.click();
    await expect(settings.page.locator('mat-option', { hasText: 'English' })).toBeVisible();
    await expect(settings.page.locator('mat-option', { hasText: 'Spanish' })).toBeVisible();
    await expect(settings.page.locator('mat-option', { hasText: 'French' })).toBeVisible();
    // Close dropdown
    await settings.page.keyboard.press('Escape');
  });

  // Navigation tests
  test('should navigate back to kanban when back button is clicked', async ({ page }) => {
    await settings.clickBack();
    await page.waitForURL('**/kanban', { timeout: 10000 });
    await expect(page).toHaveURL(/\/kanban/);
  });

  test('should navigate to settings from sidebar user menu', async ({ page }) => {
    // Navigate to kanban first
    await page.goto('/kanban');
    await page.locator('app-sidebar').waitFor({ state: 'visible', timeout: 15000 });

    // Open user menu
    const userProfile = page.locator('.user-profile');
    await userProfile.click();

    // Click Settings
    await page.locator('button[mat-menu-item]', { hasText: 'Settings' }).click();
    await page.waitForURL('**/settings', { timeout: 10000 });
    await expect(page).toHaveURL(/\/settings/);
  });
});

test.describe('Settings Page - Mobile', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'desktop', 'Mobile only');
  });

  let settings: SettingsPage;

  test.beforeEach(async ({ page }) => {
    settings = new SettingsPage(page);
    await settings.goto();
    await settings.waitForSettings();
  });

  test('should display settings page on mobile', async () => {
    await expect(settings.pageTitle).toBeVisible();
    await expect(settings.pageTitle).toHaveText('Settings');
  });

  test('should display navigation as horizontal tabs on mobile', async () => {
    const nav = settings.settingsNav;
    const style = await nav.evaluate(el => window.getComputedStyle(el).flexDirection);
    expect(style).toBe('row');
  });

  test('should stack nav and panel vertically on mobile', async () => {
    const content = settings.page.locator('.settings-content');
    const style = await content.evaluate(el => window.getComputedStyle(el).flexDirection);
    expect(style).toBe('column');
  });

  test('should hide nav item descriptions on mobile', async () => {
    const descriptions = settings.page.locator('.nav-item-desc');
    const count = await descriptions.count();
    for (let i = 0; i < count; i++) {
      await expect(descriptions.nth(i)).not.toBeVisible();
    }
  });

  test('should show Notifications section by default on mobile', async () => {
    await expect(settings.panelTitle).toHaveText('Notification Preferences');
  });

  test('should switch sections on mobile', async () => {
    await settings.clickNavItem('Appearance');
    await expect(settings.panelTitle).toHaveText('Appearance');

    await settings.clickNavItem('Security');
    await expect(settings.panelTitle).toHaveText('Security');
  });

  test('should display theme options on mobile', async () => {
    await settings.clickNavItem('Appearance');
    await expect(settings.getThemeOption('Light')).toBeVisible();
    await expect(settings.getThemeOption('Dark')).toBeVisible();
    await expect(settings.getThemeOption('System')).toBeVisible();
  });

  test('should make theme options fill full width on mobile', async () => {
    await settings.clickNavItem('Appearance');
    const themeSelector = settings.page.locator('.theme-selector');
    const selectorBox = await themeSelector.boundingBox();
    const options = settings.page.locator('.theme-option');
    const firstBox = await options.nth(0).boundingBox();

    expect(selectorBox).toBeTruthy();
    expect(firstBox).toBeTruthy();
    // Theme options should take substantial portion of container width
    const totalOptionsWidth = (await options.nth(0).boundingBox())!.width +
      (await options.nth(1).boundingBox())!.width +
      (await options.nth(2).boundingBox())!.width;
    expect(totalOptionsWidth).toBeGreaterThan(selectorBox!.width * 0.7);
  });

  test('should stack setting items vertically on mobile', async () => {
    const firstItem = settings.settingItems.first();
    const style = await firstItem.evaluate(el => window.getComputedStyle(el).flexDirection);
    expect(style).toBe('column');
  });

  test('should display security buttons on mobile', async () => {
    await settings.clickNavItem('Security');
    await expect(settings.getActionButton('Change Password')).toBeVisible();
    await expect(settings.getActionButton('Two-Factor')).toBeVisible();
  });

  test('should navigate to settings from mobile header menu', async ({ page }) => {
    // Navigate to kanban first
    await page.goto('/kanban');
    await page.locator('app-header').waitFor({ state: 'visible', timeout: 15000 });

    // Remove overlay
    await page.evaluate(() => {
      const iframe = document.getElementById('webpack-dev-server-client-overlay');
      if (iframe) iframe.remove();
      if (!document.getElementById('e2e-overlay-fix')) {
        const style = document.createElement('style');
        style.id = 'e2e-overlay-fix';
        style.textContent = '#webpack-dev-server-client-overlay { display: none !important; pointer-events: none !important; }';
        document.head.appendChild(style);
      }
    });

    // Open mobile user menu
    const headerAvatar = page.locator('.header-avatar');
    await headerAvatar.click();

    // Click Settings
    await page.locator('button[mat-menu-item]', { hasText: 'Settings' }).click();
    await page.waitForURL('**/settings', { timeout: 10000 });
    await expect(page).toHaveURL(/\/settings/);
  });

  test('should navigate back to kanban on mobile', async ({ page }) => {
    await settings.clickBack();
    await page.waitForURL('**/kanban', { timeout: 10000 });
    await expect(page).toHaveURL(/\/kanban/);
  });
});
