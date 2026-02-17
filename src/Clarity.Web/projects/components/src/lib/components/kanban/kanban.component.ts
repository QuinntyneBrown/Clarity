// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createKanbanViewModel } from './create-kanban-view-model';
import { PushPipe } from '@ngrx/component';
import { KanbanBoardControlsComponent } from '../kanban-board-controls';
import { KanbanBoardComponent } from '../kanban-board';
import { Ticket } from '@api';

@Component({
    selector: 'app-kanban',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushPipe,
        KanbanBoardComponent,
        KanbanBoardControlsComponent
    ],
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent {
  public vm$ = createKanbanViewModel();

  public teamMemberFilter: string | null = null;

  public handleTeamMemberFilterChange(teamMemberId: string | null) {
    this.teamMemberFilter = teamMemberId;
  }

  public filterTickets(tickets: Ticket[]): Ticket[] {
    if (!this.teamMemberFilter) {
      return tickets;
    }
    if (this.teamMemberFilter === 'unassigned') {
      return tickets.filter(t => !t.teamMemberId);
    }
    return tickets.filter(t => t.teamMemberId === this.teamMemberFilter);
  }
}
