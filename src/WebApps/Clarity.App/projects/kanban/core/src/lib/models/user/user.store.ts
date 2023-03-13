// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject, Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, map, noop, tap, withLatestFrom } from "rxjs";
import { User } from "./user";
import { UserService } from "./user.service";

export interface UserState {
    users: User[]
}

const initialUserState = {
    users: []
};

@Injectable({
    providedIn:"root"
})
export class UserStore extends ComponentStore<UserState> {
    private  readonly _userService = inject(UserService);

    constructor() {
        super(initialUserState);        
    }

    readonly save = (user:User, nextFn: {(response:any): void} | null = null, errorFn: {(response:any): void} | null = null) => {        
        
        const apiRequest$ = user.userId ? this._userService.update({ user }) : this._userService.create({ user });
        
        const updateFn = user?.userId ? ([response, users]: [any, User[]]) => this.patchState({

            users: users.map(t => response.user.userId == t.userId ? response.user : t)
        })
        :(([response, users]: [any, User[]]) => this.patchState({ users: [...users, response.user ]}));
        
        return this.effect<void>(
            exhaustMap(()=> apiRequest$.pipe(
                withLatestFrom(this.select(x => x.users)),
                tap(updateFn),
                tapResponse(
                    nextFn || noop,
                    errorFn || noop
                )
            )
        ))();
    }

    readonly delete = this.effect<User>(
        exhaustMap((user) => this._userService.delete({ user: user }).pipe( 
            withLatestFrom(this.select(x => x.users )),           
            tapResponse(
                ([_, users]) => this.patchState({ users: users.filter(t => t.userId != user.userId )}),
                noop
            )
        ))
    );

    readonly load = this.effect<void>(
        exhaustMap(_ => this._userService.get().pipe(            
            tapResponse(
                users => this.patchState({ users }),
                noop                
            )
        ))
    );    
}
