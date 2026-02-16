import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { UpdateTicketDialog } from '../page-objects/update-ticket-dialog.page';

test.describe('Update Ticket Dialog', () => {
  let kanban: KanbanPage;
  let dialog: UpdateTicketDialog;

  test.beforeEach(async ({ page }) => {
    kanban = new KanbanPage(page);
    dialog = new UpdateTicketDialog(page);
    await kanban.goto();
    await kanban.waitForBoard();
  });

  test('should open update ticket dialog when clicking a ticket', async () => {
    const firstTicket = kanban.page.locator('app-ticket h2').first();
    await firstTicket.waitFor({ state: 'visible', timeout: 15000 });
    const ticketName = await firstTicket.innerText();
    await kanban.clickTicket(ticketName);
    await dialog.waitForOpen();
    await expect(dialog.dialog).toBeVisible();
  });

  test('should display the correct dialog title', async () => {
    const firstTicket = kanban.page.locator('app-ticket h2').first();
    await firstTicket.waitFor({ state: 'visible', timeout: 15000 });
    const ticketName = await firstTicket.innerText();
    await kanban.clickTicket(ticketName);
    await dialog.waitForOpen();
    await expect(dialog.title).toHaveText('Update Ticket');
  });

  test('should display all form fields', async () => {
    const firstTicket = kanban.page.locator('app-ticket h2').first();
    await firstTicket.waitFor({ state: 'visible', timeout: 15000 });
    const ticketName = await firstTicket.innerText();
    await kanban.clickTicket(ticketName);
    await dialog.waitForOpen();
    await expect(dialog.nameInput).toBeVisible();
    await expect(dialog.stateSelect).toBeVisible();
    await expect(dialog.descriptionTextarea).toBeVisible();
    await expect(dialog.acceptanceCriteriaTextarea).toBeVisible();
  });

  test('should display save, delete, and cancel buttons', async () => {
    const firstTicket = kanban.page.locator('app-ticket h2').first();
    await firstTicket.waitFor({ state: 'visible', timeout: 15000 });
    const ticketName = await firstTicket.innerText();
    await kanban.clickTicket(ticketName);
    await dialog.waitForOpen();
    await expect(dialog.saveButton).toBeVisible();
    await expect(dialog.deleteButton).toBeVisible();
    await expect(dialog.cancelButton).toBeVisible();
  });

  test('should pre-populate form with ticket data', async () => {
    const firstTicket = kanban.page.locator('app-ticket h2').first();
    await firstTicket.waitFor({ state: 'visible', timeout: 15000 });
    const ticketName = await firstTicket.innerText();
    await kanban.clickTicket(ticketName);
    await dialog.waitForOpen();
    await expect(dialog.nameInput).toHaveValue(ticketName);
  });

  test('should close dialog when clicking cancel', async () => {
    const firstTicket = kanban.page.locator('app-ticket h2').first();
    await firstTicket.waitFor({ state: 'visible', timeout: 15000 });
    const ticketName = await firstTicket.innerText();
    await kanban.clickTicket(ticketName);
    await dialog.waitForOpen();
    await dialog.clickCancel();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should allow editing form fields', async () => {
    const firstTicket = kanban.page.locator('app-ticket h2').first();
    await firstTicket.waitFor({ state: 'visible', timeout: 15000 });
    const ticketName = await firstTicket.innerText();
    await kanban.clickTicket(ticketName);
    await dialog.waitForOpen();

    await dialog.fillName('Updated Ticket Name');
    await dialog.fillDescription('Updated description');
    await dialog.fillAcceptanceCriteria('Updated criteria');

    await expect(dialog.nameInput).toHaveValue('Updated Ticket Name');
    await expect(dialog.descriptionTextarea).toHaveValue('Updated description');
    await expect(dialog.acceptanceCriteriaTextarea).toHaveValue('Updated criteria');
  });

  test('should close dialog when clicking save', async () => {
    const firstTicket = kanban.page.locator('app-ticket h2').first();
    await firstTicket.waitFor({ state: 'visible', timeout: 15000 });
    const ticketName = await firstTicket.innerText();
    await kanban.clickTicket(ticketName);
    await dialog.waitForOpen();
    await dialog.clickSave();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should close dialog when clicking delete', async () => {
    const firstTicket = kanban.page.locator('app-ticket h2').first();
    await firstTicket.waitFor({ state: 'visible', timeout: 15000 });
    const ticketName = await firstTicket.innerText();
    await kanban.clickTicket(ticketName);
    await dialog.waitForOpen();
    await dialog.clickDelete();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should remove ticket from board after deleting without refresh', async () => {
    const firstTicket = kanban.page.locator('app-ticket h2').first();
    await firstTicket.waitFor({ state: 'visible', timeout: 15000 });
    const ticketName = await firstTicket.innerText();
    const countBefore = await kanban.page.locator('app-ticket').count();

    await kanban.clickTicket(ticketName);
    await dialog.waitForOpen();
    await dialog.clickDelete();
    await dialog.waitForClosed();

    // Ticket should be gone from the board without a page refresh
    await expect(kanban.getTicketByName(ticketName)).not.toBeVisible({ timeout: 5000 });
    const countAfter = await kanban.page.locator('app-ticket').count();
    expect(countAfter).toBe(countBefore - 1);
  });

  test('should persist edited acceptance criteria when re-opening dialog', async ({ page }) => {
    const firstTicket = kanban.page.locator('app-ticket h2').first();
    await firstTicket.waitFor({ state: 'visible', timeout: 15000 });
    const ticketName = await firstTicket.innerText();

    // Open dialog, edit acceptance criteria, save
    await kanban.clickTicket(ticketName);
    await dialog.waitForOpen();
    const updatedCriteria = `Updated criteria ${Date.now()}`;
    await dialog.fillAcceptanceCriteria(updatedCriteria);

    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/ticket/upsert') && resp.status() === 200
    );
    await dialog.clickSave();
    await responsePromise;
    await dialog.waitForClosed();

    // Re-open the same ticket without refreshing
    await kanban.clickTicket(ticketName);
    await dialog.waitForOpen();
    await expect(dialog.acceptanceCriteriaTextarea).toHaveValue(updatedCriteria);
    await dialog.clickCancel();
    await dialog.waitForClosed();
  });
});
