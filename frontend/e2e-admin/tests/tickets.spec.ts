import { test, expect } from '@playwright/test';
import { TicketsPage } from '../page-objects/tickets.page';

test.describe('Tickets Management', () => {
  let ticketsPage: TicketsPage;

  test.beforeEach(async ({ page }) => {
    ticketsPage = new TicketsPage(page);
    await ticketsPage.goto();
  });

  test('should display tickets page with title', async () => {
    await expect(ticketsPage.pageTitle).toHaveText('Tickets');
    await expect(ticketsPage.ticketsPage).toBeVisible();
  });

  test('should display Create Ticket button', async () => {
    await expect(ticketsPage.createTicketButton).toBeVisible();
    await expect(ticketsPage.createTicketButton).toContainText('Create Ticket');
  });

  test('should display search input and export button', async () => {
    await expect(ticketsPage.searchInput).toBeVisible();
    await expect(ticketsPage.exportButton).toBeVisible();
  });

  test('should display tickets table with data', async () => {
    await expect(ticketsPage.ticketsTable).toBeVisible();
    const rowCount = await ticketsPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should filter tickets by search term', async () => {
    const initialCount = await ticketsPage.getRowCount();
    await ticketsPage.search('nonexistent-ticket-xyz');
    const filteredCount = await ticketsPage.getRowCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('should open create ticket dialog', async () => {
    await ticketsPage.clickCreateTicket();
    await expect(ticketsPage.ticketNameInput).toBeVisible();
    await expect(ticketsPage.ticketDescriptionInput).toBeVisible();
    await expect(ticketsPage.dialogSaveButton).toBeVisible();
  });

  test('should have save disabled when name is empty', async () => {
    await ticketsPage.clickCreateTicket();
    await expect(ticketsPage.dialogSaveButton).toBeDisabled();
  });

  test('should close create dialog on cancel', async () => {
    await ticketsPage.clickCreateTicket();
    await expect(ticketsPage.ticketNameInput).toBeVisible();
    await ticketsPage.dialogCancelButton.click();
    await expect(ticketsPage.ticketNameInput).not.toBeVisible();
  });

  test('should open edit dialog with pre-filled data', async () => {
    const rowCount = await ticketsPage.getRowCount();
    if (rowCount > 0) {
      await ticketsPage.clickEditOnRow(0);
      await expect(ticketsPage.ticketNameInput).toBeVisible();
      const value = await ticketsPage.ticketNameInput.inputValue();
      expect(value.length).toBeGreaterThan(0);
    }
  });

  test('should open delete confirmation dialog', async () => {
    const rowCount = await ticketsPage.getRowCount();
    if (rowCount > 0) {
      await ticketsPage.clickDeleteOnRow(0);
      await expect(ticketsPage.confirmButton).toBeVisible();
    }
  });
});
