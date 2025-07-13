import { TestBed } from '@angular/core/testing';

import { PowensService } from './powens.service';

describe('PowensService', () => {
  let service: PowensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PowensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
