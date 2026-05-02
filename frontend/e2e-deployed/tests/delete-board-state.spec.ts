// Acceptance Test
// Traces to: L2-012
// Description: Verify board state (column) deletion with confirmation dialog

import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { CreateBoardDialog } from '../page-objects/create-board-dialog.page';
import { DeleteBoardStateDialog } from '../page-objects/delete-board-state-dialog.page';

test.describe('Delete Board State', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should open delete column confirmation dialog', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      // Create a temporary board to safely test column deletion
      await kanban.clickNewBoard();
      const boardDialog = new CreateBoardDialog(page);
      await boardDialog.waitForOpen();
      await boardDialog.fillName('Delete Col Test ' + Date.now());
      await boardDialog.clickNext();
      await boardDialog.addState('Temp Column');
      await boardDialog.clickCreate();
      await boardDialog.waitForClosed();
      await kanban.waitForBoard();

      const columnCount = await kanban.getColumnCount();
      expect(columnCount).toBeGreaterThanOrEqual(2);

      const deleteBtn = kanban.columns.last().locator('.column-delete-btn');
      await deleteBtn.click();

      const dialog = new DeleteBoardStateDialog(page);
      await dialog.waitForOpen();
      await expect(dialog.title).toContainText('Delete Column');
    });

    test('should cancel column deletion', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const columnCount = await kanban.getColumnCount();
      if (columnCount > 1) {
        const deleteBtn = kanban.columns.last().locator('.column-delete-btn');
        await deleteBtn.click();

        const dialog = new DeleteBoardStateDialog(page);
        await dialog.waitForOpen();
        await dialog.clickCancel();
        await dialog.waitForClosed();

        expect(await kanban.getColumnCount()).toBe(columnCount);
      }
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should display delete column dialog on mobile', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const columnCount = await kanban.getColumnCount();
      if (columnCount > 1) {
        const deleteBtn = kanban.columns.last().locator('.column-delete-btn');
        await deleteBtn.click();

        const dialog = new DeleteBoardStateDialog(page);
        await dialog.waitForOpen();
        await expect(dialog.title).toContainText('Delete Column');
        await dialog.clickCancel();
        await dialog.waitForClosed();
      }
    });
  });
});
