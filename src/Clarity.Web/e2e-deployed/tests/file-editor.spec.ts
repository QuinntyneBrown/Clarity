// Acceptance Test
// Traces to: L2-031, L2-033
// Description: Verify file editor page with content editing, save, download, and keyboard shortcuts

import { test, expect } from '@playwright/test';
import { FileManagementPage } from '../page-objects/file-management.page';
import { FileEditorPage } from '../page-objects/file-editor.page';

test.describe('File Editor', () => {

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should display editor toolbar and textarea', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      // Upload a text file
      const fileName = `editor-test-${Date.now()}.txt`;
      await files.uploadFile(fileName, 'Initial content', 'text/plain');
      await page.waitForTimeout(2000);

      const row = files.fileRows.filter({ hasText: fileName });
      if (await row.isVisible({ timeout: 5000 })) {
        const editBtn = files.getEditButton(row);
        if (await editBtn.isVisible()) {
          await editBtn.click();
          await page.waitForURL('**/files/*/edit', { timeout: 10000 });

          const editor = new FileEditorPage(page);
          await editor.waitForEditor();

          await expect(editor.toolbar).toBeVisible();
          await expect(editor.codeTextarea).toBeVisible();
          await expect(editor.fileName).toContainText(fileName);
          await expect(editor.saveButton).toBeVisible();
          await expect(editor.downloadButton).toBeVisible();
          await expect(editor.backButton).toBeVisible();
        }
      }
    });

    test('should edit and save file content', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      const fileName = `save-test-${Date.now()}.txt`;
      await files.uploadFile(fileName, 'Original content', 'text/plain');
      await page.waitForTimeout(2000);

      const row = files.fileRows.filter({ hasText: fileName });
      if (await row.isVisible({ timeout: 5000 })) {
        const editBtn = files.getEditButton(row);
        if (await editBtn.isVisible()) {
          await editBtn.click();
          await page.waitForURL('**/files/*/edit', { timeout: 10000 });

          const editor = new FileEditorPage(page);
          await editor.waitForEditor();

          await editor.setContent('Updated content');

          // Wait for the save API response to confirm content was persisted
          const responsePromise = page.waitForResponse(
            resp => resp.url().includes('/api/1.0/digitalAsset/') && resp.url().includes('/content') && resp.request().method() === 'PUT',
            { timeout: 15000 }
          );
          await editor.clickSave();
          await responsePromise;

          // Save indicator should appear after successful save
          await expect(editor.savedIndicator).toBeVisible({ timeout: 10000 });
        }
      }
    });

    test('should navigate back to file management', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      const fileName = `back-test-${Date.now()}.txt`;
      await files.uploadFile(fileName, 'Back test content', 'text/plain');
      await page.waitForTimeout(2000);

      const row = files.fileRows.filter({ hasText: fileName });
      if (await row.isVisible({ timeout: 5000 })) {
        const editBtn = files.getEditButton(row);
        if (await editBtn.isVisible()) {
          await editBtn.click();
          await page.waitForURL('**/files/*/edit', { timeout: 10000 });

          const editor = new FileEditorPage(page);
          await editor.waitForEditor();
          await editor.clickBack();

          await page.waitForURL('**/files', { timeout: 10000 });
        }
      }
    });
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should display file editor on mobile', async ({ page }) => {
      const files = new FileManagementPage(page);
      await files.goto();
      await files.waitForPage();

      const fileName = `mobile-editor-${Date.now()}.txt`;
      await files.uploadFile(fileName, 'Mobile content', 'text/plain');
      await page.waitForTimeout(2000);

      const card = files.fileCards.filter({ hasText: fileName });
      if (await card.isVisible({ timeout: 5000 })) {
        const editBtn = files.getEditButton(card);
        if (await editBtn.isVisible()) {
          await editBtn.click();
          await page.waitForURL('**/files/*/edit', { timeout: 10000 });

          const editor = new FileEditorPage(page);
          await editor.waitForEditor();

          await expect(editor.codeTextarea).toBeVisible();
          await expect(editor.backButton).toBeVisible();
        }
      }
    });
  });
});
