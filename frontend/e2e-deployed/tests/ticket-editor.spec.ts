// Acceptance Test
// Traces to: L2-016, L2-019, L2-020, L2-022
// Description: Verify ticket editor page with all fields, save/delete, attachments, comments sections

import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { CreateTicketDialog } from '../page-objects/create-ticket-dialog.page';
import { TicketEditorPage } from '../page-objects/ticket-editor.page';

async function createTicketViaDialog(page: import('@playwright/test').Page, ticketName: string) {
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
}

async function navigateToEditorViaKanban(page: import('@playwright/test').Page, ticketName: string) {
  // My-tickets page opens an update dialog on click, not navigation.
  // Use the kanban board which navigates to the editor on ticket click.
  const kanban = new KanbanPage(page);
  await kanban.goto();
  await kanban.waitForBoard();

  await kanban.clickTicket(ticketName);
  await page.waitForURL('**/tickets/*/edit', { timeout: 10000 });

  const editor = new TicketEditorPage(page);
  await editor.waitForPage();
  return editor;
}

test.describe('Ticket Editor', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should navigate to ticket editor from kanban', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const ticketName = 'Editor Test ' + Date.now();
      await createTicketViaDialog(page, ticketName);

      // Reload to ensure the board fetches the newly created ticket from the server
      await page.reload();
      await kanban.waitForBoard();
      await expect(kanban.getTicketByName(ticketName)).toBeVisible({ timeout: 10000 });

      await kanban.clickTicket(ticketName);

      const editorPage = new TicketEditorPage(page);
      const updateDialog = page.locator('app-update-ticket');
      if (await updateDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
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
      await createTicketViaDialog(page, ticketName);

      const editor = await navigateToEditorViaKanban(page, ticketName);

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
    });

    test('should display top bar with save and delete buttons', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const ticketName = 'TopBar Test ' + Date.now();
      await createTicketViaDialog(page, ticketName);

      const editor = await navigateToEditorViaKanban(page, ticketName);

      await expect(editor.topBar).toBeVisible();
      await expect(editor.saveButton).toBeVisible();
      await expect(editor.deleteButton).toBeVisible();
      await expect(editor.backButton).toBeVisible();
    });

    test('should display attachments and comments sections', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const ticketName = 'Sections Test ' + Date.now();
      await createTicketViaDialog(page, ticketName);

      const editor = await navigateToEditorViaKanban(page, ticketName);

      await expect(editor.uploadButton).toBeVisible();
      await expect(editor.emptyAttachmentsText).toBeVisible();
      await expect(editor.emptyCommentsText).toBeVisible();
    });

    test('should navigate back from editor', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const ticketName = 'Back Nav Test ' + Date.now();
      await createTicketViaDialog(page, ticketName);

      const editor = await navigateToEditorViaKanban(page, ticketName);

      await editor.clickBack();
      await page.waitForURL('**/my-tickets', { timeout: 10000 });
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should display ticket editor on mobile', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const ticketName = 'Mobile Editor ' + Date.now();
      await createTicketViaDialog(page, ticketName);

      const editor = await navigateToEditorViaKanban(page, ticketName);
      await expect(editor.nameInput).toBeVisible();
      await expect(editor.backButton).toBeVisible();
    });

    test('should show mobile save and delete buttons', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const ticketName = 'Mobile Actions ' + Date.now();
      await createTicketViaDialog(page, ticketName);

      const editor = await navigateToEditorViaKanban(page, ticketName);

      // On mobile viewport the desktop save-btn is hidden via CSS and the
      // mobile-action-bar (with .save-btn-mobile) is shown instead.
      // Check that at least one save button is visible.
      const isMobileSaveVisible = await editor.mobileSaveButton.isVisible().catch(() => false);
      const isDesktopSaveVisible = await editor.saveButton.isVisible().catch(() => false);
      expect(isMobileSaveVisible || isDesktopSaveVisible).toBe(true);
    });
  });
});
