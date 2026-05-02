import { createTicketViewModel } from './create-ticket-view-model';

describe('createTicketViewModel', () => {
  it('should emit view model with message', (done) => {
    const vm$ = createTicketViewModel();

    vm$.subscribe(vm => {
      expect(vm).toEqual({ message: 'ticket works!' });
      done();
    });
  });

  it('should complete after emitting', (done) => {
    const vm$ = createTicketViewModel();

    vm$.subscribe({
      complete: () => {
        done();
      }
    });
  });
});
