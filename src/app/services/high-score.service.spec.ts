import { TestBed } from '@angular/core/testing';

import { HighScoreService } from './high-score.service';
import { HttpClientModule } from '@angular/common/http';

describe('HighScoreService', () => {
  let service: HighScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule, // Import HttpClientTestingModule for testing HTTP requests
      ],
    });
    service = TestBed.inject(HighScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
