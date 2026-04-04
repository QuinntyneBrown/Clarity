import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(async () => {
    routerSpy = { navigate: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(LoginComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have hidePassword set to true initially', () => {
    expect(component.hidePassword).toBe(true);
  });

  it('should have an invalid form initially', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should require username', () => {
    component.form.patchValue({ password: 'pass' });
    expect(component.form.valid).toBe(false);
    expect(component.form.controls.username.hasError('required')).toBe(true);
  });

  it('should require password', () => {
    component.form.patchValue({ username: 'admin' });
    expect(component.form.valid).toBe(false);
    expect(component.form.controls.password.hasError('required')).toBe(true);
  });

  it('should be valid when username and password are provided', () => {
    component.form.patchValue({ username: 'admin', password: 'pass' });
    expect(component.form.valid).toBe(true);
  });

  it('should not navigate when form is invalid', () => {
    component.onSubmit();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(localStorage.getItem('clarity-admin-token')).toBeNull();
  });

  it('should set localStorage token and navigate on valid submit', () => {
    component.form.patchValue({ username: 'admin', password: 'pass' });
    component.onSubmit();
    expect(localStorage.getItem('clarity-admin-token')).toBe('admin-session');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should have rememberMe defaulting to false', () => {
    expect(component.form.controls.rememberMe.value).toBe(false);
  });
});
