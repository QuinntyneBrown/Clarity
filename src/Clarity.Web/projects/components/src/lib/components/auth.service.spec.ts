import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService, AuthenticateResponse } from './auth.service';
import { BASE_URL } from '@api';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://test.com/';

  let localStorageMock: Record<string, string>;
  let sessionStorageMock: Record<string, string>;

  beforeEach(() => {
    localStorageMock = {};
    sessionStorageMock = {};

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key: string) {
      if (this === localStorage) {
        return localStorageMock[key] ?? null;
      }
      return sessionStorageMock[key] ?? null;
    });

    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key: string, value: string) {
      if (this === localStorage) {
        localStorageMock[key] = value;
      } else {
        sessionStorageMock[key] = value;
      }
    });

    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(function (this: Storage, key: string) {
      if (this === localStorage) {
        delete localStorageMock[key];
      } else {
        delete sessionStorageMock[key];
      }
    });

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BASE_URL, useValue: baseUrl }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      expect(service.isAuthenticated).toBe(false);
    });

    it('should return true when token is in localStorage', () => {
      localStorageMock['clarity_access_token'] = 'some-token';
      expect(service.isAuthenticated).toBe(true);
    });

    it('should return true when token is in sessionStorage', () => {
      sessionStorageMock['clarity_access_token'] = 'some-token';
      expect(service.isAuthenticated).toBe(true);
    });
  });

  describe('accessToken', () => {
    it('should return null when no token exists', () => {
      expect(service.accessToken).toBeNull();
    });

    it('should read from localStorage first', () => {
      localStorageMock['clarity_access_token'] = 'local-token';
      sessionStorageMock['clarity_access_token'] = 'session-token';
      expect(service.accessToken).toBe('local-token');
    });

    it('should fall back to sessionStorage when not in localStorage', () => {
      sessionStorageMock['clarity_access_token'] = 'session-token';
      expect(service.accessToken).toBe('session-token');
    });
  });

  describe('userId', () => {
    it('should return null when no userId exists', () => {
      expect(service.userId).toBeNull();
    });

    it('should read from localStorage first', () => {
      localStorageMock['clarity_user_id'] = 'local-user';
      sessionStorageMock['clarity_user_id'] = 'session-user';
      expect(service.userId).toBe('local-user');
    });

    it('should fall back to sessionStorage when not in localStorage', () => {
      sessionStorageMock['clarity_user_id'] = 'session-user';
      expect(service.userId).toBe('session-user');
    });
  });

  describe('rememberedUsername', () => {
    it('should return null when not set', () => {
      expect(service.rememberedUsername).toBeNull();
    });

    it('should read from localStorage', () => {
      localStorageMock['clarity_remembered_username'] = 'testuser';
      expect(service.rememberedUsername).toBe('testuser');
    });
  });

  describe('isRememberMe', () => {
    it('should return false when not set', () => {
      expect(service.isRememberMe).toBe(false);
    });

    it('should return true when set to "true" in localStorage', () => {
      localStorageMock['clarity_remember_me'] = 'true';
      expect(service.isRememberMe).toBe(true);
    });

    it('should return false when set to any other value', () => {
      localStorageMock['clarity_remember_me'] = 'false';
      expect(service.isRememberMe).toBe(false);
    });
  });

  describe('authenticate', () => {
    const mockResponse: AuthenticateResponse = {
      accessToken: 'test-access-token',
      userId: 'test-user-id'
    };

    it('should POST to the correct URL', () => {
      service.authenticate('user', 'pass').subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/user/token`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'user', password: 'pass' });
      req.flush(mockResponse);
    });

    it('should store in localStorage and remove from sessionStorage when rememberMe is true', () => {
      service.authenticate('user', 'pass', true).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/user/token`);
      req.flush(mockResponse);

      expect(localStorageMock['clarity_access_token']).toBe('test-access-token');
      expect(localStorageMock['clarity_user_id']).toBe('test-user-id');
      expect(localStorageMock['clarity_remember_me']).toBe('true');
      expect(localStorageMock['clarity_remembered_username']).toBe('user');
      expect(sessionStorageMock['clarity_access_token']).toBeUndefined();
      expect(sessionStorageMock['clarity_user_id']).toBeUndefined();
    });

    it('should store in sessionStorage and remove from localStorage when rememberMe is false', () => {
      service.authenticate('user', 'pass', false).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/user/token`);
      req.flush(mockResponse);

      expect(sessionStorageMock['clarity_access_token']).toBe('test-access-token');
      expect(sessionStorageMock['clarity_user_id']).toBe('test-user-id');
      expect(localStorageMock['clarity_access_token']).toBeUndefined();
      expect(localStorageMock['clarity_user_id']).toBeUndefined();
      expect(localStorageMock['clarity_remember_me']).toBeUndefined();
      expect(localStorageMock['clarity_remembered_username']).toBeUndefined();
    });

    it('should default rememberMe to false', () => {
      service.authenticate('user', 'pass').subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/user/token`);
      req.flush(mockResponse);

      expect(sessionStorageMock['clarity_access_token']).toBe('test-access-token');
      expect(localStorageMock['clarity_access_token']).toBeUndefined();
    });

    it('should propagate errors', () => {
      let error: any;
      service.authenticate('user', 'pass').subscribe({
        error: (e) => { error = e; }
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/user/token`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(error).toBeTruthy();
      expect(error.status).toBe(401);
    });
  });

  describe('logout', () => {
    it('should remove all keys from both localStorage and sessionStorage', () => {
      localStorageMock['clarity_access_token'] = 'token';
      localStorageMock['clarity_user_id'] = 'user';
      localStorageMock['clarity_remember_me'] = 'true';
      localStorageMock['clarity_remembered_username'] = 'testuser';
      sessionStorageMock['clarity_access_token'] = 'token';
      sessionStorageMock['clarity_user_id'] = 'user';

      service.logout();

      expect(localStorageMock['clarity_access_token']).toBeUndefined();
      expect(localStorageMock['clarity_user_id']).toBeUndefined();
      expect(localStorageMock['clarity_remember_me']).toBeUndefined();
      expect(localStorageMock['clarity_remembered_username']).toBeUndefined();
      expect(sessionStorageMock['clarity_access_token']).toBeUndefined();
      expect(sessionStorageMock['clarity_user_id']).toBeUndefined();
    });
  });
});
