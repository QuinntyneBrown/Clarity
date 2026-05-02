import { test, expect } from '@playwright/test';
import { KanbanPage } from '../page-objects/kanban.page';
import { CreateBoardDialog } from '../page-objects/create-board-dialog.page';

test.describe('Create Board Dialog', () => {
  let kanban: KanbanPage;
  let dialog: CreateBoardDialog;

  test.beforeEach(async ({ page }) => {
    kanban = new KanbanPage(page);
    dialog = new CreateBoardDialog(page);
    await kanban.goto();
    await kanban.waitForBoard();
  });

  test.describe('Step 1 - Board Name', () => {
    test('should open create board dialog when clicking New Board button', async () => {
      await kanban.clickNewBoard();
      await dialog.waitForOpen();
      await expect(dialog.dialog).toBeVisible();
      await expect(dialog.title).toHaveText('New Board');
    });

    test('should display step 1 fields', async () => {
      await kanban.clickNewBoard();
      await dialog.waitForOpen();
      await expect(dialog.nameInput).toBeVisible();
      await expect(dialog.infoBox).toBeVisible();
    });

    test('should show step indicator with step 1 active', async () => {
      await kanban.clickNewBoard();
      await dialog.waitForOpen();
      const activeCount = await dialog.getActiveStepBarCount();
      expect(activeCount).toBe(1);
    });

    test('should display step label as Step 1 of 2', async () => {
      await kanban.clickNewBoard();
      await dialog.waitForOpen();
      const label = await dialog.getStepLabelText();
      expect(label).toContain('Step 1 of 2');
      expect(label).toContain('Name your board');
    });

    test('should disable Next button when name is empty', async () => {
      await kanban.clickNewBoard();
      await dialog.waitForOpen();
      await expect(dialog.nextButton).toBeDisabled();
    });

    test('should enable Next button when name is entered', async () => {
      await kanban.clickNewBoard();
      await dialog.waitForOpen();
      await dialog.fillName('Test Board');
      await expect(dialog.nextButton).toBeEnabled();
    });

    test('should close dialog when clicking Cancel', async () => {
      await kanban.clickNewBoard();
      await dialog.waitForOpen();
      await dialog.clickCancel();
      await dialog.waitForClosed();
      await expect(dialog.dialog).not.toBeVisible();
    });

    test('should close dialog when clicking close button', async () => {
      await kanban.clickNewBoard();
      await dialog.waitForOpen();
      await dialog.clickClose();
      await dialog.waitForClosed();
      await expect(dialog.dialog).not.toBeVisible();
    });
  });

  test.describe('Step 2 - Board States', () => {
    test.beforeEach(async () => {
      await kanban.clickNewBoard();
      await dialog.waitForOpen();
      await dialog.fillName('Test Board');
      await dialog.clickNext();
    });

    test('should navigate to step 2 after clicking Next', async () => {
      await expect(dialog.statesList).toBeVisible();
      const label = await dialog.getStepLabelText();
      expect(label).toContain('Step 2 of 2');
      expect(label).toContain('Configure columns');
    });

    test('should show both step bars as active on step 2', async () => {
      const activeCount = await dialog.getActiveStepBarCount();
      expect(activeCount).toBe(2);
    });

    test('should display default states', async () => {
      const states = await dialog.getStateNames();
      expect(states).toEqual(['Backlog', 'In Progress', 'Done']);
    });

    test('should allow adding a new state', async () => {
      await dialog.addState('Review');
      const states = await dialog.getStateNames();
      expect(states).toContain('Review');
      expect(states.length).toBe(4);
    });

    test('should allow removing a state', async () => {
      const initialCount = await dialog.getStateCount();
      await dialog.removeState(0);
      const newCount = await dialog.getStateCount();
      expect(newCount).toBe(initialCount - 1);
    });

    test('should disable add button when new state name is empty', async () => {
      await expect(dialog.addStateButton).toBeDisabled();
    });

    test('should navigate back to step 1 when clicking Back', async () => {
      await dialog.clickBack();
      await expect(dialog.nameInput).toBeVisible();
      await expect(dialog.nameInput).toHaveValue('Test Board');
    });

    test('should retain board name when navigating back and forth', async () => {
      await dialog.clickBack();
      await expect(dialog.nameInput).toHaveValue('Test Board');
      await dialog.clickNext();
      const states = await dialog.getStateNames();
      expect(states.length).toBeGreaterThan(0);
    });

    test('should close dialog and create board when clicking Create Board', async () => {
      await dialog.clickCreate();
      await dialog.waitForClosed();
      await expect(dialog.dialog).not.toBeVisible();
    });
  });
});
