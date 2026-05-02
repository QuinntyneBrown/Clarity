import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { createFileEditorViewModel } from './create-file-editor-view-model';

@Component({
    selector: 'app-file-editor',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        PushPipe,
        MatIconModule,
        MatButtonModule,
        FormsModule
    ],
    templateUrl: './file-editor.component.html',
    styleUrls: ['./file-editor.component.scss']
})
export class FileEditorComponent {
  public vm$ = createFileEditorViewModel();

  onKeydown(event: KeyboardEvent, save: () => void) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      save();
    }
  }
}
