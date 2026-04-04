import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { BASE_URL } from '../constants';
import { Comment } from '../models/comment';

describe('CommentService', () => {
  let service: CommentService;
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
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should send GET request and return comments array', () => {
      const mockComments: Comment[] = [
        { commentId: '1', ticketId: 't1', teamMemberId: 'tm1', description: 'Test', created: new Date() },
        { commentId: '2', ticketId: 't1', teamMemberId: 'tm2', description: 'Test 2', created: new Date() }
      ];

      service.get().subscribe(comments => {
        expect(comments).toEqual(mockComments);
        expect(comments.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/comment`);
      expect(req.request.method).toBe('GET');
      req.flush({ comments: mockComments });
    });
  });

  describe('getById', () => {
    it('should send GET request with commentId and return a comment', () => {
      const mockComment: Comment = { commentId: '1', ticketId: 't1', teamMemberId: 'tm1', description: 'Test', created: new Date() };

      service.getById({ commentId: '1' }).subscribe(comment => {
        expect(comment).toEqual(mockComment);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/comment/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ comment: mockComment });
    });
  });

  describe('delete', () => {
    it('should send DELETE request with comment id', () => {
      const comment: Comment = { commentId: '1', ticketId: 't1', teamMemberId: 'tm1', description: 'Test', created: new Date() };

      service.delete({ comment }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/comment/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('create', () => {
    it('should send POST request with comment object', () => {
      const comment: Comment = { ticketId: 't1', teamMemberId: 'tm1', description: 'New', created: new Date() };

      service.create({ comment }).subscribe(result => {
        expect(result).toEqual({ commentId: '1' });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/comment`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ comment });
      req.flush({ commentId: '1' });
    });
  });

  describe('update', () => {
    it('should send POST request with comment object', () => {
      const comment: Comment = { commentId: '1', ticketId: 't1', teamMemberId: 'tm1', description: 'Updated', created: new Date() };

      service.update({ comment }).subscribe(result => {
        expect(result).toEqual({ commentId: '1' });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/comment`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ comment });
      req.flush({ commentId: '1' });
    });
  });
});
