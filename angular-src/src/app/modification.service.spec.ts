import { TestBed, inject } from '@angular/core/testing';

import { ModificationService } from './modification.service';

describe('ModificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModificationService]
    });
  });

  it('should be created', inject([ModificationService], (service: ModificationService) => {
    expect(service).toBeTruthy();
  }));
});
