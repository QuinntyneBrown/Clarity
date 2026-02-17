import { test, expect } from '@playwright/test';
import { DigitalAssetsPage } from '../page-objects/digital-assets.page';

test.describe('Digital Assets Management', () => {
  let assetsPage: DigitalAssetsPage;

  test.beforeEach(async ({ page }) => {
    assetsPage = new DigitalAssetsPage(page);
    await assetsPage.goto();
  });

  test('should display digital assets page with title', async () => {
    await expect(assetsPage.pageTitle).toHaveText('Digital Assets');
    await expect(assetsPage.digitalAssetsPage).toBeVisible();
  });

  test('should display Upload Asset button', async () => {
    await expect(assetsPage.uploadAssetButton).toBeVisible();
    await expect(assetsPage.uploadAssetButton).toContainText('Upload Asset');
  });

  test('should display search input and export button', async () => {
    await expect(assetsPage.searchInput).toBeVisible();
    await expect(assetsPage.exportButton).toBeVisible();
  });

  test('should display digital assets table', async () => {
    await expect(assetsPage.digitalAssetsTable).toBeVisible();
  });

  test('should filter assets by search term', async () => {
    await assetsPage.search('nonexistent-asset-xyz');
    const filteredCount = await assetsPage.getRowCount();
    expect(filteredCount).toBe(0);
  });

  test('should open delete confirmation when clicking delete', async () => {
    const rowCount = await assetsPage.getRowCount();
    if (rowCount > 0) {
      await assetsPage.clickDeleteOnRow(0);
      await expect(assetsPage.confirmButton).toBeVisible();
    }
  });
});
