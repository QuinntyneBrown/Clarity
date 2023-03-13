// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertTicketComponent } from './upsert-ticket.component';

describe('UpsertTicketComponent', () => {
  let component: UpsertTicketComponent;
  let fixture: ComponentFixture<UpsertTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UpsertTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

