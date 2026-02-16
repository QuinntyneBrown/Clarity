// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../constants';
import { map, Observable } from 'rxjs';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    @Inject(BASE_URL) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  public get(): Observable<Array<Role>> {
    return this._client.get<{ roles: Array<Role> }>(`${this._baseUrl}api/1.0/role`)
      .pipe(
        map(x => x.roles)
      );
  }

  public getById(options: { roleId: string }): Observable<Role> {
    return this._client.get<{ role: Role }>(`${this._baseUrl}api/1.0/role/${options.roleId}`)
      .pipe(
        map(x => x.role)
      );
  }

  public delete(options: { role: Role }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/1.0/role/${options.role.roleId}`);
  }

  public create(options: { role: Role }): Observable<{ roleId: string }> {
    return this._client.post<{ roleId: string }>(`${this._baseUrl}api/1.0/role`, { role: options.role });
  }

  public update(options: { role: Role }): Observable<{ roleId: string }> {
    return this._client.put<{ roleId: string }>(`${this._baseUrl}api/1.0/role`, { role: options.role });
  }
}
