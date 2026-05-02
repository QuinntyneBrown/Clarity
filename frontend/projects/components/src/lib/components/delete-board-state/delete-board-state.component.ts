// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createDeleteBoardStateViewModel } from './create-delete-board-state-view-model';
import { PushPipe } from '@ngrx/component';
import { DialogModule } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-delete-board-state',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushPipe,
        DialogModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './delete-board-state.component.html',
    styleUrls: ['./delete-board-state.component.scss']
})
export class DeleteBoardStateComponent {
  public vm$ = createDeleteBoardStateViewModel();
}
