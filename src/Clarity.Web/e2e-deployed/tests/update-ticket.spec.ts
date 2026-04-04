// Acceptance Test
// Traces to: L2-016, L2-018
// Description: Verify ticket update and deletion via ticket editor page

import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { CreateTicketDialog } from '../page-objects/create-ticket-dialog.page';
import { TicketEditorPage } from '../page-objects/ticket-editor.page';

async function createTicketOnBoard(page: import('@playwright/test').Page, ticketName: string) {
  const kanban = new KanbanPage(page);
  await kanban.clickAddTicket();
  const dialog = new CreateTicketDialog(page);
  await dialog.waitForOpen();
  await dialog.fillName(ticketName);
  await dialog.fillDescription('Test description');
  await dialog.fillAcceptanceCriteria('Test acceptance criteria');
  await dialog.selectFirstAvailableState();
  await dialog.clickSaveAndWaitForApi();
  await dialog.waitForClosed();

  await page.reload();
  await kanban.waitForBoard();
  await expect(kanban.getTicketByName(ticketName)).toBeVisible({ timeout: 10000 });
}

test.describe('Update Ticket', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    let ticketName: string;

    test.beforeEach(async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      ticketName = 'Update Test ' + Date.now();
      await createTicketOnBoard(page, ticketName);
    });

    test('should open ticket editor when clicking a ticket', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.clickTicket(ticketName);

      await page.waitForURL('**/tickets/*/edit', { timeout: 10000 });
      const editor = new TicketEditorPage(page);
      await editor.waitForPage();
      await expect(editor.nameInput).toHaveValue(ticketName);
    });

    test('should update ticket name', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.clickTicket(ticketName);

      await page.waitForURL('**/tickets/*/edit', { timeout: 10000 });
      const editor = new TicketEditorPage(page);
      await editor.waitForPage();

      const updatedName = 'Updated ' + Date.now();
      await editor.fillName(updatedName);

      const responsePromise = page.waitForResponse(
        resp => resp.url().includes('/api/1.0/ticket') && resp.request().method() === 'PUT',
        { timeout: 15000 }
      );
      await editor.clickSave();
      await responsePromise;

      await page.goto('/kanban');
      await kanban.waitForBoard();
      await expect(kanban.getTicketByName(updatedName)).toBeVisible({ timeout: 10000 });
    });

    test('should delete ticket from editor', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.clickTicket(ticketName);

      await page.waitForURL('**/tickets/*/edit', { timeout: 10000 });
      const editor = new TicketEditorPage(page);
      await editor.waitForPage();

      const responsePromise = page.waitForResponse(
        resp => resp.url().includes('/api/1.0/ticket/') && resp.request().method() === 'DELETE',
        { timeout: 15000 }
      );
      await editor.clickDelete();
      await responsePromise;

      await page.goto('/kanban');
      await kanban.waitForBoard();
      await expect(kanban.getTicketByName(ticketName)).toBeHidden({ timeout: 10000 });
    });

    test('should cancel editing by navigating back', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.clickTicket(ticketName);

      await page.waitForURL('**/tickets/*/edit', { timeout: 10000 });
      const editor = new TicketEditorPage(page);
      await editor.waitForPage();
      await editor.fillName('Should Not Save');
      await editor.clickBack();

      await page.waitForURL('**/my-tickets', { timeout: 10000 });

      await page.goto('/kanban');
      await kanban.waitForBoard();
      await expect(kanban.getTicketByName(ticketName)).toBeVisible();
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should update ticket on mobile', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const ticketName = 'Mobile Update ' + Date.now();
      await createTicketOnBoard(page, ticketName);

      await kanban.clickTicket(ticketName);
      await page.waitForURL('**/tickets/*/edit', { timeout: 10000 });

      const editor = new TicketEditorPage(page);
      await editor.waitForPage();

      const updatedName = 'Updated Mobile ' + Date.now();
      await editor.fillName(updatedName);

      const responsePromise = page.waitForResponse(
        resp => resp.url().includes('/api/1.0/ticket') && resp.request().method() === 'PUT',
        { timeout: 15000 }
      );
      await (editor.mobileSaveButton.or(editor.saveButton)).first().click();
      await responsePromise;

      await page.goto('/kanban');
      await kanban.waitForBoard();
      await expect(kanban.getTicketByName(updatedName)).toBeVisible({ timeout: 10000 });
    });
  });
});
