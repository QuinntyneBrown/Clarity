import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Ticket, TicketService } from './tickets';
import { State, StateService } from './states';
import { UpsertTicket } from './tickets/upsert-ticket';
import { map } from 'rxjs/operators';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Login } from './identity/login';
import { BoardService } from './boards/board.service';
import { Board } from './boards/board.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  tickets$: BehaviorSubject<Ticket[]> = new BehaviorSubject([]);
  states$: BehaviorSubject<State[]> = new BehaviorSubject([]);
  boards$: BehaviorSubject<Board[]> = new BehaviorSubject([]);
  boardId = 2;
  public get board() {
    return this.boards$.value.filter(x => x.boardId === this.boardId)[0];
  }
  constructor(
    private boardService: BoardService,
    private login: Login,
    private ticketService: TicketService,
    public upsertTicket: UpsertTicket) { }

  ngOnInit() {
    this.ticketService.getByBoardId({ boardId: this.boardId }).pipe(
      map(x => this.tickets$.next(x))
    ).subscribe();

    this.boardService.get().pipe(
      map(x => {
        this.boards$.next(x);
        this.states$.next(x[this.boardId - 1].states);
      })
    ).subscribe();
  }

  public ticketsByState$(state: State) {
    return this.tickets$.pipe(
      map(x => x.filter(t => t.state === state.name))
    );
  }

  drop(event: CdkDragDrop<Ticket[]>, state: State) {

    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);

      const ticket: Ticket = event.container.data[event.currentIndex] as Ticket;

      ticket.state = state.name;
      ticket.age = 0;
      this.ticketService
      .create({ ticket })
      .subscribe();
    }
  }

  handleAddClick() { this.upsertTicket.create({ board: this.board }); }
}
