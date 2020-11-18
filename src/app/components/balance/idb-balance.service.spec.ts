import { TestBed } from '@angular/core/testing';

import { IdbBalanceService } from './idb-balance.service';

describe('IdbBalanceService', () => {
  let service: IdbBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdbBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
