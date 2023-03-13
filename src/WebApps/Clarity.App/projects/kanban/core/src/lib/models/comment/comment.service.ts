// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { map, Observable } from 'rxjs';
import { Comment } from './comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    @Inject(BASE_URL) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  public get(): Observable<Array<Comment>> {
    return this._client.get<{ comments: Array<Comment> }>(`${this._baseUrl}api/1.0/comment`)
      .pipe(
        map(x => x.comments)
      );
  }

  public getById(options: { commentId: string }): Observable<Comment> {
    return this._client.get<{ comment: Comment }>(`${this._baseUrl}api/1.0/comment/${options.commentId}`)
      .pipe(
        map(x => x.comment)
      );
  }

  public delete(options: { comment: Comment }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/1.0/comment/${options.comment.commentId}`);
  }

  public create(options: { comment: Comment }): Observable<{ commentId: string  }> {    
    return this._client.post<{ commentId: string }>(`${this._baseUrl}api/1.0/comment`, { comment: options.comment });
  }

  public update(options: { comment: Comment }): Observable<{ commentId: string }> {    
    return this._client.post<{ commentId: string }>(`${this._baseUrl}api/1.0/comment`, { comment: options.comment });
  }
}
