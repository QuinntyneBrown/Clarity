import { createBoardListViewModel } from './create-board-list-view-model';

describe('createBoardListViewModel', () => {
  it('should emit view model with message', (done) => {
    const vm$ = createBoardListViewModel();

    vm$.subscribe(vm => {
      expect(vm).toEqual({ message: 'board-list works!' });
      done();
    });
  });

  it('should complete after emitting', (done) => {
    const vm$ = createBoardListViewModel();

    vm$.subscribe({
      complete: () => {
        done();
      }
    });
  });
});
