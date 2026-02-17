// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, AuthService } from '@api';
import { LucideAngularModule, Mail, Lock, EyeOff, Eye, ArrowRight } from 'lucide-angular';

@Component({
    selector: 'app-login',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        LucideAngularModule,
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly _userService = inject(UserService);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  readonly icons = { Mail, Lock, EyeOff, Eye, ArrowRight };

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.form.value;

    this._userService.authenticate({ username: username!, password: password! }).subscribe({
      next: (response) => {
        this._authService.setSession(response.accessToken, { userId: response.userId, username: username! });
        this._router.navigate(['/']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    });
  }
}
