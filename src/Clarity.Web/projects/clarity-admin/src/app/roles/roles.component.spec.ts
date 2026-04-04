import { TestBed } from '@angular/core/testing';
import { RolesComponent, RoleDialogComponent } from './roles.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService, PrivilegeService } from '@api';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';

describe('RolesComponent', () => {
  let component: RolesComponent;

  const roles = [
    { roleId: 'r1', name: 'Admin' },
    { roleId: 'r2', name: 'Editor' },
  ];

  const privileges = [
    { privilegeId: 'p1', roleId: 'r1', accessRight: 'Read' },
    { privilegeId: 'p2', roleId: 'r1', accessRight: 'Write' },
    { privilegeId: 'p3', roleId: 'r2', accessRight: 'Delete' },
    { privilegeId: 'p4', roleId: 'r2', accessRight: 'Admin' },
  ];

  const mockComponentInstance = {
    data: { role: null as any },
    form: { reset: jest.fn(), value: { name: 'New Role' }, patchValue: jest.fn(), invalid: false },
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

  let mockRoleService: any;
  let mockPrivilegeService: any;
  let mockSnackBar: any;

  beforeEach(async () => {
    mockRoleService = {
      get: jest.fn().mockReturnValue(of(roles)),
      create: jest.fn().mockReturnValue(of(void 0)),
      update: jest.fn().mockReturnValue(of(void 0)),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    mockPrivilegeService = {
      get: jest.fn().mockReturnValue(of(privileges)),
    };

    mockSnackBar = { open: jest.fn() };
    mockComponentInstance.data = { role: null };

    await TestBed.configureTestingModule({
      imports: [RolesComponent, NoopAnimationsModule, OverlayModule],
      providers: [
        { provide: RoleService, useValue: mockRoleService },
        { provide: PrivilegeService, useValue: mockPrivilegeService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(RolesComponent, {
      set: { template: '', styleUrls: [], imports: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(RolesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load roles and privileges on init', () => {
    component.ngOnInit();
    expect(mockRoleService.get).toHaveBeenCalled();
    expect(mockPrivilegeService.get).toHaveBeenCalled();
    expect(component.roles.length).toBe(2);
    expect(component.privileges.length).toBe(4);
  });

  it('should filter roles by name', () => {
    component.roles = roles as any;
    component.searchTerm = 'Admin';
    component.filterRoles();
    expect(component.filteredRoles.length).toBe(1);
    expect(component.filteredRoles[0].name).toBe('Admin');
  });

  it('should show all roles when search is empty', () => {
    component.roles = roles as any;
    component.searchTerm = '';
    component.filterRoles();
    expect(component.filteredRoles.length).toBe(2);
  });

  it('should get privileges for a role', () => {
    component.privileges = privileges as any;
    const result = component.getPrivilegesForRole('r1');
    expect(result.length).toBe(2);
    expect(result[0].accessRight).toBe('Read');
  });

  it('should return empty array for undefined roleId', () => {
    component.privileges = privileges as any;
    expect(component.getPrivilegesForRole(undefined)).toEqual([]);
  });

  it('should return badge-success for read access', () => {
    expect(component.getPrivilegeBadgeClass('Read')).toBe('badge-success');
  });

  it('should return badge-info for write access', () => {
    expect(component.getPrivilegeBadgeClass('Write')).toBe('badge-info');
  });

  it('should return badge-warn for delete access', () => {
    expect(component.getPrivilegeBadgeClass('Delete')).toBe('badge-warn');
  });

  it('should return badge-primary for other access rights', () => {
    expect(component.getPrivilegeBadgeClass('Admin')).toBe('badge-primary');
  });

  it('should open create dialog', () => {
    component.openCreate();
    expect(mockDialog.open).toHaveBeenCalledWith(RoleDialogComponent);
  });

  it('should open edit dialog with role data', () => {
    component.openEdit(roles[0] as any);
    expect(mockDialog.open).toHaveBeenCalledWith(RoleDialogComponent);
    expect(mockComponentInstance.data.role).toEqual(roles[0]);
  });

  it('should call roleService.delete when confirmed', () => {
    component.confirmDelete(roles[0] as any);
    expect(mockRoleService.delete).toHaveBeenCalledWith({ role: roles[0] });
    expect(mockSnackBar.open).toHaveBeenCalledWith('Role deleted', 'Close', { duration: 3000 });
  });

  it('should call roleService.create when create dialog save is invoked', () => {
    component.openCreate();
    mockComponentInstance.save();
    expect(mockRoleService.create).toHaveBeenCalledWith({ role: { name: 'New Role' } });
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Role created', 'Close', { duration: 3000 });
  });

  it('should call roleService.update when edit dialog save is invoked', () => {
    component.openEdit(roles[0] as any);
    mockComponentInstance.save();
    expect(mockRoleService.update).toHaveBeenCalledWith({ role: { ...roles[0], name: 'New Role' } });
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Role updated', 'Close', { duration: 3000 });
  });

  it('should not call roleService.delete when not confirmed', () => {
    mockDialogRef.afterClosed.mockReturnValue(of(false));
    mockRoleService.delete.mockClear();
    component.confirmDelete(roles[0] as any);
    expect(mockRoleService.delete).not.toHaveBeenCalled();
  });
});

describe('RoleDialogComponent', () => {
  let component: RoleDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleDialogComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(RoleDialogComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(RoleDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with name control', () => {
    expect(component.form.controls.name).toBeDefined();
  });

  it('should require name', () => {
    expect(component.form.valid).toBe(false);
    component.form.patchValue({ name: 'Test' });
    expect(component.form.valid).toBe(true);
  });

  it('should have null role by default', () => {
    expect(component.data.role).toBeNull();
  });
});
