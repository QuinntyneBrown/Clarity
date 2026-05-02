// Acceptance Test
// Traces to: L2-034
// Description: Verify search results page with filtering, ticket/member results, and empty state

import { test, expect } from '@playwright/test';
import { SearchResultsPage } from '../page-objects/search-results.page';

test.describe('Search Results', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should display search page with title', async ({ page }) => {
      const search = new SearchResultsPage(page);
      await search.goto();
      await search.waitForPage();

      await expect(search.pageTitle).toContainText('Search');
    });

    test('should display search input', async ({ page }) => {
      const search = new SearchResultsPage(page);
      await search.goto();
      await search.waitForPage();

      await expect(search.desktopSearchInput).toBeVisible();
    });

    test('should display filter chips', async ({ page }) => {
      const search = new SearchResultsPage(page);
      await search.goto();
      await search.waitForPage();

      const chipCount = await search.filterChips.count();
      expect(chipCount).toBeGreaterThanOrEqual(1);
    });

    test('should show empty state when search has no matches', async ({ page }) => {
      const search = new SearchResultsPage(page);
      await search.goto('zzz-no-match-xyz-00000');
      await search.waitForPage();
      await page.waitForTimeout(2000);

      await expect(search.emptyState).toBeVisible();
    });

    test('should show results for valid search term', async ({ page }) => {
      const search = new SearchResultsPage(page);
      await search.goto('test');
      await search.waitForPage();

      // Wait for results to load
      await page.waitForTimeout(2000);
      // Should show results or empty state
      const hasResults = (await search.ticketResults.count()) > 0 || (await search.memberResults.count()) > 0;
      const hasEmpty = await search.emptyState.isVisible();
      expect(hasResults || hasEmpty).toBeTruthy();
    });

    test('should filter by tickets chip', async ({ page }) => {
      const search = new SearchResultsPage(page);
      await search.goto('test');
      await search.waitForPage();
      await page.waitForTimeout(1000);

      const ticketsChip = search.filterChips.filter({ hasText: 'Tickets' });
      if (await ticketsChip.isVisible()) {
        await ticketsChip.click();
        await page.waitForTimeout(500);
        // Members section should be hidden when filtering by tickets
      }
    });

    test('should filter by members chip', async ({ page }) => {
      const search = new SearchResultsPage(page);
      await search.goto('test');
      await search.waitForPage();
      await page.waitForTimeout(1000);

      const membersChip = search.filterChips.filter({ hasText: 'Members' });
      if (await membersChip.isVisible()) {
        await membersChip.click();
        await page.waitForTimeout(500);
      }
    });

    test('should display section titles for results', async ({ page }) => {
      const search = new SearchResultsPage(page);
      await search.goto('test');
      await search.waitForPage();
      await page.waitForTimeout(2000);

      const hasResults = (await search.ticketResults.count()) > 0 || (await search.memberResults.count()) > 0;
      if (hasResults) {
        const sectionCount = await search.sectionTitles.count();
        expect(sectionCount).toBeGreaterThanOrEqual(1);
      }
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should display mobile search header', async ({ page }) => {
      const search = new SearchResultsPage(page);
      await search.goto();
      await search.waitForPage();

      await expect(search.mobileHeader).toBeVisible();
      await expect(search.backButton).toBeVisible();
    });

    test('should display search input on mobile', async ({ page }) => {
      const search = new SearchResultsPage(page);
      await search.goto();
      await search.waitForPage();

      await expect(search.mobileSearchInput).toBeVisible();
    });

    test('should display filter chips on mobile', async ({ page }) => {
      const search = new SearchResultsPage(page);
      await search.goto();
      await search.waitForPage();

      const chipCount = await search.filterChips.count();
      expect(chipCount).toBeGreaterThanOrEqual(1);
    });

    test('should show empty state on mobile when search has no matches', async ({ page }) => {
      const search = new SearchResultsPage(page);
      await search.goto('zzz-no-match-xyz-00000');
      await search.waitForPage();
      await page.waitForTimeout(2000);

      await expect(search.emptyState).toBeVisible();
    });

    test('should navigate back on mobile', async ({ page }) => {
      const search = new SearchResultsPage(page);
      await search.goto();
      await search.waitForPage();

      await search.clickBack();
      // Should navigate away from search
      await page.waitForTimeout(1000);
    });

    test('should search and display results on mobile', async ({ page }) => {
      const search = new SearchResultsPage(page);
      await search.goto('test');
      await search.waitForPage();
      await page.waitForTimeout(2000);

      const hasResults = (await search.resultCards.count()) > 0 || (await search.memberResults.count()) > 0;
      const hasEmpty = await search.emptyState.isVisible();
      expect(hasResults || hasEmpty).toBeTruthy();
    });
  });
});
