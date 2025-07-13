import { TestBed } from '@angular/core/testing';

import { LocataireService } from './locataires.service';

describe('LocatairesService', () => {
  let service: LocataireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocataireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
