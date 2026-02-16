// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTeamMemberComponent } from './current-team-member.component';

describe('CurrentTeamMemberComponent', () => {
  let component: CurrentTeamMemberComponent;
  let fixture: ComponentFixture<CurrentTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CurrentTeamMemberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

