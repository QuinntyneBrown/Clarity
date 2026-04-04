import { TestBed } from '@angular/core/testing';
import { TeamMembersComponent, TeamMemberDialogComponent } from './team-members.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamMemberService } from '@api';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';

describe('TeamMembersComponent', () => {
  let component: TeamMembersComponent;

  const members = [
    { teamMemberId: '1', name: 'John Doe' },
    { teamMemberId: '2', name: 'Jane Smith' },
  ];

  const mockComponentInstance = {
    data: { teamMember: null as any },
    form: { reset: jest.fn(), value: { name: 'New Member' }, patchValue: jest.fn(), invalid: false },
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

  let mockTeamMemberService: any;
  let mockSnackBar: any;

  beforeEach(async () => {
    mockTeamMemberService = {
      get: jest.fn().mockReturnValue(of(members)),
      create: jest.fn().mockReturnValue(of(void 0)),
      update: jest.fn().mockReturnValue(of(void 0)),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    mockSnackBar = { open: jest.fn() };
    mockComponentInstance.data = { teamMember: null };

    await TestBed.configureTestingModule({
      imports: [TeamMembersComponent, NoopAnimationsModule, OverlayModule],
      providers: [
        { provide: TeamMemberService, useValue: mockTeamMemberService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(TeamMembersComponent, {
      set: { template: '', styleUrls: [], imports: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(TeamMembersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load members on init', () => {
    component.ngOnInit();
    expect(mockTeamMemberService.get).toHaveBeenCalled();
    expect(component.members.length).toBe(2);
    expect(component.filteredMembers.length).toBe(2);
  });

  it('should filter members by name', () => {
    component.members = members as any;
    component.searchTerm = 'John';
    component.filterMembers();
    expect(component.filteredMembers.length).toBe(1);
    expect(component.filteredMembers[0].name).toBe('John Doe');
  });

  it('should show all members when search is empty', () => {
    component.members = members as any;
    component.searchTerm = '';
    component.filterMembers();
    expect(component.filteredMembers.length).toBe(2);
  });

  it('should handle members with undefined name in filter', () => {
    component.members = [{ teamMemberId: '3' }] as any;
    component.searchTerm = 'test';
    component.filterMembers();
    expect(component.filteredMembers.length).toBe(0);
  });

  it('should get initials from a name', () => {
    expect(component.getInitials('John Doe')).toBe('JD');
  });

  it('should get single initial from single name', () => {
    expect(component.getInitials('Alice')).toBe('A');
  });

  it('should return ? for undefined name', () => {
    expect(component.getInitials(undefined)).toBe('?');
  });

  it('should return ? for empty string', () => {
    expect(component.getInitials('')).toBe('?');
  });

  it('should truncate initials to 2 characters', () => {
    expect(component.getInitials('John Michael Doe').length).toBeLessThanOrEqual(2);
  });

  it('should open create dialog', () => {
    component.openCreate();
    expect(mockDialog.open).toHaveBeenCalledWith(TeamMemberDialogComponent);
  });

  it('should open edit dialog with member data', () => {
    component.openEdit(members[0] as any);
    expect(mockDialog.open).toHaveBeenCalledWith(TeamMemberDialogComponent);
    expect(mockComponentInstance.data.teamMember).toEqual(members[0]);
  });

  it('should call teamMemberService.delete when confirmed', () => {
    component.confirmDelete(members[0] as any);
    expect(mockTeamMemberService.delete).toHaveBeenCalledWith({ teamMember: members[0] });
    expect(mockSnackBar.open).toHaveBeenCalledWith('Team member deleted', 'Close', { duration: 3000 });
  });

  it('should call teamMemberService.create when create dialog save is invoked', () => {
    component.openCreate();
    mockComponentInstance.save();
    expect(mockTeamMemberService.create).toHaveBeenCalledWith({ teamMember: { name: 'New Member' } });
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Team member added', 'Close', { duration: 3000 });
  });

  it('should call teamMemberService.update when edit dialog save is invoked', () => {
    component.openEdit(members[0] as any);
    mockComponentInstance.save();
    expect(mockTeamMemberService.update).toHaveBeenCalledWith({ teamMember: { ...members[0], name: 'New Member' } });
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Team member updated', 'Close', { duration: 3000 });
  });

  it('should not call teamMemberService.delete when not confirmed', () => {
    mockDialogRef.afterClosed.mockReturnValue(of(false));
    mockTeamMemberService.delete.mockClear();
    component.confirmDelete(members[0] as any);
    expect(mockTeamMemberService.delete).not.toHaveBeenCalled();
  });
});

describe('TeamMemberDialogComponent', () => {
  let component: TeamMemberDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamMemberDialogComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(TeamMemberDialogComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(TeamMemberDialogComponent);
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

  it('should have null teamMember by default', () => {
    expect(component.data.teamMember).toBeNull();
  });
});
