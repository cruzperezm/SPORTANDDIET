import { TestBed } from '@angular/core/testing';

import { Deportes } from './deportes';

describe('Deportes', () => {
  let service: Deportes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Deportes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
