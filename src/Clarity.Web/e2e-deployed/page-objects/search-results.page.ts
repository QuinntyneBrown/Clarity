import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class SearchResultsPage extends BasePage {
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly filterChips: Locator;
  readonly ticketResults: Locator;
  readonly memberResults: Locator;
  readonly emptyState: Locator;
  readonly resultRows: Locator;
  readonly resultCards: Locator;
  readonly sectionTitles: Locator;
  readonly mobileHeader: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('app-search-results h1');
    this.searchInput = page.locator('app-search-results app-search-input input');
    this.filterChips = page.locator('app-search-results .chip');
    this.ticketResults = page.locator('app-search-results .result-row');
    this.memberResults = page.locator('app-search-results .member-card');
    this.emptyState = page.locator('app-search-results .empty-state');
    this.resultRows = page.locator('app-search-results .result-row');
    this.resultCards = page.locator('app-search-results .result-card');
    this.sectionTitles = page.locator('app-search-results .section-title');
    this.mobileHeader = page.locator('app-search-results .mobile-header');
    this.backButton = page.locator('app-search-results .back-btn');
  }

  async goto(query?: string) {
    const url = query ? `/search?q=${encodeURIComponent(query)}` : '/search';
    await this.loginAndNavigate(url);
  }

  async waitForPage() {
    await this.searchInput.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async search(term: string) {
    await this.searchInput.first().fill(term);
  }

  async clickFilter(label: string) {
    await this.filterChips.filter({ hasText: label }).click();
  }

  async clickResult(name: string) {
    await this.resultRows.filter({ hasText: name }).click();
  }

  async clickBack() {
    await this.backButton.click();
  }
}
