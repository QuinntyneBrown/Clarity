import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { CreateTicketDialog } from '../page-objects/create-ticket-dialog.page';

test.describe('Create Ticket Dialog', () => {
  let kanban: KanbanPage;
  let dialog: CreateTicketDialog;

  test.beforeEach(async ({ page }) => {
    kanban = new KanbanPage(page);
    dialog = new CreateTicketDialog(page);
    await kanban.goto();
    await kanban.waitForBoard();
  });

  test('should open create ticket dialog when clicking add button', async () => {
    await kanban.clickAddTicket();
    await dialog.waitForOpen();
    await expect(dialog.dialog).toBeVisible();
  });

  test('should display the correct dialog title', async () => {
    await kanban.clickAddTicket();
    await dialog.waitForOpen();
    await expect(dialog.title).toHaveText('Create Ticket');
  });

  test('should display all form fields including priority', async () => {
    await kanban.clickAddTicket();
    await dialog.waitForOpen();
    await expect(dialog.nameInput).toBeVisible();
    await expect(dialog.stateSelect).toBeVisible();
    await expect(dialog.prioritySelect).toBeVisible();
    await expect(dialog.descriptionTextarea).toBeVisible();
    await expect(dialog.acceptanceCriteriaTextarea).toBeVisible();
    await expect(dialog.assigneeSelect).toBeVisible();
  });

  test('should display create and cancel buttons', async () => {
    await kanban.clickAddTicket();
    await dialog.waitForOpen();
    await expect(dialog.saveButton).toBeVisible();
    await expect(dialog.cancelButton).toBeVisible();
  });

  test('should close dialog when clicking cancel', async () => {
    await kanban.clickAddTicket();
    await dialog.waitForOpen();
    await dialog.clickCancel();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should close dialog when clicking close button', async () => {
    await kanban.clickAddTicket();
    await dialog.waitForOpen();
    await dialog.clickClose();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should allow filling in form fields', async () => {
    await kanban.clickAddTicket();
    await dialog.waitForOpen();

    await dialog.fillName('New Ticket');
    await dialog.fillDescription('A test description');
    await dialog.fillAcceptanceCriteria('Test criteria');

    await expect(dialog.nameInput).toHaveValue('New Ticket');
    await expect(dialog.descriptionTextarea).toHaveValue('A test description');
    await expect(dialog.acceptanceCriteriaTextarea).toHaveValue('Test criteria');
  });

  test('should allow selecting a priority', async () => {
    await kanban.clickAddTicket();
    await dialog.waitForOpen();
    await dialog.selectPriority('High');
    await expect(dialog.prioritySelect).toHaveValue('high');
  });

  test('should close dialog when clicking create', async () => {
    await kanban.clickAddTicket();
    await dialog.waitForOpen();

    await dialog.fillName('New Ticket');
    await dialog.fillDescription('A test description');
    await dialog.fillAcceptanceCriteria('Test criteria');
    await dialog.clickSave();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });
});
