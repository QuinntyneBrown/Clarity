import { Destroyable } from './destroyable';

describe('Destroyable', () => {
  let instance: Destroyable;

  beforeEach(() => {
    instance = new Destroyable();
  });

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });

  it('should have a _destroyed$ subject', () => {
    expect((instance as any)._destroyed$).toBeTruthy();
  });

  it('should emit on _destroyed$ when ngOnDestroy is called', () => {
    const nextSpy = jest.fn();
    (instance as any)._destroyed$.subscribe(nextSpy);

    instance.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalledWith(null);
  });

  it('should complete _destroyed$ when ngOnDestroy is called', () => {
    const completeSpy = jest.fn();
    (instance as any)._destroyed$.subscribe({ complete: completeSpy });

    instance.ngOnDestroy();

    expect(completeSpy).toHaveBeenCalled();
  });

  it('should not emit again after ngOnDestroy has been called', () => {
    const nextSpy = jest.fn();

    instance.ngOnDestroy();

    (instance as any)._destroyed$.subscribe(nextSpy);
    expect(nextSpy).not.toHaveBeenCalled();
  });
});
