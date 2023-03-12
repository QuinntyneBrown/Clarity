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
