// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createKanbanBoardControlsViewModel } from './create-kanban-board-controls-view-model';
import { PushPipe } from '@ngrx/component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Board, TeamMember } from '@api';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CreateTicketComponent } from '../create-ticket';
import { SelectBoardComponent } from '../select-board';
import { CreateBoardComponent } from '../create-board';
import { CloneBoardComponent } from '../clone-board';
import { DeleteBoardComponent } from '../delete-board';

@Component({
    selector: 'app-kanban-board-controls',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushPipe,
        MatIconModule,
        MatButtonModule,
        DialogModule
    ],
    templateUrl: './kanban-board-controls.component.html',
    styleUrls: ['./kanban-board-controls.component.scss']
})
export class KanbanBoardControlsComponent {
  public vm$ = createKanbanBoardControlsViewModel();

  private readonly _dialog = inject(Dialog);

  private readonly _avatarColors = [
    '#7D00FA', '#22C55E', '#F59E0B', '#EF4444', '#3B82F6',
    '#EC4899', '#14B8A6', '#F97316', '#8B5CF6', '#06B6D4'
  ];

  @Input() public board!: Board;
  @Input() public teamMembers: TeamMember[] = [];

  @Output() public boardSelected = new EventEmitter<string>();
  @Output() public boardCreated = new EventEmitter<void>();
  @Output() public boardCloned = new EventEmitter<void>();
  @Output() public boardDeleted = new EventEmitter<void>();
  @Output() public teamMemberFilterChange = new EventEmitter<string | null>();

  public selectedTeamMemberId: string | null = null;

  public handleClick() {
    this._dialog.open(CreateTicketComponent, {
      data: { board: this.board }
    });
  }

  public handleSelectBoardClick() {
    const dialogRef = this._dialog.open(SelectBoardComponent, {
      data: { currentBoardId: this.board?.boardId }
    });
    dialogRef.closed.subscribe((result) => {
      if (!result) return;
      if (typeof result === 'string') {
        this.boardSelected.emit(result);
      } else if ((result as any).action === 'create') {
        this.handleCreateBoardClick();
      } else if ((result as any).action === 'clone') {
        this.handleCloneBoardClick();
      } else if ((result as any).action === 'delete') {
        this.handleDeleteBoardClick();
      }
    });
  }

  public handleCreateBoardClick() {
    const dialogRef = this._dialog.open(CreateBoardComponent);
    dialogRef.closed.subscribe((result: any) => {
      if (result && result.name) {
        this.boardSelected.emit(result.name);
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

  public handleDeleteBoardClick() {
    const dialogRef = this._dialog.open(DeleteBoardComponent, {
      data: { board: this.board }
    });
    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.boardDeleted.emit();
      }
    });
  }

  public selectFilter(memberId: string | null) {
    this.selectedTeamMemberId = memberId;
    this.teamMemberFilterChange.emit(memberId);
  }

  public getInitials(name?: string): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  public getAvatarColor(member: TeamMember): string {
    const index = this.teamMembers.indexOf(member);
    return this._avatarColors[index % this._avatarColors.length];
  }
}
