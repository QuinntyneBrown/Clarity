import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SearchInputComponent } from './search-input.component';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInputComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchInputComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default placeholder', () => {
    expect(component.placeholder).toBe('Search...');
  });

  it('should have default empty value', () => {
    expect(component.value).toBe('');
  });

  it('should update value and emit valueChange on onInput', () => {
    const valueChangeSpy = jest.fn();
    component.valueChange.subscribe(valueChangeSpy);

    const mockEvent = { target: { value: 'test query' } } as unknown as Event;
    component.onInput(mockEvent);

    expect(component.value).toBe('test query');
    expect(valueChangeSpy).toHaveBeenCalledWith('test query');
  });

  it('should emit search on Enter keydown', () => {
    const searchSpy = jest.fn();
    component.search.subscribe(searchSpy);

    component.value = 'search term';
    const mockEvent = { key: 'Enter' } as KeyboardEvent;
    component.onKeydown(mockEvent);

    expect(searchSpy).toHaveBeenCalledWith('search term');
  });

  it('should not emit search on non-Enter keydown', () => {
    const searchSpy = jest.fn();
    component.search.subscribe(searchSpy);

    const mockEvent = { key: 'a' } as KeyboardEvent;
    component.onKeydown(mockEvent);

    expect(searchSpy).not.toHaveBeenCalled();
  });

  it('should clear value and emit on clear()', () => {
    const valueChangeSpy = jest.fn();
    const searchSpy = jest.fn();
    component.valueChange.subscribe(valueChangeSpy);
    component.search.subscribe(searchSpy);

    component.value = 'something';
    component.clear();

    expect(component.value).toBe('');
    expect(valueChangeSpy).toHaveBeenCalledWith('');
    expect(searchSpy).toHaveBeenCalledWith('');
  });
});
