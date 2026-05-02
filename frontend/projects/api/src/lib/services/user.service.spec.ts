import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { BASE_URL } from '../constants';
import { User, UserSettings } from '../models/user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://test.com/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BASE_URL, useValue: baseUrl }
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should send GET request and return users array', () => {
      const mockUsers: User[] = [
        { userId: '1', username: 'john' },
        { userId: '2', username: 'jane' }
      ];

      service.get().subscribe(users => {
        expect(users).toEqual(mockUsers);
        expect(users.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/user`);
      expect(req.request.method).toBe('GET');
      req.flush({ users: mockUsers });
    });
  });

  describe('getById', () => {
    it('should send GET request with userId and return a user', () => {
      const mockUser: User = { userId: '1', username: 'john' };

      service.getById({ userId: '1' }).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/user/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ user: mockUser });
    });
  });

  describe('getCurrentUser', () => {
    it('should send GET request to user endpoint and return current user', () => {
      const mockUser: User = { userId: '1', username: 'current' };

      service.getCurrentUser().subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/user`);
      expect(req.request.method).toBe('GET');
      req.flush({ user: mockUser });
    });
  });

  describe('delete', () => {
    it('should send DELETE request with user id', () => {
      const user: User = { userId: '1', username: 'john' };

      service.delete({ user }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/user/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('create', () => {
    it('should send POST request with user object wrapped in user property', () => {
      const user: User = { username: 'newuser' };

      service.create({ user }).subscribe(result => {
        expect(result).toEqual({ userId: '1' });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/user`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ user });
      req.flush({ userId: '1' });
    });
  });

  describe('update', () => {
    it('should send PUT request with user object directly as body', () => {
      const user: User = { userId: '1', username: 'updated' };
      const response = { user };

      service.update({ user }).subscribe(result => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/user`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(user);
      req.flush(response);
    });
  });

  describe('changePassword', () => {
    it('should send PUT request with old and new password', () => {
      const options = { oldPassword: 'old123', newPassword: 'new456' };

      service.changePassword(options).subscribe(result => {
        expect(result).toEqual({ success: true });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/user/change-password`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(options);
      req.flush({ success: true });
    });
  });

  describe('getSettings', () => {
    it('should send GET request with userId and return user settings', () => {
      const mockSettings: UserSettings = { userSettingsId: 's1', userId: '1', theme: 'dark' };

      service.getSettings({ userId: '1' }).subscribe(settings => {
        expect(settings).toEqual(mockSettings);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/usersettings/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ userSettings: mockSettings });
    });
  });

  describe('updateSettings', () => {
    it('should send PUT request with settings object directly as body', () => {
      const settings: UserSettings = { userSettingsId: 's1', userId: '1', theme: 'light' };
      const response = { userSettings: settings };

      service.updateSettings({ settings }).subscribe(result => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/usersettings`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(settings);
      req.flush(response);
    });
  });
});
