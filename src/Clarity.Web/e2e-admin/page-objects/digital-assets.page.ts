import { type Page, type Locator } from '@playwright/test';
import { AdminLoginPage } from './admin-login.page';

export class DigitalAssetsPage {
  readonly page: Page;
  readonly digitalAssetsPage: Locator;
  readonly pageTitle: Locator;
  readonly uploadAssetButton: Locator;
  readonly searchInput: Locator;
  readonly exportButton: Locator;
  readonly digitalAssetsTable: Locator;
  readonly tableRows: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.digitalAssetsPage = page.locator('[data-test="digital-assets-page"]');
    this.pageTitle = page.locator('.page-title');
    this.uploadAssetButton = page.locator('[data-test="upload-asset-btn"]');
    this.searchInput = page.locator('[data-test="digital-assets-page"] [data-test="search-input"]');
    this.exportButton = page.locator('[data-test="export-btn"]');
    this.digitalAssetsTable = page.locator('[data-test="digital-assets-table"]');
    this.tableRows = page.locator('[data-test="digital-assets-table"] tbody tr');
    this.confirmButton = page.locator('[data-test="confirm-btn"]');
  }

  async goto() {
    const loginPage = new AdminLoginPage(this.page);
    await loginPage.goto();
    await loginPage.login();
    await this.page.locator('[data-test="nav-/digital-assets"]').click();
    await this.page.waitForURL('**/digital-assets');
    await this.digitalAssetsPage.waitFor({ state: 'visible' });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async clickDeleteOnRow(index: number) {
    await this.tableRows.nth(index).locator('[data-test="delete-btn"]').click();
  }

  async confirmDelete() {
    await this.confirmButton.click();
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }
}
