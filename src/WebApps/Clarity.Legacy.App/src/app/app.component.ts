// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnDestroy } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { Ticket, TicketService } from './tickets';
import { BoardState } from './board-states';
import { UpsertTicket } from './tickets';
import { map, takeUntil } from 'rxjs/operators';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardService } from './boards/board.service';
import { Board } from './boards/board.model';
import { TeamMemberService } from './team-members/team-member.service';
import { TeamMember } from './team-members/team-member.model';
import { LocalStorageService } from '@core/local-storage.service';
import { Login } from './identity/login/login';
import { SelectBoard } from './boards/select-board/select-board';
import { currentBoardIdKey } from '@core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  private readonly _destroyed$: Subject<void> = new Subject();

  public  vm$: Observable<{ 
    board: Board,
    boards: Board[],
    boardStates: BoardState[],
    tickets: Ticket[]
    teamMember: TeamMember
  }> = forkJoin([
    this._boardService.getByName({ name: "Default"}),
    this._boardService.get(),
    this._ticketService.getByBoardName({ name: "Default" }),
    this._teamMemberService.getCurrent()
  ])
  .pipe(
    map(([board, boards, tickets,teamMember]) => ({ 
      board,
      boards,
      boardStates: board.states,
      tickets,
      teamMember
    }))
  );

  constructor(
    private readonly _login: Login,
    private readonly _boardService: BoardService,
    private readonly _ticketService: TicketService,
    private readonly _teamMemberService: TeamMemberService,
    private readonly _localStorageService: LocalStorageService,
    private readonly _upsertTicket: UpsertTicket,    
    private readonly _selectBoard: SelectBoard,    
    ) { }

  public ticketsByState(vm:any, state: BoardState) {
    return vm.tickets.filter(t => t.state === state.name);
  }

  drop(event: CdkDragDrop<Ticket[]>, state: BoardState) {

    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);

      const ticket: Ticket = event.container.data[event.currentIndex] as Ticket;

      ticket.boardStateId = state.boardStateId;
      ticket.state = state.name;
      ticket.age = 0;

      this._ticketService
      .create({ ticket })
      .pipe(takeUntil(this._destroyed$))
      .subscribe();
    }
  }

  handleAddClick(vm:any) {
    this._upsertTicket.create({ board: vm.board })
    .pipe(takeUntil(this._destroyed$))
    .subscribe();
  }

  handleSelectBoardClick(vm) {
    this._selectBoard.create({ boardId: vm.board.boardId }).pipe(
      takeUntil(this._destroyed$),
      map(x => {
        if (x) {
          vm.board.boardId = x.boardId;
          this._localStorageService.put({ name: currentBoardIdKey, value: vm.board.boardId })
          window.location.reload();
        }
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
