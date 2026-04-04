import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PrivilegeService } from './privilege.service';
import { BASE_URL } from '../constants';
import { Privilege } from '../models/privilege';

describe('PrivilegeService', () => {
  let service: PrivilegeService;
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
    service = TestBed.inject(PrivilegeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should send GET request and return privileges array', () => {
      const mockPrivileges: Privilege[] = [
        { privilegeId: '1', accessRight: 'Read' },
        { privilegeId: '2', accessRight: 'Write' }
      ];

      service.get().subscribe(privileges => {
        expect(privileges).toEqual(mockPrivileges);
        expect(privileges.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/privilege`);
      expect(req.request.method).toBe('GET');
      req.flush({ privileges: mockPrivileges });
    });
  });

  describe('getById', () => {
    it('should send GET request with privilegeId and return a privilege', () => {
      const mockPrivilege: Privilege = { privilegeId: '1', accessRight: 'Read' };

      service.getById({ privilegeId: '1' }).subscribe(privilege => {
        expect(privilege).toEqual(mockPrivilege);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/privilege/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ privilege: mockPrivilege });
    });
  });

  describe('delete', () => {
    it('should send DELETE request with privilege id', () => {
      const privilege: Privilege = { privilegeId: '1', accessRight: 'Read' };

      service.delete({ privilege }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/privilege/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('create', () => {
    it('should send POST request with privilege object', () => {
      const privilege: Privilege = { accessRight: 'Read' };

      service.create({ privilege }).subscribe(result => {
        expect(result).toEqual({ privilegeId: '1' });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/privilege`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ privilege });
      req.flush({ privilegeId: '1' });
    });
  });

  describe('update', () => {
    it('should send PUT request with privilege object', () => {
      const privilege: Privilege = { privilegeId: '1', accessRight: 'Write' };

      service.update({ privilege }).subscribe(result => {
        expect(result).toEqual({ privilegeId: '1' });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/privilege`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ privilege });
      req.flush({ privilegeId: '1' });
    });
  });
});
