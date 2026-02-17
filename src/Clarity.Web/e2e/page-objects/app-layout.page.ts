import { Locator, Page } from '@playwright/test';
import { LoginPage } from './login.page';

export class AppLayoutPage {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly header: Locator;
  readonly sidebarLogo: Locator;
  readonly sidebarNavItems: Locator;
  readonly sidebarUserProfile: Locator;
  readonly sidebarUserName: Locator;
  readonly headerTitle: Locator;
  readonly headerAvatar: Locator;

  constructor(page: Page) {
    this.page = page;
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
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'password123');
    await this.page.waitForURL('**/kanban', { timeout: 10000 });
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

  async waitForLayout() {
    // Wait for either sidebar or header to be visible
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
}
