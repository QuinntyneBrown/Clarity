// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl } from '@core';

@Injectable({
  providedIn: 'root'
})
export class LookUpService {
  constructor(
    private readonly _client: HttpClient,
    @Inject(baseUrl) private readonly _baseUrl: string) { 

  }

  public getState(): Observable<Array<any>> {
    return this._client.get<{ states: Array<any> }>(`${this._baseUrl}api/lookup/states`)
      .pipe(
        map(x => x.states)
      );
  }
}

