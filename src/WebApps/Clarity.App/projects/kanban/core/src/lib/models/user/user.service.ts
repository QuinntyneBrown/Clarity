// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { map, Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    @Inject(BASE_URL) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  public get(): Observable<Array<User>> {
    return this._client.get<{ users: Array<User> }>(`${this._baseUrl}api/1.0/user`)
      .pipe(
        map(x => x.users)
      );
  }

  public getById(options: { userId: string }): Observable<User> {
    return this._client.get<{ user: User }>(`${this._baseUrl}api/1.0/user/${options.userId}`)
      .pipe(
        map(x => x.user)
      );
  }

  public delete(options: { user: User }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/1.0/user/${options.user.userId}`);
  }

  public create(options: { user: User }): Observable<{ userId: string  }> {    
    return this._client.post<{ userId: string }>(`${this._baseUrl}api/1.0/user`, { user: options.user });
  }

  public update(options: { user: User }): Observable<{ userId: string }> {    
    return this._client.post<{ userId: string }>(`${this._baseUrl}api/1.0/user`, { user: options.user });
  }
}
