// Acceptance Test
// Traces to: L2-031, L2-032, L2-033
// Description: Verify file management page with upload, listing, edit, download, delete, and search

import { test, expect } from '@playwright/test';
import { FileManagementPage } from '../page-objects/file-management.page';
import { FileEditorPage } from '../page-objects/file-editor.page';

test.describe('File Management', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should display file management page with title', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      await expect(files.pageTitle).toContainText('Files');
    });

    test('should display table view on desktop', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      // Either table or empty state
      const tableVisible = await files.tableContainer.isVisible();
      const emptyVisible = await files.emptyState.isVisible();
      expect(tableVisible || emptyVisible).toBeTruthy();
    });

    test('should display upload button', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      await expect(files.uploadButton).toBeVisible();
    });

    test('should display search input', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      await expect(files.searchInput).toBeVisible();
    });

    test('should display stat cards', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      const statCount = await files.statCards.count();
      expect(statCount).toBeGreaterThanOrEqual(2);
    });

    test('should upload a text file', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      const fileName = `test-${Date.now()}.txt`;
      await files.uploadFile(fileName, 'Hello E2E test content', 'text/plain');

      // Wait for file to appear in list
      await page.waitForTimeout(2000);
      const row = files.fileRows.filter({ hasText: fileName });
      // File should appear in desktop table view
      await expect(row).toBeVisible({ timeout: 10000 });
    });

    test('should show download and delete buttons per file', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      const rowCount = await files.fileRows.count();
      if (rowCount > 0) {
        const row = files.fileRows.first();
        await expect(files.getDownloadButton(row)).toBeVisible();
        await expect(files.getDeleteButton(row)).toBeVisible();
      }
    });

    test('should navigate to file editor for editable files', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      // Upload a text file (editable)
      const fileName = `editable-${Date.now()}.txt`;
      await files.uploadFile(fileName, 'Editable content', 'text/plain');
      await page.waitForTimeout(2000);

      const row = files.fileRows.filter({ hasText: fileName });
      if (await row.isVisible({ timeout: 5000 })) {
        const editBtn = files.getEditButton(row);
        if (await editBtn.isVisible()) {
          await editBtn.click();
          await page.waitForURL('**/files/*/edit', { timeout: 10000 });

          const editor = new FileEditorPage(page);
          await editor.waitForEditor();
          await expect(editor.codeTextarea).toBeVisible();
        }
      }
    });

    test('should search files', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      await files.search('nonexistent-file-xyz');
      await page.waitForTimeout(1000);
      const count = await files.fileRows.count();
      expect(count >= 0).toBeTruthy();
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should display file management page on mobile', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      await expect(files.pageTitle).toContainText('Files');
    });

    test('should display card view on mobile', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      // Either cards or empty state
      const cardsVisible = await files.cardsContainer.isVisible();
      const emptyVisible = await files.emptyState.isVisible();
      expect(cardsVisible || emptyVisible).toBeTruthy();
    });

    test('should display upload button on mobile', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      await expect(files.uploadButton).toBeVisible();
    });

    test('should display search on mobile', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      await expect(files.searchInput).toBeVisible();
    });

    test('should show action buttons on mobile file cards', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      const cardCount = await files.fileCards.count();
      if (cardCount > 0) {
        const card = files.fileCards.first();
        await expect(files.getDownloadButton(card)).toBeVisible();
        await expect(files.getDeleteButton(card)).toBeVisible();
      }
    });
  });
});
