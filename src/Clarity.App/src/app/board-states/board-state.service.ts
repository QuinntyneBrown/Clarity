import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BoardState } from './board-state.model';

@Injectable()
export class BoardStateService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private client: HttpClient
  ) { }

  public get(): Observable<Array<BoardState>> {
    return this.client.get<{ boardStates: Array<BoardState> }>(`${this.baseUrl}api/board-states`)
      .pipe(
        map(x => x.boardStates)
      );
  }

  public getById(options: { boardStateId: string }): Observable<BoardState> {
    return this.client.get<{ boardState: BoardState }>(`${this.baseUrl}api/board-states/${options.boardStateId}`)
      .pipe(
        map(x => x.boardState)
      );
  }
}
