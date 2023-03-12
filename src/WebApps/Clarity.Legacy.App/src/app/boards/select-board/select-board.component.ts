// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { OverlayRefWrapper } from '@core/overlay-ref-wrapper';
import { Board } from '../board.model';
import { BoardService } from '../board.service';

@HostBinding('class.mat-typography')
@Component({
  templateUrl: './select-board.component.html',
  styleUrls: ['./select-board.component.scss'],
  selector: 'app-select-board'
})
export class SelectBoardComponent implements OnInit, OnDestroy {
  private readonly _destoryed$: Subject<void> = new Subject<void>();
  public board$: BehaviorSubject<Board> = new BehaviorSubject({} as Board);
  public boardId: number;
  public boards$: BehaviorSubject<Board[]> = new BehaviorSubject([]);

  constructor(
    private readonly _boardService: BoardService,
    private readonly _overlay: OverlayRefWrapper) { }

  public ngOnInit() {
    this._boardService.get().pipe(
      map(x => this.boards$.next(x))
    ).subscribe();
  }

  public ngOnDestroy() {
    this._destoryed$.next();
  }

  public handleCancelClick() {
    this._overlay.close();
  }
  
  public handleSelectClick(board: Board) {
    this._overlay.close(board);
  }
}

