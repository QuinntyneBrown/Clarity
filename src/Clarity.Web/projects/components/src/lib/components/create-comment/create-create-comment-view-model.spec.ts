import { createCreateCommentViewModel } from './create-create-comment-view-model';

describe('createCreateCommentViewModel', () => {
  it('should emit view model with message', (done) => {
    const vm$ = createCreateCommentViewModel();
    vm$.subscribe(vm => {
      expect(vm).toEqual({ message: 'create-comment works!' });
      done();
    });
  });
});
