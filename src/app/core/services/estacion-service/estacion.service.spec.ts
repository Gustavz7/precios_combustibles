import { TestBed } from '@angular/core/testing';

import { EstacionService } from './estacion.service';

describe('EstacionService', () => {
  let service: EstacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
