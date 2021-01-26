import { TestBed } from '@angular/core/testing';

import { AppcookieService } from './appcookie.service';

describe('AppcookieService', () => {
  let service: AppcookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppcookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
