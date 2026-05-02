import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { CreateTicketDialog } from '../page-objects/create-ticket-dialog.page';

test.describe('Create Ticket - Board Context', () => {
  let kanban: KanbanPage;
  let dialog: CreateTicketDialog;

  test.beforeEach(async ({ page }) => {
    kanban = new KanbanPage(page);
    dialog = new CreateTicketDialog(page);
    await kanban.goto();
    await kanban.waitForBoard();
  });

  test('should show only 3 status options matching the current board columns', async ({ page }) => {
    // First clone a board so there are multiple boards with states
    const cloneButton = page.locator('app-kanban-board-controls button', { hasText: 'Clone' });
    await cloneButton.click();
    const cloneDialog = page.locator('app-clone-board');
    await expect(cloneDialog).toBeVisible();
    await cloneDialog.locator('input[formcontrolname="name"]').fill('Second Board');
    await cloneDialog.locator('button', { hasText: 'Clone Board' }).click();
    await expect(cloneDialog).not.toBeVisible();
    await kanban.waitForBoard();

    // Now open the create ticket dialog on the Default board
    await kanban.clickAddTicket();
    await dialog.waitForOpen();

    // Should only show 3 statuses (Backlog, InProgress, Done) - not 6
    const stateCount = await dialog.getStateOptionCount();
    expect(stateCount).toBe(3);

    const labels = await dialog.getStateOptionLabels();
    expect(labels).toEqual(['Backlog', 'InProgress', 'Done']);
  });

  test('should add created ticket to the currently open board', async ({ page }) => {
    // Clone board to create a second board
    const cloneButton = page.locator('app-kanban-board-controls button', { hasText: 'Clone' });
    await cloneButton.click();
    const cloneDialog = page.locator('app-clone-board');
    await expect(cloneDialog).toBeVisible();
    await cloneDialog.locator('input[formcontrolname="name"]').fill('Other Board');
    await cloneDialog.locator('button', { hasText: 'Clone Board' }).click();
    await expect(cloneDialog).not.toBeVisible();
    await kanban.waitForBoard();

    // Navigate to the cloned board
    await kanban.clickBoardName();
    const selectSheet = page.locator('app-select-board');
    await expect(selectSheet).toBeVisible();
    await selectSheet.locator('.board-item', { hasText: 'Other Board' }).click();
    await expect(kanban.boardName).toHaveText(/Other Board/);
    await kanban.waitForBoard();

    // Create a ticket on "Other Board"
    const ticketName = 'Ticket For Other Board';
    await kanban.clickAddTicket();
    await dialog.waitForOpen();
    await dialog.fillName(ticketName);
    await dialog.fillDescription('Test description');
    await dialog.fillAcceptanceCriteria('Test criteria');
    await dialog.selectState('Backlog');
    await dialog.clickSave();
    await dialog.waitForClosed();

    // Wait for the board to reload and show the new ticket
    await page.waitForTimeout(1000);

    // The ticket should appear on "Other Board"
    const ticket = kanban.getTicketByName(ticketName);
    await expect(ticket).toBeVisible({ timeout: 10000 });

    // Navigate to Default board — the ticket should NOT be there
    await kanban.clickBoardName();
    const selectSheet2 = page.locator('app-select-board');
    await expect(selectSheet2).toBeVisible();
    await selectSheet2.locator('.board-item', { hasText: 'Default' }).click();
    await expect(kanban.boardName).toHaveText(/Default/);
    await kanban.waitForBoard();

    // The ticket should not appear on the Default board
    const ticketOnDefault = kanban.getTicketByName(ticketName);
    await expect(ticketOnDefault).not.toBeVisible({ timeout: 5000 });
  });
});
