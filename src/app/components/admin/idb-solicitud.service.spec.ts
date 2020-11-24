import { TestBed } from '@angular/core/testing';

import { IdbSolicitudService } from './idb-solicitud.service';

describe('IdbSolicitudService', () => {
  let service: IdbSolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdbSolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
