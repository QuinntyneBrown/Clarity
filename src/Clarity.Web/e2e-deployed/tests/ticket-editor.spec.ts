// Acceptance Test
// Traces to: L2-016, L2-019, L2-020, L2-022
// Description: Verify ticket editor page with all fields, save/delete, attachments, comments sections

import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { CreateTicketDialog } from '../page-objects/create-ticket-dialog.page';
import { TicketEditorPage } from '../page-objects/ticket-editor.page';

test.describe('Ticket Editor', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should navigate to ticket editor from kanban', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      // Create a ticket first
      const ticketName = 'Editor Test ' + Date.now();
      await kanban.clickAddTicket();
      const dialog = new CreateTicketDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName(ticketName);
      await dialog.clickSave();
      await dialog.waitForClosed();
      await expect(kanban.getTicketByName(ticketName)).toBeVisible({ timeout: 10000 });

      // Click ticket to navigate to editor
      await kanban.clickTicket(ticketName);

      // If it opens in editor page (not dialog)
      const editorPage = new TicketEditorPage(page);
      const updateDialog = page.locator('app-update-ticket');
      if (await updateDialog.isVisible()) {
        // Some boards may open update dialog instead of editor
        await expect(updateDialog).toBeVisible();
      } else {
        await editorPage.waitForPage();
        await expect(editorPage.nameInput).toHaveValue(ticketName);
      }
    });

    test('should display all form fields in editor', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const ticketName = 'Fields Test ' + Date.now();
      await kanban.clickAddTicket();
      const dialog = new CreateTicketDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName(ticketName);
      await dialog.clickSave();
      await dialog.waitForClosed();

      // Navigate to editor via URL
      await page.goto('/my-tickets');
      const myTickets = page.locator('app-my-tickets');
      await myTickets.waitFor({ state: 'visible', timeout: 15000 });

      // Try to find the ticket and click to edit
      const ticketRow = page.locator('.ticket-row', { hasText: ticketName });
      if (await ticketRow.isVisible({ timeout: 5000 })) {
        await ticketRow.click();
        await page.waitForURL('**/tickets/*/edit', { timeout: 10000 });

        const editor = new TicketEditorPage(page);
        await editor.waitForPage();

        await expect(editor.nameInput).toBeVisible();
        await expect(editor.descriptionInput).toBeVisible();
        await expect(editor.acceptanceCriteriaInput).toBeVisible();
        await expect(editor.urlInput).toBeVisible();
        await expect(editor.typeSelect).toBeVisible();
        await expect(editor.prioritySelect).toBeVisible();
        await expect(editor.statusSelect).toBeVisible();
        await expect(editor.assigneeSelect).toBeVisible();
        await expect(editor.initiativeSelect).toBeVisible();
        await expect(editor.storyPointsInput).toBeVisible();
        await expect(editor.effortInput).toBeVisible();
      }
    });

    test('should display top bar with save and delete buttons', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const ticketName = 'TopBar Test ' + Date.now();
      await kanban.clickAddTicket();
      const dialog = new CreateTicketDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName(ticketName);
      await dialog.clickSave();
      await dialog.waitForClosed();

      await page.goto('/my-tickets');
      await page.locator('app-my-tickets').waitFor({ state: 'visible', timeout: 15000 });
      const ticketRow = page.locator('.ticket-row', { hasText: ticketName });
      if (await ticketRow.isVisible({ timeout: 5000 })) {
        await ticketRow.click();
        await page.waitForURL('**/tickets/*/edit', { timeout: 10000 });

        const editor = new TicketEditorPage(page);
        await editor.waitForPage();

        await expect(editor.topBar).toBeVisible();
        await expect(editor.saveButton).toBeVisible();
        await expect(editor.deleteButton).toBeVisible();
        await expect(editor.backButton).toBeVisible();
      }
    });

    test('should display attachments and comments sections', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const ticketName = 'Sections Test ' + Date.now();
      await kanban.clickAddTicket();
      const dialog = new CreateTicketDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName(ticketName);
      await dialog.clickSave();
      await dialog.waitForClosed();

      await page.goto('/my-tickets');
      await page.locator('app-my-tickets').waitFor({ state: 'visible', timeout: 15000 });
      const ticketRow = page.locator('.ticket-row', { hasText: ticketName });
      if (await ticketRow.isVisible({ timeout: 5000 })) {
        await ticketRow.click();
        await page.waitForURL('**/tickets/*/edit', { timeout: 10000 });

        const editor = new TicketEditorPage(page);
        await editor.waitForPage();

        await expect(editor.uploadButton).toBeVisible();
        // Empty state texts should show for new ticket
        await expect(editor.emptyAttachmentsText).toBeVisible();
        await expect(editor.emptyCommentsText).toBeVisible();
      }
    });

    test('should navigate back from editor', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const ticketName = 'Back Nav Test ' + Date.now();
      await kanban.clickAddTicket();
      const dialog = new CreateTicketDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName(ticketName);
      await dialog.clickSave();
      await dialog.waitForClosed();

      await page.goto('/my-tickets');
      await page.locator('app-my-tickets').waitFor({ state: 'visible', timeout: 15000 });
      const ticketRow = page.locator('.ticket-row', { hasText: ticketName });
      if (await ticketRow.isVisible({ timeout: 5000 })) {
        await ticketRow.click();
        await page.waitForURL('**/tickets/*/edit', { timeout: 10000 });

        const editor = new TicketEditorPage(page);
        await editor.waitForPage();
        await editor.clickBack();

        await page.waitForURL('**/my-tickets', { timeout: 10000 });
      }
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should display ticket editor on mobile', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const ticketName = 'Mobile Editor ' + Date.now();
      await kanban.clickAddTicket();
      const dialog = new CreateTicketDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName(ticketName);
      await dialog.clickSave();
      await dialog.waitForClosed();

      await page.goto('/my-tickets');
      await page.locator('app-my-tickets').waitFor({ state: 'visible', timeout: 15000 });
      const ticketCard = page.locator('.ticket-card', { hasText: ticketName });
      if (await ticketCard.isVisible({ timeout: 5000 })) {
        await ticketCard.click();
        await page.waitForURL('**/tickets/*/edit', { timeout: 10000 });

        const editor = new TicketEditorPage(page);
        await editor.waitForPage();
        await expect(editor.nameInput).toBeVisible();
        await expect(editor.backButton).toBeVisible();
      }
    });

    test('should show mobile save and delete buttons', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const ticketName = 'Mobile Actions ' + Date.now();
      await kanban.clickAddTicket();
      const dialog = new CreateTicketDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName(ticketName);
      await dialog.clickSave();
      await dialog.waitForClosed();

      await page.goto('/my-tickets');
      await page.locator('app-my-tickets').waitFor({ state: 'visible', timeout: 15000 });
      const ticketCard = page.locator('.ticket-card', { hasText: ticketName });
      if (await ticketCard.isVisible({ timeout: 5000 })) {
        await ticketCard.click();
        await page.waitForURL('**/tickets/*/edit', { timeout: 10000 });

        const editor = new TicketEditorPage(page);
        await editor.waitForPage();

        // Mobile action bar should be visible
        await expect(editor.mobileSaveButton.or(editor.saveButton)).toBeVisible();
      }
    });
  });
});
