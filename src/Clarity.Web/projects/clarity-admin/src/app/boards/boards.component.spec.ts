import { TestBed } from '@angular/core/testing';
import { BoardsComponent, BoardDialogComponent } from './boards.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoardService } from '@api';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';

describe('BoardsComponent', () => {
  let component: BoardsComponent;

  const boards = [
    { boardId: '1', name: 'Sprint 1', states: [{ boardStateId: 's1', name: 'Todo' }] },
    { boardId: '2', name: 'Sprint 2', states: [] },
  ];

  const mockComponentInstance = {
    data: { board: null as any },
    form: { reset: jest.fn(), value: { name: 'New Board' }, patchValue: jest.fn(), invalid: false },
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

  let mockBoardService: any;
  let mockSnackBar: any;

  beforeEach(async () => {
    mockBoardService = {
      get: jest.fn().mockReturnValue(of(boards)),
      create: jest.fn().mockReturnValue(of(void 0)),
      update: jest.fn().mockReturnValue(of(void 0)),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    mockSnackBar = { open: jest.fn() };
    mockComponentInstance.data = { board: null };

    await TestBed.configureTestingModule({
      imports: [BoardsComponent, NoopAnimationsModule, OverlayModule],
      providers: [
        { provide: BoardService, useValue: mockBoardService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(BoardsComponent, {
      set: { template: '', styleUrls: [], imports: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(BoardsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load boards on init', () => {
    component.ngOnInit();
    expect(mockBoardService.get).toHaveBeenCalled();
    expect(component.boards.length).toBe(2);
    expect(component.filteredBoards.length).toBe(2);
  });

  it('should filter boards by search term', () => {
    component.boards = boards as any;
    component.searchTerm = 'Sprint 1';
    component.filterBoards();
    expect(component.filteredBoards.length).toBe(1);
    expect(component.filteredBoards[0].name).toBe('Sprint 1');
  });

  it('should show all boards when search term is empty', () => {
    component.boards = boards as any;
    component.searchTerm = '';
    component.filterBoards();
    expect(component.filteredBoards.length).toBe(2);
  });

  it('should filter case-insensitively', () => {
    component.boards = boards as any;
    component.searchTerm = 'sprint';
    component.filterBoards();
    expect(component.filteredBoards.length).toBe(2);
  });

  it('should open create dialog', () => {
    component.openCreate();
    expect(mockDialog.open).toHaveBeenCalledWith(BoardDialogComponent);
  });

  it('should open edit dialog with board data', () => {
    component.openEdit(boards[0] as any);
    expect(mockDialog.open).toHaveBeenCalledWith(BoardDialogComponent);
    expect(mockComponentInstance.data.board).toEqual(boards[0]);
  });

  it('should open confirm delete dialog', () => {
    component.confirmDelete(boards[0] as any);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should call boardService.delete when confirmed', () => {
    component.confirmDelete(boards[0] as any);
    expect(mockBoardService.delete).toHaveBeenCalledWith({ board: boards[0] });
    expect(mockSnackBar.open).toHaveBeenCalledWith('Board deleted', 'Close', { duration: 3000 });
  });

  it('should call boardService.create when create dialog save is invoked', () => {
    component.openCreate();
    mockComponentInstance.save();
    expect(mockBoardService.create).toHaveBeenCalledWith({ name: 'New Board', states: [] });
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Board created', 'Close', { duration: 3000 });
  });

  it('should call boardService.update when edit dialog save is invoked', () => {
    component.openEdit(boards[0] as any);
    mockComponentInstance.save();
    expect(mockBoardService.update).toHaveBeenCalledWith({ board: { ...boards[0], name: 'New Board' } });
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Board updated', 'Close', { duration: 3000 });
  });

  it('should not call boardService.delete when not confirmed', () => {
    mockDialogRef.afterClosed.mockReturnValue(of(false));
    mockBoardService.delete.mockClear();
    component.confirmDelete(boards[0] as any);
    expect(mockBoardService.delete).not.toHaveBeenCalled();
  });
});

describe('BoardDialogComponent', () => {
  let component: BoardDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardDialogComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(BoardDialogComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(BoardDialogComponent);
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

  it('should have null board by default', () => {
    expect(component.data.board).toBeNull();
  });

  it('should have a save method', () => {
    expect(component.save).toBeDefined();
  });
});
