import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { OverlayRefWrapper } from '../core/overlay-ref-wrapper';
import { TicketService } from './ticket.service';
import { Ticket } from './ticket.model';
import { map, switchMap, tap, takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './upsert-ticket.component.html',
  styleUrls: ['./upsert-ticket.component.less'],
  selector: 'app-upsert-ticket',
  host: { 'class': 'mat-typography' }
})
export class UpsertTicketComponent implements OnInit, OnDestroy {
  constructor(
    private ticketService: TicketService,
    private overlay: OverlayRefWrapper) { }
    public ticket$: BehaviorSubject<Ticket> = new BehaviorSubject({} as Ticket);
    public onDestroy: Subject<void> = new Subject<void>();
    public ticketId: string;
    public form: FormGroup = new FormGroup({
      name: new FormControl(null, [])
    });

    ngOnInit() {
    if (this.ticketId) {
      this.ticketService.getById({ ticketId: this.ticketId })
        .pipe(
          map(x => this.ticket$.next(x)),
          switchMap(x => this.ticket$),
          map(x => this.form.patchValue({
            name: x.name
          }))
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
    this.ticketService.create({ ticket })
      .pipe(
        map(x => ticket.ticketId = x.ticketId),
        tap(x => this.overlay.close(ticket)),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }
}
