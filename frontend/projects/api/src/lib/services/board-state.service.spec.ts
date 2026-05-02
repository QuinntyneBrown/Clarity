import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BoardStateService } from './board-state.service';
import { BASE_URL } from '../constants';
import { BoardState } from '../models/board-state';

describe('BoardStateService', () => {
  let service: BoardStateService;
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
    service = TestBed.inject(BoardStateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should send GET request and return states array', () => {
      const mockStates: BoardState[] = [
        { boardStateId: '1', name: 'Todo', type: 0, tickets: [] },
        { boardStateId: '2', name: 'Done', type: 1, tickets: [] }
      ];

      service.get().subscribe(states => {
        expect(states).toEqual(mockStates);
        expect(states.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/boardState`);
      expect(req.request.method).toBe('GET');
      req.flush({ states: mockStates });
    });
  });

  describe('getById', () => {
    it('should send GET request with boardStateId and return a board state', () => {
      const mockState: BoardState = { boardStateId: '1', name: 'Todo', type: 0, tickets: [] };

      service.getById({ boardStateId: '1' }).subscribe(state => {
        expect(state).toEqual(mockState);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/boardState/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ boardState: mockState });
    });
  });

  describe('delete', () => {
    it('should send DELETE request with board state id', () => {
      const boardState: BoardState = { boardStateId: '1', name: 'Todo', type: 0, tickets: [] };

      service.delete({ boardState }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/boardState/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('create', () => {
    it('should send POST request with boardState object', () => {
      const boardState: BoardState = { name: 'New State', type: 0, tickets: [] };

      service.create({ boardState }).subscribe(result => {
        expect(result).toEqual({ boardStateId: '1' });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/boardState`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ boardState });
      req.flush({ boardStateId: '1' });
    });
  });

  describe('update', () => {
    it('should send POST request with boardState object', () => {
      const boardState: BoardState = { boardStateId: '1', name: 'Updated', type: 1, tickets: [] };

      service.update({ boardState }).subscribe(result => {
        expect(result).toEqual({ boardStateId: '1' });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/boardState`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ boardState });
      req.flush({ boardStateId: '1' });
    });
  });
});
