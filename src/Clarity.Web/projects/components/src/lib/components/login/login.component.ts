// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hidePassword = true;
  form: FormGroup;
  loginError = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    if (this.authService.isRememberMe) {
      this.form.patchValue({
        email: this.authService.rememberedUsername,
        rememberMe: true
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.loginError = '';
      this.cdr.markForCheck();

      const { email, password, rememberMe } = this.form.value;
      this.authService.authenticate(email, password, rememberMe).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/kanban']);
        },
        error: () => {
          this.isLoading = false;
          this.loginError = 'Invalid email or password';
          this.cdr.markForCheck();
        }
      });
    }
  }
}
