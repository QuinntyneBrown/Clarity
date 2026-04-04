import { routes } from './app.routes';
import { authGuard } from './auth.guard';

describe('App Routes', () => {
  it('should have a login route', () => {
    const loginRoute = routes.find(r => r.path === 'login');
    expect(loginRoute).toBeDefined();
    expect(loginRoute!.component).toBeDefined();
  });

  it('should have a protected root route with authGuard', () => {
    const rootRoute = routes.find(r => r.path === '');
    expect(rootRoute).toBeDefined();
    expect(rootRoute!.canActivate).toContain(authGuard);
  });

  it('should have children on the root route', () => {
    const rootRoute = routes.find(r => r.path === '');
    expect(rootRoute!.children).toBeDefined();
    expect(rootRoute!.children!.length).toBeGreaterThan(0);
  });

  it('should have dashboard child route', () => {
    const children = routes.find(r => r.path === '')!.children!;
    const dashboard = children.find(c => c.path === 'dashboard');
    expect(dashboard).toBeDefined();
    expect(dashboard!.component).toBeDefined();
  });

  it('should have users child route', () => {
    const children = routes.find(r => r.path === '')!.children!;
    expect(children.find(c => c.path === 'users')).toBeDefined();
  });

  it('should have tickets child route', () => {
    const children = routes.find(r => r.path === '')!.children!;
    expect(children.find(c => c.path === 'tickets')).toBeDefined();
  });

  it('should have boards child route', () => {
    const children = routes.find(r => r.path === '')!.children!;
    expect(children.find(c => c.path === 'boards')).toBeDefined();
  });

  it('should have team-members child route', () => {
    const children = routes.find(r => r.path === '')!.children!;
    expect(children.find(c => c.path === 'team-members')).toBeDefined();
  });

  it('should have roles child route', () => {
    const children = routes.find(r => r.path === '')!.children!;
    expect(children.find(c => c.path === 'roles')).toBeDefined();
  });

  it('should have comments child route', () => {
    const children = routes.find(r => r.path === '')!.children!;
    expect(children.find(c => c.path === 'comments')).toBeDefined();
  });

  it('should have digital-assets child route', () => {
    const children = routes.find(r => r.path === '')!.children!;
    expect(children.find(c => c.path === 'digital-assets')).toBeDefined();
  });

  it('should redirect empty child path to dashboard', () => {
    const children = routes.find(r => r.path === '')!.children!;
    const redirect = children.find(c => c.path === '' && c.redirectTo === 'dashboard');
    expect(redirect).toBeDefined();
    expect(redirect!.pathMatch).toBe('full');
  });
});
