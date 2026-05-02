// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createKanbanBoardColumnsViewModel } from './create-kanban-board-columns-view-model';
import { PushPipe } from '@ngrx/component';

@Component({
    selector: 'app-kanban-board-columns',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, PushPipe],
    templateUrl: './kanban-board-columns.component.html',
    styleUrls: ['./kanban-board-columns.component.scss']
})
export class KanbanBoardColumnsComponent {
  public vm$ = createKanbanBoardColumnsViewModel();
}
