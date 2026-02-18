// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../constants';
import { map, Observable } from 'rxjs';
import { Initiative, InitiativeReport } from '../models/initiative';

@Injectable({
  providedIn: 'root'
})
export class InitiativeService {

  constructor(
    @Inject(BASE_URL) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  public get(): Observable<Array<Initiative>> {
    return this._client.get<{ initiatives: Array<Initiative> }>(`${this._baseUrl}api/1.0/initiative`)
      .pipe(
        map(x => x.initiatives)
      );
  }

  public getById(options: { initiativeId: string }): Observable<Initiative> {
    return this._client.get<{ initiative: Initiative }>(`${this._baseUrl}api/1.0/initiative/${options.initiativeId}`)
      .pipe(
        map(x => x.initiative)
      );
  }

  public delete(options: { initiative: Initiative }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/1.0/initiative/${options.initiative.initiativeId}`);
  }

  public create(options: { initiative: Initiative }): Observable<{ initiative: Initiative }> {
    return this._client.post<{ initiative: Initiative }>(`${this._baseUrl}api/1.0/initiative`, { initiative: options.initiative });
  }

  public update(options: { initiative: Initiative }): Observable<{ initiative: Initiative }> {
    return this._client.put<{ initiative: Initiative }>(`${this._baseUrl}api/1.0/initiative`, { initiative: options.initiative });
  }

  public getReport(options: { initiativeId: string }): Observable<InitiativeReport> {
    return this._client.get<{ report: InitiativeReport }>(`${this._baseUrl}api/1.0/initiative/${options.initiativeId}/report`)
      .pipe(
        map(x => x.report)
      );
  }

  public getReports(): Observable<Array<InitiativeReport>> {
    return this._client.get<{ reports: Array<InitiativeReport> }>(`${this._baseUrl}api/1.0/initiative/reports`)
      .pipe(
        map(x => x.reports)
      );
  }
}
