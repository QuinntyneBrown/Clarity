import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TeamMember } from './team-member.model';
import { baseUrl } from '@core/contants';

@Injectable()
export class TeamMemberService {
  constructor(
    @Inject(baseUrl) private _baseUrl: string,
    private client: HttpClient
  ) { }

  public getCurrent(): Observable<TeamMember> {
    return this.client.get<{ teamMember: TeamMember }>(`${this._baseUrl}api/teamMembers/current`)
      .pipe(
        map(x => x.teamMember)
      );
  }

  public get(): Observable<Array<TeamMember>> {
    return this.client.get<{ teamMembers: Array<TeamMember> }>(`${this._baseUrl}api/teamMembers`)
      .pipe(
        map(x => x.teamMembers)
      );
  }

  public getById(options: { teamMemberId: string }): Observable<TeamMember> {
    return this.client.get<{ teamMember: TeamMember }>(`${this._baseUrl}api/teamMembers/${options.teamMemberId}`)
      .pipe(
        map(x => x.teamMember)
      );
  }

  public remove(options: { teamMember: TeamMember }): Observable<void> {
    return this.client.delete<void>(`${this._baseUrl}api/teamMembers/${options.teamMember.teamMemberId}`);
  }

  public create(options: { teamMember: TeamMember }): Observable<{ teamMemberId: string }> {
    return this.client.post<{ teamMemberId: string }>(`${this._baseUrl}api/teamMembers`, { teamMember: options.teamMember });
  }

  public update(options: { teamMember: TeamMember }): Observable<{ teamMemberId: string }> {
    return this.client.put<{ teamMemberId: string }>(`${this._baseUrl}api/teamMembers`, { teamMember: options.teamMember });
  }
}
