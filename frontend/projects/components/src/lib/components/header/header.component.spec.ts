import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(HeaderComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a signOut EventEmitter', () => {
    expect(component.signOut).toBeTruthy();
  });

  it('should emit signOut when onSignOut is called', () => {
    const spy = jest.fn();
    component.signOut.subscribe(spy);

    component.onSignOut();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
