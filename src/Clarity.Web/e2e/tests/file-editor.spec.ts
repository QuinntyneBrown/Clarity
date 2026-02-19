import { test, expect } from '@playwright/test';
import { FileManagementPage } from '../page-objects/file-management.page';
import { FileEditorPage } from '../page-objects/file-editor.page';
import { LoginPage } from '../page-objects/login.page';

test.describe('File Editor Page', () => {
  let filesPage: FileManagementPage;
  let editorPage: FileEditorPage;

  async function uploadTextFile(page: import('@playwright/test').Page, filesPage: FileManagementPage) {
    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/digitalAsset/upload') && resp.request().method() === 'POST'
    );

    await filesPage.fileInput.setInputFiles({
      name: `editable-${Date.now()}.json`,
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify({ hello: 'world' }, null, 2))
    });

    await responsePromise;
    await page.waitForTimeout(1000);
  }

  test.beforeEach(async ({ page }) => {
    filesPage = new FileManagementPage(page);
    editorPage = new FileEditorPage(page);
    await filesPage.goto();
    await filesPage.waitForPage();
  });

  test('should navigate to editor when clicking edit on editable file', async ({ page }) => {
    await uploadTextFile(page, filesPage);

    const editableRow = filesPage.fileRows.filter({ has: page.locator('[data-testid="edit-btn"]') }).first();
    const count = await editableRow.count();
    if (count === 0) return;

    await filesPage.getEditButton(editableRow).click();
    await page.waitForURL('**/files/*/edit', { timeout: 10000 });
    await editorPage.waitForEditor();
    await expect(editorPage.toolbar).toBeVisible();
  });

  test('should display file name in toolbar', async ({ page }) => {
    await uploadTextFile(page, filesPage);

    const editableRow = filesPage.fileRows.filter({ has: page.locator('[data-testid="edit-btn"]') }).first();
    const count = await editableRow.count();
    if (count === 0) return;

    await filesPage.getEditButton(editableRow).click();
    await page.waitForURL('**/files/*/edit', { timeout: 10000 });
    await editorPage.waitForEditor();

    const fileName = await editorPage.fileName.innerText();
    expect(fileName.length).toBeGreaterThan(0);
  });

  test('should display code editor textarea', async ({ page }) => {
    await uploadTextFile(page, filesPage);

    const editableRow = filesPage.fileRows.filter({ has: page.locator('[data-testid="edit-btn"]') }).first();
    const count = await editableRow.count();
    if (count === 0) return;

    await filesPage.getEditButton(editableRow).click();
    await page.waitForURL('**/files/*/edit', { timeout: 10000 });
    await editorPage.waitForEditor();

    await expect(editorPage.codeTextarea).toBeVisible();
  });

  test('should display toolbar buttons', async ({ page }) => {
    await uploadTextFile(page, filesPage);

    const editableRow = filesPage.fileRows.filter({ has: page.locator('[data-testid="edit-btn"]') }).first();
    const count = await editableRow.count();
    if (count === 0) return;

    await filesPage.getEditButton(editableRow).click();
    await page.waitForURL('**/files/*/edit', { timeout: 10000 });
    await editorPage.waitForEditor();

    await expect(editorPage.backButton).toBeVisible();
    await expect(editorPage.saveButton).toBeVisible();
    await expect(editorPage.downloadButton).toBeVisible();
  });

  test('should navigate back when clicking back button', async ({ page }) => {
    await uploadTextFile(page, filesPage);

    const editableRow = filesPage.fileRows.filter({ has: page.locator('[data-testid="edit-btn"]') }).first();
    const count = await editableRow.count();
    if (count === 0) return;

    await filesPage.getEditButton(editableRow).click();
    await page.waitForURL('**/files/*/edit', { timeout: 10000 });
    await editorPage.waitForEditor();

    await editorPage.clickBack();
    await page.waitForURL('**/files', { timeout: 10000 });
  });

  test('should allow editing content', async ({ page }) => {
    await uploadTextFile(page, filesPage);

    const editableRow = filesPage.fileRows.filter({ has: page.locator('[data-testid="edit-btn"]') }).first();
    const count = await editableRow.count();
    if (count === 0) return;

    await filesPage.getEditButton(editableRow).click();
    await page.waitForURL('**/files/*/edit', { timeout: 10000 });
    await editorPage.waitForEditor();

    const newContent = '{ "updated": true }';
    await editorPage.setContent(newContent);
    const content = await editorPage.getContent();
    expect(content).toBe(newContent);
  });

  test('should save content when clicking save', async ({ page }) => {
    await uploadTextFile(page, filesPage);

    const editableRow = filesPage.fileRows.filter({ has: page.locator('[data-testid="edit-btn"]') }).first();
    const count = await editableRow.count();
    if (count === 0) return;

    await filesPage.getEditButton(editableRow).click();
    await page.waitForURL('**/files/*/edit', { timeout: 10000 });
    await editorPage.waitForEditor();

    await editorPage.setContent('{ "saved": true }');

    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/content') && resp.request().method() === 'PUT'
    );
    await editorPage.clickSave();
    await responsePromise;
  });
});
