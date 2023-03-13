// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { map, Observable } from 'rxjs';
import { Ticket } from './ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(
    @Inject(BASE_URL) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  public get(): Observable<Array<Ticket>> {
    return this._client.get<{ tickets: Array<Ticket> }>(`${this._baseUrl}api/1.0/ticket`)
      .pipe(
        map(x => x.tickets)
      );
  }

  public getById(options: { ticketId: string }): Observable<Ticket> {
    return this._client.get<{ ticket: Ticket }>(`${this._baseUrl}api/1.0/ticket/${options.ticketId}`)
      .pipe(
        map(x => x.ticket)
      );
  }

  public delete(options: { ticket: Ticket }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/1.0/ticket/${options.ticket.ticketId}`);
  }

  public create(options: { ticket: Ticket }): Observable<{ ticketId: string  }> {    
    return this._client.post<{ ticketId: string }>(`${this._baseUrl}api/1.0/ticket`, { ticket: options.ticket });
  }

  public update(options: { ticket: Ticket }): Observable<{ ticketId: string }> {    
    return this._client.post<{ ticketId: string }>(`${this._baseUrl}api/1.0/ticket`, { ticket: options.ticket });
  }
}
