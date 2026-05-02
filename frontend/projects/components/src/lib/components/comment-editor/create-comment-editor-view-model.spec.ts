import { createCommentEditorViewModel } from './create-comment-editor-view-model';

describe('createCommentEditorViewModel', () => {
  it('should emit view model with message', (done) => {
    const vm$ = createCommentEditorViewModel();
    vm$.subscribe(vm => {
      expect(vm).toEqual({ message: 'comment-editor works!' });
      done();
    });
  });
});
