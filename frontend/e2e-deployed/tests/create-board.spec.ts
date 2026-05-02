// Acceptance Test
// Traces to: L2-011, L2-012
// Description: Verify multi-step board creation with name and columns

import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { CreateBoardDialog } from '../page-objects/create-board-dialog.page';

test.describe('Create Board', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should open create board dialog', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickNewBoard();

      const dialog = new CreateBoardDialog(page);
      await dialog.waitForOpen();
      await expect(dialog.title).toContainText('New Board');
    });

    test('should display step 1 with name input', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickNewBoard();

      const dialog = new CreateBoardDialog(page);
      await dialog.waitForOpen();

      await expect(dialog.nameInput).toBeVisible();
      await expect(dialog.nextButton).toBeVisible();
      await expect(dialog.cancelButton).toBeVisible();
      expect(await dialog.getActiveStepBarCount()).toBe(1);
    });

    test('should navigate to step 2 with default columns', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickNewBoard();

      const dialog = new CreateBoardDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName('Test Board ' + Date.now());
      await dialog.clickNext();

      await expect(dialog.stateItems.first()).toBeVisible();
      const stateCount = await dialog.getStateCount();
      expect(stateCount).toBeGreaterThanOrEqual(1);
      expect(await dialog.getActiveStepBarCount()).toBe(2);
    });

    test('should add a custom column in step 2', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickNewBoard();

      const dialog = new CreateBoardDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName('Test Board ' + Date.now());
      await dialog.clickNext();

      const initialCount = await dialog.getStateCount();
      await dialog.addState('Review');
      const newCount = await dialog.getStateCount();
      expect(newCount).toBe(initialCount + 1);
    });

    test('should go back to step 1 from step 2', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickNewBoard();

      const dialog = new CreateBoardDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName('Test Board');
      await dialog.clickNext();
      await dialog.clickBack();

      await expect(dialog.nameInput).toBeVisible();
      expect(await dialog.getActiveStepBarCount()).toBe(1);
    });

    test('should create board and navigate to it', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickNewBoard();

      const boardName = 'E2E Board ' + Date.now();
      const dialog = new CreateBoardDialog(page);
      await dialog.waitForOpen();
      await dialog.fillName(boardName);
      await dialog.clickNext();
      await dialog.clickCreate();
      await dialog.waitForClosed();

      await kanban.waitForBoard();
      await expect(kanban.boardName).toContainText(boardName);
    });

    test('should close dialog via close button', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickNewBoard();

      const dialog = new CreateBoardDialog(page);
      await dialog.waitForOpen();
      await dialog.clickClose();
      await dialog.waitForClosed();
    });

    test('should close dialog via cancel button', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickNewBoard();

      const dialog = new CreateBoardDialog(page);
      await dialog.waitForOpen();
      await dialog.clickCancel();
      await dialog.waitForClosed();
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should open and complete board creation on mobile', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();
      await kanban.clickNewBoard();

      const dialog = new CreateBoardDialog(page);
      await dialog.waitForOpen();
      await expect(dialog.nameInput).toBeVisible();

      const boardName = 'Mobile Board ' + Date.now();
      await dialog.fillName(boardName);
      await dialog.clickNext();
      await expect(dialog.stateItems.first()).toBeVisible();
      await dialog.clickCreate();
      await dialog.waitForClosed();

      await kanban.waitForBoard();
      await expect(kanban.boardName).toContainText(boardName);
    });
  });
});
