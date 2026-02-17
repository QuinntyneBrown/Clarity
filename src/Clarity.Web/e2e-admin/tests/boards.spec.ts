import { test, expect } from '@playwright/test';
import { BoardsPage } from '../page-objects/boards.page';

test.describe('Boards Management', () => {
  let boardsPage: BoardsPage;

  test.beforeEach(async ({ page }) => {
    boardsPage = new BoardsPage(page);
    await boardsPage.goto();
  });

  test('should display boards page with title', async () => {
    await expect(boardsPage.pageTitle).toHaveText('Boards');
    await expect(boardsPage.boardsPage).toBeVisible();
  });

  test('should display Create Board button', async () => {
    await expect(boardsPage.createBoardButton).toBeVisible();
    await expect(boardsPage.createBoardButton).toContainText('Create Board');
  });

  test('should display search input', async () => {
    await expect(boardsPage.searchInput).toBeVisible();
  });

  test('should display boards table with data', async () => {
    await expect(boardsPage.boardsTable).toBeVisible();
    const rowCount = await boardsPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should filter boards by search term', async () => {
    const initialCount = await boardsPage.getRowCount();
    await boardsPage.search('nonexistent-board-xyz');
    const filteredCount = await boardsPage.getRowCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('should open create board dialog', async () => {
    await boardsPage.clickCreateBoard();
    await expect(boardsPage.boardNameInput).toBeVisible();
    await expect(boardsPage.dialogSaveButton).toBeVisible();
  });

  test('should close create dialog on cancel', async () => {
    await boardsPage.clickCreateBoard();
    await expect(boardsPage.boardNameInput).toBeVisible();
    await boardsPage.dialogCancelButton.click();
    await expect(boardsPage.boardNameInput).not.toBeVisible();
  });

  test('should open edit dialog with pre-filled data', async () => {
    const rowCount = await boardsPage.getRowCount();
    if (rowCount > 0) {
      await boardsPage.clickEditOnRow(0);
      await expect(boardsPage.boardNameInput).toBeVisible();
      const value = await boardsPage.boardNameInput.inputValue();
      expect(value.length).toBeGreaterThan(0);
    }
  });

  test('should open delete confirmation dialog', async () => {
    const rowCount = await boardsPage.getRowCount();
    if (rowCount > 0) {
      await boardsPage.clickDeleteOnRow(0);
      await expect(boardsPage.confirmButton).toBeVisible();
    }
  });
});
