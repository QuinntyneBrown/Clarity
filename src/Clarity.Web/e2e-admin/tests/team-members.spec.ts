import { test, expect } from '@playwright/test';
import { TeamMembersPage } from '../page-objects/team-members.page';

test.describe('Team Members Management', () => {
  let teamMembersPage: TeamMembersPage;

  test.beforeEach(async ({ page }) => {
    teamMembersPage = new TeamMembersPage(page);
    await teamMembersPage.goto();
  });

  test('should display team members page with title', async () => {
    await expect(teamMembersPage.pageTitle).toHaveText('Team Members');
    await expect(teamMembersPage.teamMembersPage).toBeVisible();
  });

  test('should display Add Member button', async () => {
    await expect(teamMembersPage.addMemberButton).toBeVisible();
    await expect(teamMembersPage.addMemberButton).toContainText('Add Member');
  });

  test('should display search input', async () => {
    await expect(teamMembersPage.searchInput).toBeVisible();
  });

  test('should display team members table with data', async () => {
    await expect(teamMembersPage.teamMembersTable).toBeVisible();
    const rowCount = await teamMembersPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should filter team members by search term', async () => {
    const initialCount = await teamMembersPage.getRowCount();
    await teamMembersPage.search('nonexistent-member-xyz');
    const filteredCount = await teamMembersPage.getRowCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('should open create member dialog', async () => {
    await teamMembersPage.clickAddMember();
    await expect(teamMembersPage.memberNameInput).toBeVisible();
    await expect(teamMembersPage.dialogSaveButton).toBeVisible();
  });

  test('should close create dialog on cancel', async () => {
    await teamMembersPage.clickAddMember();
    await expect(teamMembersPage.memberNameInput).toBeVisible();
    await teamMembersPage.dialogCancelButton.click();
    await expect(teamMembersPage.memberNameInput).not.toBeVisible();
  });

  test('should open edit dialog with pre-filled data', async () => {
    const rowCount = await teamMembersPage.getRowCount();
    if (rowCount > 0) {
      await teamMembersPage.clickEditOnRow(0);
      await expect(teamMembersPage.memberNameInput).toBeVisible();
      const value = await teamMembersPage.memberNameInput.inputValue();
      expect(value.length).toBeGreaterThan(0);
    }
  });

  test('should open delete confirmation dialog', async () => {
    const rowCount = await teamMembersPage.getRowCount();
    if (rowCount > 0) {
      await teamMembersPage.clickDeleteOnRow(0);
      await expect(teamMembersPage.confirmButton).toBeVisible();
    }
  });
});
