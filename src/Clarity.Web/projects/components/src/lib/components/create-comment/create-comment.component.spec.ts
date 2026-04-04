import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CreateCommentComponent } from './create-comment.component';

describe('CreateCommentComponent', () => {
  let component: CreateCommentComponent;
  let fixture: ComponentFixture<CreateCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCommentComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CreateCommentComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have vm$ observable', () => {
    expect(component.vm$).toBeTruthy();
  });

  it('should accept ticketId input', () => {
    component.ticketId = 'ticket-1';
    expect(component.ticketId).toBe('ticket-1');
  });
});
