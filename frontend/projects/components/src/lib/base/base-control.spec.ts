import { BaseControl } from './base-control';

describe('BaseControl', () => {
  let instance: BaseControl;

  beforeEach(() => {
    instance = new BaseControl();
  });

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });

  it('should extend Destroyable', () => {
    expect(instance.ngOnDestroy).toBeDefined();
    expect((instance as any)._destroyed$).toBeTruthy();
  });

  describe('ControlValueAccessor methods', () => {
    it('should have writeValue method', () => {
      expect(instance.writeValue).toBeDefined();
      expect(() => instance.writeValue('test')).not.toThrow();
    });

    it('should have registerOnChange method', () => {
      expect(instance.registerOnChange).toBeDefined();
      expect(() => instance.registerOnChange(jest.fn())).not.toThrow();
    });

    it('should have registerOnTouched method', () => {
      expect(instance.registerOnTouched).toBeDefined();
      expect(() => instance.registerOnTouched(jest.fn())).not.toThrow();
    });

    it('should have setDisabledState method', () => {
      expect(instance.setDisabledState).toBeDefined();
      expect(() => instance.setDisabledState!(true)).not.toThrow();
      expect(() => instance.setDisabledState!(false)).not.toThrow();
    });
  });

  describe('Destroyable behavior', () => {
    it('should emit and complete _destroyed$ on ngOnDestroy', () => {
      const nextSpy = jest.fn();
      const completeSpy = jest.fn();
      (instance as any)._destroyed$.subscribe({ next: nextSpy, complete: completeSpy });

      instance.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalledWith(null);
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
