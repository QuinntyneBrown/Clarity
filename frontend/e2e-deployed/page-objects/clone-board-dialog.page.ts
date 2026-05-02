import { Locator, Page } from '@playwright/test';

export class CloneBoardDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly title: Locator;
  readonly sourceBoardName: Locator;
  readonly nameInput: Locator;
  readonly cancelButton: Locator;
  readonly cloneButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('app-clone-board');
    this.title = this.dialog.locator('h2');
    this.sourceBoardName = this.dialog.locator('.source-name');
    this.nameInput = this.dialog.locator('input[formcontrolname="name"]');
    this.cancelButton = this.dialog.locator('button', { hasText: 'Cancel' });
    this.cloneButton = this.dialog.locator('button', { hasText: 'Clone Board' });
  }

  async waitForOpen() {
    await this.dialog.waitFor({ state: 'visible' });
  }

  async waitForClosed() {
    await this.dialog.waitFor({ state: 'detached' });
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async clickClone() {
    await this.cloneButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }
}
