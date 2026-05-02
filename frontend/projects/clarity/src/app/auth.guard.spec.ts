import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '@components';

describe('authGuard (clarity)', () => {
  let authServiceMock: Partial<AuthService>;
  let routerMock: jest.Mocked<Pick<Router, 'createUrlTree'>>;
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = {};
    routerMock = {
      createUrlTree: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    });
  });

  it('should return true when user is authenticated', () => {
    Object.defineProperty(authServiceMock, 'isAuthenticated', { get: () => true });

    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(result).toBe(true);
  });

  it('should return a UrlTree to /login when user is not authenticated', () => {
    Object.defineProperty(authServiceMock, 'isAuthenticated', { get: () => false });
    const urlTree = new UrlTree();
    routerMock.createUrlTree.mockReturnValue(urlTree);

    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(urlTree);
  });

  it('should not create a UrlTree when user is authenticated', () => {
    Object.defineProperty(authServiceMock, 'isAuthenticated', { get: () => true, configurable: true });

    TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });
});
