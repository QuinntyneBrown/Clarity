// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';

import { LookUpService } from './look-up.service';

describe('LookUpService', () => {
  let service: LookUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LookUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

