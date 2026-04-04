// Acceptance Test
// Traces to: L2-005, L2-035
// Description: Verify profile page with view, edit, save, cancel, and responsive layout

import { test, expect } from '@playwright/test';
import { ProfilePage } from '../page-objects/profile.page';

test.describe('Profile', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should display profile page with title', async ({ page }) => {
      const profile = new ProfilePage(page);
      await profile.goto();
      await profile.waitForProfile();

      await expect(profile.pageTitle).toContainText('My Profile');
      await expect(profile.pageSubtitle).toBeVisible();
    });

    test('should display avatar card with user info', async ({ page }) => {
      const profile = new ProfilePage(page);
      await profile.goto();
      await profile.waitForProfile();

      await expect(profile.avatarInitials).toBeVisible();
      await expect(profile.avatarName).toBeVisible();
      await expect(profile.avatarEmail).toBeVisible();
    });

    test('should display personal information card', async ({ page }) => {
      const profile = new ProfilePage(page);
      await profile.goto();
      await profile.waitForProfile();

      await expect(profile.cardTitle).toBeVisible();
      await expect(profile.firstNameInput).toBeVisible();
      await expect(profile.lastNameInput).toBeVisible();
      await expect(profile.emailInput).toBeVisible();
    });

    test('should show fields as read-only by default', async ({ page }) => {
      const profile = new ProfilePage(page);
      await profile.goto();
      await profile.waitForProfile();

      await expect(profile.firstNameInput).toHaveAttribute('readonly', '');
      await expect(profile.editButton).toBeVisible();
    });

    test('should enter edit mode when clicking edit', async ({ page }) => {
      const profile = new ProfilePage(page);
      await profile.goto();
      await profile.waitForProfile();

      await profile.clickEdit();
      await expect(profile.firstNameInput).not.toHaveAttribute('readonly', '');
      await expect(profile.saveButton).toBeVisible();
      await expect(profile.cancelButton).toBeVisible();
    });

    test('should cancel edit mode', async ({ page }) => {
      const profile = new ProfilePage(page);
      await profile.goto();
      await profile.waitForProfile();

      await profile.clickEdit();
      await profile.fillFirstName('Temp Name');
      await profile.clickCancel();

      await expect(profile.firstNameInput).toHaveAttribute('readonly', '');
      await expect(profile.editButton).toBeVisible();
    });

    test('should save profile changes', async ({ page }) => {
      const profile = new ProfilePage(page);
      await profile.goto();
      await profile.waitForProfile();

      await profile.clickEdit();

      const currentPhone = await profile.phoneInput.inputValue();
      const newPhone = '555-' + Date.now().toString().slice(-4);
      await profile.fillPhone(newPhone);
      await profile.clickSave();

      // After save, should return to read-only mode
      await expect(profile.editButton).toBeVisible({ timeout: 10000 });
      await expect(profile.phoneInput).toHaveValue(newPhone);

      // Restore original phone
      await profile.clickEdit();
      await profile.fillPhone(currentPhone);
      await profile.clickSave();
    });

    test('should display back button that navigates to kanban', async ({ page }) => {
      const profile = new ProfilePage(page);
      await profile.goto();
      await profile.waitForProfile();

      await expect(profile.backButton).toBeVisible();
      await profile.clickBack();
      await page.waitForURL('**/kanban', { timeout: 10000 });
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should display profile page on mobile', async ({ page }) => {
      const profile = new ProfilePage(page);
      await profile.goto();
      await profile.waitForProfile();

      await expect(profile.pageTitle).toContainText('My Profile');
    });

    test('should display avatar and info on mobile', async ({ page }) => {
      const profile = new ProfilePage(page);
      await profile.goto();
      await profile.waitForProfile();

      await expect(profile.avatarInitials).toBeVisible();
      await expect(profile.avatarName).toBeVisible();
    });

    test('should display form fields on mobile', async ({ page }) => {
      const profile = new ProfilePage(page);
      await profile.goto();
      await profile.waitForProfile();

      await expect(profile.firstNameInput).toBeVisible();
      await expect(profile.lastNameInput).toBeVisible();
      await expect(profile.emailInput).toBeVisible();
    });

    test('should enter edit mode on mobile', async ({ page }) => {
      const profile = new ProfilePage(page);
      await profile.goto();
      await profile.waitForProfile();

      await profile.clickEdit();
      await expect(profile.firstNameInput).not.toHaveAttribute('readonly', '');
      await expect(profile.saveButton).toBeVisible();
    });

    test('should display back button on mobile', async ({ page }) => {
      const profile = new ProfilePage(page);
      await profile.goto();
      await profile.waitForProfile();

      await expect(profile.backButton).toBeVisible();
    });
  });
});
