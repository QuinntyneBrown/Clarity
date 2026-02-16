// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject, Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, map, noop, tap, withLatestFrom } from "rxjs";
import { TeamMember } from "./team-member";
import { TeamMemberService } from "./team-member.service";

export interface TeamMemberState {
    teamMembers: TeamMember[]
}

const initialTeamMemberState = {
    teamMembers: []
};

@Injectable({
    providedIn:"root"
})
export class TeamMemberStore extends ComponentStore<TeamMemberState> {
    private  readonly _teamMemberService = inject(TeamMemberService);

    constructor() {
        super(initialTeamMemberState);        
    }

    readonly save = (teamMember:TeamMember, nextFn: {(response:any): void} | null = null, errorFn: {(response:any): void} | null = null) => {        
        
        const apiRequest$ = teamMember.teamMemberId ? this._teamMemberService.update({ teamMember }) : this._teamMemberService.create({ teamMember });
        
        const updateFn = teamMember?.teamMemberId ? ([response, teamMembers]: [any, TeamMember[]]) => this.patchState({

            teamMembers: teamMembers.map(t => response.teamMember.teamMemberId == t.teamMemberId ? response.teamMember : t)
        })
        :(([response, teamMembers]: [any, TeamMember[]]) => this.patchState({ teamMembers: [...teamMembers, response.teamMember ]}));
        
        return this.effect<void>(
            exhaustMap(()=> apiRequest$.pipe(
                withLatestFrom(this.select(x => x.teamMembers)),
                tap(updateFn),
                tapResponse(
                    nextFn || noop,
                    errorFn || noop
                )
            )
        ))();
    }

    readonly delete = this.effect<TeamMember>(
        exhaustMap((teamMember) => this._teamMemberService.delete({ teamMember: teamMember }).pipe( 
            withLatestFrom(this.select(x => x.teamMembers )),           
            tapResponse(
                ([_, teamMembers]) => this.patchState({ teamMembers: teamMembers.filter(t => t.teamMemberId != teamMember.teamMemberId )}),
                noop
            )
        ))
    );

    readonly load = this.effect<void>(
        exhaustMap(_ => this._teamMemberService.get().pipe(            
            tapResponse(
                teamMembers => this.patchState({ teamMembers }),
                noop                
            )
        ))
    );    
}
