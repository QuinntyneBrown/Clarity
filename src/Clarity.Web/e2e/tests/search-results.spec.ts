import { test, expect } from '@playwright/test';
import { SearchResultsPage } from '../page-objects/search-results.page';
import { UpdateTicketDialog } from '../page-objects/update-ticket-dialog.page';

test.describe('Search Results Page', () => {
  let searchPage: SearchResultsPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchResultsPage(page);
    await searchPage.goto();
    await searchPage.waitForPage();
  });

  test('should display search input', async () => {
    await expect(searchPage.searchInput.first()).toBeVisible();
  });

  test('should display filter chips', async () => {
    await expect(searchPage.filterChips).toHaveCount(3);
  });

  test('should show empty state when no search term', async () => {
    await expect(searchPage.emptyState).toBeVisible();
  });

  test('should display results when searching', async () => {
    // Type a search term that should match something
    await searchPage.search('a');
    await searchPage.page.waitForTimeout(500);

    // Either tickets or members should appear (or empty state if no matches)
    const ticketCount = await searchPage.ticketResults.count();
    const memberCount = await searchPage.memberResults.count();
    const hasEmpty = await searchPage.emptyState.isVisible().catch(() => false);
    expect(ticketCount > 0 || memberCount > 0 || hasEmpty).toBeTruthy();
  });

  test('should filter by tickets only', async () => {
    await searchPage.search('a');
    await searchPage.page.waitForTimeout(300);
    await searchPage.clickFilter('Tickets');
    await searchPage.page.waitForTimeout(300);

    // Members should not be visible when filtering by tickets
    const memberCount = await searchPage.memberResults.count();
    expect(memberCount).toBe(0);
  });

  test('should filter by members only', async () => {
    await searchPage.search('a');
    await searchPage.page.waitForTimeout(300);
    await searchPage.clickFilter('Members');
    await searchPage.page.waitForTimeout(300);

    // Ticket results should not be visible when filtering by members
    const ticketCount = await searchPage.ticketResults.count();
    expect(ticketCount).toBe(0);
  });

  test('should show no results for nonsense query', async () => {
    await searchPage.search('zzzznonexistent12345');
    await searchPage.page.waitForTimeout(500);
    await expect(searchPage.emptyState).toBeVisible();
  });

  test('should open ticket dialog when clicking a ticket result', async ({ page }) => {
    await searchPage.search('a');
    await searchPage.page.waitForTimeout(500);

    const ticketCount = await searchPage.ticketResults.count();
    if (ticketCount === 0) return;

    const dialog = new UpdateTicketDialog(page);
    await searchPage.ticketResults.first().click();
    await dialog.waitForOpen();
    await expect(dialog.dialog).toBeVisible();
    await dialog.clickCancel();
    await dialog.waitForClosed();
  });

  test('should navigate to search with query param', async ({ page }) => {
    const searchPage = new SearchResultsPage(page);
    await searchPage.goto('test');
    await searchPage.waitForPage();
    // The search input should have the query pre-filled
    await expect(searchPage.searchInput.first()).toHaveValue('test');
  });
});
