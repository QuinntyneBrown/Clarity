import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket, TicketService } from './tickets';
import { State, StateService } from './states';
import { UpsertTicket } from './tickets/upsert-ticket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  tickets$: Observable<Array<Ticket>>;
  states$: Observable<Array<State>>;

  form;
  formGroup;
  
  constructor(private ticketService: TicketService, private stateService: StateService, public upsertTicket: UpsertTicket) { }

  ngOnInit() {
    this.tickets$ = this.ticketService.get();
    this.states$ = this.stateService.get();

  }

  handleClick() {
    this.upsertTicket.create();
  }


}
