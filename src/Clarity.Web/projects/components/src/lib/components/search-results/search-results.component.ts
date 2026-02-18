import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { DialogModule } from '@angular/cdk/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { createSearchResultsViewModel } from './create-search-results-view-model';
import { SearchInputComponent } from '../search-input';

@Component({
    selector: 'app-search-results',
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
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent {
  public vm$ = createSearchResultsViewModel();

  filters = [
    { value: 'all', label: 'All' },
    { value: 'tickets', label: 'Tickets' },
    { value: 'members', label: 'Members' }
  ];
}
