import { test, expect } from '@playwright/test';
import { TeamPage } from '../page-objects/team.page';
import { CreateTeamMemberDialog } from '../page-objects/create-team-member-dialog.page';
import { UpdateTeamMemberDialog } from '../page-objects/update-team-member-dialog.page';

test.describe('Deployment Smoke Tests', () => {

  test('app should load with JavaScript bundles', async ({ page }) => {
    const jsRequests: string[] = [];
    page.on('response', (response) => {
      const url = response.url();
      if (url.endsWith('.js') && response.status() === 200) {
        jsRequests.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(jsRequests.length).toBeGreaterThan(0);

    const html = await page.content();
    expect(html).toContain('<app-root');
  });

  test('swagger should expose TeamMember upsert and delete endpoints', async ({ request }) => {
    const response = await request.get('/swagger/v1/swagger.json');
    expect(response.ok()).toBeTruthy();

    const swagger = await response.json();
    const paths = Object.keys(swagger.paths);

    const teamMemberPaths = paths.filter(p => p.toLowerCase().includes('teammember'));
    expect(teamMemberPaths.length).toBeGreaterThanOrEqual(3);

    const hasPost = teamMemberPaths.some(p => swagger.paths[p]['post']);
    const hasDelete = teamMemberPaths.some(p => swagger.paths[p]['delete']);

    expect(hasPost).toBeTruthy();
    expect(hasDelete).toBeTruthy();
  });

  test('TeamMemberDto should include email and role fields', async ({ request }) => {
    const response = await request.get('/swagger/v1/swagger.json');
    const swagger = await response.json();

    const teamMemberDto = swagger.components?.schemas?.TeamMemberDto
      ?? swagger.definitions?.TeamMemberDto;
    expect(teamMemberDto).toBeTruthy();

    const properties = teamMemberDto.properties;
    expect(properties).toHaveProperty('email');
    expect(properties).toHaveProperty('role');
  });

  test('should create a team member with email and role via API', async ({ page }) => {
    const teamPage = new TeamPage(page);
    const dialog = new CreateTeamMemberDialog(page);

    await teamPage.goto();
    await teamPage.waitForPage();

    const memberName = `Smoke Test ${Date.now()}`;
    const memberEmail = 'smoke-test@example.com';
    const memberRole = 'Developer';

    await teamPage.clickAddMember();
    await dialog.waitForOpen();

    await dialog.fillName(memberName);
    await dialog.fillEmail(memberEmail);
    await dialog.selectRole(memberRole);

    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/teamMember') && resp.request().method() === 'POST'
    );

    await dialog.clickSave();
    const apiResponse = await responsePromise;

    expect(apiResponse.status()).toBe(200);

    const body = await apiResponse.json();
    expect(body.teamMember).toBeTruthy();
    expect(body.teamMember.name).toBe(memberName);
    expect(body.teamMember.email).toBe(memberEmail);
    expect(body.teamMember.role).toBe(memberRole);

    await dialog.waitForClosed();
  });

  test('should delete the created team member', async ({ page }) => {
    const teamPage = new TeamPage(page);
    const dialog = new CreateTeamMemberDialog(page);

    await teamPage.goto();
    await teamPage.waitForPage();

    const memberName = `Delete Test ${Date.now()}`;

    await teamPage.clickAddMember();
    await dialog.waitForOpen();
    await dialog.fillName(memberName);
    await dialog.fillEmail('delete-test@example.com');
    await dialog.selectRole('Designer');

    const createResponse = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/teamMember') && resp.request().method() === 'POST' && resp.status() === 200
    );
    await dialog.clickSave();
    await createResponse;
    await dialog.waitForClosed();

    await page.waitForTimeout(500);

    const memberRow = teamPage.getMemberRowByName(memberName);
    await expect(memberRow).toBeVisible();

    const editBtn = teamPage.getEditButton(memberRow);
    await editBtn.click();

    const updateDialog = new UpdateTeamMemberDialog(page);
    await updateDialog.waitForOpen();

    const deleteResponse = page.waitForResponse(resp =>
      resp.url().includes('/api/1.0/teamMember') && resp.request().method() === 'DELETE' && resp.status() === 200
    );
    await updateDialog.clickDelete();
    await deleteResponse;
    await updateDialog.waitForClosed();

    await page.waitForTimeout(500);
    await expect(teamPage.getMemberRowByName(memberName)).toHaveCount(0);
  });
});
