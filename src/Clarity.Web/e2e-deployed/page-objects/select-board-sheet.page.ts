import { Locator, Page } from '@playwright/test';

export class SelectBoardSheet {
  readonly page: Page;
  readonly sheet: Locator;
  readonly title: Locator;
  readonly closeButton: Locator;
  readonly boardItems: Locator;
  readonly newBoardAction: Locator;
  readonly cloneAction: Locator;
  readonly deleteAction: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sheet = page.locator('app-select-board');
    this.title = this.sheet.locator('.sheet-title');
    this.closeButton = this.sheet.locator('.sheet-close');
    this.boardItems = this.sheet.locator('.board-item');
    this.newBoardAction = this.sheet.locator('.sheet-action', { hasText: 'New Board' });
    this.cloneAction = this.sheet.locator('.sheet-action', { hasText: 'Clone' });
    this.deleteAction = this.sheet.locator('.sheet-action', { hasText: 'Delete' });
  }

  async waitForOpen() {
    await this.sheet.waitFor({ state: 'visible' });
  }

  async waitForClosed() {
    await this.sheet.waitFor({ state: 'detached' });
  }

  async selectBoard(name: string) {
    await this.boardItems.filter({ hasText: name }).click();
  }

  async clickNewBoard() {
    await this.newBoardAction.click();
  }

  async clickClone() {
    await this.cloneAction.click();
  }

  async clickDelete() {
    await this.deleteAction.click();
  }

  async clickClose() {
    await this.closeButton.click();
  }

  getActiveBoardItem(): Locator {
    return this.boardItems.filter({ has: this.page.locator('.board-check') });
  }

  async getBoardNames(): Promise<string[]> {
    const names: string[] = [];
    const count = await this.boardItems.count();
    for (let i = 0; i < count; i++) {
      const text = await this.boardItems.nth(i).locator('.board-name').innerText();
      names.push(text.trim());
    }
    return names;
  }
}
