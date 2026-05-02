import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService, TeamMemberService, TicketService } from '@api';
import { of } from 'rxjs';
import { createKanbanViewModel } from './create-kanban-view-model';
import { TicketStore } from '../../stores';

describe('createKanbanViewModel', () => {
  let mockBoardService: jest.Mocked<Partial<BoardService>>;
  let mockTicketService: jest.Mocked<Partial<TicketService>>;
  let mockTeamMemberService: jest.Mocked<Partial<TeamMemberService>>;
  let mockTicketStore: any;
  let mockRoute: any;
  let mockRouter: jest.Mocked<Partial<Router>>;

  const mockBoard = {
    boardId: 'b1',
    name: 'Default',
    states: [{ boardStateId: 's1', name: 'Backlog', type: 0 }]
  };

  beforeEach(() => {
    mockBoardService = { getByName: jest.fn().mockReturnValue(of(mockBoard)) };
    mockTicketService = { getTicketsByBoardId: jest.fn().mockReturnValue(of([])) };
    mockTeamMemberService = { get: jest.fn().mockReturnValue(of([])) };
    mockTicketStore = {
      patchState: jest.fn(),
      select: jest.fn().mockReturnValue(of([]))
    };
    mockRoute = {
      paramMap: of({ get: (key: string) => 'Default' })
    };
    mockRouter = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: BoardService, useValue: mockBoardService },
        { provide: TicketService, useValue: mockTicketService },
        { provide: TeamMemberService, useValue: mockTeamMemberService },
        { provide: TicketStore, useValue: mockTicketStore },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createKanbanViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should expose board, tickets, boardStates, and teamMembers', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createKanbanViewModel().subscribe(v => vm = v);
    });
    expect(vm.board).toBeTruthy();
    expect(vm.tickets).toEqual([]);
    expect(vm.boardStates).toBeTruthy();
    expect(vm.teamMembers).toEqual([]);
  });

  it('should have selectBoard and reload functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createKanbanViewModel().subscribe(v => vm = v);
    });
    expect(typeof vm.selectBoard).toBe('function');
    expect(typeof vm.reload).toBe('function');
  });
});
