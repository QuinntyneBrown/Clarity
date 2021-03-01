import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { BoardService } from './board.service';
import { Board } from './board.model';
import { map } from 'rxjs/operators';
import { OverlayRefWrapper } from '@core/overlay-ref-wrapper';

@HostBinding('class.mat-typography')
@Component({
  templateUrl: './select-board.component.html',
  styleUrls: ['./select-board.component.scss'],
  selector: 'app-select-board'
})
export class SelectBoardComponent implements OnInit, OnDestroy {
  public onDestroy: Subject<void> = new Subject<void>();
  public board$: BehaviorSubject<Board> = new BehaviorSubject({} as Board);
  public boardId: number;
  public boards$: BehaviorSubject<Board[]> = new BehaviorSubject([]);

  constructor(
    private boardService: BoardService,
    private overlay: OverlayRefWrapper) { }

  public ngOnInit() {
    this.boardService.get().pipe(
      map(x => this.boards$.next(x))
    ).subscribe();
  }

  public ngOnDestroy() {
    this.onDestroy.next();
  }

  public handleCancelClick() {
    this.overlay.close();
  }
  
  public handleSelectClick(board: Board) {
    this.overlay.close(board);
  }
}
