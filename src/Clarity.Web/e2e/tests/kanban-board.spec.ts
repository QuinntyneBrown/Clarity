import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';

test.describe('Kanban Board', () => {
  let kanban: KanbanPage;

  test.beforeEach(async ({ page }) => {
    kanban = new KanbanPage(page);
    await kanban.goto();
    await kanban.waitForBoard();
  });

  test('should display the board name', async () => {
    await expect(kanban.boardName).toHaveText(/Default/);
  });

  test('should display the add ticket button', async () => {
    await expect(kanban.addTicketButton).toBeVisible();
    await expect(kanban.addTicketButton).toHaveText('add');
  });

  test('should render three columns for board states', async () => {
    const count = await kanban.getColumnCount();
    expect(count).toBe(3);
  });

  test('should display board state types as column headers', async () => {
    const headers = await kanban.getColumnHeaders();
    expect(headers).toEqual(['Backlog', 'InProgress', 'Done']);
  });

  test('should render ticket lists in each column', async () => {
    for (let i = 0; i < 3; i++) {
      const column = kanban.columns.nth(i);
      await expect(column).toBeVisible();
    }
  });
});
