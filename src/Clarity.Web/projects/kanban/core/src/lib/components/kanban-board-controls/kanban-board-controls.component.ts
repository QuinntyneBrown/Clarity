// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createKanbanBoardControlsViewModel } from './create-kanban-board-controls-view-model';
import { PushModule } from '@ngrx/component';
import { MatIconModule } from '@angular/material/icon';
import { Board } from '../../models';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CreateTicketComponent } from '../create-ticket';

@Component({
  selector: 'app-kanban-board-controls',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, 
    PushModule,
    MatIconModule,
    DialogModule
  ],
  templateUrl: './kanban-board-controls.component.html',
  styleUrls: ['./kanban-board-controls.component.scss']
})
export class KanbanBoardControlsComponent {
  public vm$ = createKanbanBoardControlsViewModel();

  private readonly _dialog = inject(Dialog);

  public handleClick() {
    this._dialog.open(CreateTicketComponent);
  }

  public handleSelectBoardClick() {
    
  }

  @Input() public board!:Board;
}
