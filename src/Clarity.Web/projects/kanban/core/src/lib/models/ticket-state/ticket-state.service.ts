// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { map, Observable } from 'rxjs';
import { TicketState } from './ticket-state';

@Injectable({
  providedIn: 'root'
})
export class TicketStateService {

  constructor(
    @Inject(BASE_URL) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  public get(): Observable<Array<TicketState>> {
    return this._client.get<{ ticketStates: Array<TicketState> }>(`${this._baseUrl}api/1.0/ticketState`)
      .pipe(
        map(x => x.ticketStates)
      );
  }

  public getById(options: { ticketStateId: string }): Observable<TicketState> {
    return this._client.get<{ ticketState: TicketState }>(`${this._baseUrl}api/1.0/ticketState/${options.ticketStateId}`)
      .pipe(
        map(x => x.ticketState)
      );
  }

  public delete(options: { ticketState: TicketState }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/1.0/ticketState/${options.ticketState.ticketStateId}`);
  }

  public create(options: { ticketState: TicketState }): Observable<{ ticketStateId: string  }> {    
    return this._client.post<{ ticketStateId: string }>(`${this._baseUrl}api/1.0/ticketState`, { ticketState: options.ticketState });
  }

  public update(options: { ticketState: TicketState }): Observable<{ ticketStateId: string }> {    
    return this._client.post<{ ticketStateId: string }>(`${this._baseUrl}api/1.0/ticketState`, { ticketState: options.ticketState });
  }
}
