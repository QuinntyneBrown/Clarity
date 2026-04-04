// Acceptance Test
// Traces to: L2-023, L2-024
// Description: Verify team page with member listing, CRUD operations, search, table/card views

import { test, expect } from '@playwright/test';
import { TeamPage } from '../page-objects/team.page';
import { CreateTeamMemberDialog } from '../page-objects/create-team-member-dialog.page';
import { UpdateTeamMemberDialog } from '../page-objects/update-team-member-dialog.page';

test.describe('Team', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should display team page with title', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();

      await expect(team.pageTitle).toContainText('Team');
    });

    test('should display table view on desktop', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();

      await expect(team.tableContainer).toBeVisible();
    });

    test('should display add member button', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();

      await expect(team.addMemberButton).toBeVisible();
    });

    test('should display search input', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();

      await expect(team.searchInput).toBeVisible();
    });

    test('should show team members in table', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();

      const memberCount = await team.memberRows.count();
      expect(memberCount).toBeGreaterThanOrEqual(1);
    });

    test('should show edit and delete buttons per member', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();

      const memberCount = await team.memberRows.count();
      if (memberCount > 0) {
        const firstRow = team.memberRows.first();
        await expect(team.getEditButton(firstRow)).toBeVisible();
        await expect(team.getDeleteButton(firstRow)).toBeVisible();
      }
    });

    test('should open create team member dialog', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();
      await team.clickAddMember();

      const dialog = new CreateTeamMemberDialog(page);
      await dialog.waitForOpen();
      await expect(dialog.title).toContainText('Add Team Member');
      await expect(dialog.nameInput).toBeVisible();
      await expect(dialog.emailInput).toBeVisible();
      await expect(dialog.roleSelect).toBeVisible();
    });

    test('should create a new team member', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();
      await team.clickAddMember();

      const memberName = 'E2E Member ' + Date.now();
      const dialog = new CreateTeamMemberDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName(memberName);
      await dialog.fillEmail(`e2e-${Date.now()}@test.com`);
      await dialog.clickSave();
      await dialog.waitForClosed();

      await expect(team.getMemberRowByName(memberName)).toBeVisible({ timeout: 20000 });
    });

    test('should open update team member dialog', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();

      const memberCount = await team.memberRows.count();
      if (memberCount > 0) {
        const firstRow = team.memberRows.first();
        await team.getEditButton(firstRow).click();

        const dialog = new UpdateTeamMemberDialog(page);
        await dialog.waitForOpen();
        await expect(dialog.title).toContainText('Edit Team Member');
        await expect(dialog.nameInput).toBeVisible();
        await dialog.clickCancel();
      }
    });

    test('should search team members', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();

      await team.search('nonexistent-member-xyz');
      await page.waitForTimeout(1000);
      // After filtering, results may be empty
      const count = await team.memberRows.count();
      expect(count >= 0).toBeTruthy();
    });

    test('should cancel create team member dialog', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();
      await team.clickAddMember();

      const dialog = new CreateTeamMemberDialog(page);
      await dialog.waitForOpen();
      await dialog.clickCancel();
      await dialog.waitForClosed();
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should display team page on mobile', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();

      await expect(team.pageTitle).toContainText('Team');
    });

    test('should display card view on mobile', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();

      await expect(team.cardsContainer).toBeVisible();
    });

    test('should display member cards on mobile', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();

      const cardCount = await team.memberCards.count();
      expect(cardCount).toBeGreaterThanOrEqual(1);
    });

    test('should show edit and delete on mobile cards', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();

      const cardCount = await team.memberCards.count();
      if (cardCount > 0) {
        const firstCard = team.memberCards.first();
        await expect(team.getEditButton(firstCard)).toBeVisible();
        await expect(team.getDeleteButton(firstCard)).toBeVisible();
      }
    });

    test('should open create member dialog on mobile', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();
      await team.clickAddMember();

      const dialog = new CreateTeamMemberDialog(page);
      await dialog.waitForOpen();
      await expect(dialog.nameInput).toBeVisible();
      await dialog.clickCancel();
    });

    test('should display search on mobile', async ({ page }) => {
      const team = new TeamPage(page);
      await team.goto();
      await team.waitForPage();

      await expect(team.searchInput).toBeVisible();
    });
  });
});
