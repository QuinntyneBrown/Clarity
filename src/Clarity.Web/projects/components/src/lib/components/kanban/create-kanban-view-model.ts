// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, combineLatest, map, switchMap, tap } from "rxjs";
import { BoardService, TeamMemberService, TicketService } from "@api";
import { TicketStore } from "../../stores";

export function createKanbanViewModel() {

  const boardService = inject(BoardService);
  const ticketService = inject(TicketService);
  const teamMemberService = inject(TeamMemberService);
  const ticketStore = inject(TicketStore);
  const route = inject(ActivatedRoute);
  const router = inject(Router);

  const reloadSubject = new BehaviorSubject<void>(undefined);

  const boardName$ = route.paramMap.pipe(
    map(params => params.get('boardName') ?? 'Default')
  );

  const loadBoard$ = combineLatest([boardName$, reloadSubject]).pipe(
    switchMap(([boardName]) => {
      return boardService.getByName({ name: boardName }).pipe(
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
                  selectBoard: (name: string | null) => {
                    if (name) {
                      router.navigate(['/kanban', name]);
                    } else {
                      router.navigate(['/kanban']);
                    }
                  },
                  reload: () => reloadSubject.next()
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
