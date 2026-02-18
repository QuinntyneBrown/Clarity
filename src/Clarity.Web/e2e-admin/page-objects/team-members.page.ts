import { type Page, type Locator } from '@playwright/test';
import { AdminLoginPage } from './admin-login.page';

export class TeamMembersPage {
  readonly page: Page;
  readonly teamMembersPage: Locator;
  readonly pageTitle: Locator;
  readonly addMemberButton: Locator;
  readonly searchInput: Locator;
  readonly teamMembersTable: Locator;
  readonly tableRows: Locator;
  readonly dialogSaveButton: Locator;
  readonly dialogCancelButton: Locator;
  readonly memberNameInput: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.teamMembersPage = page.locator('[data-test="team-members-page"]');
    this.pageTitle = page.locator('.page-title');
    this.addMemberButton = page.locator('[data-test="add-member-btn"]');
    this.searchInput = page.locator('[data-test="team-members-page"] [data-test="search-input"]');
    this.teamMembersTable = page.locator('[data-test="team-members-table"]');
    this.tableRows = page.locator('[data-test="team-members-table"] tbody tr');
    this.dialogSaveButton = page.locator('[data-test="dialog-save"]');
    this.dialogCancelButton = page.locator('[data-test="dialog-cancel"]');
    this.memberNameInput = page.locator('[data-test="member-name-input"]');
    this.confirmButton = page.locator('[data-test="confirm-btn"]');
  }

  async goto() {
    const loginPage = new AdminLoginPage(this.page);
    await loginPage.goto();
    await loginPage.login();
    await this.page.locator('[data-test="nav-/team-members"]').click();
    await this.page.waitForURL('**/team-members');
    await this.teamMembersPage.waitFor({ state: 'visible' });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async clickAddMember() {
    await this.addMemberButton.click();
  }

  async createMember(name: string) {
    await this.clickAddMember();
    await this.memberNameInput.waitFor({ state: 'visible' });
    await this.memberNameInput.fill(name);
    await this.dialogSaveButton.click();
  }

  async clickEditOnRow(index: number) {
    await this.tableRows.nth(index).locator('[data-test="edit-btn"]').click();
  }

  async clickDeleteOnRow(index: number) {
    await this.tableRows.nth(index).locator('[data-test="delete-btn"]').click();
  }

  async confirmDelete() {
    await this.confirmButton.click();
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }
}
