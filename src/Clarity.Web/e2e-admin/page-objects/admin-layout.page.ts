import { type Page, type Locator } from '@playwright/test';
import { AdminLoginPage } from './admin-login.page';

export class AdminLayoutPage {
  readonly page: Page;
  readonly layout: Locator;
  readonly sidebar: Locator;
  readonly mainContent: Locator;
  readonly brandName: Locator;
  readonly navItems: Locator;
  readonly userInfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.layout = page.locator('[data-test="admin-layout"]');
    this.sidebar = page.locator('[data-test="sidebar"]');
    this.mainContent = page.locator('.main-content');
    this.brandName = page.locator('.brand-name');
    this.navItems = page.locator('.nav-item');
    this.userInfo = page.locator('.user-info');
  }

  async goto() {
    const loginPage = new AdminLoginPage(this.page);
    await loginPage.goto();
    await loginPage.login();
  }

  async navigateTo(route: string) {
    await this.page.locator(`[data-test="nav-${route}"]`).click();
    await this.page.waitForURL(`**/${route}`);
  }

  getNavItem(route: string): Locator {
    return this.page.locator(`[data-test="nav-${route}"]`);
  }

  async getActiveNavItem(): Promise<Locator> {
    return this.page.locator('.nav-item.active');
  }
}
