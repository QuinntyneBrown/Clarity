import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TicketService } from './tickets';
import { StateService } from './states';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';

import { KanbanBoardColumnComponent } from './kanban-board/kanban-board-column.component';
import { TicketComponent } from './tickets/ticket.component';
import { UpsertTicket } from './tickets/upsert-ticket';
import { OverlayRefProvider } from './core/overlay-ref-provider';
import { UpsertTicketComponent } from './tickets/upsert-ticket.component';

@NgModule({
  declarations: [
    AppComponent,
    KanbanBoardColumnComponent,
    TicketComponent
  ],
  entryComponents: [
    UpsertTicketComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    OverlayModule,
  ],
  providers: [
    UpsertTicket,
    OverlayRefProvider,
    TicketService,
    StateService,
    { provide: 'BASE_URL', useValue: 'https://localhost:44354/' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
