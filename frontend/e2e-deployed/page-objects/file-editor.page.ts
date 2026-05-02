import { Locator, Page } from '@playwright/test';

export class FileEditorPage {
  readonly page: Page;
  readonly toolbar: Locator;
  readonly backButton: Locator;
  readonly fileName: Locator;
  readonly saveButton: Locator;
  readonly downloadButton: Locator;
  readonly codeTextarea: Locator;
  readonly editorContainer: Locator;
  readonly savedIndicator: Locator;
  readonly savingIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toolbar = page.locator('[data-testid="editor-toolbar"]');
    this.backButton = page.locator('[data-testid="back-btn"]');
    this.fileName = page.locator('[data-testid="editor-filename"]');
    this.saveButton = page.locator('[data-testid="editor-save-btn"]');
    this.downloadButton = page.locator('[data-testid="editor-download-btn"]');
    this.codeTextarea = page.locator('[data-testid="code-textarea"]');
    this.editorContainer = page.locator('[data-testid="editor-container"]');
    this.savedIndicator = page.locator('app-file-editor .save-indicator.saved');
    this.savingIndicator = page.locator('app-file-editor .save-indicator.saving');
  }

  async waitForEditor() {
    await this.toolbar.waitFor({ state: 'visible', timeout: 15000 });
    await this.codeTextarea.waitFor({ state: 'visible', timeout: 15000 });
  }

  async getContent(): Promise<string> {
    return this.codeTextarea.inputValue();
  }

  async setContent(content: string) {
    // Clear and type content using keyboard to ensure Angular's ngModel detects changes
    await this.codeTextarea.click();
    await this.codeTextarea.press('Control+a');
    await this.codeTextarea.press('Backspace');
    await this.codeTextarea.type(content, { delay: 0 });
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickBack() {
    await this.backButton.click();
  }

  async clickDownload() {
    await this.downloadButton.click();
  }

  async saveWithKeyboard() {
    await this.codeTextarea.press('Control+s');
  }
}
