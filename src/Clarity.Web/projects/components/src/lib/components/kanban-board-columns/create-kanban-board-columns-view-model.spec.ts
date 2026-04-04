import { createKanbanBoardColumnsViewModel } from './create-kanban-board-columns-view-model';

describe('createKanbanBoardColumnsViewModel', () => {
  it('should emit view model with message', (done) => {
    const vm$ = createKanbanBoardColumnsViewModel();
    vm$.subscribe(vm => {
      expect(vm).toEqual({ message: 'kanban-board-columns works!' });
      done();
    });
  });
});
