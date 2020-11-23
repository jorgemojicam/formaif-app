import { TestBed } from '@angular/core/testing';

import { IdbCrucesService } from './idb-cruces.service';

describe('IdbCrucesService', () => {
  let service: IdbCrucesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdbCrucesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
