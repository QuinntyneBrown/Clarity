// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createKanbanBoardViewModel } from './create-kanban-board-view-model';
import { PushModule } from '@ngrx/component';
import { CdkDragDrop, CdkDropListGroup, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { BoardState, LookUpService, State, Ticket, TicketService } from '../../models';
import { Subject, takeUntil } from 'rxjs';
import { TicketComponent } from '../ticket';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, 
    PushModule, 
    DragDropModule,  
    MatIconModule,
    TicketComponent
  ],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
  hostDirectives:[{
    directive: CdkDropListGroup,
    inputs:[]
  }]
})
export class KanbanBoardComponent implements OnDestroy {

  private readonly _destroyed$ = new Subject();

  private readonly _lookUpService = inject(LookUpService);

  private readonly _ticketService = inject(TicketService);
  
  public vm$ = createKanbanBoardViewModel();

  @Input() boardStates!: BoardState[];

  @Input() tickets!:Ticket[];

  public ticketsByState(tickets:Ticket[], state: BoardState) {    
    return tickets.filter(t => t.name as unknown === state.name);
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

  ngOnDestroy() {
    this._destroyed$.next(null);
    this._destroyed$.complete();
  }
}
