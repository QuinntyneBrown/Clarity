import { createUpsertTicketViewModel } from './create-upsert-ticket-view-model';

describe('createUpsertTicketViewModel', () => {
  it('should emit view model with message', (done) => {
    const vm$ = createUpsertTicketViewModel();
    vm$.subscribe(vm => {
      expect(vm).toEqual({ message: 'upsert-ticket works!' });
      done();
    });
  });
});
