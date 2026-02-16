// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject, Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, map, noop, tap, withLatestFrom } from "rxjs";
import { State } from "./state";
import { LookUpService } from "./look-up.service";

export interface StateState {
    states: State[]
}

const initialStateState = {
    states: []
};

@Injectable({
    providedIn:"root"
})
export class StateStore extends ComponentStore<StateState> {
    private  readonly _stateService = inject(LookUpService);

    constructor() {
        super(initialStateState);        
    }

    readonly load = this.effect<void>(
        exhaustMap(_ => this._stateService.getStates().pipe(            
            tapResponse(
                states => this.patchState({ states }),
                noop                
            )
        ))
    );    
}
