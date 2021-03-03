import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LookUpService {

  constructor(
    private readonly _client: HttpClient,
    @Inject("BASE_URL") private readonly _baseUrl: string) { 

  }

  public getState(): Observable<Array<any>> {
    return this._client.get<{ states: Array<any> }>(`${this._baseUrl}api/lookup/states`)
      .pipe(
        map(x => x.states)
      );
  }
}
