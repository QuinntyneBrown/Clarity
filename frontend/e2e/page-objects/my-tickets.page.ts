import { Locator, Page } from '@playwright/test';
import { LoginPage } from './login.page';

export class MyTicketsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly filterChips: Locator;
  readonly newTicketButton: Locator;
  readonly fab: Locator;
  readonly ticketRows: Locator;
  readonly ticketCards: Locator;
  readonly emptyState: Locator;
  readonly tableContainer: Locator;
  readonly cardsContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('app-my-tickets h1');
    this.searchInput = page.locator('app-my-tickets app-search-input input');
    this.filterChips = page.locator('app-my-tickets .chip');
    this.newTicketButton = page.locator('app-my-tickets .new-ticket-btn');
    this.fab = page.locator('app-my-tickets .fab');
    this.ticketRows = page.locator('app-my-tickets .ticket-row');
    this.ticketCards = page.locator('app-my-tickets .ticket-card');
    this.emptyState = page.locator('app-my-tickets .empty-state');
    this.tableContainer = page.locator('app-my-tickets .table-container');
    this.cardsContainer = page.locator('app-my-tickets .cards-container');
  }

  async goto() {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
    await this.page.waitForURL('**/kanban', { timeout: 10000 });
    await this.page.goto('/my-tickets');
    await this.removeOverlay();
  }

  private async removeOverlay() {
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

  async waitForPage() {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 15000 });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async clearSearch() {
    const clearBtn = this.page.locator('app-my-tickets app-search-input .clear-btn');
    await clearBtn.click();
  }

  async clickFilter(label: string) {
    await this.filterChips.filter({ hasText: label }).click();
  }

  getActiveFilter(): Locator {
    return this.filterChips.filter({ has: this.page.locator('.active') });
  }

  async clickNewTicket() {
    await this.newTicketButton.click();
  }

  async clickFab() {
    await this.fab.click();
  }

  async clickTicketRow(name: string) {
    await this.ticketRows.filter({ hasText: name }).click();
  }

  async clickTicketCard(name: string) {
    await this.ticketCards.filter({ hasText: name }).click();
  }

  getTicketRowByName(name: string): Locator {
    return this.ticketRows.filter({ hasText: name });
  }

  getTicketCardByName(name: string): Locator {
    return this.ticketCards.filter({ hasText: name });
  }
}
