// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject } from "@angular/core";
import { combineLatest, map, switchMap, tap } from "rxjs";
import { BoardService, BoardStateService, TicketService } from "@api";
import { TicketStore } from "../../stores";

export function createKanbanViewModel() {

  const boardService = inject(BoardService);
  const ticketService = inject(TicketService);
  const boardStateService = inject(BoardStateService);
  const ticketStore = inject(TicketStore);

  const name = "Default";

  return combineLatest([
    boardService.getByName({ name }),
    ticketService.getTicketsByBoardName({ boardName: name }).pipe(
      tap(tickets => ticketStore.patchState({ tickets }))
    ),
    boardStateService.get()
  ]).pipe(
    switchMap(([board, _, boardStates]) =>
      ticketStore.select(x => x.tickets).pipe(
        map(tickets => ({
          board,
          tickets,
          boardStates
        }))
      )
    )
  );
};
