import { test, expect } from '@playwright/test';
import { CommentsPage } from '../page-objects/comments.page';

test.describe('Comments Management', () => {
  let commentsPage: CommentsPage;

  test.beforeEach(async ({ page }) => {
    commentsPage = new CommentsPage(page);
    await commentsPage.goto();
  });

  test('should display comments page with title', async () => {
    await expect(commentsPage.pageTitle).toHaveText('Comments');
    await expect(commentsPage.commentsPage).toBeVisible();
  });

  test('should display Add Comment button', async () => {
    await expect(commentsPage.addCommentButton).toBeVisible();
    await expect(commentsPage.addCommentButton).toContainText('Add Comment');
  });

  test('should display search input', async () => {
    await expect(commentsPage.searchInput).toBeVisible();
  });

  test('should display comments table', async () => {
    await expect(commentsPage.commentsTable).toBeVisible();
  });

  test('should filter comments by search term', async () => {
    await commentsPage.search('nonexistent-comment-xyz');
    const filteredCount = await commentsPage.getRowCount();
    expect(filteredCount).toBe(0);
  });

  test('should open create comment dialog', async () => {
    await commentsPage.clickAddComment();
    await expect(commentsPage.commentDescriptionInput).toBeVisible();
    await expect(commentsPage.commentTicketInput).toBeVisible();
    await expect(commentsPage.commentMemberInput).toBeVisible();
    await expect(commentsPage.dialogSaveButton).toBeVisible();
  });

  test('should close create dialog on cancel', async () => {
    await commentsPage.clickAddComment();
    await expect(commentsPage.commentDescriptionInput).toBeVisible();
    await commentsPage.dialogCancelButton.click();
    await expect(commentsPage.commentDescriptionInput).not.toBeVisible();
  });

  test('should open edit dialog when clicking edit', async () => {
    const rowCount = await commentsPage.getRowCount();
    if (rowCount > 0) {
      await commentsPage.clickEditOnRow(0);
      await expect(commentsPage.commentDescriptionInput).toBeVisible();
    }
  });

  test('should open delete confirmation when clicking delete', async () => {
    const rowCount = await commentsPage.getRowCount();
    if (rowCount > 0) {
      await commentsPage.clickDeleteOnRow(0);
      await expect(commentsPage.confirmButton).toBeVisible();
    }
  });
});
