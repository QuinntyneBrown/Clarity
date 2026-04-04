import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class TeamPage extends BasePage {
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly addMemberButton: Locator;
  readonly memberRows: Locator;
  readonly memberCards: Locator;
  readonly emptyState: Locator;
  readonly tableContainer: Locator;
  readonly cardsContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('app-team h1');
    this.searchInput = page.locator('app-team app-search-input input');
    this.addMemberButton = page.locator('app-team .invite-btn');
    this.memberRows = page.locator('app-team .member-row');
    this.memberCards = page.locator('app-team .member-card');
    this.emptyState = page.locator('app-team .empty-state');
    this.tableContainer = page.locator('app-team .table-container');
    this.cardsContainer = page.locator('app-team .cards-container');
  }

  async goto() {
    await this.loginAndNavigate('/team');
  }

  async waitForPage() {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 15000 });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async clickAddMember() {
    await this.addMemberButton.click();
  }

  getMemberRowByName(name: string): Locator {
    return this.memberRows.filter({ hasText: name });
  }

  getMemberCardByName(name: string): Locator {
    return this.memberCards.filter({ hasText: name });
  }

  getEditButton(memberRow: Locator): Locator {
    return memberRow.locator('.action-btn').first();
  }

  getDeleteButton(memberRow: Locator): Locator {
    return memberRow.locator('.action-btn.delete');
  }
}
