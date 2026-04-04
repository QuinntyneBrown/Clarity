import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class InitiativesPage extends BasePage {
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly addInitiativeButton: Locator;
  readonly initiativeRows: Locator;
  readonly initiativeCards: Locator;
  readonly emptyState: Locator;
  readonly tableContainer: Locator;
  readonly cardsContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('app-initiatives h1');
    this.searchInput = page.locator('app-initiatives app-search-input input');
    this.addInitiativeButton = page.locator('app-initiatives .add-btn');
    this.initiativeRows = page.locator('app-initiatives .initiative-card');
    this.initiativeCards = page.locator('app-initiatives .initiative-card');
    this.emptyState = page.locator('app-initiatives .empty-state');
    this.tableContainer = page.locator('app-initiatives .cards-container');
    this.cardsContainer = page.locator('app-initiatives .cards-container');
  }

  async goto() {
    await this.loginAndNavigate('/initiatives');
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
