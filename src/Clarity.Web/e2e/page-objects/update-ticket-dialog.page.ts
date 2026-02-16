import { Locator, Page } from '@playwright/test';

export class UpdateTicketDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('app-update-ticket');
    this.title = this.dialog.locator('h1');
  }

  async waitForOpen() {
    await this.dialog.waitFor({ state: 'visible' });
  }

  async waitForClosed() {
    await this.dialog.waitFor({ state: 'detached' });
  }
}
