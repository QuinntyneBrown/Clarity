// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject } from "@angular/core";
import { combineLatest, map,of } from "rxjs";
import { BoardService, BoardState, BoardStateService, LookUpService, Ticket, TicketService } from "../../models";

export function createKanbanViewModel() {

  const boardService = inject(BoardService);
  const ticketService = inject(TicketService);
  const boardStateService = inject(BoardStateService);
  
  const name = "Default";

  return combineLatest([
    boardService.getByName({ name }),
    ticketService.getTicketsByBoardName({ boardName: name }),
    boardStateService.get()
  ]) .pipe(
    map(([board,tickets, boardStates]) => {
      return { 
        board,
        tickets,
        boardStates
      };
    })
  );
};


