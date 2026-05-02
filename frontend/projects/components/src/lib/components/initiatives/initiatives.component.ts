import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { createInitiativesViewModel } from './create-initiatives-view-model';
import { SearchInputComponent } from '../search-input';

@Component({
    selector: 'app-initiatives',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        PushPipe,
        MatIconModule,
        MatButtonModule,
        SearchInputComponent
    ],
    templateUrl: './initiatives.component.html',
    styleUrls: ['./initiatives.component.scss']
})
export class InitiativesComponent {
  public vm$ = createInitiativesViewModel();
}
