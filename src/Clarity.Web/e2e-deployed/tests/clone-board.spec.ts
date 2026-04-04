// Acceptance Test
// Traces to: L2-013
// Description: Verify board cloning creates a copy with same states

import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { CloneBoardDialog } from '../page-objects/clone-board-dialog.page';

test.describe('Clone Board', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should open clone board dialog from controls', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickCloneBoard();

      const dialog = new CloneBoardDialog(page);
      await dialog.waitForOpen();
      await expect(dialog.title).toContainText('Clone Board');
    });

    test('should display source board name', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const originalName = (await kanban.boardName.innerText()).trim();
      await kanban.clickCloneBoard();

      const dialog = new CloneBoardDialog(page);
      await dialog.waitForOpen();
      await expect(dialog.sourceBoardName).toContainText(originalName);
    });

    test('should clone board with new name', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickCloneBoard();

      const cloneName = 'Cloned Board ' + Date.now();
      const dialog = new CloneBoardDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName(cloneName);
      await dialog.clickClone();
      await dialog.waitForClosed();

      await kanban.waitForBoard();
      await expect(kanban.boardName).toContainText(cloneName);
    });

    test('should cancel clone dialog', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickCloneBoard();

      const dialog = new CloneBoardDialog(page);
      await dialog.waitForOpen();
      await dialog.clickCancel();
      await dialog.waitForClosed();
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should clone board on mobile', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      await kanban.clickBoardName();
      const selectBoard = page.locator('app-select-board');
      await selectBoard.waitFor({ state: 'visible' });

      const cloneAction = selectBoard.locator('.action-item', { hasText: 'Clone' });
      await cloneAction.click();

      const dialog = new CloneBoardDialog(page);
      await dialog.waitForOpen();
      const cloneName = 'Mobile Clone ' + Date.now();
      await dialog.fillName(cloneName);
      await dialog.clickClone();
      await dialog.waitForClosed();

      await kanban.waitForBoard();
      await expect(kanban.boardName).toContainText(cloneName);
    });
  });
});
