// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { map, Observable, tap } from 'rxjs';
import { BoardState } from './board-state';

@Injectable({
  providedIn: 'root'
})
export class BoardStateService {

  constructor(
    @Inject(BASE_URL) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  public get(): Observable<Array<BoardState>> {
    return this._client.get<{ states: Array<BoardState> }>(`${this._baseUrl}api/1.0/boardState`)
      .pipe(
        map(x => x.states)
      );
  }

  public getById(options: { boardStateId: string }): Observable<BoardState> {
    return this._client.get<{ boardState: BoardState }>(`${this._baseUrl}api/1.0/boardState/${options.boardStateId}`)
      .pipe(
        map(x => x.boardState)
      );
  }

  public delete(options: { boardState: BoardState }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/1.0/boardState/${options.boardState.boardStateId}`);
  }

  public create(options: { boardState: BoardState }): Observable<{ boardStateId: string  }> {    
    return this._client.post<{ boardStateId: string }>(`${this._baseUrl}api/1.0/boardState`, { boardState: options.boardState });
  }

  public update(options: { boardState: BoardState }): Observable<{ boardStateId: string }> {    
    return this._client.post<{ boardStateId: string }>(`${this._baseUrl}api/1.0/boardState`, { boardState: options.boardState });
  }
}
