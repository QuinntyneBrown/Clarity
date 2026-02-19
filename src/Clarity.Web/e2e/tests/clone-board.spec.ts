import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';

test.describe('Clone Board', () => {
  let kanban: KanbanPage;

  test.beforeEach(async ({ page }) => {
    kanban = new KanbanPage(page);
    await kanban.goto();
    await kanban.waitForBoard();
  });

  test('should clone a board and display exactly three columns', async ({ page }) => {
    // Verify we start on Default board with 3 columns
    await expect(kanban.boardName).toHaveText(/Default/);
    expect(await kanban.getColumnCount()).toBe(3);

    // Click the Clone button in the board controls bar
    const cloneButton = page.locator('app-kanban-board-controls button', { hasText: 'Clone' });
    await cloneButton.click();

    // Fill in the clone dialog
    const dialog = page.locator('app-clone-board');
    await expect(dialog).toBeVisible();
    await dialog.locator('input[formcontrolname="name"]').fill('Agents');
    await dialog.locator('button', { hasText: 'Clone Board' }).click();

    // Wait for clone dialog to close
    await expect(dialog).not.toBeVisible();

    // After clone, the page reloads the current board — verify Default still has 3 columns
    await kanban.waitForBoard();
    expect(await kanban.getColumnCount()).toBe(3);

    // Navigate to the cloned board via the board selector
    await kanban.clickBoardName();
    const selectSheet = page.locator('app-select-board');
    await expect(selectSheet).toBeVisible();
    await selectSheet.locator('.board-item', { hasText: 'Agents' }).click();

    // Wait for the Agents board to load
    await expect(kanban.boardName).toHaveText(/Agents/);
    await kanban.waitForBoard();

    // Verify cloned board has exactly 3 columns
    expect(await kanban.getColumnCount()).toBe(3);
    const headers = await kanban.getColumnHeaders();
    expect(headers).toEqual(['Backlog', 'InProgress', 'Done']);
  });
});
