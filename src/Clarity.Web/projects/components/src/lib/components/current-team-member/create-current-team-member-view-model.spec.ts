import { createCurrentTeamMemberViewModel } from './create-current-team-member-view-model';

describe('createCurrentTeamMemberViewModel', () => {
  it('should emit view model with message', (done) => {
    const vm$ = createCurrentTeamMemberViewModel();
    vm$.subscribe(vm => {
      expect(vm).toEqual({ message: 'current-team-member works!' });
      done();
    });
  });
});
