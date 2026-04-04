import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { AppLayoutComponent, APP_VERSION } from './app-layout.component';
import { AuthService } from '../auth.service';

describe('AppLayoutComponent', () => {
  let component: AppLayoutComponent;
  let fixture: ComponentFixture<AppLayoutComponent>;
  let mockRouter: jest.Mocked<Pick<Router, 'navigate'>>;
  let mockAuthService: jest.Mocked<Pick<AuthService, 'logout'>>;
  let mockBreakpointObserver: { observe: jest.Mock };

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn() };
    mockAuthService = { logout: jest.fn() };
    mockBreakpointObserver = {
      observe: jest.fn().mockReturnValue(of({ matches: false, breakpoints: {} }))
    };

    await TestBed.configureTestingModule({
      imports: [AppLayoutComponent],
      providers: [
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(AppLayoutComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(AppLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default version to empty string when APP_VERSION not provided', () => {
    expect(component.version).toBe('');
  });

  it('should call authService.logout and navigate on onSignOut', () => {
    component.onSignOut();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should expose isMobile$ observable', (done) => {
    component.isMobile$.subscribe(value => {
      expect(value).toBe(false);
      done();
    });
  });
});

describe('AppLayoutComponent with APP_VERSION', () => {
  let component: AppLayoutComponent;
  let fixture: ComponentFixture<AppLayoutComponent>;

  beforeEach(async () => {
    const mockBreakpointObserver = {
      observe: jest.fn().mockReturnValue(of({ matches: false, breakpoints: {} }))
    };

    await TestBed.configureTestingModule({
      imports: [AppLayoutComponent],
      providers: [
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: AuthService, useValue: { logout: jest.fn() } },
        { provide: APP_VERSION, useValue: '2.0.0' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(AppLayoutComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(AppLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should use provided APP_VERSION', () => {
    expect(component.version).toBe('2.0.0');
  });
});
