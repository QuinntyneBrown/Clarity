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
import { UpsertTicket, UpsertTicketComponent, TicketComponent } from './tickets';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BoardService } from './boards/board.service';
import { MatSelectModule } from '@angular/material/select';
import { OAuthInterceptor } from './@core/oauth.interceptor';
import { TeamMemberService } from './team-members/team-member.service';
import { MatListModule } from '@angular/material/list';
import { UnauthorizedResponseInterceptor } from './@core/unauthorized-response.interceptor';
import { CommentService } from './comments/comment.service';
import { OverlayRefProvider } from '@core/overlay-ref-provider';
import { baseUrl } from '@core/constants';
import { KanbanBoardControlsComponent } from './kanban-board/kanban-board-controls/kanban-board-controls.component';
import { TicketEditorComponent } from './tickets/ticket-editor/ticket-editor.component';
import { CommentEditorComponent } from './comments/comment-editor/comment-editor.component';
import { KanbanBoardColumnComponent } from './kanban-board/kanban-board-column/kanban-board-column.component';
import { LoginComponent } from './identity/login/login.component';
import { SelectBoardComponent } from './boards/select-board/select-board.component';
import { CreateCommentComponent } from './comments/create-comment/create-comment.component';
import { Login } from './identity/login/login';
import { SelectBoard } from './boards/select-board/select-board';

@NgModule({
  declarations: [
    AppComponent,
    KanbanBoardColumnComponent,
    TicketComponent,
    UpsertTicketComponent,
    LoginComponent,
    SelectBoardComponent,
    CreateCommentComponent,
    KanbanBoardControlsComponent,
    TicketEditorComponent,
    CommentEditorComponent
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    OverlayModule,
    MatInputModule,
    BrowserAnimationsModule,
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
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
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