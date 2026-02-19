import { Locator, Page } from '@playwright/test';
import { LoginPage } from './login.page';

export class KanbanPage {
  readonly page: Page;
  readonly addTicketButton: Locator;
  readonly boardName: Locator;
  readonly columns: Locator;
  readonly controlsBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.controlsBar = page.locator('app-kanban-board-controls');
    this.addTicketButton = this.controlsBar.locator('.add-ticket-btn');
    this.boardName = this.controlsBar.locator('.board-name');
    this.columns = page.locator('.kanban-column');
  }

  async goto() {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
    await this.page.waitForURL('**/kanban', { timeout: 10000 });
    await this.removeOverlay();
  }

  async waitForBoard() {
    await this.boardName.waitFor({ state: 'visible' });
    await this.removeOverlay();
  }

  private async removeOverlay() {
    // Hide webpack dev server error overlay that intercepts pointer events.
    // Use CSS injection so it persists even if the overlay is recreated.
    await this.page.evaluate(() => {
      const iframe = document.getElementById('webpack-dev-server-client-overlay');
      if (iframe) iframe.remove();
      if (!document.getElementById('e2e-overlay-fix')) {
        const style = document.createElement('style');
        style.id = 'e2e-overlay-fix';
        style.textContent = '#webpack-dev-server-client-overlay { display: none !important; pointer-events: none !important; }';
        document.head.appendChild(style);
      }
    });
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
}
