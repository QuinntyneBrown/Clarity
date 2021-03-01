import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TicketService } from './ticket.service';
import { Ticket } from './ticket.model';
import { map, switchMap, tap, takeUntil } from 'rxjs/operators';
import { State } from '../states';
import { Board } from '../boards/board.model';
import { BoardService } from '../boards/board.service';
import { CommentService } from '../comments/comment.service';
import { Comment } from '../comments/comment.model';
import { OverlayRefWrapper } from '@core/overlay-ref-wrapper';

@HostBinding('class.mat-typography')
@Component({
  templateUrl: './upsert-ticket.component.html',
  styleUrls: ['./upsert-ticket.component.scss'],
  selector: 'app-upsert-ticket',
})
export class UpsertTicketComponent implements OnInit, OnDestroy {
  public boardId = 2;
  public board$: BehaviorSubject<Board> = new BehaviorSubject(new Board());
  public stateId: number;
  public ticket: Ticket = new Ticket();
  public selected: number;

  constructor(
    public boardService: BoardService,
    public commentService: CommentService,
    formBuilder: FormBuilder,
    private ticketService: TicketService,
    private overlay: OverlayRefWrapper) {
      this.form = formBuilder.group({
        name: '',
        state: '',
        description: '',
        acceptanceCriteria: ''
      });

      this.commentForm = formBuilder.group({
        description: ''
      });
    }
    public ticket$: BehaviorSubject<Ticket> = new BehaviorSubject({} as Ticket);
    public onDestroy: Subject<void> = new Subject<void>();
    public name: string;
    public ticketId: number;

    public states$: BehaviorSubject<Array<State>> = new BehaviorSubject([]);

    public form: FormGroup;
    public commentForm: FormGroup;

    ngOnInit() {
      if (this.name) {
        this.ticketService.getByName({ name: this.name })
        .pipe(
          map(x => this.ticket$.next(x)),
          switchMap(() => this.ticket$),
          map(x => {
            this.form.patchValue({
              name: x.name,
              state: x.stateId,
              description: x.description,
              acceptanceCriteria: x.acceptanceCriteria
            });

            this.ticket = x;

            this.boardService.getById({ boardId: this.ticket.boardId}).pipe(
              map(board => {
                this.board$.next(board);
              })
              ).subscribe();
          })
        )
        .subscribe();
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  public handleCancelClick() {
    this.overlay.close();
  }

  public handleSaveClick() {
    this.ticket.name = this.form.value.name;
    this.ticket.stateId = parseInt(this.form.value.state, null);
    this.ticket.description = this.form.value.description;
    this.ticket.acceptanceCriteria = this.form.value.acceptanceCriteria;

    this.ticketService.create({ ticket: this.ticket })
      .pipe(
        map(x => this.ticket.ticketId = x.ticketId),
        tap(() => this.overlay.close(this.ticket)),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }

  public handleDeleteClick() {
    this.ticketService.remove({ ticket: this.ticket })
      .pipe(
        tap(() => this.overlay.close(this.ticket)),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }

  public handleCommentSaved($comment: any) {
    $comment.created = Date.now();
    this.ticket.comments.unshift($comment);
  }
}
