import { Locator, Page } from '@playwright/test';
import { LoginPage } from './login.page';

export class FileManagementPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly uploadButton: Locator;
  readonly fileInput: Locator;
  readonly fileRows: Locator;
  readonly fileCards: Locator;
  readonly emptyState: Locator;
  readonly tableContainer: Locator;
  readonly cardsContainer: Locator;
  readonly statCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('app-file-management h1');
    this.searchInput = page.locator('app-file-management app-search-input input');
    this.uploadButton = page.locator('app-file-management .upload-btn');
    this.fileInput = page.locator('app-file-management [data-testid="file-input"]');
    this.fileRows = page.locator('app-file-management [data-testid="file-row"]');
    this.fileCards = page.locator('app-file-management [data-testid="file-card"]');
    this.emptyState = page.locator('app-file-management [data-testid="empty-state"]');
    this.tableContainer = page.locator('app-file-management [data-testid="files-table"]');
    this.cardsContainer = page.locator('app-file-management [data-testid="files-cards"]');
    this.statCards = page.locator('app-file-management .stat-card');
  }

  async goto() {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
    await this.page.waitForURL('**/kanban', { timeout: 10000 });
    await this.page.goto('/files');
    await this.removeOverlay();
  }

  private async removeOverlay() {
    await this.page.evaluate(() => {
      const iframe = document.getElementById('webpack-dev-server-client-overlay');
      if (iframe) iframe.remove();
      if (!document.getElementById('e2e-overlay-fix')) {
        const style = document.createElement('style');
        style.id = 'e2e-overlay-fix';
        style.textContent = '#webpack-dev-server-client-overlay { display: none !important; pointer-events: none !important; }';
        document.head.appendChild(style);
      }
    });
  }

  async waitForPage() {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 15000 });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async clickUpload() {
    await this.uploadButton.click();
  }

  getEditButton(row: Locator): Locator {
    return row.locator('[data-testid="edit-btn"]');
  }

  getDownloadButton(row: Locator): Locator {
    return row.locator('[data-testid="download-btn"]');
  }

  getDeleteButton(row: Locator): Locator {
    return row.locator('[data-testid="delete-btn"]');
  }
}
