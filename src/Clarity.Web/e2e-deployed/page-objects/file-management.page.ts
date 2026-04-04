import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class FileManagementPage extends BasePage {
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
    super(page);
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
    await this.loginAndNavigate('/files');
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

  async uploadFile(name: string, content: string, mimeType: string) {
    const buffer = Buffer.from(content, 'utf-8');
    await this.fileInput.setInputFiles({
      name,
      mimeType,
      buffer,
    });
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
