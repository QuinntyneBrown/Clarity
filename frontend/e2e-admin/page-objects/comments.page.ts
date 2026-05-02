import { type Page, type Locator } from '@playwright/test';
import { AdminLoginPage } from './admin-login.page';

export class CommentsPage {
  readonly page: Page;
  readonly commentsPage: Locator;
  readonly pageTitle: Locator;
  readonly addCommentButton: Locator;
  readonly searchInput: Locator;
  readonly commentsTable: Locator;
  readonly tableRows: Locator;
  readonly dialogSaveButton: Locator;
  readonly dialogCancelButton: Locator;
  readonly commentDescriptionInput: Locator;
  readonly commentTicketInput: Locator;
  readonly commentMemberInput: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.commentsPage = page.locator('[data-test="comments-page"]');
    this.pageTitle = page.locator('.page-title');
    this.addCommentButton = page.locator('[data-test="add-comment-btn"]');
    this.searchInput = page.locator('[data-test="comments-page"] [data-test="search-input"]');
    this.commentsTable = page.locator('[data-test="comments-table"]');
    this.tableRows = page.locator('[data-test="comments-table"] tbody tr');
    this.dialogSaveButton = page.locator('[data-test="dialog-save"]');
    this.dialogCancelButton = page.locator('[data-test="dialog-cancel"]');
    this.commentDescriptionInput = page.locator('[data-test="comment-description-input"]');
    this.commentTicketInput = page.locator('[data-test="comment-ticket-input"]');
    this.commentMemberInput = page.locator('[data-test="comment-member-input"]');
    this.confirmButton = page.locator('[data-test="confirm-btn"]');
  }

  async goto() {
    const loginPage = new AdminLoginPage(this.page);
    await loginPage.goto();
    await loginPage.login();
    await this.page.locator('[data-test="nav-/comments"]').click();
    await this.page.waitForURL('**/comments');
    await this.commentsPage.waitFor({ state: 'visible' });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async clickAddComment() {
    await this.addCommentButton.click();
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
