// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { map, Observable } from 'rxjs';
import { TeamMember } from './team-member';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {

  constructor(
    @Inject(BASE_URL) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  public get(): Observable<Array<TeamMember>> {
    return this._client.get<{ teamMembers: Array<TeamMember> }>(`${this._baseUrl}api/1.0/teamMember`)
      .pipe(
        map(x => x.teamMembers)
      );
  }

  public getById(options: { teamMemberId: string }): Observable<TeamMember> {
    return this._client.get<{ teamMember: TeamMember }>(`${this._baseUrl}api/1.0/teamMember/${options.teamMemberId}`)
      .pipe(
        map(x => x.teamMember)
      );
  }

  public delete(options: { teamMember: TeamMember }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/1.0/teamMember/${options.teamMember.teamMemberId}`);
  }

  public create(options: { teamMember: TeamMember }): Observable<{ teamMemberId: string  }> {    
    return this._client.post<{ teamMemberId: string }>(`${this._baseUrl}api/1.0/teamMember`, { teamMember: options.teamMember });
  }

  public update(options: { teamMember: TeamMember }): Observable<{ teamMemberId: string }> {    
    return this._client.post<{ teamMemberId: string }>(`${this._baseUrl}api/1.0/teamMember`, { teamMember: options.teamMember });
  }
}
