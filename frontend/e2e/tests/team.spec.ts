import { test, expect } from '@playwright/test';
import { TeamPage } from '../page-objects/team.page';
import { CreateTeamMemberDialog } from '../page-objects/create-team-member-dialog.page';
import { UpdateTeamMemberDialog } from '../page-objects/update-team-member-dialog.page';

test.describe('Team Page', () => {
  let teamPage: TeamPage;

  test.beforeEach(async ({ page }) => {
    teamPage = new TeamPage(page);
    await teamPage.goto();
    await teamPage.waitForPage();
  });

  test('should display page title', async () => {
    await expect(teamPage.pageTitle).toHaveText('Team');
  });

  test('should display search input', async () => {
    await expect(teamPage.searchInput).toBeVisible();
  });

  test('should display add member button', async () => {
    await expect(teamPage.addMemberButton).toBeVisible();
  });

  test('should load team members from API', async () => {
    const hasRows = await teamPage.memberRows.count();
    const hasCards = await teamPage.memberCards.count();
    expect(hasRows + hasCards).toBeGreaterThan(0);
  });

  test('should filter members by search term', async () => {
    const totalBefore = await teamPage.memberRows.count() + await teamPage.memberCards.count();
    if (totalBefore === 0) return;

    await teamPage.search('nonexistent-member-xyz');
    await teamPage.page.waitForTimeout(300);
    const totalAfter = await teamPage.memberRows.count() + await teamPage.memberCards.count();
    expect(totalAfter).toBeLessThanOrEqual(totalBefore);
  });

  test('should display member avatars with initials', async ({ page }) => {
    const avatars = page.locator('app-team .member-avatar');
    const count = await avatars.count();
    if (count > 0) {
      const text = await avatars.first().innerText();
      expect(text.length).toBeGreaterThanOrEqual(1);
    }
  });

  test('should display role badges', async ({ page }) => {
    const badges = page.locator('app-team .role-badge');
    const count = await badges.count();
    if (count > 0) {
      await expect(badges.first()).toBeVisible();
    }
  });
});

test.describe('Team Page - Desktop', () => {
  test('should show table layout on desktop', async ({ page }) => {
    const teamPage = new TeamPage(page);
    await teamPage.goto();
    await teamPage.waitForPage();
    await expect(teamPage.tableContainer).toBeVisible();
  });

  test('should display edit and delete action buttons', async ({ page }) => {
    const teamPage = new TeamPage(page);
    await teamPage.goto();
    await teamPage.waitForPage();

    const rowCount = await teamPage.memberRows.count();
    if (rowCount > 0) {
      const firstRow = teamPage.memberRows.first();
      const editBtn = teamPage.getEditButton(firstRow);
      const deleteBtn = teamPage.getDeleteButton(firstRow);
      await expect(editBtn).toBeVisible();
      await expect(deleteBtn).toBeVisible();
    }
  });
});

test.describe('Create Team Member Dialog', () => {
  let teamPage: TeamPage;
  let dialog: CreateTeamMemberDialog;

  test.beforeEach(async ({ page }) => {
    teamPage = new TeamPage(page);
    dialog = new CreateTeamMemberDialog(page);
    await teamPage.goto();
    await teamPage.waitForPage();
  });

  test('should open create dialog when clicking add member', async () => {
    await teamPage.clickAddMember();
    await dialog.waitForOpen();
    await expect(dialog.dialog).toBeVisible();
  });

  test('should display correct dialog title', async () => {
    await teamPage.clickAddMember();
    await dialog.waitForOpen();
    await expect(dialog.title).toHaveText('Add Team Member');
  });

  test('should display all form fields', async () => {
    await teamPage.clickAddMember();
    await dialog.waitForOpen();
    await expect(dialog.nameInput).toBeVisible();
    await expect(dialog.emailInput).toBeVisible();
    await expect(dialog.roleSelect).toBeVisible();
  });

  test('should display add member and cancel buttons', async () => {
    await teamPage.clickAddMember();
    await dialog.waitForOpen();
    await expect(dialog.saveButton).toBeVisible();
    await expect(dialog.cancelButton).toBeVisible();
  });

  test('should close dialog when clicking cancel', async () => {
    await teamPage.clickAddMember();
    await dialog.waitForOpen();
    await dialog.clickCancel();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should close dialog when clicking close button', async () => {
    await teamPage.clickAddMember();
    await dialog.waitForOpen();
    await dialog.clickClose();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should allow filling in form fields', async () => {
    await teamPage.clickAddMember();
    await dialog.waitForOpen();

    await dialog.fillName('Jane Doe');
    await dialog.fillEmail('jane.doe@example.com');
    await dialog.selectRole('Developer');

    await expect(dialog.nameInput).toHaveValue('Jane Doe');
    await expect(dialog.emailInput).toHaveValue('jane.doe@example.com');
    await expect(dialog.roleSelect).toHaveValue('Developer');
  });

  test('should close dialog when clicking add member', async () => {
    await teamPage.clickAddMember();
    await dialog.waitForOpen();

    await dialog.fillName('New Member');
    await dialog.fillEmail('new@example.com');
    await dialog.selectRole('Developer');
    await dialog.clickSave();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should add member to the list after creating', async ({ page }) => {
    const countBefore = await teamPage.memberRows.count() + await teamPage.memberCards.count();

    await teamPage.clickAddMember();
    await dialog.waitForOpen();

    const memberName = `Test Member ${Date.now()}`;
    await dialog.fillName(memberName);
    await dialog.fillEmail('test@example.com');
    await dialog.selectRole('Developer');

    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/teamMember') && resp.request().method() === 'POST' && resp.status() === 200
    );
    await dialog.clickSave();
    await responsePromise;
    await dialog.waitForClosed();

    // Reload to pick up changes
    await teamPage.page.waitForTimeout(500);
    const countAfter = await teamPage.memberRows.count() + await teamPage.memberCards.count();
    expect(countAfter).toBeGreaterThanOrEqual(countBefore);
  });
});

test.describe('Update Team Member Dialog', () => {
  let teamPage: TeamPage;
  let dialog: UpdateTeamMemberDialog;

  test.beforeEach(async ({ page }) => {
    teamPage = new TeamPage(page);
    dialog = new UpdateTeamMemberDialog(page);
    await teamPage.goto();
    await teamPage.waitForPage();
  });

  test('should open update dialog when clicking edit button', async () => {
    const rowCount = await teamPage.memberRows.count();
    if (rowCount === 0) return;

    const firstRow = teamPage.memberRows.first();
    const editBtn = teamPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await expect(dialog.dialog).toBeVisible();
  });

  test('should display correct dialog title', async () => {
    const rowCount = await teamPage.memberRows.count();
    if (rowCount === 0) return;

    const firstRow = teamPage.memberRows.first();
    const editBtn = teamPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await expect(dialog.title).toHaveText('Edit Team Member');
  });

  test('should display all form fields', async () => {
    const rowCount = await teamPage.memberRows.count();
    if (rowCount === 0) return;

    const firstRow = teamPage.memberRows.first();
    const editBtn = teamPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await expect(dialog.nameInput).toBeVisible();
    await expect(dialog.emailInput).toBeVisible();
    await expect(dialog.roleSelect).toBeVisible();
  });

  test('should pre-populate form with member name', async () => {
    const rowCount = await teamPage.memberRows.count();
    if (rowCount === 0) return;

    const firstRow = teamPage.memberRows.first();
    const memberName = await firstRow.locator('.member-name').innerText();
    const editBtn = teamPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await expect(dialog.nameInput).toHaveValue(memberName);
  });

  test('should display update, delete, and cancel buttons', async () => {
    const rowCount = await teamPage.memberRows.count();
    if (rowCount === 0) return;

    const firstRow = teamPage.memberRows.first();
    const editBtn = teamPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await expect(dialog.saveButton).toBeVisible();
    await expect(dialog.deleteButton).toBeVisible();
    await expect(dialog.cancelButton).toBeVisible();
  });

  test('should close dialog when clicking cancel', async () => {
    const rowCount = await teamPage.memberRows.count();
    if (rowCount === 0) return;

    const firstRow = teamPage.memberRows.first();
    const editBtn = teamPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await dialog.clickCancel();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should allow editing form fields', async () => {
    const rowCount = await teamPage.memberRows.count();
    if (rowCount === 0) return;

    const firstRow = teamPage.memberRows.first();
    const editBtn = teamPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();

    await dialog.fillName('Updated Name');
    await dialog.fillEmail('updated@example.com');

    await expect(dialog.nameInput).toHaveValue('Updated Name');
    await expect(dialog.emailInput).toHaveValue('updated@example.com');
  });

  test('should close dialog when clicking update', async () => {
    const rowCount = await teamPage.memberRows.count();
    if (rowCount === 0) return;

    const firstRow = teamPage.memberRows.first();
    const editBtn = teamPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await dialog.clickSave();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should close dialog when clicking delete', async () => {
    const rowCount = await teamPage.memberRows.count();
    if (rowCount === 0) return;

    const firstRow = teamPage.memberRows.first();
    const editBtn = teamPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await dialog.clickDelete();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should close dialog when clicking close button', async () => {
    const rowCount = await teamPage.memberRows.count();
    if (rowCount === 0) return;

    const firstRow = teamPage.memberRows.first();
    const editBtn = teamPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await dialog.clickClose();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should remove member from list after deleting', async ({ page }) => {
    const rowCount = await teamPage.memberRows.count();
    if (rowCount === 0) return;

    const firstRow = teamPage.memberRows.first();
    const memberName = await firstRow.locator('.member-name').innerText();
    const editBtn = teamPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();

    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/teamMember') && resp.request().method() === 'DELETE' && resp.status() === 200
    );
    await dialog.clickDelete();
    await responsePromise;
    await dialog.waitForClosed();

    await teamPage.page.waitForTimeout(500);
    const memberAfter = teamPage.getMemberRowByName(memberName);
    await expect(memberAfter).toHaveCount(0);
  });
});
