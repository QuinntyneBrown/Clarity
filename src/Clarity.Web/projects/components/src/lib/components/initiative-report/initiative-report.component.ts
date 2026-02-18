import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { createInitiativeReportViewModel } from './create-initiative-report-view-model';

@Component({
    selector: 'app-initiative-report',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        PushPipe,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './initiative-report.component.html',
    styleUrls: ['./initiative-report.component.scss']
})
export class InitiativeReportComponent {
  public vm$ = createInitiativeReportViewModel();
}
