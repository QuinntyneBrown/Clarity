import { test, expect } from '@playwright/test';
import { AdminLayoutPage } from '../page-objects/admin-layout.page';

test.describe('Admin Navigation', () => {
  let layoutPage: AdminLayoutPage;

  test.beforeEach(async ({ page }) => {
    layoutPage = new AdminLayoutPage(page);
    await layoutPage.goto();
  });

  test('should display sidebar with branding', async () => {
    await expect(layoutPage.sidebar).toBeVisible();
    await expect(layoutPage.brandName).toHaveText('Clarity Admin');
  });

  test('should display all navigation items', async () => {
    const navCount = await layoutPage.navItems.count();
    expect(navCount).toBe(8);
  });

  test('should display user info in sidebar', async () => {
    await expect(layoutPage.userInfo).toBeVisible();
  });

  test('should navigate to Users page', async ({ page }) => {
    await layoutPage.navigateTo('users');
    await expect(page).toHaveURL(/\/users/);
    await expect(page.locator('[data-test="users-page"]')).toBeVisible();
  });

  test('should navigate to Tickets page', async ({ page }) => {
    await layoutPage.navigateTo('tickets');
    await expect(page).toHaveURL(/\/tickets/);
    await expect(page.locator('[data-test="tickets-page"]')).toBeVisible();
  });

  test('should navigate to Boards page', async ({ page }) => {
    await layoutPage.navigateTo('boards');
    await expect(page).toHaveURL(/\/boards/);
    await expect(page.locator('[data-test="boards-page"]')).toBeVisible();
  });

  test('should navigate to Team Members page', async ({ page }) => {
    await layoutPage.navigateTo('team-members');
    await expect(page).toHaveURL(/\/team-members/);
    await expect(page.locator('[data-test="team-members-page"]')).toBeVisible();
  });

  test('should navigate to Roles page', async ({ page }) => {
    await layoutPage.navigateTo('roles');
    await expect(page).toHaveURL(/\/roles/);
    await expect(page.locator('[data-test="roles-page"]')).toBeVisible();
  });

  test('should navigate to Comments page', async ({ page }) => {
    await layoutPage.navigateTo('comments');
    await expect(page).toHaveURL(/\/comments/);
    await expect(page.locator('[data-test="comments-page"]')).toBeVisible();
  });

  test('should navigate to Digital Assets page', async ({ page }) => {
    await layoutPage.navigateTo('digital-assets');
    await expect(page).toHaveURL(/\/digital-assets/);
    await expect(page.locator('[data-test="digital-assets-page"]')).toBeVisible();
  });

  test('should highlight active navigation item', async ({ page }) => {
    await layoutPage.navigateTo('users');
    const activeItem = await layoutPage.getActiveNavItem();
    await expect(activeItem).toContainText('Users');
  });
});
