import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { OverlayRefWrapper } from '../core/overlay-ref-wrapper';
import { TicketService } from './ticket.service';
import { Ticket } from './ticket.model';
import { map, switchMap, tap, takeUntil } from 'rxjs/operators';
import { State } from '../states';

@Component({
  templateUrl: './upsert-ticket.component.html',
  styleUrls: ['./upsert-ticket.component.less'],
  selector: 'app-upsert-ticket',
  host: { 'class': 'mat-typography' }
})
export class UpsertTicketComponent implements OnInit, OnDestroy {
  constructor(
    private formBuilder: FormBuilder,
    private ticketService: TicketService,
    private overlay: OverlayRefWrapper) {
      this.form = formBuilder.group({
        name: '',
        state: '',
        description: '',
        acceptanceCriteria: ''
      });
    }
    public ticket$: BehaviorSubject<Ticket> = new BehaviorSubject({} as Ticket);
    public onDestroy: Subject<void> = new Subject<void>();
    public name: string;
    public ticketId: number;

    public states: Array<State> = [];

    public form: FormGroup;

    ngOnInit() {
    if (this.name) {
      this.ticketService.getByName({ name: this.name })
        .pipe(
          map(x => this.ticket$.next(x)),
          switchMap(x => this.ticket$),
          map(x => {
            this.form.patchValue({
              name: x.name,
              state: x.state,
              description: x.description,
              acceptanceCriteria: x.acceptanceCriteria
            });
            this.ticketId = x.ticketId;
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
    const ticket = new Ticket();
    ticket.ticketId = this.ticketId;
    ticket.name = this.form.value.name;
    ticket.state = this.form.value.state;
    ticket.description = this.form.value.description;
    ticket.acceptanceCriteria = this.form.value.acceptanceCriteria;

    this.ticketService.create({ ticket })
      .pipe(
        map(x => ticket.ticketId = x.ticketId),
        tap(x => this.overlay.close(ticket)),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }
}
