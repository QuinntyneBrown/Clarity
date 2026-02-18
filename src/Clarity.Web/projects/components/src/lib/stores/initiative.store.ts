// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject, Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tapResponse } from "@ngrx/operators";
import { exhaustMap, map, noop, tap, withLatestFrom } from "rxjs";
import { Initiative, InitiativeService } from "@api";

export interface InitiativeState {
    initiatives: Initiative[]
}

const initialInitiativeState = {
    initiatives: []
};

@Injectable({
    providedIn:"root"
})
export class InitiativeStore extends ComponentStore<InitiativeState> {
    private  readonly _initiativeService = inject(InitiativeService);

    constructor() {
        super(initialInitiativeState);
    }

    readonly save = (initiative:Initiative, nextFn: {(response:any): void} | null = null, errorFn: {(response:any): void} | null = null) => {

        const apiRequest$ = initiative.initiativeId ? this._initiativeService.update({ initiative }) : this._initiativeService.create({ initiative });

        const updateFn = initiative?.initiativeId ? ([response, initiatives]: [any, Initiative[]]) => this.patchState({

            initiatives: initiatives.map(t => response.initiative.initiativeId == t.initiativeId ? response.initiative : t)
        })
        :(([response, initiatives]: [any, Initiative[]]) => this.patchState({ initiatives: [...initiatives, response.initiative ]}));

        return this.effect<void>(
            exhaustMap(()=> apiRequest$.pipe(
                withLatestFrom(this.select(x => x.initiatives)),
                tap(updateFn),
                tapResponse(
                    nextFn || noop,
                    errorFn || noop
                )
            )
        ))();
    }

    readonly delete = this.effect<Initiative>(
        exhaustMap((initiative) => this._initiativeService.delete({ initiative: initiative }).pipe(
            withLatestFrom(this.select(x => x.initiatives )),
            tapResponse(
                ([_, initiatives]: [any, Initiative[]]) => this.patchState({ initiatives: initiatives.filter(t => t.initiativeId != initiative.initiativeId )}),
                noop
            )
        ))
    );

    readonly load = this.effect<void>(
        exhaustMap(_ => this._initiativeService.get().pipe(
            tapResponse(
                (initiatives: Initiative[]) => this.patchState({ initiatives }),
                noop
            )
        ))
    );
}
