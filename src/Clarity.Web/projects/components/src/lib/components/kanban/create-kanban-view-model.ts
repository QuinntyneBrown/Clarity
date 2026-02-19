// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject } from "@angular/core";
import { BehaviorSubject, combineLatest, map, switchMap, tap } from "rxjs";
import { BoardService, TeamMemberService, TicketService } from "@api";
import { TicketStore } from "../../stores";

export function createKanbanViewModel() {

  const boardService = inject(BoardService);
  const ticketService = inject(TicketService);
  const teamMemberService = inject(TeamMemberService);
  const ticketStore = inject(TicketStore);

  const boardIdSubject = new BehaviorSubject<string | null>(null);

  const loadBoard$ = boardIdSubject.pipe(
    switchMap(boardId => {
      const board$ = boardId
        ? boardService.getById({ boardId })
        : boardService.getByName({ name: "Default" });

      return board$.pipe(
        switchMap(board => {
          const tickets$ = ticketService.getTicketsByBoardId({ boardId: board.boardId! }).pipe(
            tap(tickets => ticketStore.patchState({ tickets }))
          );

          return combineLatest([
            tickets$,
            teamMemberService.get()
          ]).pipe(
            switchMap(([_, teamMembers]) =>
              ticketStore.select(x => x.tickets).pipe(
                map(tickets => ({
                  board,
                  tickets,
                  boardStates: board.states,
                  teamMembers,
                  selectBoard: (id: string | null) => boardIdSubject.next(id),
                  reload: () => boardIdSubject.next(board.boardId!)
                }))
              )
            )
          );
        })
      );
    })
  );

  return loadBoard$;
}
