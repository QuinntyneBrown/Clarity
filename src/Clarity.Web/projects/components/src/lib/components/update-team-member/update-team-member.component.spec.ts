import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { UpdateTeamMemberComponent } from './update-team-member.component';
import { TeamMemberStore } from '../../stores';

describe('UpdateTeamMemberComponent', () => {
  let component: UpdateTeamMemberComponent;
  let fixture: ComponentFixture<UpdateTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTeamMemberComponent],
      providers: [
        { provide: TeamMemberStore, useValue: { save: jest.fn(), delete: jest.fn() } },
        { provide: DialogRef, useValue: { close: jest.fn() } },
        { provide: DIALOG_DATA, useValue: { teamMemberId: 'm1', name: 'John', email: 'john@test.com', role: 'Developer' } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(UpdateTeamMemberComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTeamMemberComponent);
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
