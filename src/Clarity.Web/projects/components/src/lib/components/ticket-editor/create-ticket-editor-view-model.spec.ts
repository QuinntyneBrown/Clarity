import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardStateService, DigitalAssetService, InitiativeService, TeamMemberService, TicketService } from '@api';
import { of } from 'rxjs';
import { createTicketEditorViewModel } from './create-ticket-editor-view-model';
import { TicketStore } from '../../stores';

describe('createTicketEditorViewModel', () => {
  let mockRoute: any;
  let mockRouter: jest.Mocked<Partial<Router>>;
  let mockTicketService: jest.Mocked<Partial<TicketService>>;
  let mockTicketStore: any;
  let mockBoardStateService: jest.Mocked<Partial<BoardStateService>>;
  let mockTeamMemberService: jest.Mocked<Partial<TeamMemberService>>;
  let mockInitiativeService: jest.Mocked<Partial<InitiativeService>>;
  let mockDigitalAssetService: jest.Mocked<Partial<DigitalAssetService>>;

  const mockTicket = {
    ticketId: 't1',
    name: 'Test Ticket',
    description: 'Desc',
    acceptanceCriteria: 'AC',
    state: 0,
    priority: 'medium',
    storyPoints: 3,
    effort: 2,
    ticketType: 0,
    teamMemberId: null,
    initiativeId: null,
    url: null,
    digitalAssets: []
  };

  beforeEach(() => {
    mockRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('t1')
        }
      }
    };
    mockRouter = { navigate: jest.fn() };
    mockTicketService = {
      getById: jest.fn().mockReturnValue(of(mockTicket)),
      update: jest.fn().mockReturnValue(of(null)),
      attachFile: jest.fn().mockReturnValue(of(null)),
      detachFile: jest.fn().mockReturnValue(of(null))
    };
    mockTicketStore = {
      delete: jest.fn()
    };
    mockBoardStateService = { get: jest.fn().mockReturnValue(of([])) };
    mockTeamMemberService = { get: jest.fn().mockReturnValue(of([])) };
    mockInitiativeService = { get: jest.fn().mockReturnValue(of([])) };
    mockDigitalAssetService = {
      upload: jest.fn().mockReturnValue(of({ digitalAssetId: 'a1' })),
      getById: jest.fn().mockReturnValue(of({ digitalAssetId: 'a1' })),
      getServeUrl: jest.fn().mockReturnValue('/api/assets/a1')
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: TicketService, useValue: mockTicketService },
        { provide: TicketStore, useValue: mockTicketStore },
        { provide: BoardStateService, useValue: mockBoardStateService },
        { provide: TeamMemberService, useValue: mockTeamMemberService },
        { provide: InitiativeService, useValue: mockInitiativeService },
        { provide: DigitalAssetService, useValue: mockDigitalAssetService }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTicketEditorViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should have ticket, form, and action functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTicketEditorViewModel().subscribe(v => vm = v);
    });
    expect(vm.ticket).toBeTruthy();
    expect(vm.form).toBeTruthy();
    expect(typeof vm.save).toBe('function');
    expect(typeof vm.delete).toBe('function');
    expect(typeof vm.back).toBe('function');
  });

  it('should populate form from ticket data', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTicketEditorViewModel().subscribe(v => vm = v);
    });
    expect(vm.form.controls['name'].value).toBe('Test Ticket');
    expect(vm.form.controls['description'].value).toBe('Desc');
  });

  it('back should navigate to /my-tickets', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTicketEditorViewModel().subscribe(v => vm = v);
    });
    vm.back();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/my-tickets']);
  });

  it('should expose priorities and ticketTypes', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTicketEditorViewModel().subscribe(v => vm = v);
    });
    expect(vm.priorities).toBeTruthy();
    expect(vm.ticketTypes).toBeTruthy();
  });

  it('save should call ticketService.update', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTicketEditorViewModel().subscribe(v => vm = v);
    });
    vm.save();
    expect(mockTicketService.update).toHaveBeenCalled();
  });

  it('delete should call ticketStore.delete and navigate', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTicketEditorViewModel().subscribe(v => vm = v);
    });
    vm.delete();
    expect(mockTicketStore.delete).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/my-tickets']);
  });

  it('uploadFile should call digitalAssetService.upload when file is present', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTicketEditorViewModel().subscribe(v => vm = v);
    });
    const file = new File(['data'], 'test.txt');
    const input = { files: [file], value: 'test.txt' } as any;
    const event = { target: input } as any;
    vm.uploadFile(event);
    expect(mockDigitalAssetService.upload).toHaveBeenCalledWith({ file });
    expect(input.value).toBe('');
  });

  it('uploadFile should not call upload when no files', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTicketEditorViewModel().subscribe(v => vm = v);
    });
    (mockDigitalAssetService.upload as jest.Mock).mockClear();
    const input = { files: [], value: '' } as any;
    const event = { target: input } as any;
    vm.uploadFile(event);
    expect(mockDigitalAssetService.upload).not.toHaveBeenCalled();
  });

  it('detachFile should call ticketService.detachFile', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTicketEditorViewModel().subscribe(v => vm = v);
    });
    vm.detachFile('a1');
    expect(mockTicketService.detachFile).toHaveBeenCalledWith({ ticketId: 't1', digitalAssetId: 'a1' });
  });

  it('downloadFile should open window with serve URL', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTicketEditorViewModel().subscribe(v => vm = v);
    });
    vm.downloadFile('a1');
    expect(mockDigitalAssetService.getServeUrl).toHaveBeenCalledWith('a1');
    expect(openSpy).toHaveBeenCalledWith('/api/assets/a1', '_blank');
    openSpy.mockRestore();
  });

  it('getFileIcon should return correct icons', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTicketEditorViewModel().subscribe(v => vm = v);
    });
    expect(vm.getFileIcon('image/png')).toBe('image');
    expect(vm.getFileIcon('application/pdf')).toBe('picture_as_pdf');
    expect(vm.getFileIcon('text/plain')).toBe('code');
    expect(vm.getFileIcon('application/json')).toBe('code');
    expect(vm.getFileIcon('application/octet-stream')).toBe('description');
  });

  it('getFileIconColor should return correct colors', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createTicketEditorViewModel().subscribe(v => vm = v);
    });
    expect(vm.getFileIconColor('image/png')).toBe('#10B981');
    expect(vm.getFileIconColor('application/pdf')).toBe('#EF4444');
    expect(vm.getFileIconColor('text/plain')).toBe('#7D00FA');
    expect(vm.getFileIconColor('application/json')).toBe('#7D00FA');
    expect(vm.getFileIconColor('application/octet-stream')).toBe('#6B7280');
  });
});
