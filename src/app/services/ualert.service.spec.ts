import { TestBed } from '@angular/core/testing';

import { UAlertService } from './ualert.service';

describe('UAlertService', () => {
  let service: UAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
