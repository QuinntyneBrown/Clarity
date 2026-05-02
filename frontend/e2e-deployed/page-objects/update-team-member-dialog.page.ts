import { Locator, Page } from '@playwright/test';

export class UpdateTeamMemberDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly title: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly roleSelect: Locator;
  readonly saveButton: Locator;
  readonly deleteButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;
  readonly form: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('app-update-team-member');
    this.title = this.dialog.locator('h1');
    this.form = this.dialog.locator('form');
    this.nameInput = this.dialog.locator('input[formcontrolname="name"]');
    this.emailInput = this.dialog.locator('input[formcontrolname="email"]');
    this.roleSelect = this.dialog.locator('select[formcontrolname="role"]');
    this.saveButton = this.dialog.locator('button', { hasText: 'Update' });
    this.deleteButton = this.dialog.locator('button', { hasText: 'Delete' });
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

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async selectRole(role: string) {
    await this.roleSelect.selectOption({ label: role });
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickDelete() {
    await this.deleteButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clickClose() {
    await this.closeButton.click();
  }
}
