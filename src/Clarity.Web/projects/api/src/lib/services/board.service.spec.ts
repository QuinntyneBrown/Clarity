import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BoardService } from './board.service';
import { BASE_URL } from '../constants';
import { Board } from '../models/board';

describe('BoardService', () => {
  let service: BoardService;
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
    service = TestBed.inject(BoardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should send GET request and return boards array', () => {
      const mockBoards: Board[] = [
        { name: 'Board 1', states: [] },
        { name: 'Board 2', states: [] }
      ];

      service.get().subscribe(boards => {
        expect(boards).toEqual(mockBoards);
        expect(boards.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/board`);
      expect(req.request.method).toBe('GET');
      req.flush({ boards: mockBoards });
    });
  });

  describe('getById', () => {
    it('should send GET request with boardId and return a board', () => {
      const mockBoard: Board = { boardId: '1', name: 'Board 1', states: [] };

      service.getById({ boardId: '1' }).subscribe(board => {
        expect(board).toEqual(mockBoard);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/board/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ board: mockBoard });
    });
  });

  describe('getByName', () => {
    it('should send GET request with name and return a board', () => {
      const mockBoard: Board = { boardId: '1', name: 'Sprint', states: [] };

      service.getByName({ name: 'Sprint' }).subscribe(board => {
        expect(board).toEqual(mockBoard);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/board/name/Sprint`);
      expect(req.request.method).toBe('GET');
      req.flush({ board: mockBoard });
    });
  });

  describe('delete', () => {
    it('should send DELETE request with board id', () => {
      const board: Board = { boardId: '1', name: 'Board 1', states: [] };

      service.delete({ board }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/board/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('create', () => {
    it('should send POST request with name', () => {
      const response = { board: { boardId: '1', name: 'New Board', states: [] } as Board };

      service.create({ name: 'New Board' }).subscribe(result => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/board`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ name: 'New Board', states: undefined });
      req.flush(response);
    });

    it('should send POST request with name and states', () => {
      const response = { board: { boardId: '1', name: 'New Board', states: [] } as Board };

      service.create({ name: 'New Board', states: ['Todo', 'Done'] }).subscribe(result => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/board`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ name: 'New Board', states: ['Todo', 'Done'] });
      req.flush(response);
    });
  });

  describe('update', () => {
    it('should send POST request with board object', () => {
      const board: Board = { boardId: '1', name: 'Updated Board', states: [] };

      service.update({ board }).subscribe(result => {
        expect(result).toEqual({ boardId: '1' });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/board`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ board });
      req.flush({ boardId: '1' });
    });
  });

  describe('clone', () => {
    it('should send POST request with boardId and name', () => {
      const response = { board: { boardId: '2', name: 'Cloned', states: [] } as Board };

      service.clone({ boardId: '1', name: 'Cloned' }).subscribe(result => {
        expect(result).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/board/clone`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ boardId: '1', name: 'Cloned' });
      req.flush(response);
    });
  });
});
