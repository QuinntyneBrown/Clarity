import { Locator, Page } from '@playwright/test';

export class CreateTicketDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly title: Locator;
  readonly nameInput: Locator;
  readonly stateSelect: Locator;
  readonly prioritySelect: Locator;
  readonly descriptionTextarea: Locator;
  readonly acceptanceCriteriaTextarea: Locator;
  readonly assigneeSelect: Locator;
  readonly initiativeSelect: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;
  readonly form: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('app-create-ticket');
    this.title = this.dialog.locator('h1');
    this.form = this.dialog.locator('form');
    this.nameInput = this.dialog.locator('input[formcontrolname="name"]');
    this.stateSelect = this.dialog.locator('select[formcontrolname="state"]');
    this.prioritySelect = this.dialog.locator('select[formcontrolname="priority"]');
    this.descriptionTextarea = this.dialog.locator('textarea[formcontrolname="description"]');
    this.acceptanceCriteriaTextarea = this.dialog.locator('textarea[formcontrolname="acceptanceCriteria"]');
    this.assigneeSelect = this.dialog.locator('select[formcontrolname="teamMemberId"]');
    this.initiativeSelect = this.dialog.locator('select[formcontrolname="initiativeId"]');
    this.saveButton = this.dialog.locator('button', { hasText: 'Create' });
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
    await this.descriptionTextarea.fill(description);
  }

  async fillAcceptanceCriteria(criteria: string) {
    await this.acceptanceCriteriaTextarea.fill(criteria);
  }

  async selectState(stateName: string) {
    await this.stateSelect.selectOption({ label: stateName });
  }

  async selectPriority(priority: string) {
    await this.prioritySelect.selectOption({ label: priority });
  }

  async selectAssignee(label: string) {
    await this.assigneeSelect.selectOption({ label });
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

  async getStateOptionLabels(): Promise<string[]> {
    const options = this.stateSelect.locator('option');
    const count = await options.count();
    const labels: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await options.nth(i).innerText()).trim();
      if (text && text !== 'Select status') {
        labels.push(text);
      }
    }
    return labels;
  }
}
