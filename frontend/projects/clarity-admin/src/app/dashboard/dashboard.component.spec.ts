import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import {
  UserService,
  TicketService,
  BoardService,
  TeamMemberService,
  RoleService,
  CommentService,
  DigitalAssetService,
  PrivilegeService,
} from '@api';

describe('DashboardComponent', () => {
  let component: DashboardComponent;

  const mockUserService = { get: jest.fn().mockReturnValue(of([{ userId: '1' }, { userId: '2' }])) };
  const mockTicketService = { get: jest.fn().mockReturnValue(of([{ ticketId: '1' }])) };
  const mockBoardService = { get: jest.fn().mockReturnValue(of([{ boardId: '1' }, { boardId: '2' }, { boardId: '3' }])) };
  const mockTeamMemberService = { get: jest.fn().mockReturnValue(of([{ teamMemberId: '1' }])) };
  const mockRoleService = { get: jest.fn().mockReturnValue(of([{ roleId: '1' }, { roleId: '2' }])) };
  const mockCommentService = { get: jest.fn().mockReturnValue(of([{ commentId: '1' }, { commentId: '2' }, { commentId: '3' }, { commentId: '4' }])) };
  const mockDigitalAssetService = { get: jest.fn().mockReturnValue(of([{ digitalAssetId: '1' }])) };
  const mockPrivilegeService = { get: jest.fn().mockReturnValue(of([{ privilegeId: '1' }, { privilegeId: '2' }, { privilegeId: '3' }])) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: TicketService, useValue: mockTicketService },
        { provide: BoardService, useValue: mockBoardService },
        { provide: TeamMemberService, useValue: mockTeamMemberService },
        { provide: RoleService, useValue: mockRoleService },
        { provide: CommentService, useValue: mockCommentService },
        { provide: DigitalAssetService, useValue: mockDigitalAssetService },
        { provide: PrivilegeService, useValue: mockPrivilegeService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(DashboardComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 metricsRow1 cards initialized to 0', () => {
    expect(component.metricsRow1.length).toBe(4);
    component.metricsRow1.forEach(m => expect(m.value).toBe(0));
  });

  it('should have 4 metricsRow2 cards initialized to 0', () => {
    expect(component.metricsRow2.length).toBe(4);
    component.metricsRow2.forEach(m => expect(m.value).toBe(0));
  });

  it('should have 4 recent activity items', () => {
    expect(component.recentActivity.length).toBe(4);
  });

  it('should populate metrics on ngOnInit via forkJoin', () => {
    component.ngOnInit();

    expect(mockUserService.get).toHaveBeenCalled();
    expect(mockTicketService.get).toHaveBeenCalled();
    expect(mockBoardService.get).toHaveBeenCalled();
    expect(mockTeamMemberService.get).toHaveBeenCalled();
    expect(mockRoleService.get).toHaveBeenCalled();
    expect(mockCommentService.get).toHaveBeenCalled();
    expect(mockDigitalAssetService.get).toHaveBeenCalled();
    expect(mockPrivilegeService.get).toHaveBeenCalled();

    expect(component.metricsRow1[0].value).toBe(2);  // users
    expect(component.metricsRow1[1].value).toBe(1);  // tickets
    expect(component.metricsRow1[2].value).toBe(3);  // boards
    expect(component.metricsRow1[3].value).toBe(1);  // team members
    expect(component.metricsRow2[0].value).toBe(2);  // roles
    expect(component.metricsRow2[1].value).toBe(4);  // comments
    expect(component.metricsRow2[2].value).toBe(1);  // digital assets
    expect(component.metricsRow2[3].value).toBe(3);  // privileges
  });

  it('should have correct labels in metricsRow1', () => {
    expect(component.metricsRow1.map(m => m.label)).toEqual([
      'Users', 'Tickets', 'Boards', 'Team Members'
    ]);
  });

  it('should have correct labels in metricsRow2', () => {
    expect(component.metricsRow2.map(m => m.label)).toEqual([
      'Roles', 'Comments', 'Digital Assets', 'Privileges'
    ]);
  });
});
