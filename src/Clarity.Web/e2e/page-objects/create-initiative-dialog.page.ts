import { Locator, Page } from '@playwright/test';

export class CreateInitiativeDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly title: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;
  readonly form: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('app-create-initiative');
    this.title = this.dialog.locator('h1');
    this.form = this.dialog.locator('form');
    this.nameInput = this.dialog.locator('input[formcontrolname="name"]');
    this.descriptionInput = this.dialog.locator('textarea[formcontrolname="description"]');
    this.saveButton = this.dialog.locator('button', { hasText: 'Create Initiative' });
    this.cancelButton = this.dialog.locator('button', { hasText: 'Cancel' });
    this.closeButton = this.dialog.locator('.close-btn');
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

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clickClose() {
    await this.closeButton.click();
  }
}
