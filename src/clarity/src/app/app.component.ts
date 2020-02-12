import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket, TicketService } from './tickets';
import { State, StateService } from './states';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  tickets$: Observable<Array<Ticket>>;
  states$: Observable<Array<State>>;

  constructor(private ticketService: TicketService, private stateService: StateService) { }

  ngOnInit() {
    this.tickets$ = this.ticketService.get();
    this.states$ = this.stateService.get();
  }
}
