import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from './comment.model';

@Injectable()
export class CommentService {
  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private client: HttpClient
  ) { }

  public upsert(options: { comment: Comment }): Observable<{ commentId: number }> {
    return this.client.post<{ commentId: number }>(`${this.baseUrl}api/comments`, { comment: options.comment });
  }
}
