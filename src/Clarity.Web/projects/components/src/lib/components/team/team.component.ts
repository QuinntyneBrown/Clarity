import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { createTeamViewModel } from './create-team-view-model';
import { SearchInputComponent } from '../search-input';

@Component({
    selector: 'app-team',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        PushPipe,
        MatIconModule,
        MatButtonModule,
        SearchInputComponent
    ],
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss']
})
export class TeamComponent {
  public vm$ = createTeamViewModel();
}
