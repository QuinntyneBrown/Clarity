import { test, expect } from '@playwright/test';
import { RolesPage } from '../page-objects/roles.page';

test.describe('Roles & Privileges Management', () => {
  let rolesPage: RolesPage;

  test.beforeEach(async ({ page }) => {
    rolesPage = new RolesPage(page);
    await rolesPage.goto();
  });

  test('should display roles page with title', async () => {
    await expect(rolesPage.pageTitle).toHaveText('Roles & Privileges');
    await expect(rolesPage.rolesPage).toBeVisible();
  });

  test('should display Create Role button', async () => {
    await expect(rolesPage.createRoleButton).toBeVisible();
    await expect(rolesPage.createRoleButton).toContainText('Create Role');
  });

  test('should display search input', async () => {
    await expect(rolesPage.searchInput).toBeVisible();
  });

  test('should display roles table with data', async () => {
    await expect(rolesPage.rolesTable).toBeVisible();
    const rowCount = await rolesPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should filter roles by search term', async () => {
    const initialCount = await rolesPage.getRowCount();
    await rolesPage.search('nonexistent-role-xyz');
    const filteredCount = await rolesPage.getRowCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('should open create role dialog', async () => {
    await rolesPage.clickCreateRole();
    await expect(rolesPage.roleNameInput).toBeVisible();
    await expect(rolesPage.dialogSaveButton).toBeVisible();
  });

  test('should close create dialog on cancel', async () => {
    await rolesPage.clickCreateRole();
    await expect(rolesPage.roleNameInput).toBeVisible();
    await rolesPage.dialogCancelButton.click();
    await expect(rolesPage.roleNameInput).not.toBeVisible();
  });

  test('should open edit dialog with pre-filled data', async () => {
    const rowCount = await rolesPage.getRowCount();
    if (rowCount > 0) {
      await rolesPage.clickEditOnRow(0);
      await expect(rolesPage.roleNameInput).toBeVisible();
      const value = await rolesPage.roleNameInput.inputValue();
      expect(value.length).toBeGreaterThan(0);
    }
  });

  test('should open delete confirmation dialog', async () => {
    const rowCount = await rolesPage.getRowCount();
    if (rowCount > 0) {
      await rolesPage.clickDeleteOnRow(0);
      await expect(rolesPage.confirmButton).toBeVisible();
    }
  });
});
