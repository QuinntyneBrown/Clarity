// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createKanbanBoardControlsViewModel } from './create-kanban-board-controls-view-model';
import { PushPipe } from '@ngrx/component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Board, TeamMember } from '@api';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CreateTicketComponent } from '../create-ticket';
import { SelectBoardComponent } from '../select-board';
import { CreateBoardComponent } from '../create-board';
import { CloneBoardComponent } from '../clone-board';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-kanban-board-controls',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushPipe,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        DialogModule,
        FormsModule
    ],
    templateUrl: './kanban-board-controls.component.html',
    styleUrls: ['./kanban-board-controls.component.scss']
})
export class KanbanBoardControlsComponent {
  public vm$ = createKanbanBoardControlsViewModel();

  private readonly _dialog = inject(Dialog);

  @Input() public board!: Board;
  @Input() public teamMembers: TeamMember[] = [];

  @Output() public boardSelected = new EventEmitter<string>();
  @Output() public boardCreated = new EventEmitter<void>();
  @Output() public boardCloned = new EventEmitter<void>();
  @Output() public teamMemberFilterChange = new EventEmitter<string | null>();

  public selectedTeamMemberId: string | null = null;

  public handleClick() {
    this._dialog.open(CreateTicketComponent);
  }

  public handleSelectBoardClick() {
    const dialogRef = this._dialog.open(SelectBoardComponent);
    dialogRef.closed.subscribe((boardId) => {
      if (boardId) {
        this.boardSelected.emit(boardId as string);
      }
    });
  }

  public handleCreateBoardClick() {
    const dialogRef = this._dialog.open(CreateBoardComponent);
    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.boardCreated.emit();
      }
    });
  }

  public handleCloneBoardClick() {
    const dialogRef = this._dialog.open(CloneBoardComponent, {
      data: { board: this.board }
    });
    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.boardCloned.emit();
      }
    });
  }

  public handleFilterChange() {
    this.teamMemberFilterChange.emit(this.selectedTeamMemberId);
  }
}
