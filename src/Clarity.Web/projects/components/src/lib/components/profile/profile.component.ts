// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-profile',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        ReactiveFormsModule,
        RouterModule
    ],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  editing = signal(false);

  form = this.fb.group({
    firstName: ['Quinntyne', Validators.required],
    lastName: ['Brown', Validators.required],
    email: ['quinntynebrown@gmail.com', [Validators.required, Validators.email]],
    jobTitle: ['Software Engineer'],
    phone: ['']
  });

  constructor(private fb: FormBuilder) {}

  get initials(): string {
    const first = this.form.get('firstName')?.value || '';
    const last = this.form.get('lastName')?.value || '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  }

  get fullName(): string {
    return `${this.form.get('firstName')?.value || ''} ${this.form.get('lastName')?.value || ''}`.trim();
  }

  toggleEdit() {
    this.editing.update(v => !v);
  }

  onSave() {
    if (this.form.valid) {
      this.editing.set(false);
    }
  }

  onCancel() {
    this.form.reset({
      firstName: 'Quinntyne',
      lastName: 'Brown',
      email: 'quinntynebrown@gmail.com',
      jobTitle: 'Software Engineer',
      phone: ''
    });
    this.editing.set(false);
  }
}
