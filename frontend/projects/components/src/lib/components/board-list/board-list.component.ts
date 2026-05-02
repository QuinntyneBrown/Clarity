// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createBoardListViewModel } from './create-board-list-view-model';
import { PushPipe } from '@ngrx/component';

@Component({
    selector: 'app-board-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, PushPipe],
    templateUrl: './board-list.component.html',
    styleUrls: ['./board-list.component.scss']
})
export class BoardListComponent {
  public vm$ = createBoardListViewModel();
}
