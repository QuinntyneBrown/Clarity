// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createKanbanViewModel } from './create-kanban-view-model';
import { PushPipe } from '@ngrx/component';
import { KanbanBoardControlsComponent } from '../kanban-board-controls';
import { KanbanBoardComponent } from '../kanban-board';
import { Board, BoardState, Ticket } from '@api';
import { MatIconModule } from '@angular/material/icon';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CreateTicketComponent } from '../create-ticket';

@Component({
    selector: 'app-kanban',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushPipe,
        KanbanBoardComponent,
        KanbanBoardControlsComponent,
        MatIconModule,
        DialogModule
    ],
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnDestroy {
  public vm$ = createKanbanViewModel();

  public teamMemberFilter: string | null = null;
  public showStickyHeader = false;

  private readonly _dialog = inject(Dialog);
  private readonly _cdr = inject(ChangeDetectorRef);
  private _observer: IntersectionObserver | null = null;
  private _scrollContainerEl: HTMLElement | null = null;
  private _boardControlsEl: HTMLElement | null = null;

  @ViewChild('scrollContainer')
  set scrollContainerRef(ref: ElementRef | undefined) {
    this._scrollContainerEl = ref?.nativeElement ?? null;
    this._trySetupObserver();
  }

  @ViewChild('boardControls', { read: ElementRef })
  set boardControlsRef(ref: ElementRef | undefined) {
    this._boardControlsEl = ref?.nativeElement ?? null;
    this._trySetupObserver();
  }

  private readonly _pillColors = [
    { bg: '#FEF3C7', text: '#92400E', dot: '#92400E' },
    { bg: '#DBEAFE', text: '#1E40AF', dot: '#1E40AF' },
    { bg: '#D1FAE5', text: '#065F46', dot: '#065F46' },
    { bg: '#EDE9FE', text: '#5B21B6', dot: '#5B21B6' },
    { bg: '#FEE2E2', text: '#991B1B', dot: '#991B1B' },
    { bg: '#CFFAFE', text: '#155E75', dot: '#155E75' }
  ];

  private _trySetupObserver() {
    if (this._observer || !this._scrollContainerEl || !this._boardControlsEl) return;

    this._observer = new IntersectionObserver(
      ([entry]) => {
        this.showStickyHeader = !entry.isIntersecting;
        this._cdr.detectChanges();
      },
      {
        root: this._scrollContainerEl,
        threshold: 0
      }
    );
    this._observer.observe(this._boardControlsEl);
  }

  ngOnDestroy() {
    this._observer?.disconnect();
  }

  public handleTeamMemberFilterChange(teamMemberId: string | null) {
    this.teamMemberFilter = teamMemberId;
  }

  public filterTickets(tickets: Ticket[]): Ticket[] {
    if (!this.teamMemberFilter) {
      return tickets;
    }
    if (this.teamMemberFilter === 'unassigned') {
      return tickets.filter(t => !t.teamMemberId);
    }
    return tickets.filter(t => t.teamMemberId === this.teamMemberFilter);
  }

  public getTicketCount(tickets: Ticket[], state: BoardState): number {
    return this.filterTickets(tickets).filter(t => t.boardStateId === state.boardStateId).length;
  }

  public getPillColor(index: number) {
    return this._pillColors[index % this._pillColors.length];
  }

  public handleNewTicket(board: Board) {
    this._dialog.open(CreateTicketComponent, {
      data: { board }
    });
  }

  public scrollToTop() {
    this._scrollContainerEl?.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
