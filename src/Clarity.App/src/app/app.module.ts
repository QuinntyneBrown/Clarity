import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TicketService } from './tickets';
import { BoardStateService } from './board-states';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { KanbanBoardColumnComponent } from './kanban-board/kanban-board-column.component';
import { TicketComponent } from './tickets/ticket.component';
import { UpsertTicket } from './tickets/upsert-ticket';
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
import { MatListModule } from '@angular/material/list';
import { UnauthorizedResponseInterceptor } from './identity/unauthorized-response.interceptor';
import { CommentService } from './comments/comment.service';
import { CreateCommentComponent } from './comments/create-comment.component';
import { OverlayRefProvider } from '@core/overlay-ref-provider';
import { baseUrl } from '@core/contants';

@NgModule({
  declarations: [
    AppComponent,
    KanbanBoardColumnComponent,
    TicketComponent,
    UpsertTicketComponent,
    LoginComponent,
    SelectBoardComponent,
    CreateCommentComponent
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    OverlayModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatListModule,
  ],
  providers: [
    BoardService,
    CommentService,
    UpsertTicket,
    Login,
    OverlayRefProvider,
    TicketService,
    BoardStateService,
    TeamMemberService,
    SelectBoard,
    { provide: baseUrl, useValue: 'https://localhost:5001/' },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OAuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedResponseInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }