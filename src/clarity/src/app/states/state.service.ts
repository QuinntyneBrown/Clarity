import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from './state.model';

@Injectable()
export class StateService {

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
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
}
