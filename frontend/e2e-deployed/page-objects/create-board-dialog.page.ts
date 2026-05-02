import { Locator, Page } from '@playwright/test';

export class CreateBoardDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly title: Locator;
  readonly closeButton: Locator;
  readonly stepBars: Locator;
  readonly stepLabel: Locator;

  // Step 1
  readonly nameInput: Locator;
  readonly infoBox: Locator;
  readonly cancelButton: Locator;
  readonly nextButton: Locator;

  // Step 2
  readonly stateItems: Locator;
  readonly newStateInput: Locator;
  readonly addStateButton: Locator;
  readonly backButton: Locator;
  readonly createButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('app-create-board');
    this.title = this.dialog.locator('h2');
    this.closeButton = this.dialog.locator('.close-btn');
    this.stepBars = this.dialog.locator('.step-bar');
    this.stepLabel = this.dialog.locator('.step-label');

    this.nameInput = this.dialog.locator('input[formcontrolname="name"]');
    this.infoBox = this.dialog.locator('.info-box');
    this.cancelButton = this.dialog.locator('button', { hasText: 'Cancel' });
    this.nextButton = this.dialog.locator('button', { hasText: 'Next' });

    this.stateItems = this.dialog.locator('.state-item');
    this.newStateInput = this.dialog.locator('.add-state-row input');
    this.addStateButton = this.dialog.locator('.btn-add');
    this.backButton = this.dialog.locator('button', { hasText: 'Back' });
    this.createButton = this.dialog.locator('button', { hasText: 'Create Board' });
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

  async clickNext() {
    await this.nextButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clickClose() {
    await this.closeButton.click();
  }

  async clickBack() {
    await this.backButton.click();
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async getStateNames(): Promise<string[]> {
    const names: string[] = [];
    const count = await this.stateItems.count();
    for (let i = 0; i < count; i++) {
      const text = await this.stateItems.nth(i).locator('.state-name').innerText();
      names.push(text.trim());
    }
    return names;
  }

  async getStateCount(): Promise<number> {
    return await this.stateItems.count();
  }

  async addState(name: string) {
    await this.newStateInput.fill(name);
    await this.addStateButton.click();
  }

  async removeState(index: number) {
    await this.stateItems.nth(index).locator('.delete-state-btn').click();
  }

  async getStepLabelText(): Promise<string> {
    return (await this.stepLabel.innerText()).trim();
  }

  async getActiveStepBarCount(): Promise<number> {
    return await this.dialog.locator('.step-bar.active').count();
  }

  getDeleteStateButton(index: number): Locator {
    return this.stateItems.nth(index).locator('.delete-state-btn');
  }
}
