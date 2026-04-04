// Acceptance Test
// Traces to: L2-026
// Description: Verify initiative report page with metrics, status breakdown, and navigation

import { test, expect } from '@playwright/test';
import { InitiativesPage } from '../page-objects/initiatives.page';
import { InitiativeReportPage } from '../page-objects/initiative-report.page';

test.describe('Initiative Report', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should navigate to report from initiatives page', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      const rowCount = await initiatives.initiativeRows.count();
      if (rowCount > 0) {
        const row = initiatives.initiativeRows.first();
        await initiatives.getViewReportButton(row).click();

        await page.waitForURL('**/initiatives/*/report', { timeout: 10000 });
        const report = new InitiativeReportPage(page);
        await report.waitForPage();

        await expect(report.pageTitle).toBeVisible();
      }
    });

    test('should display metric cards', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      const rowCount = await initiatives.initiativeRows.count();
      if (rowCount > 0) {
        const row = initiatives.initiativeRows.first();
        await initiatives.getViewReportButton(row).click();

        await page.waitForURL('**/initiatives/*/report', { timeout: 10000 });
        const report = new InitiativeReportPage(page);
        await report.waitForPage();

        const metricCount = await report.metricCards.count();
        expect(metricCount).toBe(4);
        await expect(report.totalTickets).toBeVisible();
        await expect(report.storyPoints).toBeVisible();
        await expect(report.totalEffort).toBeVisible();
        await expect(report.percentComplete).toBeVisible();
      }
    });

    test('should display status breakdown section', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      const rowCount = await initiatives.initiativeRows.count();
      if (rowCount > 0) {
        const row = initiatives.initiativeRows.first();
        await initiatives.getViewReportButton(row).click();

        await page.waitForURL('**/initiatives/*/report', { timeout: 10000 });
        const report = new InitiativeReportPage(page);
        await report.waitForPage();

        await expect(report.statusSection).toBeVisible();
      }
    });

    test('should display back button and navigate back', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      const rowCount = await initiatives.initiativeRows.count();
      if (rowCount > 0) {
        const row = initiatives.initiativeRows.first();
        await initiatives.getViewReportButton(row).click();

        await page.waitForURL('**/initiatives/*/report', { timeout: 10000 });
        const report = new InitiativeReportPage(page);
        await report.waitForPage();

        await expect(report.backButton).toBeVisible();
        await report.clickBack();
        await page.waitForURL('**/initiatives', { timeout: 10000 });
      }
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should display report on mobile', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      const cardCount = await initiatives.initiativeCards.count();
      if (cardCount > 0) {
        const card = initiatives.initiativeCards.first();
        const reportBtn = initiatives.getViewReportButton(card);
        await reportBtn.click();

        await page.waitForURL('**/initiatives/*/report', { timeout: 10000 });
        const report = new InitiativeReportPage(page);
        await report.waitForPage();

        await expect(report.pageTitle).toBeVisible();
        await expect(report.metricCards.first()).toBeVisible();
        await expect(report.backButton).toBeVisible();
      }
    });

    test('should navigate back from report on mobile', async ({ page }) => {
      const initiatives = new InitiativesPage(page);
      await initiatives.goto();
      await initiatives.waitForPage();

      const cardCount = await initiatives.initiativeCards.count();
      if (cardCount > 0) {
        const card = initiatives.initiativeCards.first();
        await initiatives.getViewReportButton(card).click();

        await page.waitForURL('**/initiatives/*/report', { timeout: 10000 });
        const report = new InitiativeReportPage(page);
        await report.waitForPage();
        await report.clickBack();
        await page.waitForURL('**/initiatives', { timeout: 10000 });
      }
    });
  });
});
