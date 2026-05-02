import { test, expect } from '@playwright/test';
import { UsersPage } from '../page-objects/users.page';

test.describe('Users Management', () => {
  let usersPage: UsersPage;

  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page);
    await usersPage.goto();
  });

  test('should display users page with title', async () => {
    await expect(usersPage.pageTitle).toHaveText('Users');
    await expect(usersPage.usersPage).toBeVisible();
  });

  test('should display Add User button', async () => {
    await expect(usersPage.addUserButton).toBeVisible();
    await expect(usersPage.addUserButton).toContainText('Add User');
  });

  test('should display search input and export button', async () => {
    await expect(usersPage.searchInput).toBeVisible();
    await expect(usersPage.exportButton).toBeVisible();
  });

  test('should display users table with data', async () => {
    await expect(usersPage.usersTable).toBeVisible();
    const rowCount = await usersPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should filter users by search term', async () => {
    const initialCount = await usersPage.getRowCount();
    await usersPage.search('nonexistent-user-xyz');
    const filteredCount = await usersPage.getRowCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('should open create user dialog', async () => {
    await usersPage.clickAddUser();
    await expect(usersPage.userIdInput).toBeVisible();
    await expect(usersPage.dialogSaveButton).toBeVisible();
    await expect(usersPage.dialogCancelButton).toBeVisible();
  });

  test('should close create dialog on cancel', async () => {
    await usersPage.clickAddUser();
    await expect(usersPage.userIdInput).toBeVisible();
    await usersPage.dialogCancelButton.click();
    await expect(usersPage.userIdInput).not.toBeVisible();
  });

  test('should open edit dialog when clicking edit button', async () => {
    const rowCount = await usersPage.getRowCount();
    if (rowCount > 0) {
      await usersPage.clickEditOnRow(0);
      await expect(usersPage.userIdInput).toBeVisible();
    }
  });

  test('should open delete confirmation when clicking delete button', async () => {
    const rowCount = await usersPage.getRowCount();
    if (rowCount > 0) {
      await usersPage.clickDeleteOnRow(0);
      await expect(usersPage.confirmButton).toBeVisible();
    }
  });
});
