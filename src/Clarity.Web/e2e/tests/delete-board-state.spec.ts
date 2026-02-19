import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { DeleteBoardStateDialog } from '../page-objects/delete-board-state-dialog.page';

test.describe('Delete Board State (Column)', () => {
  let kanban: KanbanPage;
  let dialog: DeleteBoardStateDialog;

  test.beforeEach(async ({ page }) => {
    kanban = new KanbanPage(page);
    dialog = new DeleteBoardStateDialog(page);
    await kanban.goto();
    await kanban.waitForBoard();
  });

  test('should show delete button on each column header', async ({ page }) => {
    const deleteButtons = page.locator('.column-delete-btn');
    const count = await deleteButtons.count();
    expect(count).toBe(3);
  });

  test('should open confirmation dialog when clicking delete on a column', async ({ page }) => {
    const deleteButtons = page.locator('.column-delete-btn');
    await deleteButtons.first().click();
    await dialog.waitForOpen();

    const titleText = await dialog.getConfirmTitleText();
    expect(titleText).toContain('Delete');
    expect(titleText).toContain('column?');
  });

  test('should cancel deletion and keep column when clicking Cancel', async ({ page }) => {
    const columnsBefore = await kanban.getColumnCount();
    expect(columnsBefore).toBe(3);

    const deleteButtons = page.locator('.column-delete-btn');
    await deleteButtons.first().click();
    await dialog.waitForOpen();
    await dialog.clickCancel();
    await dialog.waitForClosed();

    const columnsAfter = await kanban.getColumnCount();
    expect(columnsAfter).toBe(3);
  });

  test('should delete column and reload board with fewer columns', async ({ page }) => {
    const columnsBefore = await kanban.getColumnCount();
    expect(columnsBefore).toBe(3);

    const headersBefore = await kanban.getColumnHeaders();
    expect(headersBefore).toEqual(['Backlog', 'InProgress', 'Done']);

    // Delete the last column (Done)
    const deleteButtons = page.locator('.column-delete-btn');
    await deleteButtons.last().click();
    await dialog.waitForOpen();

    const titleText = await dialog.getConfirmTitleText();
    expect(titleText).toContain('Done');

    await dialog.clickDelete();
    await dialog.waitForClosed();

    // Wait for board to reload
    await page.waitForTimeout(1000);
    await kanban.waitForBoard();

    const columnsAfter = await kanban.getColumnCount();
    expect(columnsAfter).toBe(2);

    const headersAfter = await kanban.getColumnHeaders();
    expect(headersAfter).toEqual(['Backlog', 'InProgress']);
  });
});
