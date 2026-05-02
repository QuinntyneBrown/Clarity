import { TestBed } from '@angular/core/testing';
import { UsersComponent, UserDialogComponent } from './users.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '@api';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';

describe('UsersComponent', () => {
  let component: UsersComponent;

  const users = [
    { userId: 'admin@clarity.io' },
    { userId: 'john@clarity.io' },
  ];

  const mockComponentInstance = {
    data: { user: null as any },
    form: { reset: jest.fn(), value: { userId: 'new@clarity.io' }, patchValue: jest.fn(), invalid: false },
    save: jest.fn(),
  };

  const mockDialogRef = {
    componentInstance: mockComponentInstance,
    afterClosed: jest.fn().mockReturnValue(of(true)),
    close: jest.fn(),
  };

  const mockDialog = {
    open: jest.fn().mockReturnValue(mockDialogRef),
  };

  let mockUserService: any;
  let mockSnackBar: any;

  beforeEach(async () => {
    mockUserService = {
      get: jest.fn().mockReturnValue(of(users)),
      create: jest.fn().mockReturnValue(of(void 0)),
      update: jest.fn().mockReturnValue(of(void 0)),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    mockSnackBar = { open: jest.fn() };
    mockComponentInstance.data = { user: null };

    await TestBed.configureTestingModule({
      imports: [UsersComponent, NoopAnimationsModule, OverlayModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(UsersComponent, {
      set: { template: '', styleUrls: [], imports: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    component.ngOnInit();
    expect(mockUserService.get).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
    expect(component.filteredUsers.length).toBe(2);
  });

  it('should filter users by userId', () => {
    component.users = users as any;
    component.searchTerm = 'admin';
    component.filterUsers();
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].userId).toBe('admin@clarity.io');
  });

  it('should show all users when search is empty', () => {
    component.users = users as any;
    component.searchTerm = '';
    component.filterUsers();
    expect(component.filteredUsers.length).toBe(2);
  });

  it('should filter case-insensitively', () => {
    component.users = users as any;
    component.searchTerm = 'ADMIN';
    component.filterUsers();
    expect(component.filteredUsers.length).toBe(1);
  });

  it('should handle users with undefined userId in filter', () => {
    component.users = [{}] as any;
    component.searchTerm = 'test';
    component.filterUsers();
    expect(component.filteredUsers.length).toBe(0);
  });

  it('should open create dialog', () => {
    component.openCreate();
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should open edit dialog with user data', () => {
    component.openEdit(users[0] as any);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockComponentInstance.data.user).toEqual(users[0]);
  });

  it('should call userService.delete when confirmed', () => {
    component.confirmDelete(users[0] as any);
    expect(mockUserService.delete).toHaveBeenCalledWith({ user: users[0] });
    expect(mockSnackBar.open).toHaveBeenCalledWith('User deleted', 'Close', { duration: 3000 });
  });

  it('should call userService.create when create dialog save is invoked', () => {
    component.openCreate();
    mockComponentInstance.save();
    expect(mockUserService.create).toHaveBeenCalledWith({ user: { userId: 'new@clarity.io' } });
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('User created', 'Close', { duration: 3000 });
  });

  it('should call userService.update when edit dialog save is invoked', () => {
    component.openEdit(users[0] as any);
    mockComponentInstance.save();
    expect(mockUserService.update).toHaveBeenCalledWith({ user: { ...users[0], userId: 'new@clarity.io' } });
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('User updated', 'Close', { duration: 3000 });
  });

  it('should not call userService.delete when not confirmed', () => {
    mockDialogRef.afterClosed.mockReturnValue(of(false));
    mockUserService.delete.mockClear();
    component.confirmDelete(users[0] as any);
    expect(mockUserService.delete).not.toHaveBeenCalled();
  });
});

describe('UserDialogComponent', () => {
  let component: UserDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDialogComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(UserDialogComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with userId control', () => {
    expect(component.form.controls.userId).toBeDefined();
  });

  it('should require userId', () => {
    expect(component.form.valid).toBe(false);
    component.form.patchValue({ userId: 'test@test.com' });
    expect(component.form.valid).toBe(true);
  });

  it('should have null user by default', () => {
    expect(component.data.user).toBeNull();
  });

  it('should have a save method', () => {
    expect(component.save).toBeDefined();
  });
});
