import { type Page, type Locator } from '@playwright/test';
import { AdminLoginPage } from './admin-login.page';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardPage: Locator;
  readonly pageTitle: Locator;
  readonly pageSubtitle: Locator;
  readonly metricsRow1: Locator;
  readonly metricsRow2: Locator;
  readonly recentActivity: Locator;
  readonly activityRows: Locator;
  readonly viewAllLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardPage = page.locator('[data-test="dashboard-page"]');
    this.pageTitle = page.locator('.page-title');
    this.pageSubtitle = page.locator('.page-subtitle');
    this.metricsRow1 = page.locator('[data-test="metrics-row-1"]');
    this.metricsRow2 = page.locator('[data-test="metrics-row-2"]');
    this.recentActivity = page.locator('[data-test="recent-activity"]');
    this.activityRows = page.locator('.activity-row');
    this.viewAllLink = page.locator('.view-all-link');
  }

  async goto() {
    const loginPage = new AdminLoginPage(this.page);
    await loginPage.goto();
    await loginPage.login();
    await this.dashboardPage.waitFor({ state: 'visible' });
  }

  getMetricCard(name: string): Locator {
    return this.page.locator(`[data-test="metric-${name}"]`);
  }

  async getMetricValue(name: string): Promise<string> {
    return this.getMetricCard(name).locator('.metric-value').innerText();
  }

  async getActivityCount(): Promise<number> {
    return this.activityRows.count();
  }
}
