// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createDeleteBoardViewModel } from './create-delete-board-view-model';
import { PushPipe } from '@ngrx/component';
import { DialogModule } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-delete-board',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushPipe,
        DialogModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './delete-board.component.html',
    styleUrls: ['./delete-board.component.scss']
})
export class DeleteBoardComponent {
  public vm$ = createDeleteBoardViewModel();
}
