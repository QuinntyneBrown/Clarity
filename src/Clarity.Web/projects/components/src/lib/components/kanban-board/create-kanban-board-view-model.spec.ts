import { createKanbanBoardViewModel } from './create-kanban-board-view-model';

describe('createKanbanBoardViewModel', () => {
  it('should emit initial value', (done) => {
    const vm$ = createKanbanBoardViewModel();
    vm$.subscribe(vm => {
      expect(vm).toBeDefined();
      done();
    });
  });
});
