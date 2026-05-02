import { Locator, Page } from '@playwright/test';
import { LoginPage } from './login.page';

export class InitiativesPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly addInitiativeButton: Locator;
  readonly initiativeRows: Locator;
  readonly initiativeCards: Locator;
  readonly emptyState: Locator;
  readonly tableContainer: Locator;
  readonly cardsContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('app-initiatives h1');
    this.searchInput = page.locator('app-initiatives app-search-input input');
    this.addInitiativeButton = page.locator('app-initiatives .add-btn');
    this.initiativeRows = page.locator('app-initiatives .initiative-row');
    this.initiativeCards = page.locator('app-initiatives .initiative-card');
    this.emptyState = page.locator('app-initiatives .empty-state');
    this.tableContainer = page.locator('app-initiatives .table-container');
    this.cardsContainer = page.locator('app-initiatives .cards-container');
  }

  async goto() {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
    await this.page.waitForURL('**/kanban', { timeout: 10000 });
    await this.page.goto('/initiatives');
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

  async clickAddInitiative() {
    await this.addInitiativeButton.click();
  }

  getInitiativeRowByName(name: string): Locator {
    return this.initiativeRows.filter({ hasText: name });
  }

  getInitiativeCardByName(name: string): Locator {
    return this.initiativeCards.filter({ hasText: name });
  }

  getEditButton(row: Locator): Locator {
    return row.locator('.action-btn').nth(1);
  }

  getDeleteButton(row: Locator): Locator {
    return row.locator('.action-btn.delete');
  }

  getViewReportButton(row: Locator): Locator {
    return row.locator('.action-btn').first();
  }
}
