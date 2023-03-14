// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject, Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, map, noop, tap, withLatestFrom } from "rxjs";
import { Ticket } from "./ticket";
import { TicketService } from "./ticket.service";

interface TicketState {
    tickets: Ticket[]
}

const initialTicketState = {
    tickets: []
};

@Injectable({
    providedIn:"root"
})
export class TicketStore extends ComponentStore<TicketState> {
    private  readonly _ticketService = inject(TicketService);

    constructor() {
        super(initialTicketState);        
    }

    readonly save = (ticket:Ticket, nextFn: {(response:any): void} | null = null, errorFn: {(response:any): void} | null = null) => {        
        
        const apiRequest$ = ticket.ticketId ? this._ticketService.update({ ticket }) : this._ticketService.create({ ticket });
        
        const updateFn = ticket?.ticketId ? ([response, tickets]: [any, Ticket[]]) => this.patchState({

            tickets: tickets.map(t => response.ticket.ticketId == t.ticketId ? response.ticket : t)
        })
        :(([response, tickets]: [any, Ticket[]]) => this.patchState({ tickets: [...tickets, response.ticket ]}));
        
        return this.effect<void>(
            exhaustMap(()=> apiRequest$.pipe(
                withLatestFrom(this.select(x => x.tickets)),
                tap(updateFn),
                tapResponse(
                    nextFn || noop,
                    errorFn || noop
                )
            )
        ))();
    }

    readonly delete = this.effect<Ticket>(
        exhaustMap((ticket) => this._ticketService.delete({ ticket: ticket }).pipe( 
            withLatestFrom(this.select(x => x.tickets )),           
            tapResponse(
                ([_, tickets]) => this.patchState({ tickets: tickets.filter(t => t.ticketId != ticket.ticketId )}),
                noop
            )
        ))
    );

    readonly load = this.effect<void>(
        exhaustMap(_ => this._ticketService.get().pipe(            
            tapResponse(
                tickets => this.patchState({ tickets }),
                noop                
            )
        ))
    );    
}
