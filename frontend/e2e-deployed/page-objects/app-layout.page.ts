import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AppLayoutPage extends BasePage {
  readonly sidebar: Locator;
  readonly header: Locator;
  readonly sidebarLogo: Locator;
  readonly sidebarNavItems: Locator;
  readonly sidebarUserProfile: Locator;
  readonly sidebarUserName: Locator;
  readonly headerTitle: Locator;
  readonly headerAvatar: Locator;

  constructor(page: Page) {
    super(page);
    this.sidebar = page.locator('app-sidebar');
    this.header = page.locator('app-header');
    this.sidebarLogo = page.locator('.logo-name');
    this.sidebarNavItems = page.locator('.nav-item');
    this.sidebarUserProfile = page.locator('.user-profile');
    this.sidebarUserName = page.locator('.user-name');
    this.headerTitle = page.locator('.header-title');
    this.headerAvatar = page.locator('.header-avatar');
  }

  async goto() {
    await this.loginAndNavigate('/kanban');
  }

  async waitForLayout() {
    await this.page.locator('app-sidebar, app-header').first().waitFor({ state: 'visible', timeout: 15000 });
    await this.removeOverlay();
  }

  async openMobileUserMenu() {
    await this.headerAvatar.click();
  }

  async openDesktopUserMenu() {
    await this.sidebarUserProfile.click();
  }

  async clickSignOut() {
    await this.page.locator('.sign-out-item').click();
  }

  async navigateTo(label: string) {
    await this.sidebarNavItems.filter({ hasText: label }).click();
  }

  getNavItem(label: string): Locator {
    return this.sidebarNavItems.filter({ hasText: label });
  }

  async getUserMenuLink(label: string): Promise<Locator> {
    return this.page.locator('button[mat-menu-item], a[mat-menu-item]').filter({ hasText: label });
  }
}
