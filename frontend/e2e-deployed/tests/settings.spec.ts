// Acceptance Test
// Traces to: L2-036
// Description: Verify settings page with nav sections, toggles, theme selection, language, and responsive layout

import { test, expect } from '@playwright/test';
import { SettingsPage } from '../page-objects/settings.page';

test.describe('Settings', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should display settings page with title', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      await expect(settings.pageTitle).toContainText('Settings');
      await expect(settings.pageSubtitle).toBeVisible();
    });

    test('should display settings navigation sidebar', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      await expect(settings.settingsNav).toBeVisible();
      const navCount = await settings.navItems.count();
      expect(navCount).toBeGreaterThanOrEqual(4);
    });

    test('should display back button', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      await expect(settings.backButton).toBeVisible();
    });

    test('should display notifications section by default', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      await expect(settings.panelTitle).toContainText('Notification Preferences');
    });

    test('should display notification toggles', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      await expect(settings.getSlideToggle('Email Notifications')).toBeVisible();
      await expect(settings.getSlideToggle('Push Notifications')).toBeVisible();
      await expect(settings.getSlideToggle('Ticket Updates')).toBeVisible();
    });

    test('should navigate to appearance section', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      await settings.clickNavItem('Appearance');
      await expect(settings.panelTitle).toContainText('Appearance');
      await expect(settings.getThemeOption('Light')).toBeVisible();
      await expect(settings.getThemeOption('Dark')).toBeVisible();
      await expect(settings.getThemeOption('System')).toBeVisible();
    });

    test('should display active theme indicator', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      await settings.clickNavItem('Appearance');
      const active = settings.getActiveTheme();
      await expect(active).toBeVisible();
    });

    test('should display appearance toggles', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      await settings.clickNavItem('Appearance');
      await expect(settings.getSlideToggle('Compact Mode')).toBeVisible();
      await expect(settings.getSlideToggle('Show Avatars')).toBeVisible();
    });

    test('should navigate to security section', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      await settings.clickNavItem('Security');
      await expect(settings.panelTitle).toContainText('Security');
      await expect(settings.getActionButton('Change Password')).toBeVisible();
      await expect(settings.getActionButton('Two-Factor Authentication')).toBeVisible();
    });

    test('should navigate to language section', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      await settings.clickNavItem('Language');
      await expect(settings.panelTitle).toContainText('Language');
      await expect(settings.getSelect('Language')).toBeVisible();
      await expect(settings.getSelect('Timezone')).toBeVisible();
      await expect(settings.getSelect('Date Format')).toBeVisible();
    });

    test('should navigate back from settings', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      await settings.clickBack();
      await page.waitForURL('**/kanban', { timeout: 10000 });
    });

    test('should highlight active nav item', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      const activeNav = await settings.getActiveNavItem();
      expect(activeNav.length).toBeGreaterThan(0);
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should display settings page on mobile', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      await expect(settings.pageTitle).toContainText('Settings');
    });

    test('should display settings sections on mobile', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      // Panel should be visible on mobile
      await expect(settings.settingsPanel).toBeVisible();
    });

    test('should display back button on mobile', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      await expect(settings.backButton).toBeVisible();
    });

    test('should navigate between sections on mobile', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      await settings.clickNavItem('Appearance');
      await expect(settings.panelTitle).toContainText('Appearance');

      await settings.clickNavItem('Security');
      await expect(settings.panelTitle).toContainText('Security');
    });

    test('should display notification toggles on mobile', async ({ page }) => {
      const settings = new SettingsPage(page);
      await settings.goto();
      await settings.waitForSettings();

      await expect(settings.getSlideToggle('Email Notifications')).toBeVisible();
    });
  });
});
