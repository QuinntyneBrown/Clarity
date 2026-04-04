import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceMock: jest.Mocked<Pick<AuthService, 'accessToken' | 'logout'>>;
  let routerMock: jest.Mocked<Pick<Router, 'navigate'>>;

  beforeEach(() => {
    authServiceMock = {
      accessToken: null as any,
      logout: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when token exists', () => {
    Object.defineProperty(authServiceMock, 'accessToken', { get: () => 'test-token', configurable: true });

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({});
  });

  it('should NOT add Authorization header when no token', () => {
    Object.defineProperty(authServiceMock, 'accessToken', { get: () => null, configurable: true });

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should call logout and navigate to /login on 401 error', () => {
    Object.defineProperty(authServiceMock, 'accessToken', { get: () => 'test-token', configurable: true });

    let error: HttpErrorResponse | undefined;
    httpClient.get('/api/test').subscribe({
      error: (e) => { error = e; }
    });

    const req = httpMock.expectOne('/api/test');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    expect(error).toBeTruthy();
    expect(error!.status).toBe(401);
  });

  it('should re-throw non-401 errors without calling logout', () => {
    Object.defineProperty(authServiceMock, 'accessToken', { get: () => 'test-token', configurable: true });

    let error: HttpErrorResponse | undefined;
    httpClient.get('/api/test').subscribe({
      error: (e) => { error = e; }
    });

    const req = httpMock.expectOne('/api/test');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(authServiceMock.logout).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(error).toBeTruthy();
    expect(error!.status).toBe(500);
  });

  it('should re-throw 403 errors without calling logout', () => {
    Object.defineProperty(authServiceMock, 'accessToken', { get: () => 'test-token', configurable: true });

    let error: HttpErrorResponse | undefined;
    httpClient.get('/api/test').subscribe({
      error: (e) => { error = e; }
    });

    const req = httpMock.expectOne('/api/test');
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

    expect(authServiceMock.logout).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(error).toBeTruthy();
    expect(error!.status).toBe(403);
  });
});
