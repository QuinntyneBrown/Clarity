// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BoardState } from './board-state.model';
import { baseUrl } from '@core';

@Injectable({
  providedIn:"root"
})
export class BoardStateService {

  constructor(
    @Inject(baseUrl) private baseUrl: string,
    private client: HttpClient
  ) { }

  public get(): Observable<Array<BoardState>> {
    return this.client.get<{ boardStates: Array<BoardState> }>(`${this.baseUrl}api/boardstate`)
      .pipe(
        map(x => x.boardStates)
      );
  }

  public getById(options: { boardStateId: string }): Observable<BoardState> {
    return this.client.get<{ boardState: BoardState }>(`${this.baseUrl}api/boardstate/${options.boardStateId}`)
      .pipe(
        map(x => x.boardState)
      );
  }
}

