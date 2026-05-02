import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SearchInputComponent } from '../search-input';
import { createFileManagementViewModel } from './create-file-management-view-model';

@Component({
    selector: 'app-file-management',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        PushPipe,
        MatIconModule,
        MatButtonModule,
        SearchInputComponent
    ],
    templateUrl: './file-management.component.html',
    styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  public vm$ = createFileManagementViewModel();

  onFileSelected(event: Event, upload: (file: File) => void) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      upload(input.files[0]);
      input.value = '';
    }
  }
}
