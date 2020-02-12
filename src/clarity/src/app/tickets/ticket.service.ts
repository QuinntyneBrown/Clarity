import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ticket } from './ticket.model';

@Injectable()
export class TicketService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private client: HttpClient
  ) { }

  public get(): Observable<Array<Ticket>> {
    return this.client.get<{ tickets: Array<Ticket> }>(`${this.baseUrl}api/tickets`)
      .pipe(
        map(x => x.tickets)
      );
  }

  public getById(options: { ticketId: number }): Observable<Ticket> {
    return this.client.get<{ ticket: Ticket }>(`${this.baseUrl}api/tickets/${options.ticketId}`)
      .pipe(
        map(x => x.ticket)
      );
  }

  public remove(options: { ticket: Ticket }): Observable<void> {
    return this.client.delete<void>(`${this.baseUrl}api/tickets/${options.ticket.ticketId}`);
  }

  public create(options: { ticket: Ticket }): Observable<{ ticketId: number }> {
    return this.client.post<{ ticketId: number }>(`${this.baseUrl}api/tickets`, { ticket: options.ticket });
  }

  public update(options: { ticket: Ticket }): Observable<{ ticketId: number }> {
    return this.client.put<{ ticketId: number }>(`${this.baseUrl}api/tickets`, { ticket: options.ticket });
  }
}
