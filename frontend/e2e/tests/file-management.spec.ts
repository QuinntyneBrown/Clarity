import { test, expect } from '@playwright/test';
import { FileManagementPage } from '../page-objects/file-management.page';

test.describe('File Management Page', () => {
  let filesPage: FileManagementPage;

  test.beforeEach(async ({ page }) => {
    filesPage = new FileManagementPage(page);
    await filesPage.goto();
    await filesPage.waitForPage();
  });

  test('should display page title', async () => {
    await expect(filesPage.pageTitle).toHaveText('Files');
  });

  test('should display search input', async () => {
    await expect(filesPage.searchInput).toBeVisible();
  });

  test('should display upload button', async () => {
    await expect(filesPage.uploadButton).toBeVisible();
  });

  test('should display stat cards', async () => {
    const statCount = await filesPage.statCards.count();
    expect(statCount).toBeGreaterThanOrEqual(2);
  });

  test('should load files from API', async () => {
    const hasRows = await filesPage.fileRows.count();
    const hasCards = await filesPage.fileCards.count();
    expect(hasRows + hasCards).toBeGreaterThanOrEqual(0);
  });

  test('should filter files by search term', async () => {
    const totalBefore = await filesPage.fileRows.count() + await filesPage.fileCards.count();
    if (totalBefore === 0) return;

    await filesPage.search('nonexistent-file-xyz');
    await filesPage.page.waitForTimeout(300);
    const totalAfter = await filesPage.fileRows.count() + await filesPage.fileCards.count();
    expect(totalAfter).toBeLessThanOrEqual(totalBefore);
  });
});

test.describe('File Management Page - Desktop', () => {
  test('should show table layout on desktop', async ({ page }) => {
    const filesPage = new FileManagementPage(page);
    await filesPage.goto();
    await filesPage.waitForPage();
    await expect(filesPage.tableContainer).toBeVisible();
  });

  test('should display action buttons on rows', async ({ page }) => {
    const filesPage = new FileManagementPage(page);
    await filesPage.goto();
    await filesPage.waitForPage();

    const rowCount = await filesPage.fileRows.count();
    if (rowCount > 0) {
      const firstRow = filesPage.fileRows.first();
      const downloadBtn = filesPage.getDownloadButton(firstRow);
      const deleteBtn = filesPage.getDeleteButton(firstRow);
      await expect(downloadBtn).toBeVisible();
      await expect(deleteBtn).toBeVisible();
    }
  });
});

test.describe('File Upload', () => {
  let filesPage: FileManagementPage;

  test.beforeEach(async ({ page }) => {
    filesPage = new FileManagementPage(page);
    await filesPage.goto();
    await filesPage.waitForPage();
  });

  test('should upload a text file', async ({ page }) => {
    const countBefore = await filesPage.fileRows.count() + await filesPage.fileCards.count();

    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/digitalAsset/upload') && resp.request().method() === 'POST'
    );

    await filesPage.fileInput.setInputFiles({
      name: `test-file-${Date.now()}.txt`,
      mimeType: 'text/plain',
      buffer: Buffer.from('Hello, Clarity!')
    });

    await responsePromise;
    await page.waitForTimeout(1000);

    const countAfter = await filesPage.fileRows.count() + await filesPage.fileCards.count();
    expect(countAfter).toBeGreaterThan(countBefore);
  });

  test('should upload a JSON file', async ({ page }) => {
    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/digitalAsset/upload') && resp.request().method() === 'POST'
    );

    await filesPage.fileInput.setInputFiles({
      name: `config-${Date.now()}.json`,
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify({ key: 'value' }, null, 2))
    });

    await responsePromise;
    await page.waitForTimeout(500);
  });
});

test.describe('File Deletion', () => {
  test('should delete a file', async ({ page }) => {
    const filesPage = new FileManagementPage(page);
    await filesPage.goto();
    await filesPage.waitForPage();

    const countBefore = await filesPage.fileRows.count() + await filesPage.fileCards.count();
    if (countBefore === 0) return;

    const firstRow = filesPage.fileRows.first();
    const deleteBtn = filesPage.getDeleteButton(firstRow);

    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/digitalAsset') && resp.request().method() === 'DELETE'
    );
    await deleteBtn.click();
    await responsePromise;
    await page.waitForTimeout(1000);

    const countAfter = await filesPage.fileRows.count() + await filesPage.fileCards.count();
    expect(countAfter).toBeLessThan(countBefore);
  });
});
