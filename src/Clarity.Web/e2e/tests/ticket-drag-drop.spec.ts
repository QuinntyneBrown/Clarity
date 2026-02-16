import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { CreateTicketDialog } from '../page-objects/create-ticket-dialog.page';

// Use a wide viewport to ensure columns are well-separated
test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Ticket Drag and Drop', () => {
  let kanban: KanbanPage;
  let dialog: CreateTicketDialog;
  let uniqueId: string;

  test.beforeEach(async ({ page }) => {
    uniqueId = Date.now().toString(36);

    // Permanently block webpack overlay across all navigations
    await page.addInitScript(() => {
      const observer = new MutationObserver(() => {
        const overlay = document.getElementById('webpack-dev-server-client-overlay');
        if (overlay) overlay.remove();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    });

    kanban = new KanbanPage(page);
    dialog = new CreateTicketDialog(page);
    await kanban.goto();
    await kanban.waitForBoard();
  });

  test('should drag a ticket to another column and persist after reload', async ({ page }) => {
    const ticketName = `Drag-${uniqueId}`;

    // Create a ticket in Backlog
    await kanban.clickAddTicket();
    await dialog.waitForOpen();
    await dialog.fillName(ticketName);
    await dialog.selectState('Backlog');
    await dialog.fillDescription('Drag test description');
    await dialog.fillAcceptanceCriteria('Drag test criteria');

    const createResponse = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/ticket/upsert') && resp.status() === 200
    );
    await dialog.clickSave();
    await createResponse;
    await dialog.waitForClosed();

    await page.reload();
    await kanban.waitForBoard();

    // Verify ticket is in Backlog
    const backlogTickets = kanban.getTicketsInColumnByHeader('Backlog');
    await expect(backlogTickets.filter({ hasText: ticketName })).toHaveCount(1);

    // Get the ticket element
    const ticket = kanban.getTicketByName(ticketName);
    await ticket.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Target the InProgress column (adjacent column, most reliable drop target)
    const inProgressColumn = kanban.getColumnByHeader('InProgress');

    const ticketBox = await ticket.boundingBox();
    const targetBox = await inProgressColumn.boundingBox();
    if (!ticketBox || !targetBox) throw new Error('Could not get bounding boxes');

    const startX = ticketBox.x + ticketBox.width / 2;
    const startY = ticketBox.y + ticketBox.height / 2;
    const endX = targetBox.x + targetBox.width / 2;
    // Use the ticket's Y position (not the column top) to keep the drag within
    // the visible viewport — when many tickets accumulate, the column top may
    // scroll above the viewport making targetBox.y negative/off-screen.
    const endY = startY;

    // Set up response listener before starting drag
    const dragResponse = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/ticket/upsert') && resp.status() === 200
    );

    // Perform drag with deliberate mouse movements for CDK compatibility
    await page.mouse.move(startX, startY);
    await page.waitForTimeout(200);
    await page.mouse.down();
    await page.waitForTimeout(300);

    // Move past CDK's drag distance threshold
    await page.mouse.move(startX + 30, startY, { steps: 5 });
    await page.waitForTimeout(200);

    // Move to target column
    await page.mouse.move(endX, endY, { steps: 30 });
    await page.waitForTimeout(500);
    await page.mouse.up();

    await dragResponse;

    // Reload and verify persistence
    await page.reload();
    await kanban.waitForBoard();

    const inProgressAfterReload = kanban.getTicketsInColumnByHeader('InProgress');
    await expect(inProgressAfterReload.filter({ hasText: ticketName })).toHaveCount(1, { timeout: 10000 });

    const backlogAfterReload = kanban.getTicketsInColumnByHeader('Backlog');
    await expect(backlogAfterReload.filter({ hasText: ticketName })).toHaveCount(0);
  });
});
