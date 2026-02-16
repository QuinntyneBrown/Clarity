// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createKanbanViewModel } from './create-kanban-view-model';
import { PushPipe } from '@ngrx/component';
import { KanbanBoardControlsComponent } from '../kanban-board-controls';
import { KanbanBoardComponent } from '../kanban-board';

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
}
