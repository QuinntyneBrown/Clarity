import { Locator, Page } from '@playwright/test';
import { LoginPage } from './login.page';

export class TeamPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly addMemberButton: Locator;
  readonly memberRows: Locator;
  readonly memberCards: Locator;
  readonly emptyState: Locator;
  readonly tableContainer: Locator;
  readonly cardsContainer: Locator;

  constructor(page: Page) {
    this.page = page;
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
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
    await this.page.waitForURL('**/kanban', { timeout: 10000 });
    await this.page.goto('/team');
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
