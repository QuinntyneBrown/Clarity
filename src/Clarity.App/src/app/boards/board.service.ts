import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Board } from './board.model';
import { baseUrl } from '@core/contants';

@Injectable()
export class BoardService {
  constructor(
    @Inject(baseUrl) private _baseUrl: string,
    private client: HttpClient
  ) { }

  public get(): Observable<Array<Board>> {
    return this.client.get<{ boards: Array<Board> }>(`${this._baseUrl}api/boards`)
      .pipe(
        map(x => x.boards)
      );
  }

  public getById(options: { boardId: number }): Observable<Board> {
    return this.client.get<{ board: Board }>(`${this._baseUrl}api/boards/${options.boardId}`)
      .pipe(
        map(x => x.board)
      );
  }

  public remove(options: { board: Board }): Observable<void> {
    return this.client.delete<void>(`${this._baseUrl}api/boards/${options.board.boardId}`);
  }

  public create(options: { board: Board }): Observable<{ boardId: number }> {
    return this.client.post<{ boardId: number }>(`${this._baseUrl}api/boards`, { board: options.board });
  }

  public update(options: { board: Board }): Observable<{ boardId: string }> {
    return this.client.put<{ boardId: string }>(`${this._baseUrl}api/boards`, { board: options.board });
  }
}
