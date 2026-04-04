import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TeamMemberService } from './team-member.service';
import { BASE_URL } from '../constants';
import { TeamMember } from '../models/team-member';

describe('TeamMemberService', () => {
  let service: TeamMemberService;
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
    service = TestBed.inject(TeamMemberService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should send GET request and return team members array', () => {
      const mockMembers: TeamMember[] = [
        { teamMemberId: '1', name: 'John' },
        { teamMemberId: '2', name: 'Jane' }
      ];

      service.get().subscribe(members => {
        expect(members).toEqual(mockMembers);
        expect(members.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/teamMember`);
      expect(req.request.method).toBe('GET');
      req.flush({ teamMembers: mockMembers });
    });
  });

  describe('getById', () => {
    it('should send GET request with teamMemberId and return a team member', () => {
      const mockMember: TeamMember = { teamMemberId: '1', name: 'John' };

      service.getById({ teamMemberId: '1' }).subscribe(member => {
        expect(member).toEqual(mockMember);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/teamMember/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ teamMember: mockMember });
    });
  });

  describe('delete', () => {
    it('should send DELETE request with team member id', () => {
      const teamMember: TeamMember = { teamMemberId: '1', name: 'John' };

      service.delete({ teamMember }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/teamMember/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('create', () => {
    it('should send POST request with teamMember object', () => {
      const teamMember: TeamMember = { name: 'New Member' };
      const response = { teamMember: { teamMemberId: '1', name: 'New Member' } as TeamMember };

      service.create({ teamMember }).subscribe(result => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/teamMember`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ teamMember });
      req.flush(response);
    });
  });

  describe('update', () => {
    it('should send POST request with teamMember object', () => {
      const teamMember: TeamMember = { teamMemberId: '1', name: 'Updated Member' };
      const response = { teamMember };

      service.update({ teamMember }).subscribe(result => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/teamMember`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ teamMember });
      req.flush(response);
    });
  });
});
