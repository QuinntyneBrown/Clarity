import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TicketService } from './tickets';
import { StateService } from './states';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { KanbanBoardColumnComponent } from './kanban-board/kanban-board-column.component';
import { TicketComponent } from './tickets/ticket.component';
import { UpsertTicket } from './tickets/upsert-ticket';
import { OverlayRefProvider } from './core/overlay-ref-provider';
import { UpsertTicketComponent } from './tickets/upsert-ticket.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Login } from './identity/login';
import { LoginComponent } from './identity/login.component';
import { MatCardModule } from '@angular/material/card';
import { BoardService } from './boards/board.service';
import { MatSelectModule } from '@angular/material/select';
import { OAuthInterceptor } from './identity/oauth.interceptor';
import { TeamMemberService } from './team-members/team-member.service';
import { SelectBoard } from './boards/select-board';
import { SelectBoardComponent } from './boards/select-board.component';

@NgModule({
  declarations: [
    AppComponent,
    KanbanBoardColumnComponent,
    TicketComponent,
    UpsertTicketComponent,
    LoginComponent,
    SelectBoardComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    OverlayModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule
  ],
  providers: [
    BoardService,
    UpsertTicket,
    Login,
    OverlayRefProvider,
    TicketService,
    StateService,
    TeamMemberService,
    SelectBoard,
    { provide: 'BASE_URL', useValue: 'https://localhost:44354/' },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OAuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
