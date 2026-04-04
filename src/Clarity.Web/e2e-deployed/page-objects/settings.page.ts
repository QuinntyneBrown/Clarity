import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class SettingsPage extends BasePage {
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
    super(page);
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
    await this.loginAndNavigate('/settings');
  }

  async waitForSettings() {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 15000 });
    await this.removeOverlay();
  }

  async clickNavItem(sectionTitle: string) {
    await this.navItems.filter({ hasText: sectionTitle }).click();
  }

  async getActiveNavItem(): Promise<string> {
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
