import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TicketStateService } from './ticket-state.service';
import { BASE_URL } from '../constants';
import { TicketState } from '../models/ticket-state';

describe('TicketStateService', () => {
  let service: TicketStateService;
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
    service = TestBed.inject(TicketStateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should send GET request and return ticket states array', () => {
      const mockStates: TicketState[] = [
        { ticketStateId: '1' },
        { ticketStateId: '2' }
      ];

      service.get().subscribe(states => {
        expect(states).toEqual(mockStates);
        expect(states.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/ticketState`);
      expect(req.request.method).toBe('GET');
      req.flush({ ticketStates: mockStates });
    });
  });

  describe('getById', () => {
    it('should send GET request with ticketStateId and return a ticket state', () => {
      const mockState: TicketState = { ticketStateId: '1' };

      service.getById({ ticketStateId: '1' }).subscribe(state => {
        expect(state).toEqual(mockState);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/ticketState/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ ticketState: mockState });
    });
  });

  describe('delete', () => {
    it('should send DELETE request with ticket state id', () => {
      const ticketState: TicketState = { ticketStateId: '1' };

      service.delete({ ticketState }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/ticketState/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('create', () => {
    it('should send POST request with ticketState object', () => {
      const ticketState: TicketState = { ticketStateId: '1' };

      service.create({ ticketState }).subscribe(result => {
        expect(result).toEqual({ ticketStateId: '1' });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/ticketState`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ticketState });
      req.flush({ ticketStateId: '1' });
    });
  });

  describe('update', () => {
    it('should send POST request with ticketState object', () => {
      const ticketState: TicketState = { ticketStateId: '1' };

      service.update({ ticketState }).subscribe(result => {
        expect(result).toEqual({ ticketStateId: '1' });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/ticketState`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ticketState });
      req.flush({ ticketStateId: '1' });
    });
  });
});
