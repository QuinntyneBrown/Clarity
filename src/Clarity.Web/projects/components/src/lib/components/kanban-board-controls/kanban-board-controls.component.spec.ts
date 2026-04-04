import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { of } from 'rxjs';
import { KanbanBoardControlsComponent } from './kanban-board-controls.component';

describe('KanbanBoardControlsComponent', () => {
  let component: KanbanBoardControlsComponent;
  let fixture: ComponentFixture<KanbanBoardControlsComponent>;
  let mockDialog: any;

  beforeEach(async () => {
    mockDialog = { open: jest.fn().mockReturnValue({ closed: of(null) }) };

    await TestBed.configureTestingModule({
      imports: [KanbanBoardControlsComponent],
      providers: [
        { provide: Dialog, useValue: mockDialog }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(KanbanBoardControlsComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanBoardControlsComponent);
    component = fixture.componentInstance;
    (component as any)._dialog = mockDialog;
    component.board = { boardId: 'b1', name: 'Test', states: [] } as any;
    component.teamMembers = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have vm$ observable', () => {
    expect(component.vm$).toBeTruthy();
  });

  it('getInitials should return correct initials', () => {
    expect(component.getInitials('John Doe')).toBe('JD');
    expect(component.getInitials('Alice')).toBe('AL');
    expect(component.getInitials(undefined)).toBe('?');
  });

  it('selectFilter should update selectedTeamMemberId and emit', () => {
    const spy = jest.fn();
    component.teamMemberFilterChange.subscribe(spy);
    component.selectFilter('m1');
    expect(component.selectedTeamMemberId).toBe('m1');
    expect(spy).toHaveBeenCalledWith('m1');
  });

  it('getAvatarColor should return a color string', () => {
    const member = { name: 'Test' } as any;
    component.teamMembers = [member];
    const color = component.getAvatarColor(member);
    expect(typeof color).toBe('string');
  });

  it('should have boardSelected output', () => {
    const spy = jest.fn();
    component.boardSelected.subscribe(spy);
    component.boardSelected.emit('board-1');
    expect(spy).toHaveBeenCalledWith('board-1');
  });

  it('handleClick should open CreateTicketComponent dialog', () => {
    component.handleClick();
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('handleSelectBoardClick should open SelectBoardComponent dialog', () => {
    component.handleSelectBoardClick();
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('handleSelectBoardClick should emit boardSelected when result is string', () => {
    mockDialog.open = jest.fn().mockReturnValue({ closed: of('board-2') });
    const spy = jest.fn();
    component.boardSelected.subscribe(spy);
    component.handleSelectBoardClick();
    expect(spy).toHaveBeenCalledWith('board-2');
  });

  it('handleSelectBoardClick should call handleCreateBoardClick when action is create', () => {
    mockDialog.open = jest.fn()
      .mockReturnValueOnce({ closed: of({ action: 'create' }) })
      .mockReturnValueOnce({ closed: of(null) });
    const spy = jest.spyOn(component, 'handleCreateBoardClick');
    component.handleSelectBoardClick();
    expect(spy).toHaveBeenCalled();
  });

  it('handleSelectBoardClick should call handleCloneBoardClick when action is clone', () => {
    mockDialog.open = jest.fn()
      .mockReturnValueOnce({ closed: of({ action: 'clone' }) })
      .mockReturnValueOnce({ closed: of(null) });
    const spy = jest.spyOn(component, 'handleCloneBoardClick');
    component.handleSelectBoardClick();
    expect(spy).toHaveBeenCalled();
  });

  it('handleSelectBoardClick should call handleDeleteBoardClick when action is delete', () => {
    mockDialog.open = jest.fn()
      .mockReturnValueOnce({ closed: of({ action: 'delete' }) })
      .mockReturnValueOnce({ closed: of(null) });
    const spy = jest.spyOn(component, 'handleDeleteBoardClick');
    component.handleSelectBoardClick();
    expect(spy).toHaveBeenCalled();
  });

  it('handleSelectBoardClick should do nothing when result is null', () => {
    mockDialog.open = jest.fn().mockReturnValue({ closed: of(null) });
    const spy = jest.fn();
    component.boardSelected.subscribe(spy);
    component.handleSelectBoardClick();
    expect(spy).not.toHaveBeenCalled();
  });

  it('handleCreateBoardClick should open CreateBoardComponent and emit when result has name', () => {
    mockDialog.open = jest.fn().mockReturnValue({ closed: of({ name: 'New Board' }) });
    const spy = jest.fn();
    component.boardSelected.subscribe(spy);
    component.handleCreateBoardClick();
    expect(spy).toHaveBeenCalledWith('New Board');
  });

  it('handleCloneBoardClick should open CloneBoardComponent and emit boardCloned', () => {
    mockDialog.open = jest.fn().mockReturnValue({ closed: of(true) });
    const spy = jest.fn();
    component.boardCloned.subscribe(spy);
    component.handleCloneBoardClick();
    expect(spy).toHaveBeenCalled();
  });

  it('handleCloneBoardClick should not emit when result is falsy', () => {
    mockDialog.open = jest.fn().mockReturnValue({ closed: of(null) });
    const spy = jest.fn();
    component.boardCloned.subscribe(spy);
    component.handleCloneBoardClick();
    expect(spy).not.toHaveBeenCalled();
  });

  it('handleDeleteBoardClick should open DeleteBoardComponent and emit boardDeleted', () => {
    mockDialog.open = jest.fn().mockReturnValue({ closed: of(true) });
    const spy = jest.fn();
    component.boardDeleted.subscribe(spy);
    component.handleDeleteBoardClick();
    expect(spy).toHaveBeenCalled();
  });

  it('handleDeleteBoardClick should not emit when result is falsy', () => {
    mockDialog.open = jest.fn().mockReturnValue({ closed: of(null) });
    const spy = jest.fn();
    component.boardDeleted.subscribe(spy);
    component.handleDeleteBoardClick();
    expect(spy).not.toHaveBeenCalled();
  });
});
