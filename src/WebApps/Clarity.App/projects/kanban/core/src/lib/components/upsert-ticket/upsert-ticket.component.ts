// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, OnDestroy, HostBinding, ChangeDetectionStrategy, inject } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { map, switchMap, tap, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { PushModule } from '@ngrx/component';
import { DialogModule } from '@angular/cdk/dialog';
import { Board, BoardService, CommentService, Ticket, TicketService } from '../../models';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateCommentComponent } from '../create-comment';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, 
    PushModule, 
    DialogModule, 
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    CreateCommentComponent
  ],
  templateUrl: './upsert-ticket.component.html',
  styleUrls: ['./upsert-ticket.component.scss']
})
export class UpsertTicketComponent {
  
  private readonly _destroyed$ = new Subject();

  private readonly _ticketService = inject(TicketService);

  private readonly _overlayRef = inject(OverlayRef);

  public boardId = 2;
  public board$: BehaviorSubject<Board> = new BehaviorSubject({} as unknown as Board);
  public stateId!: string;
  public ticket: Ticket = { } as unknown as Ticket;
  public selected!: string;

  form = new FormGroup<any>({
    name: '',
    state: '',
    description: '',
    acceptanceCriteria: ''
  });

  commentForm = new FormGroup<any>({
    description: ''
  });


  ngOnDestroy() {    
    this._destroyed$.next(null);
    this._destroyed$.complete();
  }

  public handleCancelClick() {

  }

  public handleSaveClick() {
    this.ticket.name = this.form.value.name;
    //this.ticket.stateId = parseInt(this.form.value.state, null);
    this.ticket.description = this.form.value.description;
    this.ticket.acceptanceCriteria = this.form.value.acceptanceCriteria;

    this._ticketService.create({ ticket: this.ticket })
      .pipe(
        map(x => this.ticket.ticketId = x.ticketId),
        tap(() => this._overlayRef.dispose()),
        takeUntil(this._destroyed$)
      )
      .subscribe();
  }

  public handleDeleteClick() {
    this._ticketService.delete({ ticket: this.ticket })
      .pipe(
        tap(() => this._overlayRef.dispose()),
        takeUntil(this._destroyed$)
      )
      .subscribe();
  }

  public handleCommentSaved($comment: any) {
    $comment.created = Date.now();
    this.ticket.comments.unshift($comment);
  }
}
