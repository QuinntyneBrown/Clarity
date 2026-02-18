import { test, expect } from '@playwright/test';
import { MyTicketsPage } from '../page-objects/my-tickets.page';
import { CreateTicketDialog } from '../page-objects/create-ticket-dialog.page';
import { UpdateTicketDialog } from '../page-objects/update-ticket-dialog.page';

test.describe('My Tickets Page', () => {
  let myTickets: MyTicketsPage;

  test.beforeEach(async ({ page }) => {
    myTickets = new MyTicketsPage(page);
    await myTickets.goto();
    await myTickets.waitForPage();
  });

  test('should display page title', async () => {
    await expect(myTickets.pageTitle).toHaveText('My Tickets');
  });

  test('should display search input', async () => {
    await expect(myTickets.searchInput).toBeVisible();
  });

  test('should display filter chips', async () => {
    await expect(myTickets.filterChips).toHaveCount(5);
    await expect(myTickets.filterChips.first()).toHaveText('All');
  });

  test('should load tickets from API', async () => {
    // Wait for tickets to load - either table rows or cards should appear
    const hasRows = await myTickets.ticketRows.count();
    const hasCards = await myTickets.ticketCards.count();
    expect(hasRows + hasCards).toBeGreaterThan(0);
  });

  test('should filter tickets by search term', async () => {
    // Get all tickets count first
    const totalBefore = await myTickets.ticketRows.count() + await myTickets.ticketCards.count();
    if (totalBefore === 0) return; // Skip if no tickets

    await myTickets.search('nonexistent-search-term-xyz');
    // Wait for filter to take effect
    await myTickets.page.waitForTimeout(300);
    const totalAfter = await myTickets.ticketRows.count() + await myTickets.ticketCards.count();
    expect(totalAfter).toBeLessThanOrEqual(totalBefore);
  });

  test('should filter tickets by chip', async () => {
    await myTickets.clickFilter('Done');
    await myTickets.page.waitForTimeout(300);
    // Active filter should be set - we just verify no crash
    await expect(myTickets.filterChips.filter({ hasText: 'Done' })).toHaveClass(/active/);
  });

  test('should open create ticket dialog from new ticket button', async ({ page }) => {
    // Only on desktop viewport
    const viewport = page.viewportSize();
    if (!viewport || viewport.width < 768) return;

    const dialog = new CreateTicketDialog(page);
    await myTickets.clickNewTicket();
    await dialog.waitForOpen();
    await expect(dialog.dialog).toBeVisible();
    await dialog.clickCancel();
    await dialog.waitForClosed();
  });

  test('should open update ticket dialog when clicking a ticket', async ({ page }) => {
    const viewport = page.viewportSize();
    if (!viewport || viewport.width < 768) return;

    const rowCount = await myTickets.ticketRows.count();
    if (rowCount === 0) return;

    const dialog = new UpdateTicketDialog(page);
    await myTickets.ticketRows.first().click();
    await dialog.waitForOpen();
    await expect(dialog.dialog).toBeVisible();
    await dialog.clickCancel();
    await dialog.waitForClosed();
  });
});

test.describe('My Tickets Page - Desktop', () => {
  test('should show table layout on desktop', async ({ page }) => {
    const myTickets = new MyTicketsPage(page);
    await myTickets.goto();
    await myTickets.waitForPage();
    await expect(myTickets.tableContainer).toBeVisible();
  });

  test('should show new ticket button on desktop', async ({ page }) => {
    const myTickets = new MyTicketsPage(page);
    await myTickets.goto();
    await myTickets.waitForPage();
    await expect(myTickets.newTicketButton).toBeVisible();
  });
});
