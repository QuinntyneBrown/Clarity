import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <div class="login-header">
          <div class="logo-row">
            <div class="logo">C</div>
            <span class="app-name">Clarity</span>
          </div>
          <h2 class="login-title">Sign in to Admin Panel</h2>
          <p class="login-subtitle">Enter your credentials to access the admin dashboard</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">
          <mat-form-field>
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" placeholder="admin@clarity.io" data-test="username-input">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Password</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Enter password" data-test="password-input">
            <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword" data-test="toggle-password">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          <div class="remember-row">
            <mat-checkbox formControlName="rememberMe" data-test="remember-checkbox">
              Remember me
            </mat-checkbox>
            <a class="forgot-link" href="javascript:void(0)">Forgot password?</a>
          </div>

          <button mat-flat-button color="primary" type="submit" class="sign-in-btn" [disabled]="form.invalid" data-test="sign-in-btn">
            <mat-icon>login</mat-icon>
            Sign In
          </button>
        </form>

        <div class="login-footer">
          <span>Clarity Project Management</span>
          <span class="dot">&middot;</span>
          <span>v2.0</span>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      background-color: var(--background);
    }

    .login-card {
      width: 420px;
      padding: 40px;
      background-color: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }

    .login-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      margin-bottom: 32px;
    }

    .logo-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo {
      width: 44px;
      height: 44px;
      background-color: var(--primary);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-on-primary);
      font-size: 24px;
      font-weight: 700;
    }

    .app-name {
      font-size: 28px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .login-title {
      font-size: 20px;
      font-weight: 500;
      color: var(--text-primary);
      margin: 0;
    }

    .login-subtitle {
      font-size: 14px;
      color: var(--text-secondary);
      text-align: center;
      max-width: 300px;
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .remember-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .forgot-link {
      color: var(--primary-light);
      font-size: 13px;
      text-decoration: none;
    }

    .sign-in-btn {
      height: 44px;
      font-size: 15px;
      font-weight: 500;
    }

    .sign-in-btn mat-icon {
      margin-right: 8px;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .login-footer {
      display: flex;
      justify-content: center;
      gap: 4px;
      margin-top: 32px;
      font-size: 12px;
      color: var(--text-disabled);
    }
  `]
})
export class LoginComponent {
  hidePassword = true;

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false),
  });

  constructor(private router: Router) {}

  onSubmit() {
    if (this.form.valid) {
      localStorage.setItem('clarity-admin-token', 'admin-session');
      this.router.navigate(['/dashboard']);
    }
  }
}
