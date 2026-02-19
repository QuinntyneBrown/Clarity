// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createKanbanBoardViewModel } from './create-kanban-board-view-model';
import { PushPipe } from '@ngrx/component';
import { CdkDragDrop, CdkDropListGroup, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { BoardState, Ticket, TicketService } from '@api';
import { takeUntil } from 'rxjs';
import { TicketComponent } from '../ticket';
import { DeleteBoardStateComponent } from '../delete-board-state';
import { Destroyable } from '../../base';

@Component({
    selector: 'app-kanban-board',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushPipe,
        DragDropModule,
        MatIconModule,
        MatButtonModule,
        DialogModule,
        TicketComponent
    ],
    templateUrl: './kanban-board.component.html',
    styleUrls: ['./kanban-board.component.scss'],
    hostDirectives: [{
            directive: CdkDropListGroup,
            inputs: []
        }]
})
export class KanbanBoardComponent extends Destroyable {

  private readonly _ticketService = inject(TicketService);
  private readonly _dialog = inject(Dialog);

  public vm$ = createKanbanBoardViewModel();

  @Input() boardStates!: BoardState[];

  @Input() tickets!: Ticket[];

  @Output() public boardStateDeleted = new EventEmitter<void>();

  public ticketsByState(tickets: Ticket[], state: BoardState) {
    return tickets.filter(t => Number(t.state) === state.type);
  }

  drop(event: CdkDragDrop<Ticket[]>, state: BoardState) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);

      const ticket: Ticket = event.container.data[event.currentIndex] as Ticket;

      ticket.boardStateId = state.boardStateId;
      ticket.state = state.type as any;
      ticket.age = 0;

      this._ticketService
      .update({ ticket })
      .pipe(takeUntil(this._destroyed$))
      .subscribe();
    }
  }

  handleDeleteColumn(boardState: BoardState) {
    const ticketCount = this.ticketsByState(this.tickets, boardState).length;
    const dialogRef = this._dialog.open(DeleteBoardStateComponent, {
      data: { boardState, ticketCount }
    });
    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.boardStateDeleted.emit();
      }
    });
  }
}
