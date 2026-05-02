import { createKanbanBoardControlsViewModel } from './create-kanban-board-controls-view-model';

describe('createKanbanBoardControlsViewModel', () => {
  it('should emit view model with message', (done) => {
    const vm$ = createKanbanBoardControlsViewModel();
    vm$.subscribe(vm => {
      expect(vm).toEqual({ message: 'kanban-board-controls works!' });
      done();
    });
  });
});
