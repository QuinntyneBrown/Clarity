import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { CreateTicketDialog } from '../page-objects/create-ticket-dialog.page';

test.describe('Ticket Creation', () => {
  let kanban: KanbanPage;
  let dialog: CreateTicketDialog;
  let uniqueId: string;

  test.beforeEach(async ({ page }) => {
    uniqueId = Date.now().toString(36);
    kanban = new KanbanPage(page);
    dialog = new CreateTicketDialog(page);
    await kanban.goto();
    await kanban.waitForBoard();
  });

  test('should create a ticket and see it in the correct column after reload', async ({ page }) => {
    const ticketName = `Ticket-${uniqueId}`;

    await kanban.clickAddTicket();
    await dialog.waitForOpen();

    await dialog.fillName(ticketName);
    await dialog.selectState('Backlog');
    await dialog.fillDescription('A test description');
    await dialog.fillAcceptanceCriteria('Test criteria');

    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/ticket/upsert') && resp.status() === 200
    );
    await dialog.clickSave();
    await responsePromise;
    await dialog.waitForClosed();

    await page.reload();
    await kanban.waitForBoard();

    const backlogTickets = kanban.getTicketsInColumnByHeader('Backlog');
    await expect(backlogTickets.filter({ hasText: ticketName })).toHaveCount(1);
  });

  test('should create tickets in different states and see them in correct columns', async ({ page }) => {
    const backlogName = `Backlog-${uniqueId}`;
    const doneName = `Done-${uniqueId}`;

    // Create first ticket in Backlog
    await kanban.clickAddTicket();
    await dialog.waitForOpen();
    await dialog.fillName(backlogName);
    await dialog.selectState('Backlog');
    await dialog.fillDescription('Backlog description');
    await dialog.fillAcceptanceCriteria('Backlog criteria');

    const response1 = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/ticket/upsert') && resp.status() === 200
    );
    await dialog.clickSave();
    await response1;
    await dialog.waitForClosed();

    // Create second ticket in Done
    await kanban.clickAddTicket();
    await dialog.waitForOpen();
    await dialog.fillName(doneName);
    await dialog.selectState('Done');
    await dialog.fillDescription('Done description');
    await dialog.fillAcceptanceCriteria('Done criteria');

    const response2 = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/ticket/upsert') && resp.status() === 200
    );
    await dialog.clickSave();
    await response2;
    await dialog.waitForClosed();

    await page.reload();
    await kanban.waitForBoard();

    const backlogTickets = kanban.getTicketsInColumnByHeader('Backlog');
    await expect(backlogTickets.filter({ hasText: backlogName })).toHaveCount(1);

    const doneTickets = kanban.getTicketsInColumnByHeader('Done');
    await expect(doneTickets.filter({ hasText: doneName })).toHaveCount(1);
  });
});
