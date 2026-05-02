import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CurrentTeamMemberComponent } from './current-team-member.component';

describe('CurrentTeamMemberComponent', () => {
  let component: CurrentTeamMemberComponent;
  let fixture: ComponentFixture<CurrentTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentTeamMemberComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CurrentTeamMemberComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have vm$ observable', () => {
    expect(component.vm$).toBeTruthy();
  });
});
