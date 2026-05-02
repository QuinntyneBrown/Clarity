import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { InitiativeService } from './initiative.service';
import { BASE_URL } from '../constants';
import { Initiative, InitiativeReport } from '../models/initiative';

describe('InitiativeService', () => {
  let service: InitiativeService;
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
    service = TestBed.inject(InitiativeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should send GET request and return initiatives array', () => {
      const mockInitiatives: Initiative[] = [
        { initiativeId: '1', name: 'Initiative 1' },
        { initiativeId: '2', name: 'Initiative 2' }
      ];

      service.get().subscribe(initiatives => {
        expect(initiatives).toEqual(mockInitiatives);
        expect(initiatives.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/initiative`);
      expect(req.request.method).toBe('GET');
      req.flush({ initiatives: mockInitiatives });
    });
  });

  describe('getById', () => {
    it('should send GET request with initiativeId and return an initiative', () => {
      const mockInitiative: Initiative = { initiativeId: '1', name: 'Initiative 1' };

      service.getById({ initiativeId: '1' }).subscribe(initiative => {
        expect(initiative).toEqual(mockInitiative);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/initiative/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ initiative: mockInitiative });
    });
  });

  describe('delete', () => {
    it('should send DELETE request with initiative id', () => {
      const initiative: Initiative = { initiativeId: '1', name: 'Initiative 1' };

      service.delete({ initiative }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/initiative/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('create', () => {
    it('should send POST request with initiative object directly as body', () => {
      const initiative: Initiative = { name: 'New Initiative' };
      const response = { initiative: { initiativeId: '1', name: 'New Initiative' } as Initiative };

      service.create({ initiative }).subscribe(result => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/initiative`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(initiative);
      req.flush(response);
    });
  });

  describe('update', () => {
    it('should send PUT request with initiative object directly as body', () => {
      const initiative: Initiative = { initiativeId: '1', name: 'Updated Initiative' };
      const response = { initiative };

      service.update({ initiative }).subscribe(result => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/initiative`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(initiative);
      req.flush(response);
    });
  });

  describe('getReport', () => {
    it('should send GET request and return a report', () => {
      const mockReport: InitiativeReport = { initiativeId: '1', name: 'Report 1', totalTickets: 10 };

      service.getReport({ initiativeId: '1' }).subscribe(report => {
        expect(report).toEqual(mockReport);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/initiative/1/report`);
      expect(req.request.method).toBe('GET');
      req.flush({ report: mockReport });
    });
  });

  describe('getReports', () => {
    it('should send GET request and return reports array', () => {
      const mockReports: InitiativeReport[] = [
        { initiativeId: '1', name: 'Report 1', totalTickets: 10 },
        { initiativeId: '2', name: 'Report 2', totalTickets: 5 }
      ];

      service.getReports().subscribe(reports => {
        expect(reports).toEqual(mockReports);
        expect(reports.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/initiative/reports`);
      expect(req.request.method).toBe('GET');
      req.flush({ reports: mockReports });
    });
  });

  describe('attachFile', () => {
    it('should send POST request with empty body to the correct URL', () => {
      service.attachFile({ initiativeId: '1', digitalAssetId: 'a1' }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/initiative/1/attachments/a1`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(null);
    });
  });

  describe('detachFile', () => {
    it('should send DELETE request to the correct URL', () => {
      service.detachFile({ initiativeId: '1', digitalAssetId: 'a1' }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/initiative/1/attachments/a1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
