import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from './state.model';

@Injectable()
export class StateService {
  private baseUrl: string;

  constructor(
    private client: HttpClient
  ) { }

  public get(): Observable<Array<State>> {
    return this.client.get<{ states: Array<State> }>(`${this.baseUrl}api/states`)
      .pipe(
        map(x => x.states)
      );
  }

  public getById(options: { stateId: string }): Observable<State> {
    return this.client.get<{ state: State }>(`${this.baseUrl}api/states/${options.stateId}`)
      .pipe(
        map(x => x.state)
      );
  }

  public remove(options: { state: State }): Observable<void> {
    return this.client.delete<void>(`${this.baseUrl}api/states/${options.state.stateId}`);
  }

  public create(options: { state: State }): Observable<{ stateId: string }> {
    return this.client.post<{ stateId: string }>(`${this.baseUrl}api/states`, { state: options.state });
  }

  public update(options: { state: State }): Observable<{ stateId: string }> {
    return this.client.put<{ stateId: string }>(`${this.baseUrl}api/states`, { state: options.state });
  }
}
