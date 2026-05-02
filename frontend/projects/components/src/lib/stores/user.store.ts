// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject, Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { catchError, EMPTY, exhaustMap, Observable, tap } from "rxjs";
import { User, UserService } from "@api";

export interface UserState {
    users: User[]
}

const initialUserState: UserState = {
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

    readonly save = (user: User, nextFn?: (response: any) => void, errorFn?: (error: any) => void) => {

        const apiRequest$: Observable<any> = user.userId ? this._userService.update({ user }) : this._userService.create({ user });

        return this.effect<void>(
            exhaustMap(() => apiRequest$.pipe(
                tap((response: any) => {
                    const users = this.get().users;
                    if (user?.userId) {
                        this.patchState({ users: users.map(t => response.user?.userId == t.userId ? response.user : t) });
                    } else {
                        this.patchState({ users: [...users, response.user] });
                    }
                    if (nextFn) nextFn(response);
                }),
                catchError((error) => { if (errorFn) errorFn(error); return EMPTY; })
            )
        ))();
    }

    readonly delete = this.effect<User>(
        exhaustMap((user) => this._userService.delete({ user }).pipe(
            tap(() => {
                const users = this.get().users;
                this.patchState({ users: users.filter(t => t.userId != user.userId) });
            }),
            catchError(() => EMPTY)
        ))
    );

    readonly load = this.effect<void>(
        exhaustMap(() => this._userService.get().pipe(
            tap((users: User[]) => this.patchState({ users })),
            catchError(() => EMPTY)
        ))
    );
}
