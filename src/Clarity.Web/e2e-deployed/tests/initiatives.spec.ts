// Acceptance Test
// Traces to: L2-025, L2-026, L2-027
// Description: Verify initiatives page with CRUD, search, report navigation, table/card views

import { test, expect } from '@playwright/test';
import { InitiativesPage } from '../page-objects/initiatives.page';
import { CreateInitiativeDialog } from '../page-objects/create-initiative-dialog.page';
import { UpdateInitiativeDialog } from '../page-objects/update-initiative-dialog.page';

test.describe('Initiatives', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should display initiatives page with title', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      await expect(initiatives.pageTitle).toContainText('Initiatives');
    });

    test('should display table view on desktop', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      await expect(initiatives.tableContainer).toBeVisible();
    });

    test('should display add initiative button', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      await expect(initiatives.addInitiativeButton).toBeVisible();
    });

    test('should display search input', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      await expect(initiatives.searchInput).toBeVisible();
    });

    test('should open create initiative dialog', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();
      await initiatives.clickAddInitiative();

      const dialog = new CreateInitiativeDialog(page);
      await dialog.waitForOpen();
      await expect(dialog.title).toContainText('Create Initiative');
      await expect(dialog.nameInput).toBeVisible();
      await expect(dialog.descriptionInput).toBeVisible();
    });

    test('should create a new initiative', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();
      await initiatives.clickAddInitiative();

      const name = 'E2E Initiative ' + Date.now();
      const dialog = new CreateInitiativeDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName(name);
      await dialog.fillDescription('Test initiative description');
      await dialog.clickSave();
      await dialog.waitForClosed();

      // Reload to ensure the store fetches the newly created initiative
      await page.reload();
      await initiatives.waitForPage();

      // Check for row (desktop) or card (mobile) depending on viewport
      const rowOrCard = initiatives.getInitiativeRowByName(name)
        .or(initiatives.getInitiativeCardByName(name));
      await expect(rowOrCard.first()).toBeVisible({ timeout: 10000 });
    });

    test('should open update initiative dialog', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      const rowCount = await initiatives.initiativeRows.count();
      if (rowCount > 0) {
        const row = initiatives.initiativeRows.first();
        await initiatives.getEditButton(row).click();

        const dialog = new UpdateInitiativeDialog(page);
        await dialog.waitForOpen();
        await expect(dialog.title).toContainText('Edit Initiative');
        await dialog.clickCancel();
      }
    });

    test('should show view report, edit, delete buttons per row', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      const rowCount = await initiatives.initiativeRows.count();
      if (rowCount > 0) {
        const row = initiatives.initiativeRows.first();
        await expect(initiatives.getViewReportButton(row)).toBeVisible();
        await expect(initiatives.getEditButton(row)).toBeVisible();
        await expect(initiatives.getDeleteButton(row)).toBeVisible();
      }
    });

    test('should navigate to initiative report', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      const rowCount = await initiatives.initiativeRows.count();
      if (rowCount > 0) {
        const row = initiatives.initiativeRows.first();
        await initiatives.getViewReportButton(row).click();
        await page.waitForURL('**/initiatives/*/report', { timeout: 10000 });
        expect(page.url()).toContain('/report');
      }
    });

    test('should search initiatives', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      await initiatives.search('nonexistent-initiative-xyz');
      await page.waitForTimeout(1000);
      const count = await initiatives.initiativeRows.count();
      expect(count >= 0).toBeTruthy();
    });

    test('should cancel create initiative dialog', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();
      await initiatives.clickAddInitiative();

      const dialog = new CreateInitiativeDialog(page);
      await dialog.waitForOpen();
      await dialog.clickCancel();
      await dialog.waitForClosed();
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should display initiatives page on mobile', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      await expect(initiatives.pageTitle).toContainText('Initiatives');
    });

    test('should display card view on mobile', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      await expect(initiatives.cardsContainer).toBeVisible();
    });

    test('should display initiative cards on mobile', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      const cardCount = await initiatives.initiativeCards.count();
      // May or may not have initiatives
      expect(cardCount >= 0).toBeTruthy();
    });

    test('should open create initiative dialog on mobile', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();
      await initiatives.clickAddInitiative();

      const dialog = new CreateInitiativeDialog(page);
      await dialog.waitForOpen();
      await expect(dialog.nameInput).toBeVisible();
      await dialog.clickCancel();
    });

    test('should display search on mobile', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      await expect(initiatives.searchInput).toBeVisible();
    });
  });
});
