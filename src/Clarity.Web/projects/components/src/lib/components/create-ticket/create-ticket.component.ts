import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createCreateTicketViewModel } from './create-create-ticket-view-model';
import { PushPipe } from '@ngrx/component';
import { DialogModule } from '@angular/cdk/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-create-ticket',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushPipe,
        DialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule
    ],
    templateUrl: './create-ticket.component.html',
    styleUrls: ['./create-ticket.component.scss']
})
export class CreateTicketComponent {
  public vm$ = createCreateTicketViewModel();
}
