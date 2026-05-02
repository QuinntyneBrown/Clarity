import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { CreateTeamMemberComponent } from './create-team-member.component';
import { TeamMemberStore } from '../../stores';

describe('CreateTeamMemberComponent', () => {
  let component: CreateTeamMemberComponent;
  let fixture: ComponentFixture<CreateTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTeamMemberComponent],
      providers: [
        { provide: TeamMemberStore, useValue: { save: jest.fn() } },
        { provide: DialogRef, useValue: { close: jest.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CreateTeamMemberComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTeamMemberComponent);
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
