// Acceptance Test
// Traces to: L2-050
// Description: Verify board selection, switching boards, and board selector sheet

import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { SelectBoardSheet } from '../page-objects/select-board-sheet.page';

test.describe('Board Selection', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should open board selector sheet', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickBoardName();

      const sheet = new SelectBoardSheet(page);
      await sheet.waitForOpen();
      await expect(sheet.title).toContainText('Select Board');
    });

    test('should list available boards', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickBoardName();

      const sheet = new SelectBoardSheet(page);
      await sheet.waitForOpen();
      const names = await sheet.getBoardNames();
      expect(names.length).toBeGreaterThanOrEqual(1);
    });

    test('should highlight current board', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const currentName = (await kanban.boardName.innerText()).trim();
      await kanban.clickBoardName();

      const sheet = new SelectBoardSheet(page);
      await sheet.waitForOpen();
      const active = sheet.getActiveBoardItem();
      await expect(active).toContainText(currentName);
    });

    test('should show action items (New Board, Clone, Delete)', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickBoardName();

      const sheet = new SelectBoardSheet(page);
      await sheet.waitForOpen();
      await expect(sheet.newBoardAction).toBeVisible();
      await expect(sheet.cloneAction).toBeVisible();
      await expect(sheet.deleteAction).toBeVisible();
    });

    test('should close board selector', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickBoardName();

      const sheet = new SelectBoardSheet(page);
      await sheet.waitForOpen();
      await sheet.clickClose();
      await sheet.waitForClosed();
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should open board selector on mobile', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickBoardName();

      const sheet = new SelectBoardSheet(page);
      await sheet.waitForOpen();
      await expect(sheet.title).toContainText('Select Board');
      const names = await sheet.getBoardNames();
      expect(names.length).toBeGreaterThanOrEqual(1);
    });

    test('should close board selector on mobile', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickBoardName();

      const sheet = new SelectBoardSheet(page);
      await sheet.waitForOpen();
      await sheet.clickClose();
      await sheet.waitForClosed();
    });
  });
});
