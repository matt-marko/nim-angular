import { TestBed } from '@angular/core/testing';

import { HighScore } from '../interfaces/high-score';
import { HighScoreService } from './high-score.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';

describe('HighScoreService', () => {
  let service: HighScoreService;
  let httpTestingController: HttpTestingController;

  const mockHighScores: HighScore[] = [
    {
        id: 1,
        name: 'Arthur',
        score: 5,
    },
    {
        id: 2,
        name: 'Guinevere',
        score: 3,
    }
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Import HttpClientTestingModule for testing HTTP requests
      ],
    });
    service = TestBed.inject(HighScoreService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get high scores', () => {
    service.getHighScores().subscribe(response => {
      expect(response).toEqual(mockHighScores);
    })

    const req = httpTestingController.expectOne(environment.apiUrl);

    expect(req.request.method).toEqual('GET');

    req.flush(mockHighScores);

    httpTestingController.verify();
  });

  it('should post high score', () => {
    const newHighScore = {
      name: 'Lancelot',
      score: 7,
    }

    const newHighScores = [...mockHighScores];
    newHighScores.push(newHighScore);

    service.postHighScore(newHighScore).subscribe(response => {
      expect(response).toEqual(newHighScores);
    })

    const req = httpTestingController.expectOne(environment.apiUrl);

    expect(req.request.method).toEqual('POST');

    req.flush(newHighScores);

    httpTestingController.verify();
  });

  it('should sort high scores', () => {
    const sortedHighScores = service.sortByScore(mockHighScores);

    expect(sortedHighScores[0]).toEqual(mockHighScores[1]);
    expect(sortedHighScores[1]).toEqual(mockHighScores[0]);
  });
});
