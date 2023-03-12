// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input } from '@angular/core';
import { BoardState } from 'src/app/board-states';


@Component({
  templateUrl: './kanban-board-column.component.html',
  styleUrls: ['./kanban-board-column.component.scss'],
  selector: 'app-kanban-board-column'
})
export class KanbanBoardColumnComponent {

  @Input()
  public boardState: BoardState;
}

