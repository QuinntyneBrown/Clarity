import { Component, OnInit } from '@angular/core';
import { Ticket } from './ticket.model';
import { State } from './state.model';
import { TicketService } from './ticket.service';
import { StateService } from './state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  tickets$: Observable<Array<Ticket>>;
  states$: Observable<Array<State>>;

  constructor(private ticketService: TicketService, private stateService: StateService) {

  }

  ngOnInit() {
    this.tickets$ = this.ticketService.get();
    this.states$ = this.stateService.get();
  }
}
