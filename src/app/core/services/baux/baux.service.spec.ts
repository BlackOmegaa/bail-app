import { TestBed } from '@angular/core/testing';

import { BauxService } from './baux.service';

describe('BauxService', () => {
  let service: BauxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BauxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
