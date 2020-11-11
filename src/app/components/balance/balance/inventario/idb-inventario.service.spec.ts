import { TestBed } from '@angular/core/testing';

import { IdbInventarioService } from './idb-inventario.service';

describe('IdbInventarioService', () => {
  let service: IdbInventarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdbInventarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
