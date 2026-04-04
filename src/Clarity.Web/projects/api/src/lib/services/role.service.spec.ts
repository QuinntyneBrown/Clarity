import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RoleService } from './role.service';
import { BASE_URL } from '../constants';
import { Role } from '../models/role';

describe('RoleService', () => {
  let service: RoleService;
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
    service = TestBed.inject(RoleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should send GET request and return roles array', () => {
      const mockRoles: Role[] = [
        { roleId: '1', name: 'Admin' },
        { roleId: '2', name: 'User' }
      ];

      service.get().subscribe(roles => {
        expect(roles).toEqual(mockRoles);
        expect(roles.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/role`);
      expect(req.request.method).toBe('GET');
      req.flush({ roles: mockRoles });
    });
  });

  describe('getById', () => {
    it('should send GET request with roleId and return a role', () => {
      const mockRole: Role = { roleId: '1', name: 'Admin' };

      service.getById({ roleId: '1' }).subscribe(role => {
        expect(role).toEqual(mockRole);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/role/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ role: mockRole });
    });
  });

  describe('delete', () => {
    it('should send DELETE request with role id', () => {
      const role: Role = { roleId: '1', name: 'Admin' };

      service.delete({ role }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/role/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('create', () => {
    it('should send POST request with role object', () => {
      const role: Role = { name: 'New Role' };

      service.create({ role }).subscribe(result => {
        expect(result).toEqual({ roleId: '1' });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/role`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ role });
      req.flush({ roleId: '1' });
    });
  });

  describe('update', () => {
    it('should send PUT request with role object', () => {
      const role: Role = { roleId: '1', name: 'Updated Role' };

      service.update({ role }).subscribe(result => {
        expect(result).toEqual({ roleId: '1' });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/role`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ role });
      req.flush({ roleId: '1' });
    });
  });
});
