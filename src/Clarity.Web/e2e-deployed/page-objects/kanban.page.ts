import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class KanbanPage extends BasePage {
  readonly addTicketButton: Locator;
  readonly newBoardButton: Locator;
  readonly cloneBoardButton: Locator;
  readonly boardName: Locator;
  readonly columns: Locator;
  readonly controlsBar: Locator;
  readonly stickyHeader: Locator;
  readonly filterChips: Locator;
  readonly boardSelectorTrigger: Locator;

  constructor(page: Page) {
    super(page);
    this.controlsBar = page.locator('app-kanban-board-controls');
    this.addTicketButton = this.controlsBar.locator('.add-ticket-btn');
    this.newBoardButton = this.controlsBar.locator('.board-action-btn', { hasText: 'New Board' });
    this.cloneBoardButton = this.controlsBar.locator('.board-action-btn', { hasText: 'Clone' });
    this.boardName = this.controlsBar.locator('.board-name');
    this.columns = page.locator('.kanban-column');
    this.stickyHeader = page.locator('.sticky-header');
    this.filterChips = this.controlsBar.locator('.filter-chip');
    this.boardSelectorTrigger = this.controlsBar.locator('.board-selector-trigger');
  }

  async goto() {
    await this.loginAndNavigate('/kanban');
  }

  async waitForBoard() {
    await this.boardName.waitFor({ state: 'visible', timeout: 15000 });
    await this.removeOverlay();
  }

  async getColumnHeaders(): Promise<string[]> {
    const headers: string[] = [];
    const count = await this.columns.count();
    for (let i = 0; i < count; i++) {
      const text = await this.columns.nth(i).locator('.column-title').innerText();
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

  async clickNewBoard() {
    await this.newBoardButton.click();
  }

  async clickCloneBoard() {
    await this.cloneBoardButton.click();
  }

  getColumnByHeader(headerText: string): Locator {
    return this.page.locator('.kanban-column').filter({ has: this.page.locator('.column-title', { hasText: headerText }) });
  }

  getTicketsInColumnByHeader(headerText: string): Locator {
    return this.getColumnByHeader(headerText).locator('app-ticket');
  }

  async clickBoardName() {
    await this.boardName.click();
  }

  async clickTicket(name: string) {
    await this.getTicketByName(name).locator('.ticket-title').click();
  }

  async clickFilterChip(label: string) {
    await this.filterChips.filter({ hasText: label }).click();
  }

  getDeleteColumnButton(columnIndex: number): Locator {
    return this.columns.nth(columnIndex).locator('.column-delete-btn');
  }
}
