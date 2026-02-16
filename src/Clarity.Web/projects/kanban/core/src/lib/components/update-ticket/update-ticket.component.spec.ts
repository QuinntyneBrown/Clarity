// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTicketComponent } from './update-ticket.component';

describe('UpdateTicketComponent', () => {
  let component: UpdateTicketComponent;
  let fixture: ComponentFixture<UpdateTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UpdateTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

