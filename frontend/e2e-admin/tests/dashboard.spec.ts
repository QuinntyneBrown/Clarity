import { test, expect } from '@playwright/test';
import { DashboardPage } from '../page-objects/dashboard.page';

test.describe('Dashboard', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
  });

  test('should display dashboard title and subtitle', async () => {
    await expect(dashboardPage.pageTitle).toHaveText('Dashboard');
    await expect(dashboardPage.pageSubtitle).toHaveText('Overview of your Clarity project administration');
  });

  test('should display first row of metric cards', async () => {
    await expect(dashboardPage.metricsRow1).toBeVisible();
    await expect(dashboardPage.getMetricCard('users')).toBeVisible();
    await expect(dashboardPage.getMetricCard('tickets')).toBeVisible();
    await expect(dashboardPage.getMetricCard('boards')).toBeVisible();
    await expect(dashboardPage.getMetricCard('team-members')).toBeVisible();
  });

  test('should display second row of metric cards', async () => {
    await expect(dashboardPage.metricsRow2).toBeVisible();
    await expect(dashboardPage.getMetricCard('roles')).toBeVisible();
    await expect(dashboardPage.getMetricCard('comments')).toBeVisible();
    await expect(dashboardPage.getMetricCard('digital-assets')).toBeVisible();
    await expect(dashboardPage.getMetricCard('privileges')).toBeVisible();
  });

  test('should display recent activity section', async () => {
    await expect(dashboardPage.recentActivity).toBeVisible();
    const count = await dashboardPage.getActivityCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should display view all link in activity section', async () => {
    await expect(dashboardPage.viewAllLink).toBeVisible();
    await expect(dashboardPage.viewAllLink).toHaveText('View All');
  });
});
