// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject, Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, map, noop, tap, withLatestFrom } from "rxjs";
import { TicketState } from "./ticket-state";
import { TicketStateService } from "./ticket-state.service";

export interface TicketStateState {
    ticketStates: TicketState[]
}

const initialTicketStateState = {
    ticketStates: []
};

@Injectable({
    providedIn:"root"
})
export class TicketStateStore extends ComponentStore<TicketStateState> {
    private  readonly _ticketStateService = inject(TicketStateService);

    constructor() {
        super(initialTicketStateState);        
    }

    readonly save = (ticketState:TicketState, nextFn: {(response:any): void} | null = null, errorFn: {(response:any): void} | null = null) => {        
        
        const apiRequest$ = ticketState.ticketStateId ? this._ticketStateService.update({ ticketState }) : this._ticketStateService.create({ ticketState });
        
        const updateFn = ticketState?.ticketStateId ? ([response, ticketStates]: [any, TicketState[]]) => this.patchState({

            ticketStates: ticketStates.map(t => response.ticketState.ticketStateId == t.ticketStateId ? response.ticketState : t)
        })
        :(([response, ticketStates]: [any, TicketState[]]) => this.patchState({ ticketStates: [...ticketStates, response.ticketState ]}));
        
        return this.effect<void>(
            exhaustMap(()=> apiRequest$.pipe(
                withLatestFrom(this.select(x => x.ticketStates)),
                tap(updateFn),
                tapResponse(
                    nextFn || noop,
                    errorFn || noop
                )
            )
        ))();
    }

    readonly delete = this.effect<TicketState>(
        exhaustMap((ticketState) => this._ticketStateService.delete({ ticketState: ticketState }).pipe( 
            withLatestFrom(this.select(x => x.ticketStates )),           
            tapResponse(
                ([_, ticketStates]) => this.patchState({ ticketStates: ticketStates.filter(t => t.ticketStateId != ticketState.ticketStateId )}),
                noop
            )
        ))
    );

    readonly load = this.effect<void>(
        exhaustMap(_ => this._ticketStateService.get().pipe(            
            tapResponse(
                ticketStates => this.patchState({ ticketStates }),
                noop                
            )
        ))
    );    
}
