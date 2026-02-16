import { Locator, Page } from '@playwright/test';

export class CreateTicketDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly title: Locator;
  readonly nameInput: Locator;
  readonly stateSelect: Locator;
  readonly descriptionTextarea: Locator;
  readonly acceptanceCriteriaTextarea: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly form: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('app-create-ticket');
    this.title = this.dialog.locator('h1');
    this.form = this.dialog.locator('form');
    this.nameInput = this.dialog.locator('input[formcontrolname="name"]');
    this.stateSelect = this.dialog.locator('select[formcontrolname="state"]');
    this.descriptionTextarea = this.dialog.locator('textarea[formcontrolname="description"]');
    this.acceptanceCriteriaTextarea = this.dialog.locator('textarea[formcontrolname="acceptanceCriteria"]');
    this.saveButton = this.dialog.locator('button', { hasText: 'Save' });
    this.cancelButton = this.dialog.locator('button', { hasText: 'Cancel' });
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
    await this.descriptionTextarea.fill(description);
  }

  async fillAcceptanceCriteria(criteria: string) {
    await this.acceptanceCriteriaTextarea.fill(criteria);
  }

  async selectState(stateName: string) {
    await this.stateSelect.selectOption({ label: stateName });
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }
}
