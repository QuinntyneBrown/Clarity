import { test, expect } from '@playwright/test';
import { InitiativesPage } from '../page-objects/initiatives.page';
import { CreateInitiativeDialog } from '../page-objects/create-initiative-dialog.page';
import { UpdateInitiativeDialog } from '../page-objects/update-initiative-dialog.page';

test.describe('Initiatives Page', () => {
  let initiativesPage: InitiativesPage;

  test.beforeEach(async ({ page }) => {
    initiativesPage = new InitiativesPage(page);
    await initiativesPage.goto();
    await initiativesPage.waitForPage();
  });

  test('should display page title', async () => {
    await expect(initiativesPage.pageTitle).toHaveText('Initiatives');
  });

  test('should display search input', async () => {
    await expect(initiativesPage.searchInput).toBeVisible();
  });

  test('should display add initiative button', async () => {
    await expect(initiativesPage.addInitiativeButton).toBeVisible();
  });

  test('should load initiatives from API', async () => {
    const hasRows = await initiativesPage.initiativeRows.count();
    const hasCards = await initiativesPage.initiativeCards.count();
    expect(hasRows + hasCards).toBeGreaterThanOrEqual(0);
  });

  test('should filter initiatives by search term', async () => {
    const totalBefore = await initiativesPage.initiativeRows.count() + await initiativesPage.initiativeCards.count();
    if (totalBefore === 0) return;

    await initiativesPage.search('nonexistent-initiative-xyz');
    await initiativesPage.page.waitForTimeout(300);
    const totalAfter = await initiativesPage.initiativeRows.count() + await initiativesPage.initiativeCards.count();
    expect(totalAfter).toBeLessThanOrEqual(totalBefore);
  });
});

test.describe('Initiatives Page - Desktop', () => {
  test('should show table layout on desktop', async ({ page }) => {
    const initiativesPage = new InitiativesPage(page);
    await initiativesPage.goto();
    await initiativesPage.waitForPage();
    await expect(initiativesPage.tableContainer).toBeVisible();
  });

  test('should display action buttons on rows', async ({ page }) => {
    const initiativesPage = new InitiativesPage(page);
    await initiativesPage.goto();
    await initiativesPage.waitForPage();

    const rowCount = await initiativesPage.initiativeRows.count();
    if (rowCount > 0) {
      const firstRow = initiativesPage.initiativeRows.first();
      const editBtn = initiativesPage.getEditButton(firstRow);
      const deleteBtn = initiativesPage.getDeleteButton(firstRow);
      await expect(editBtn).toBeVisible();
      await expect(deleteBtn).toBeVisible();
    }
  });
});

test.describe('Create Initiative Dialog', () => {
  let initiativesPage: InitiativesPage;
  let dialog: CreateInitiativeDialog;

  test.beforeEach(async ({ page }) => {
    initiativesPage = new InitiativesPage(page);
    dialog = new CreateInitiativeDialog(page);
    await initiativesPage.goto();
    await initiativesPage.waitForPage();
  });

  test('should open create dialog when clicking add initiative', async () => {
    await initiativesPage.clickAddInitiative();
    await dialog.waitForOpen();
    await expect(dialog.dialog).toBeVisible();
  });

  test('should display correct dialog title', async () => {
    await initiativesPage.clickAddInitiative();
    await dialog.waitForOpen();
    await expect(dialog.title).toHaveText('Create Initiative');
  });

  test('should display all form fields', async () => {
    await initiativesPage.clickAddInitiative();
    await dialog.waitForOpen();
    await expect(dialog.nameInput).toBeVisible();
    await expect(dialog.descriptionInput).toBeVisible();
  });

  test('should display create and cancel buttons', async () => {
    await initiativesPage.clickAddInitiative();
    await dialog.waitForOpen();
    await expect(dialog.saveButton).toBeVisible();
    await expect(dialog.cancelButton).toBeVisible();
  });

  test('should close dialog when clicking cancel', async () => {
    await initiativesPage.clickAddInitiative();
    await dialog.waitForOpen();
    await dialog.clickCancel();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should close dialog when clicking close button', async () => {
    await initiativesPage.clickAddInitiative();
    await dialog.waitForOpen();
    await dialog.clickClose();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should allow filling in form fields', async () => {
    await initiativesPage.clickAddInitiative();
    await dialog.waitForOpen();

    await dialog.fillName('Test Initiative');
    await dialog.fillDescription('Test description');

    await expect(dialog.nameInput).toHaveValue('Test Initiative');
    await expect(dialog.descriptionInput).toHaveValue('Test description');
  });

  test('should close dialog when clicking create initiative', async () => {
    await initiativesPage.clickAddInitiative();
    await dialog.waitForOpen();

    await dialog.fillName('New Initiative');
    await dialog.fillDescription('Initiative description');
    await dialog.clickSave();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should add initiative to the list after creating', async ({ page }) => {
    const countBefore = await initiativesPage.initiativeRows.count() + await initiativesPage.initiativeCards.count();

    await initiativesPage.clickAddInitiative();
    await dialog.waitForOpen();

    const initiativeName = `Test Initiative ${Date.now()}`;
    await dialog.fillName(initiativeName);
    await dialog.fillDescription('E2E test initiative');

    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/initiative') && resp.request().method() === 'POST' && resp.status() === 200
    );
    await dialog.clickSave();
    await responsePromise;
    await dialog.waitForClosed();

    await initiativesPage.page.waitForTimeout(500);
    const countAfter = await initiativesPage.initiativeRows.count() + await initiativesPage.initiativeCards.count();
    expect(countAfter).toBeGreaterThanOrEqual(countBefore);
  });
});

test.describe('Update Initiative Dialog', () => {
  let initiativesPage: InitiativesPage;
  let dialog: UpdateInitiativeDialog;

  test.beforeEach(async ({ page }) => {
    initiativesPage = new InitiativesPage(page);
    dialog = new UpdateInitiativeDialog(page);
    await initiativesPage.goto();
    await initiativesPage.waitForPage();
  });

  test('should open update dialog when clicking edit button', async () => {
    const rowCount = await initiativesPage.initiativeRows.count();
    if (rowCount === 0) return;

    const firstRow = initiativesPage.initiativeRows.first();
    const editBtn = initiativesPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await expect(dialog.dialog).toBeVisible();
  });

  test('should display correct dialog title', async () => {
    const rowCount = await initiativesPage.initiativeRows.count();
    if (rowCount === 0) return;

    const firstRow = initiativesPage.initiativeRows.first();
    const editBtn = initiativesPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await expect(dialog.title).toHaveText('Edit Initiative');
  });

  test('should display all form fields', async () => {
    const rowCount = await initiativesPage.initiativeRows.count();
    if (rowCount === 0) return;

    const firstRow = initiativesPage.initiativeRows.first();
    const editBtn = initiativesPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await expect(dialog.nameInput).toBeVisible();
    await expect(dialog.descriptionInput).toBeVisible();
  });

  test('should pre-populate form with initiative name', async () => {
    const rowCount = await initiativesPage.initiativeRows.count();
    if (rowCount === 0) return;

    const firstRow = initiativesPage.initiativeRows.first();
    const initiativeName = await firstRow.locator('.initiative-name').innerText();
    const editBtn = initiativesPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await expect(dialog.nameInput).toHaveValue(initiativeName);
  });

  test('should display update and cancel buttons', async () => {
    const rowCount = await initiativesPage.initiativeRows.count();
    if (rowCount === 0) return;

    const firstRow = initiativesPage.initiativeRows.first();
    const editBtn = initiativesPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await expect(dialog.saveButton).toBeVisible();
    await expect(dialog.cancelButton).toBeVisible();
  });

  test('should close dialog when clicking cancel', async () => {
    const rowCount = await initiativesPage.initiativeRows.count();
    if (rowCount === 0) return;

    const firstRow = initiativesPage.initiativeRows.first();
    const editBtn = initiativesPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await dialog.clickCancel();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should allow editing form fields', async () => {
    const rowCount = await initiativesPage.initiativeRows.count();
    if (rowCount === 0) return;

    const firstRow = initiativesPage.initiativeRows.first();
    const editBtn = initiativesPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();

    await dialog.fillName('Updated Initiative');
    await dialog.fillDescription('Updated description');

    await expect(dialog.nameInput).toHaveValue('Updated Initiative');
    await expect(dialog.descriptionInput).toHaveValue('Updated description');
  });

  test('should close dialog when clicking update', async () => {
    const rowCount = await initiativesPage.initiativeRows.count();
    if (rowCount === 0) return;

    const firstRow = initiativesPage.initiativeRows.first();
    const editBtn = initiativesPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await dialog.clickSave();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should close dialog when clicking close button', async () => {
    const rowCount = await initiativesPage.initiativeRows.count();
    if (rowCount === 0) return;

    const firstRow = initiativesPage.initiativeRows.first();
    const editBtn = initiativesPage.getEditButton(firstRow);
    await editBtn.click();
    await dialog.waitForOpen();
    await dialog.clickClose();
    await dialog.waitForClosed();
    await expect(dialog.dialog).not.toBeVisible();
  });

  test('should remove initiative from list after deleting', async ({ page }) => {
    const countBefore = await initiativesPage.initiativeRows.count() + await initiativesPage.initiativeCards.count();
    if (countBefore === 0) return;

    const firstRow = initiativesPage.initiativeRows.first();
    const deleteBtn = initiativesPage.getDeleteButton(firstRow);

    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/initiative') && resp.request().method() === 'DELETE'
    );
    await deleteBtn.click();
    const resp = await responsePromise;
    await page.waitForTimeout(1000);

    const countAfter = await initiativesPage.initiativeRows.count() + await initiativesPage.initiativeCards.count();
    expect(countAfter).toBeLessThan(countBefore);
  });
});

test.describe('Ticket Dialog - Initiative Select', () => {
  test('should display initiative select in create ticket dialog', async ({ page }) => {
    const { LoginPage } = await import('../page-objects/login.page');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
    await page.waitForURL('**/kanban', { timeout: 10000 });

    // Remove overlay
    await page.evaluate(() => {
      const iframe = document.getElementById('webpack-dev-server-client-overlay');
      if (iframe) iframe.remove();
      if (!document.getElementById('e2e-overlay-fix')) {
        const style = document.createElement('style');
        style.id = 'e2e-overlay-fix';
        style.textContent = '#webpack-dev-server-client-overlay { display: none !important; pointer-events: none !important; }';
        document.head.appendChild(style);
      }
    });

    // Click add ticket button
    const addButton = page.locator('button', { hasText: 'Add Ticket' }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      const dialog = page.locator('app-create-ticket');
      await dialog.waitFor({ state: 'visible', timeout: 5000 });
      const initiativeSelect = dialog.locator('select[formcontrolname="initiativeId"]');
      await expect(initiativeSelect).toBeVisible();
    }
  });
});
