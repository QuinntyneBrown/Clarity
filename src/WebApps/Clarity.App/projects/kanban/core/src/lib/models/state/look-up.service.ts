// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { map, Observable } from 'rxjs';
import { State } from './state';

@Injectable({
  providedIn: 'root'
})
export class LookUpService {

  constructor(
    @Inject(BASE_URL) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  public getStates(): Observable<Array<State>> {
    return this._client.get<{ states: Array<State> }>(`${this._baseUrl}api/1.0/lookup/states`)
      .pipe(
        map(x => x.states)
      );
  }

}
