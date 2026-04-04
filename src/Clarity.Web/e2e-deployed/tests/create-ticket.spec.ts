// Acceptance Test
// Traces to: L2-016, L2-018
// Description: Verify ticket creation via dialog with all fields, validation, and board association

import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { CreateTicketDialog } from '../page-objects/create-ticket-dialog.page';

test.describe('Create Ticket', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should open create ticket dialog from kanban', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickAddTicket();

      const dialog = new CreateTicketDialog(page);
      await dialog.waitForOpen();
      await expect(dialog.title).toContainText('Create Ticket');
    });

    test('should display all form fields in dialog', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickAddTicket();

      const dialog = new CreateTicketDialog(page);
      await dialog.waitForOpen();

      await expect(dialog.nameInput).toBeVisible();
      await expect(dialog.descriptionTextarea).toBeVisible();
      await expect(dialog.stateSelect).toBeVisible();
      await expect(dialog.prioritySelect).toBeVisible();
      await expect(dialog.assigneeSelect).toBeVisible();
      await expect(dialog.acceptanceCriteriaTextarea).toBeVisible();
    });

    test('should populate state options from board', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickAddTicket();

      const dialog = new CreateTicketDialog(page);
      await dialog.waitForOpen();

      const labels = await dialog.getStateOptionLabels();
      expect(labels.length).toBeGreaterThanOrEqual(1);
    });

    test('should create ticket and show it on board', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickAddTicket();

      const ticketName = 'E2E Ticket ' + Date.now();
      const dialog = new CreateTicketDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName(ticketName);
      await dialog.fillDescription('Test description for E2E ticket');
      await dialog.fillAcceptanceCriteria('Test acceptance criteria');
      await dialog.selectFirstAvailableState();
      await dialog.clickSave();
      await page.waitForTimeout(3000);

      // Reload to ensure the board fetches the newly created ticket from the server
      await page.reload();
      await kanban.waitForBoard();

      const ticket = kanban.getTicketByName(ticketName);
      await expect(ticket).toBeVisible({ timeout: 10000 });
    });

    test('should close dialog via cancel', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickAddTicket();

      const dialog = new CreateTicketDialog(page);
      await dialog.waitForOpen();
      await dialog.clickCancel();
      await dialog.waitForClosed();
    });

    test('should close dialog via close button', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickAddTicket();

      const dialog = new CreateTicketDialog(page);
      await dialog.waitForOpen();
      await dialog.clickClose();
      await dialog.waitForClosed();
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should open and complete ticket creation on mobile', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickAddTicket();

      const ticketName = 'Mobile Ticket ' + Date.now();
      const dialog = new CreateTicketDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName(ticketName);
      await dialog.fillDescription('Mobile test description');
      await dialog.fillAcceptanceCriteria('Mobile acceptance criteria');
      await dialog.selectFirstAvailableState();
      await dialog.clickSaveAndWaitForApi();
      await dialog.waitForClosed();

      // Reload to ensure the board fetches the newly created ticket from the server
      await page.reload();
      await kanban.waitForBoard();

      const ticket = kanban.getTicketByName(ticketName);
      await expect(ticket).toBeVisible({ timeout: 10000 });
    });

    test('should display all form fields on mobile', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickAddTicket();

      const dialog = new CreateTicketDialog(page);
      await dialog.waitForOpen();
      await expect(dialog.nameInput).toBeVisible();
      await expect(dialog.descriptionTextarea).toBeVisible();
      await expect(dialog.stateSelect).toBeVisible();
      await dialog.clickCancel();
    });
  });
});
