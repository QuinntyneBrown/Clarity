import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ticket } from './ticket.model';
import { baseUrl } from '@core';

@Injectable()
export class TicketService {

  constructor(
    @Inject(baseUrl) private _baseUrl: string,
    private client: HttpClient
  ) { }

  public get(): Observable<Array<Ticket>> {
    return this.client.get<{ tickets: Array<Ticket> }>(`${this._baseUrl}api/ticket`)
      .pipe(
        map(x => x.tickets)
      );
  }

  public getById(options: { ticketId: number }): Observable<Ticket> {
    return this.client.get<{ ticket: Ticket }>(`${this._baseUrl}api/ticket/${options.ticketId}`)
      .pipe(
        map(x => x.ticket)
      );
  }

  public getByBoardId(options: { boardId: number }): Observable<Ticket[]> {
    return this.client.get<{ tickets: Ticket[]}>(`${this._baseUrl}api/ticket/board/${options.boardId}`)
      .pipe(
        map(x => x.tickets)
      );
  }

  public getByBoardName(options: { name: string }): Observable<Ticket[]> {
    return this.client.get<{ tickets: Ticket[]}>(`${this._baseUrl}api/ticket/board/name/${options.name}`)
      .pipe(
        map(x => x.tickets)
      );
  }  

  public getByName(options: { name: string }): Observable<Ticket> {
    return this.client.get<{ ticket: Ticket }>(`${this._baseUrl}api/ticket/${options.name}`)
      .pipe(
        map(x => x.ticket)
      );
  }

  public remove(options: { ticket: Ticket }): Observable<void> {
    return this.client.delete<void>(`${this._baseUrl}api/ticket/${options.ticket.ticketId}`);
  }

  public create(options: { ticket: Ticket }): Observable<{ ticketId: number }> {
    return this.client.post<{ ticketId: number }>(`${this._baseUrl}api/ticket`, { ticket: options.ticket });
  }

  public update(options: { ticket: Ticket }): Observable<{ ticketId: number }> {
    return this.client.put<{ ticketId: number }>(`${this._baseUrl}api/ticket`, { ticket: options.ticket });
  }
}
