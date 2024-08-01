import { TestBed } from '@angular/core/testing';

import { LocalizacionService } from './localizacion.service';

describe('LocalizacionService', () => {
  let service: LocalizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
