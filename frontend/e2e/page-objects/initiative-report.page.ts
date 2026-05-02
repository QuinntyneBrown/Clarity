import { Locator, Page } from '@playwright/test';
import { LoginPage } from './login.page';

export class InitiativeReportPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly backButton: Locator;
  readonly description: Locator;
  readonly metricCards: Locator;
  readonly totalTickets: Locator;
  readonly storyPoints: Locator;
  readonly totalEffort: Locator;
  readonly percentComplete: Locator;
  readonly statusSection: Locator;
  readonly statusRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('app-initiative-report h1');
    this.backButton = page.locator('app-initiative-report .back-btn');
    this.description = page.locator('app-initiative-report .report-description');
    this.metricCards = page.locator('app-initiative-report .metric-card');
    this.totalTickets = this.metricCards.nth(0).locator('.metric-value');
    this.storyPoints = this.metricCards.nth(1).locator('.metric-value');
    this.totalEffort = this.metricCards.nth(2).locator('.metric-value');
    this.percentComplete = this.metricCards.nth(3).locator('.metric-value');
    this.statusSection = page.locator('app-initiative-report .status-section');
    this.statusRows = page.locator('app-initiative-report .status-row');
  }

  async goto(initiativeId: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
    await this.page.waitForURL('**/kanban', { timeout: 10000 });
    await this.page.goto(`/initiatives/${initiativeId}/report`);
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

  async clickBack() {
    await this.backButton.click();
  }
}
