import { test, expect } from '@playwright/test';
import { ProfilePage } from '../page-objects/profile.page';
import { AppLayoutPage } from '../page-objects/app-layout.page';

test.describe('Profile Page - Desktop', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Desktop only');
  });

  let profile: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profile = new ProfilePage(page);
    await profile.goto();
    await profile.waitForProfile();
  });

  test('should display page header with title and subtitle', async () => {
    await expect(profile.pageTitle).toHaveText('My Profile');
    await expect(profile.pageSubtitle).toHaveText('Manage your personal information');
  });

  test('should display avatar card with initials, name, and email', async () => {
    await expect(profile.avatarInitials).toBeVisible();
    await expect(profile.avatarInitials).toHaveText('QB');
    await expect(profile.avatarName).toHaveText('Quinntyne Brown');
    await expect(profile.avatarEmail).toHaveText('quinntynebrown@gmail.com');
  });

  test('should display job title badge in avatar card', async () => {
    await expect(profile.avatarRole).toBeVisible();
    await expect(profile.avatarRole).toHaveText('Software Engineer');
  });

  test('should display personal information card with form fields', async () => {
    await expect(profile.cardTitle).toHaveText('Personal Information');
    await expect(profile.firstNameInput).toBeVisible();
    await expect(profile.lastNameInput).toBeVisible();
    await expect(profile.emailInput).toBeVisible();
    await expect(profile.phoneInput).toBeVisible();
    await expect(profile.jobTitleInput).toBeVisible();
  });

  test('should have form fields populated with user data', async () => {
    await expect(profile.firstNameInput).toHaveValue('Quinntyne');
    await expect(profile.lastNameInput).toHaveValue('Brown');
    await expect(profile.emailInput).toHaveValue('quinntynebrown@gmail.com');
    await expect(profile.jobTitleInput).toHaveValue('Software Engineer');
  });

  test('should show fields as readonly when not editing', async () => {
    await expect(profile.firstNameInput).toHaveAttribute('readonly', '');
    await expect(profile.lastNameInput).toHaveAttribute('readonly', '');
    await expect(profile.emailInput).toHaveAttribute('readonly', '');
  });

  test('should show edit button when not editing', async () => {
    await expect(profile.editButton).toBeVisible();
    await expect(profile.editButton).toContainText('Edit');
  });

  test('should not show save/cancel buttons when not editing', async () => {
    await expect(profile.saveButton).not.toBeVisible();
    await expect(profile.cancelButton).not.toBeVisible();
  });

  test('should enter edit mode when edit button is clicked', async () => {
    await profile.clickEdit();
    await expect(profile.editButton).not.toBeVisible();
    await expect(profile.saveButton).toBeVisible();
    await expect(profile.cancelButton).toBeVisible();
  });

  test('should make fields editable in edit mode', async () => {
    await profile.clickEdit();
    await expect(profile.firstNameInput).not.toHaveAttribute('readonly', '');
    await expect(profile.lastNameInput).not.toHaveAttribute('readonly', '');
    await expect(profile.emailInput).not.toHaveAttribute('readonly', '');
  });

  test('should allow editing field values', async () => {
    await profile.clickEdit();
    await profile.fillFirstName('John');
    await profile.fillLastName('Doe');
    await expect(profile.firstNameInput).toHaveValue('John');
    await expect(profile.lastNameInput).toHaveValue('Doe');
  });

  test('should update avatar and name display when editing', async () => {
    await profile.clickEdit();
    await profile.fillFirstName('John');
    await profile.fillLastName('Doe');
    await expect(profile.avatarName).toHaveText('John Doe');
    await expect(profile.avatarInitials).toHaveText('JD');
  });

  test('should save changes and exit edit mode', async () => {
    await profile.clickEdit();
    await profile.fillFirstName('Updated');
    await profile.clickSave();
    await expect(profile.editButton).toBeVisible();
    await expect(profile.saveButton).not.toBeVisible();
    await expect(profile.firstNameInput).toHaveValue('Updated');
  });

  test('should cancel changes and restore original values', async () => {
    await profile.clickEdit();
    await profile.fillFirstName('Changed');
    await profile.fillLastName('Name');
    await profile.clickCancel();
    await expect(profile.editButton).toBeVisible();
    await expect(profile.saveButton).not.toBeVisible();
    await expect(profile.firstNameInput).toHaveValue('Quinntyne');
    await expect(profile.lastNameInput).toHaveValue('Brown');
  });

  test('should navigate back to kanban when back button is clicked', async ({ page }) => {
    await profile.clickBack();
    await page.waitForURL('**/kanban', { timeout: 10000 });
    await expect(page).toHaveURL(/\/kanban/);
  });

  test('should display form rows side by side on desktop', async () => {
    const formRows = profile.page.locator('.form-row');
    const firstRow = formRows.first();
    const fields = firstRow.locator('mat-form-field');
    const count = await fields.count();
    expect(count).toBe(2);

    // Verify fields are side by side (horizontal layout)
    const firstBox = await fields.nth(0).boundingBox();
    const secondBox = await fields.nth(1).boundingBox();
    expect(firstBox).toBeTruthy();
    expect(secondBox).toBeTruthy();
    expect(secondBox!.x).toBeGreaterThan(firstBox!.x);
  });

  test('should navigate to profile from sidebar user menu', async ({ page }) => {
    // Navigate to kanban first
    await page.goto('/kanban');
    await page.locator('app-sidebar').waitFor({ state: 'visible', timeout: 15000 });

    // Open user menu
    const userProfile = page.locator('.user-profile');
    await userProfile.click();

    // Click My Profile
    await page.locator('button[mat-menu-item]', { hasText: 'My Profile' }).click();
    await page.waitForURL('**/profile', { timeout: 10000 });
    await expect(page).toHaveURL(/\/profile/);
  });
});

test.describe('Profile Page - Mobile', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'desktop', 'Mobile only');
  });

  let profile: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profile = new ProfilePage(page);
    await profile.goto();
    await profile.waitForProfile();
  });

  test('should display profile page on mobile', async () => {
    await expect(profile.pageTitle).toBeVisible();
    await expect(profile.pageTitle).toHaveText('My Profile');
  });

  test('should display avatar card on mobile', async () => {
    await expect(profile.avatarInitials).toBeVisible();
    await expect(profile.avatarName).toBeVisible();
  });

  test('should center avatar on mobile', async () => {
    const avatarSection = profile.page.locator('.avatar-section');
    const style = await avatarSection.evaluate(el => window.getComputedStyle(el).flexDirection);
    expect(style).toBe('column');
  });

  test('should stack form fields vertically on mobile', async () => {
    const formRows = profile.page.locator('.form-row');
    const firstRow = formRows.first();
    const fields = firstRow.locator('mat-form-field');
    const count = await fields.count();
    expect(count).toBe(2);

    // Verify fields are stacked (vertical layout)
    const firstBox = await fields.nth(0).boundingBox();
    const secondBox = await fields.nth(1).boundingBox();
    expect(firstBox).toBeTruthy();
    expect(secondBox).toBeTruthy();
    expect(secondBox!.y).toBeGreaterThan(firstBox!.y);
  });

  test('should show edit and save/cancel flow on mobile', async () => {
    await expect(profile.editButton).toBeVisible();
    await profile.clickEdit();
    await expect(profile.saveButton).toBeVisible();
    await expect(profile.cancelButton).toBeVisible();
    await profile.clickCancel();
    await expect(profile.editButton).toBeVisible();
  });

  test('should have full-width buttons in edit mode on mobile', async () => {
    await profile.clickEdit();
    const formActions = profile.page.locator('.form-actions');
    const style = await formActions.evaluate(el => window.getComputedStyle(el).flexDirection);
    expect(style).toBe('column-reverse');
  });

  test('should navigate to profile from mobile header menu', async ({ page }) => {
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

    // Click My Profile
    await page.locator('button[mat-menu-item]', { hasText: 'My Profile' }).click();
    await page.waitForURL('**/profile', { timeout: 10000 });
    await expect(page).toHaveURL(/\/profile/);
  });

  test('should navigate back to kanban on mobile', async ({ page }) => {
    await profile.clickBack();
    await page.waitForURL('**/kanban', { timeout: 10000 });
    await expect(page).toHaveURL(/\/kanban/);
  });
});
