import { Locator, Page } from '@playwright/test';

export class KanbanPage {
  readonly page: Page;
  readonly addTicketButton: Locator;
  readonly boardName: Locator;
  readonly columns: Locator;
  readonly controlsBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.controlsBar = page.locator('app-kanban-board-controls');
    this.addTicketButton = this.controlsBar.locator('mat-icon');
    this.boardName = this.controlsBar.locator('span');
    this.columns = page.locator('.kanban-board__column');
  }

  async goto() {
    await this.page.goto('/');
  }

  async waitForBoard() {
    await this.boardName.waitFor({ state: 'visible' });
  }

  async getColumnHeaders(): Promise<string[]> {
    const headers: string[] = [];
    const count = await this.columns.count();
    for (let i = 0; i < count; i++) {
      const text = await this.columns.nth(i).locator('> span').innerText();
      headers.push(text.trim());
    }
    return headers;
  }

  async getColumnCount(): Promise<number> {
    return await this.columns.count();
  }

  async getTicketsInColumn(columnIndex: number): Promise<Locator> {
    return this.columns.nth(columnIndex).locator('app-ticket');
  }

  async getAllTickets(): Promise<Locator> {
    return this.page.locator('app-ticket');
  }

  getTicketByName(name: string): Locator {
    return this.page.locator('app-ticket').filter({ hasText: name });
  }

  async clickAddTicket() {
    await this.addTicketButton.click();
  }

  async clickBoardName() {
    await this.boardName.click();
  }

  async clickTicket(name: string) {
    await this.getTicketByName(name).locator('h2').click();
  }
}
