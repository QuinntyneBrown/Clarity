import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket, TicketService } from './tickets';
import { State, StateService } from './states';
import { UpsertTicket } from './tickets/upsert-ticket';
import { map } from 'rxjs/operators';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Login } from './identity/login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  tickets: Array<Ticket>;
  states$: Observable<Array<State>>;

  constructor(
    private login: Login,
    private ticketService: TicketService,
    private stateService: StateService,
    public upsertTicket: UpsertTicket) { }

  ngOnInit() {
    this.ticketService.get().pipe(
      map(x => this.tickets = x)
    ).subscribe();

    this.states$ = this.stateService.get();
  }

  public ticketsByState(state: State) { return this.tickets.filter(t => t.state === state.name); }

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

  handleClick() { this.login.create(); } //this.upsertTicket.create(); }
}
