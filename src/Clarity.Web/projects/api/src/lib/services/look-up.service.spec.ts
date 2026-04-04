import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LookUpService } from './look-up.service';
import { BASE_URL } from '../constants';
import { State } from '../models/state';

describe('LookUpService', () => {
  let service: LookUpService;
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
    service = TestBed.inject(LookUpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getStates', () => {
    it('should send GET request and return states array', () => {
      const mockStates: State[] = [
        { id: '1', name: 'Active' },
        { id: '2', name: 'Inactive' }
      ];

      service.getStates().subscribe(states => {
        expect(states).toEqual(mockStates);
        expect(states.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/lookup/states`);
      expect(req.request.method).toBe('GET');
      req.flush({ states: mockStates });
    });

    it('should return empty array when no states exist', () => {
      service.getStates().subscribe(states => {
        expect(states).toEqual([]);
        expect(states.length).toBe(0);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/lookup/states`);
      req.flush({ states: [] });
    });
  });
});
