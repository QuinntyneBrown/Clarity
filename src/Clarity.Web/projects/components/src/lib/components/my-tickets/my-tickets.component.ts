import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { DialogModule } from '@angular/cdk/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { createMyTicketsViewModel } from './create-my-tickets-view-model';
import { SearchInputComponent } from '../search-input';

@Component({
    selector: 'app-my-tickets',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        PushPipe,
        DialogModule,
        MatIconModule,
        MatButtonModule,
        SearchInputComponent
    ],
    templateUrl: './my-tickets.component.html',
    styleUrls: ['./my-tickets.component.scss']
})
export class MyTicketsComponent {
  public vm$ = createMyTicketsViewModel();

  filters = [
    { value: 'all', label: 'All' },
    { value: 'backlog', label: 'Backlog' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'high', label: 'High' },
    { value: 'done', label: 'Done' }
  ];
}
