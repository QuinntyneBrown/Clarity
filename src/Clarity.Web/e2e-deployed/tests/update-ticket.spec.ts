// Acceptance Test
// Traces to: L2-016, L2-018
// Description: Verify ticket update and deletion via update dialog

import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { CreateTicketDialog } from '../page-objects/create-ticket-dialog.page';
import { UpdateTicketDialog } from '../page-objects/update-ticket-dialog.page';

test.describe('Update Ticket', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    let ticketName: string;

    test.beforeEach(async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      // Create a ticket to update
      ticketName = 'Update Test ' + Date.now();
      await kanban.clickAddTicket();
      const createDialog = new CreateTicketDialog(page);
      await createDialog.waitForOpen();
      await createDialog.fillName(ticketName);
      await createDialog.clickSave();
      await createDialog.waitForClosed();
      await expect(kanban.getTicketByName(ticketName)).toBeVisible({ timeout: 10000 });
    });

    test('should open update dialog when clicking a ticket', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.clickTicket(ticketName);

      const dialog = new UpdateTicketDialog(page);
      await dialog.waitForOpen();
      await expect(dialog.nameInput).toHaveValue(ticketName);
    });

    test('should update ticket name', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.clickTicket(ticketName);

      const updatedName = 'Updated ' + Date.now();
      const dialog = new UpdateTicketDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName(updatedName);
      await dialog.clickSave();
      await dialog.waitForClosed();

      await expect(kanban.getTicketByName(updatedName)).toBeVisible({ timeout: 10000 });
    });

    test('should delete ticket from update dialog', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.clickTicket(ticketName);

      const dialog = new UpdateTicketDialog(page);
      await dialog.waitForOpen();
      await dialog.clickDelete();
      await dialog.waitForClosed();

      await expect(kanban.getTicketByName(ticketName)).toBeHidden({ timeout: 10000 });
    });

    test('should cancel update dialog', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.clickTicket(ticketName);

      const dialog = new UpdateTicketDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName('Should Not Save');
      await dialog.clickCancel();
      await dialog.waitForClosed();

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
      await kanban.clickAddTicket();
      const createDialog = new CreateTicketDialog(page);
      await createDialog.waitForOpen();
      await createDialog.fillName(ticketName);
      await createDialog.clickSave();
      await createDialog.waitForClosed();
      await expect(kanban.getTicketByName(ticketName)).toBeVisible({ timeout: 10000 });

      await kanban.clickTicket(ticketName);
      const updateDialog = new UpdateTicketDialog(page);
      await updateDialog.waitForOpen();
      const updatedName = 'Updated Mobile ' + Date.now();
      await updateDialog.fillName(updatedName);
      await updateDialog.clickSave();
      await updateDialog.waitForClosed();

      await expect(kanban.getTicketByName(updatedName)).toBeVisible({ timeout: 10000 });
    });
  });
});
