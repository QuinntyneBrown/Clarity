import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from './comment.model';
import { baseUrl } from '@core';


@Injectable()
export class CommentService {
  constructor(
    @Inject(baseUrl) private _baseUrl: string,
    private client: HttpClient
  ) { }

  public upsert(options: { comment: Comment }): Observable<{ commentId: number }> {
    return this.client.post<{ commentId: number }>(`${this._baseUrl}api/comment`, { comment: options.comment });
  }
}
