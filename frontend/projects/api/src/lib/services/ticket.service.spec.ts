import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TicketService } from './ticket.service';
import { BASE_URL } from '../constants';
import { Ticket } from '../models/ticket';

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://test.com/';

  const mockTicket: Ticket = {
    ticketId: '1',
    name: 'Test Ticket',
    state: 'Todo',
    url: '',
    age: 0,
    description: 'desc',
    acceptanceCriteria: '',
    ticketType: 0,
    storyPoints: 3,
    effort: 1,
    priority: 1,
    boardId: 'b1',
    comments: [],
    digitalAssets: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BASE_URL, useValue: baseUrl }
      ]
    });
    service = TestBed.inject(TicketService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should send GET request and return tickets array', () => {
      const mockTickets = [mockTicket];

      service.get().subscribe(tickets => {
        expect(tickets).toEqual(mockTickets);
        expect(tickets.length).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/ticket`);
      expect(req.request.method).toBe('GET');
      req.flush({ tickets: mockTickets });
    });
  });

  describe('getById', () => {
    it('should send GET request with ticketId and return a ticket', () => {
      service.getById({ ticketId: '1' }).subscribe(ticket => {
        expect(ticket).toEqual(mockTicket);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/ticket/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ ticket: mockTicket });
    });
  });

  describe('getTicketsByBoardId', () => {
    it('should send GET request with boardId and return tickets array', () => {
      const mockTickets = [mockTicket];

      service.getTicketsByBoardId({ boardId: 'b1' }).subscribe(tickets => {
        expect(tickets).toEqual(mockTickets);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/ticket/board/b1`);
      expect(req.request.method).toBe('GET');
      req.flush({ tickets: mockTickets });
    });
  });

  describe('getTicketsByBoardName', () => {
    it('should send GET request with boardName and return tickets array', () => {
      const mockTickets = [mockTicket];

      service.getTicketsByBoardName({ boardName: 'Sprint' }).subscribe(tickets => {
        expect(tickets).toEqual(mockTickets);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/ticket/board/name/Sprint`);
      expect(req.request.method).toBe('GET');
      req.flush({ tickets: mockTickets });
    });
  });

  describe('delete', () => {
    it('should send DELETE request with ticket id', () => {
      service.delete({ ticket: mockTicket }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/ticket/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('create', () => {
    it('should send PUT request to upsert endpoint with ticket object', () => {
      service.create({ ticket: mockTicket }).subscribe(result => {
        expect(result).toEqual({ ticketId: '1' });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/ticket/upsert`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ ticket: mockTicket });
      req.flush({ ticketId: '1' });
    });
  });

  describe('update', () => {
    it('should send PUT request to upsert endpoint with ticket object', () => {
      service.update({ ticket: mockTicket }).subscribe(result => {
        expect(result).toEqual({ ticketId: '1' });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/ticket/upsert`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ ticket: mockTicket });
      req.flush({ ticketId: '1' });
    });
  });

  describe('attachFile', () => {
    it('should send POST request with empty body to the correct URL', () => {
      service.attachFile({ ticketId: '1', digitalAssetId: 'a1' }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/ticket/1/attachments/a1`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(null);
    });
  });

  describe('detachFile', () => {
    it('should send DELETE request to the correct URL', () => {
      service.detachFile({ ticketId: '1', digitalAssetId: 'a1' }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/ticket/1/attachments/a1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
