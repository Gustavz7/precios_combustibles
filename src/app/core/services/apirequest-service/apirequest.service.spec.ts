import { TestBed } from '@angular/core/testing';

import { CombustibleService } from './apirequest.service';

describe('CombustibleService', () => {
  let service: CombustibleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CombustibleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
