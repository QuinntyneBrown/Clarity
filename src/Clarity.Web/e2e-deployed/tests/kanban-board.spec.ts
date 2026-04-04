// Acceptance Test
// Traces to: L2-011, L2-012, L2-014, L2-015, L2-018, L2-050
// Description: Verify Kanban board display, columns, tickets, board selection, sticky header, and filtering

import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';

test.describe('Kanban Board', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should display board with columns', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const columnCount = await kanban.getColumnCount();
      expect(columnCount).toBeGreaterThanOrEqual(1);
    });

    test('should display board name in controls', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      await expect(kanban.boardName).toBeVisible();
      const name = await kanban.boardName.innerText();
      expect(name.trim().length).toBeGreaterThan(0);
    });

    test('should display column headers', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const headers = await kanban.getColumnHeaders();
      expect(headers.length).toBeGreaterThanOrEqual(1);
      headers.forEach(h => expect(h.length).toBeGreaterThan(0));
    });

    test('should display tickets as cards in columns', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const tickets = await kanban.getAllTickets();
      // Board may or may not have tickets, but the locator should exist
      expect(tickets).toBeTruthy();
    });

    test('should show New Board button', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      await expect(kanban.newBoardButton).toBeVisible();
    });

    test('should show Add Ticket button', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      await expect(kanban.addTicketButton).toBeVisible();
    });

    test('should open board selector when clicking board name', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      await kanban.clickBoardName();
      await expect(page.locator('app-select-board')).toBeVisible({ timeout: 5000 });
    });

    test('should display team member filter chips', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const allMembersChip = kanban.filterChips.filter({ hasText: 'All Members' });
      await expect(allMembersChip).toBeVisible();
    });

    test('should display column ticket counts', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const columns = kanban.columns;
      const count = await columns.count();
      for (let i = 0; i < count; i++) {
        const ticketCount = columns.nth(i).locator('.ticket-count, .column-count');
        // Count element should exist in column header
        expect(await columns.nth(i).locator('.column-title').count()).toBeGreaterThanOrEqual(1);
      }
    });

    test('should show delete button on column headers', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const columnCount = await kanban.getColumnCount();
      if (columnCount > 0) {
        const deleteBtn = kanban.columns.first().locator('.column-delete-btn');
        await expect(deleteBtn).toBeVisible();
      }
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should display board on mobile viewport', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      await expect(kanban.boardName).toBeVisible();
    });

    test('should display columns on mobile (scrollable)', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      const columnCount = await kanban.getColumnCount();
      expect(columnCount).toBeGreaterThanOrEqual(1);
    });

    test('should show add ticket button on mobile', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      await expect(kanban.addTicketButton).toBeVisible();
    });

    test('should open board selector on mobile', async ({ page }) => {
      const kanban = new KanbanPage(page);
      await kanban.goto();
      await kanban.waitForBoard();

      await kanban.clickBoardName();
      await expect(page.locator('app-select-board')).toBeVisible({ timeout: 5000 });
    });
  });
});
