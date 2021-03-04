import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Ticket, TicketService } from './tickets';
import { BoardState } from './board-states';
import { UpsertTicket } from './tickets/upsert-ticket';
import { map, takeUntil } from 'rxjs/operators';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Login } from './identity/login';
import { BoardService } from './boards/board.service';
import { Board } from './boards/board.model';
import { TeamMemberService } from './team-members/team-member.service';
import { TeamMember } from './team-members/team-member.model';
import { SelectBoard } from './boards/select-board';
import { LookUpService } from '@core/look-up.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly _destroyed$: Subject<void> = new Subject();
  public readonly tickets$: BehaviorSubject<Ticket[]> = new BehaviorSubject([]);
  public readonly boardStates$: BehaviorSubject<BoardState[]> = new BehaviorSubject([]);
  public readonly boards$: BehaviorSubject<Board[]> = new BehaviorSubject([]);
  public readonly teamMember$: BehaviorSubject<TeamMember> = new BehaviorSubject({} as TeamMember);

  public get isAuthenticated(): string { return localStorage.getItem('ACCESS_TOKEN'); }
  
  public get board$(): Observable<Board> { return this.boards$.pipe(
    map(x => x.filter(l => l.boardId === this.boardId)[0] )
  );
}
  boardId = parseInt(localStorage.getItem('BOARD_ID'), null) || 1;
  public get board() { return this.boards$.value.filter(x => x.boardId === this.boardId)[0]; }

  constructor(
    private _login: Login,
    private boardService: BoardService,
    private ticketService: TicketService,
    private readonly _lookUpService: LookUpService,
    public upsertTicket: UpsertTicket,
    public teamMemberService: TeamMemberService,
    public selectBoard: SelectBoard) { }

  async ensureAuthenticated() {
    return new Promise((resolve, reject) => {
      if (this.isAuthenticated) {
        resolve(null);
        return;
      }

      this._login.create().pipe(
        map(x => { resolve(null); })
      ).subscribe();
    });
  }

  async ngOnInit() {
    await this.ensureAuthenticated();

    this._lookUpService.getState()
    .pipe(
      takeUntil(this._destroyed$),      
    ).subscribe();

    this.teamMemberService.getCurrent().pipe(
      map(x => this.teamMember$.next(x))
      ).subscribe();

    this.ticketService.getByBoardId({ boardId: this.boardId }).pipe(
      map(x => this.tickets$.next(x))
    ).subscribe();

    this.boardService.get().pipe(
      map(x => {
        this.boards$.next(x);
        this.boardStates$.next(x[this.boardId - 1].states);
      })
    ).subscribe();

  }

  public ticketsByState$(state: BoardState) {
    return this.tickets$.pipe(
      map(x => x.filter(t => t.state === state.name))
    );
  }

  drop(event: CdkDragDrop<Ticket[]>, state: BoardState) {

    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);

      const ticket: Ticket = event.container.data[event.currentIndex] as Ticket;

      ticket.boardStateId = state.boardStateId;
      ticket.state = state.name;
      ticket.age = 0;
      this.ticketService
      .create({ ticket })
      .subscribe();
    }
  }

  handleAddClick() {
    this.upsertTicket.create({ board: this.board })
    .pipe(
      takeUntil(this._destroyed$),
      map(x => this.ngOnInit()
      )
      ).subscribe();
  }

  handleSelectBoardClick() {
    this.selectBoard.create({ boardId: this.boardId }).pipe(
      takeUntil(this._destroyed$),
      map(x => {
        if (x) {
          this.boardId = x.boardId;
          localStorage.setItem('BOARD_ID', `${this.boardId}`);
          window.location.reload();
        }
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}