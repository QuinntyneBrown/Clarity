import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class InitiativeReportPage extends BasePage {
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
    super(page);
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
    await this.loginAndNavigate(`/initiatives/${initiativeId}/report`);
  }

  async waitForPage() {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 15000 });
  }

  async clickBack() {
    await this.backButton.click();
  }
}
