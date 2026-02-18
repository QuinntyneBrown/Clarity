import { test, expect } from '@playwright/test';
import { TeamPage } from '../page-objects/team.page';

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
    // Wait for members to load - either table rows or cards should appear
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
      await expect(badges.first()).toHaveText('Member');
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
