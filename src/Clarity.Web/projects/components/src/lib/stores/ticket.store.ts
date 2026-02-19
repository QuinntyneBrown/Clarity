// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject, Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tapResponse } from "@ngrx/operators";
import { exhaustMap, map, noop, tap, withLatestFrom } from "rxjs";
import { Ticket, TicketService } from "@api";

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

        const updateFn = ticket?.ticketId ? ([_, tickets]: [any, Ticket[]]) => this.patchState({
            tickets: tickets.map(t => t.ticketId == ticket.ticketId ? ticket : t)
        })
        : ([response, tickets]: [any, Ticket[]]) => this.patchState({
            tickets: [...tickets, { ...ticket, ticketId: response.ticketId }]
        });

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
                ([_, tickets]: [any, Ticket[]]) => this.patchState({ tickets: tickets.filter(t => t.ticketId != ticket.ticketId )}),
                noop
            )
        ))
    );

    readonly load = this.effect<void>(
        exhaustMap(_ => this._ticketService.get().pipe(
            tapResponse(
                (tickets: Ticket[]) => this.patchState({ tickets }),
                noop
            )
        ))
    );
}
