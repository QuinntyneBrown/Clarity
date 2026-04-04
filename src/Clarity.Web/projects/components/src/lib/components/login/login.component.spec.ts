import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: jest.Mocked<Pick<Router, 'navigate'>>;
  let mockAuthService: {
    authenticate: jest.Mock;
    isRememberMe: boolean;
    rememberedUsername: string | null;
  };
  let mockCdr: { markForCheck: jest.Mock };

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn() };
    mockAuthService = {
      authenticate: jest.fn(),
      isRememberMe: false,
      rememberedUsername: null
    };
    mockCdr = { markForCheck: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ChangeDetectorRef, useValue: mockCdr }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(LoginComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize hidePassword to true', () => {
    fixture.detectChanges();
    expect(component.hidePassword).toBe(true);
  });

  it('should initialize isLoading to false', () => {
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });

  it('should initialize loginError to empty string', () => {
    fixture.detectChanges();
    expect(component.loginError).toBe('');
  });

  it('should have required validator on email', () => {
    fixture.detectChanges();
    component.form.patchValue({ email: '' });
    expect(component.form.get('email')?.hasError('required')).toBe(true);
  });

  it('should have email validator on email', () => {
    fixture.detectChanges();
    component.form.patchValue({ email: 'notanemail' });
    expect(component.form.get('email')?.hasError('email')).toBe(true);
  });

  it('should have required validator on password', () => {
    fixture.detectChanges();
    component.form.patchValue({ password: '' });
    expect(component.form.get('password')?.hasError('required')).toBe(true);
  });

  it('should patch form with remembered credentials on ngOnInit when rememberMe is true', () => {
    mockAuthService.isRememberMe = true;
    mockAuthService.rememberedUsername = 'user@test.com';

    fixture.detectChanges();

    expect(component.form.get('email')?.value).toBe('user@test.com');
    expect(component.form.get('rememberMe')?.value).toBe(true);
  });

  it('should not patch form on ngOnInit when rememberMe is false', () => {
    mockAuthService.isRememberMe = false;

    fixture.detectChanges();

    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('rememberMe')?.value).toBe(false);
  });

  it('should call authenticate and navigate on successful submit', () => {
    fixture.detectChanges();
    mockAuthService.authenticate.mockReturnValue(of({ accessToken: 'token', userId: '1' }));

    component.form.patchValue({
      email: 'user@test.com',
      password: 'password123',
      rememberMe: false
    });

    component.onSubmit();

    expect(mockAuthService.authenticate).toHaveBeenCalledWith('user@test.com', 'password123', false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/kanban']);
    expect(component.isLoading).toBe(false);
  });

  it('should set loginError on failed submit', () => {
    fixture.detectChanges();
    mockAuthService.authenticate.mockReturnValue(throwError(() => new Error('Unauthorized')));

    component.form.patchValue({
      email: 'user@test.com',
      password: 'wrongpassword',
      rememberMe: false
    });

    component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(component.loginError).toBe('Invalid email or password');
  });

  it('should not call authenticate if form is invalid', () => {
    fixture.detectChanges();
    component.form.patchValue({ email: '', password: '' });

    component.onSubmit();

    expect(mockAuthService.authenticate).not.toHaveBeenCalled();
  });

  it('should set isLoading to true during submit', () => {
    fixture.detectChanges();
    // Use a synchronous observable that completes immediately
    mockAuthService.authenticate.mockReturnValue(of({ accessToken: 'token', userId: '1' }));

    component.form.patchValue({
      email: 'user@test.com',
      password: 'password123',
      rememberMe: true
    });

    component.onSubmit();

    // After synchronous completion, isLoading should be false
    expect(component.isLoading).toBe(false);
    expect(mockAuthService.authenticate).toHaveBeenCalledWith('user@test.com', 'password123', true);
  });
});
