// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { map, Observable } from 'rxjs';
import { Board } from './board';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(
    @Inject(BASE_URL) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  public get(): Observable<Array<Board>> {
    return this._client.get<{ boards: Array<Board> }>(`${this._baseUrl}api/1.0/board`)
      .pipe(
        map(x => x.boards)
      );
  }

  public getById(options: { boardId: string }): Observable<Board> {
    return this._client.get<{ board: Board }>(`${this._baseUrl}api/1.0/board/${options.boardId}`)
      .pipe(
        map(x => x.board)
      );
  }

  public getByName(options: { name: string }): Observable<Board> {
    return this._client.get<{ board: Board }>(`${this._baseUrl}api/1.0/board/name/${options.name}`)
      .pipe(
        map(x => x.board)
      );
  }

  public delete(options: { board: Board }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/1.0/board/${options.board.boardId}`);
  }

  public create(options: { board: Board }): Observable<{ boardId: string  }> {    
    return this._client.post<{ boardId: string }>(`${this._baseUrl}api/1.0/board`, { board: options.board });
  }

  public update(options: { board: Board }): Observable<{ boardId: string }> {    
    return this._client.post<{ boardId: string }>(`${this._baseUrl}api/1.0/board`, { board: options.board });
  }
}
