import { TestBed } from '@angular/core/testing';

import { CarpetadigitalService } from './carpetadigital.service';

describe('CarpetadigitalService', () => {
  let service: CarpetadigitalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarpetadigitalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
