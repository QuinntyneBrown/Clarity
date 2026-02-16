// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createSelectBoardViewModel } from './create-select-board-view-model';
import { PushPipe } from '@ngrx/component';

@Component({
    selector: 'app-select-board',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, PushPipe],
    templateUrl: './select-board.component.html',
    styleUrls: ['./select-board.component.scss']
})
export class SelectBoardComponent {
  public vm$ = createSelectBoardViewModel();
}
