import { Locator, Page } from '@playwright/test';
import { LoginPage } from './login.page';

export class SettingsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly pageSubtitle: Locator;
  readonly backButton: Locator;
  readonly settingsNav: Locator;
  readonly navItems: Locator;
  readonly settingsPanel: Locator;
  readonly panelTitle: Locator;
  readonly panelDescription: Locator;
  readonly settingItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.page-title');
    this.pageSubtitle = page.locator('.page-subtitle');
    this.backButton = page.locator('.back-btn');
    this.settingsNav = page.locator('.settings-nav');
    this.navItems = page.locator('.settings-nav .nav-item');
    this.settingsPanel = page.locator('.settings-panel');
    this.panelTitle = page.locator('.panel-title');
    this.panelDescription = page.locator('.panel-description');
    this.settingItems = page.locator('.setting-item');
  }

  async goto() {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
    await this.page.waitForURL('**/kanban', { timeout: 10000 });
    await this.removeOverlay();
    await this.page.goto('/settings');
    await this.page.waitForURL('**/settings', { timeout: 10000 });
    await this.removeOverlay();
  }

  async waitForSettings() {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 15000 });
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

  async clickNavItem(sectionTitle: string) {
    await this.navItems.filter({ hasText: sectionTitle }).click();
  }

  async getActiveNavItem(): Promise<string> {
    const active = this.navItems.filter({ has: this.page.locator('.active') });
    // Fall back to checking the class on the nav-item itself
    const activeItem = this.page.locator('.settings-nav .nav-item.active');
    return await activeItem.locator('.nav-item-title').innerText();
  }

  getSlideToggle(label: string): Locator {
    return this.page.locator('.setting-item', { hasText: label }).locator('mat-slide-toggle');
  }

  getSlideToggleInput(label: string): Locator {
    return this.getSlideToggle(label).locator('input');
  }

  getThemeOption(theme: string): Locator {
    return this.page.locator('.theme-option', { hasText: theme });
  }

  getActiveTheme(): Locator {
    return this.page.locator('.theme-option.active');
  }

  getActionButton(label: string): Locator {
    return this.page.locator('.setting-item', { hasText: label }).locator('.action-btn');
  }

  getSelect(label: string): Locator {
    return this.page.locator('.setting-item', { hasText: label }).locator('mat-select');
  }

  async clickBack() {
    await this.backButton.click();
  }
}
