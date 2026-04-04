import { Page } from '@playwright/test';
import { LoginPage } from './login.page';

export abstract class BasePage {
  constructor(readonly page: Page) {}

  protected async removeOverlay() {
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

  protected async loginAndNavigate(path: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login('quinntynebrown@gmail.com', 'P@ssw0rd');
    await this.page.waitForURL('**/kanban', { timeout: 15000 });
    await this.removeOverlay();
    if (path !== '/kanban') {
      await this.page.goto(path);
      await this.page.waitForURL(`**${path}`, { timeout: 15000 });
      await this.removeOverlay();
    }
  }
}
