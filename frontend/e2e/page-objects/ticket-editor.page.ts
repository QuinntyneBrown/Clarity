import { Locator, Page } from '@playwright/test';
import { LoginPage } from './login.page';

export class TicketEditorPage {
  readonly page: Page;
  readonly topBar: Locator;
  readonly backButton: Locator;
  readonly breadcrumb: Locator;
  readonly pageTitle: Locator;
  readonly saveButton: Locator;
  readonly deleteButton: Locator;
  readonly savedIndicator: Locator;
  readonly savingIndicator: Locator;

  // Main form fields
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly acceptanceCriteriaInput: Locator;
  readonly urlInput: Locator;

  // Details sidebar
  readonly typeSelect: Locator;
  readonly prioritySelect: Locator;
  readonly statusSelect: Locator;
  readonly assigneeSelect: Locator;
  readonly initiativeSelect: Locator;
  readonly storyPointsInput: Locator;
  readonly effortInput: Locator;

  // Attachments
  readonly uploadButton: Locator;
  readonly fileItems: Locator;
  readonly emptyAttachmentsText: Locator;

  // Comments
  readonly commentItems: Locator;
  readonly emptyCommentsText: Locator;

  // Mobile
  readonly mobileDeleteButton: Locator;
  readonly mobileSaveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.topBar = page.locator('[data-testid="ticket-editor-topbar"]');
    this.backButton = page.locator('[data-testid="back-btn"]');
    this.breadcrumb = page.locator('.breadcrumb');
    this.pageTitle = page.locator('.top-bar-title h1');
    this.saveButton = page.locator('[data-testid="save-btn"]');
    this.deleteButton = page.locator('[data-testid="delete-btn"]');
    this.savedIndicator = page.locator('.save-indicator.saved');
    this.savingIndicator = page.locator('.save-indicator.saving');

    this.nameInput = page.locator('[data-testid="name-input"]');
    this.descriptionInput = page.locator('[data-testid="description-input"]');
    this.acceptanceCriteriaInput = page.locator('[data-testid="acceptance-criteria-input"]');
    this.urlInput = page.locator('[data-testid="url-input"]');

    this.typeSelect = page.locator('[data-testid="type-select"]');
    this.prioritySelect = page.locator('[data-testid="priority-select"]');
    this.statusSelect = page.locator('[data-testid="status-select"]');
    this.assigneeSelect = page.locator('[data-testid="assignee-select"]');
    this.initiativeSelect = page.locator('[data-testid="initiative-select"]');
    this.storyPointsInput = page.locator('[data-testid="story-points-input"]');
    this.effortInput = page.locator('[data-testid="effort-input"]');

    this.uploadButton = page.locator('[data-testid="upload-btn"]');
    this.fileItems = page.locator('[data-testid="file-item"]');
    this.emptyAttachmentsText = page.locator('.attachments-card .empty-text');

    this.commentItems = page.locator('[data-testid="comment-item"]');
    this.emptyCommentsText = page.locator('.comments-card .empty-text');

    this.mobileDeleteButton = page.locator('.delete-btn-mobile');
    this.mobileSaveButton = page.locator('.save-btn-mobile');
  }

  async goto() {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
    await this.page.waitForURL('**/kanban', { timeout: 10000 });
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
    await this.topBar.waitFor({ state: 'visible', timeout: 15000 });
    await this.nameInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async clickBack() {
    await this.backButton.click();
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickDelete() {
    await this.deleteButton.click();
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async fillAcceptanceCriteria(criteria: string) {
    await this.acceptanceCriteriaInput.fill(criteria);
  }

  async fillUrl(url: string) {
    await this.urlInput.fill(url);
  }

  async fillStoryPoints(points: string) {
    await this.storyPointsInput.fill(points);
  }

  async fillEffort(effort: string) {
    await this.effortInput.fill(effort);
  }

  async selectType(label: string) {
    await this.typeSelect.selectOption({ label });
  }

  async selectPriority(label: string) {
    await this.prioritySelect.selectOption({ label });
  }

  async selectStatus(label: string) {
    await this.statusSelect.selectOption({ label });
  }

  async selectAssignee(label: string) {
    await this.assigneeSelect.selectOption({ label });
  }

  async selectInitiative(label: string) {
    await this.initiativeSelect.selectOption({ label });
  }

  getDownloadButton(fileItem: Locator): Locator {
    return fileItem.locator('[data-testid="download-file-btn"]');
  }

  getDetachButton(fileItem: Locator): Locator {
    return fileItem.locator('[data-testid="detach-file-btn"]');
  }
}
