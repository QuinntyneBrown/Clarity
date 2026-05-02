import { Locator, Page } from '@playwright/test';

export class DeleteBoardStateDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly title: Locator;
  readonly confirmTitle: Locator;
  readonly confirmDesc: Locator;
  readonly cancelButton: Locator;
  readonly deleteButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('app-delete-board-state');
    this.title = this.dialog.locator('.dialog-title');
    this.confirmTitle = this.dialog.locator('.confirm-title');
    this.confirmDesc = this.dialog.locator('.confirm-desc');
    this.cancelButton = this.dialog.locator('.cancel-btn');
    this.deleteButton = this.dialog.locator('.delete-btn');
    this.closeButton = this.dialog.locator('.close-btn');
  }

  async waitForOpen() {
    await this.dialog.waitFor({ state: 'visible' });
  }

  async waitForClosed() {
    await this.dialog.waitFor({ state: 'detached' });
  }

  async getConfirmTitleText(): Promise<string> {
    return (await this.confirmTitle.innerText()).trim();
  }

  async getConfirmDescText(): Promise<string> {
    return (await this.confirmDesc.innerText()).trim();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clickDelete() {
    await this.deleteButton.click();
  }

  async clickClose() {
    await this.closeButton.click();
  }
}
