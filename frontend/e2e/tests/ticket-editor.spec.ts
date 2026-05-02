import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { TicketEditorPage } from '../page-objects/ticket-editor.page';

test.describe('Ticket Editor Page', () => {
  let kanban: KanbanPage;
  let editor: TicketEditorPage;

  async function navigateToFirstTicket(page: import('@playwright/test').Page) {
    const firstTicket = kanban.page.locator('app-ticket .ticket-title').first();
    await firstTicket.waitFor({ state: 'visible', timeout: 15000 });
    const ticketName = await firstTicket.innerText();
    await kanban.clickTicket(ticketName);
    await page.waitForURL('**/tickets/*/edit', { timeout: 10000 });
    await editor.waitForPage();
    return ticketName;
  }

  test.beforeEach(async ({ page }) => {
    kanban = new KanbanPage(page);
    editor = new TicketEditorPage(page);
    await kanban.goto();
    await kanban.waitForBoard();
  });

  test('should navigate to ticket editor when clicking a ticket', async ({ page }) => {
    await navigateToFirstTicket(page);
    await expect(editor.topBar).toBeVisible();
    await expect(editor.pageTitle).toHaveText('Edit Ticket');
  });

  test('should display breadcrumb navigation', async ({ page }) => {
    await navigateToFirstTicket(page);
    await expect(editor.breadcrumb).toBeVisible();
    await expect(editor.breadcrumb).toContainText('My Tickets');
  });

  test('should display all main form fields', async ({ page }) => {
    await navigateToFirstTicket(page);
    await expect(editor.nameInput).toBeVisible();
    await expect(editor.descriptionInput).toBeVisible();
    await expect(editor.acceptanceCriteriaInput).toBeVisible();
    await expect(editor.urlInput).toBeVisible();
  });

  test('should display all detail fields', async ({ page }) => {
    await navigateToFirstTicket(page);
    await expect(editor.typeSelect).toBeVisible();
    await expect(editor.prioritySelect).toBeVisible();
    await expect(editor.statusSelect).toBeVisible();
    await expect(editor.assigneeSelect).toBeVisible();
    await expect(editor.initiativeSelect).toBeVisible();
    await expect(editor.storyPointsInput).toBeVisible();
    await expect(editor.effortInput).toBeVisible();
  });

  test('should display save and delete buttons', async ({ page }) => {
    await navigateToFirstTicket(page);
    await expect(editor.saveButton).toBeVisible();
    await expect(editor.deleteButton).toBeVisible();
  });

  test('should pre-populate form with ticket data', async ({ page }) => {
    const ticketName = await navigateToFirstTicket(page);
    await expect(editor.nameInput).toHaveValue(ticketName);
  });

  test('should display attachments section', async ({ page }) => {
    await navigateToFirstTicket(page);
    await expect(editor.uploadButton).toBeVisible();
  });

  test('should display comments section', async ({ page }) => {
    await navigateToFirstTicket(page);
    const commentsTitle = editor.page.locator('.comments-card .section-title');
    await expect(commentsTitle).toHaveText('Comments');
  });

  test('should allow editing form fields', async ({ page }) => {
    await navigateToFirstTicket(page);
    await editor.fillName('Updated Ticket Name');
    await editor.fillDescription('Updated description text');
    await editor.fillAcceptanceCriteria('Updated acceptance criteria');
    await editor.fillUrl('https://example.com');

    await expect(editor.nameInput).toHaveValue('Updated Ticket Name');
    await expect(editor.descriptionInput).toHaveValue('Updated description text');
    await expect(editor.acceptanceCriteriaInput).toHaveValue('Updated acceptance criteria');
    await expect(editor.urlInput).toHaveValue('https://example.com');
  });

  test('should allow editing story points and effort', async ({ page }) => {
    await navigateToFirstTicket(page);
    await editor.fillStoryPoints('5');
    await editor.fillEffort('8');

    await expect(editor.storyPointsInput).toHaveValue('5');
    await expect(editor.effortInput).toHaveValue('8');
  });

  test('should save changes and show saved indicator', async ({ page }) => {
    await navigateToFirstTicket(page);
    const updatedName = `E2E Test ${Date.now()}`;
    await editor.fillName(updatedName);

    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/ticket') && resp.request().method() === 'PUT' && resp.status() === 200
    );
    await editor.clickSave();
    await responsePromise;

    await expect(editor.savedIndicator).toBeVisible({ timeout: 5000 });
  });

  test('should navigate back to my-tickets when clicking back', async ({ page }) => {
    await navigateToFirstTicket(page);
    await editor.clickBack();
    await page.waitForURL('**/my-tickets', { timeout: 10000 });
  });

  test('should navigate back when clicking breadcrumb link', async ({ page }) => {
    await navigateToFirstTicket(page);
    await editor.breadcrumb.locator('a').click();
    await page.waitForURL('**/my-tickets', { timeout: 10000 });
  });

  test('should persist edited name when revisiting', async ({ page }) => {
    const ticketName = await navigateToFirstTicket(page);
    const updatedName = `Persist Test ${Date.now()}`;
    await editor.fillName(updatedName);

    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/ticket') && resp.request().method() === 'PUT' && resp.status() === 200
    );
    await editor.clickSave();
    await responsePromise;

    await editor.clickBack();
    await page.waitForURL('**/my-tickets', { timeout: 10000 });

    await page.goBack();
    await editor.waitForPage();
    await expect(editor.nameInput).toHaveValue(updatedName);

    // Restore original name
    await editor.fillName(ticketName);
    const restorePromise = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/ticket') && resp.request().method() === 'PUT' && resp.status() === 200
    );
    await editor.clickSave();
    await restorePromise;
  });

  test('should disable save button while saving', async ({ page }) => {
    await navigateToFirstTicket(page);

    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/ticket') && resp.request().method() === 'PUT'
    );
    await editor.clickSave();
    await responsePromise;
  });
});
