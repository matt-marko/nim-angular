import { Injectable } from '@angular/core';
import { HighScore } from '../high-score';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HighScoreService {
  highScoresUrl: string = 'http://localhost:8080/high-scores';

  constructor(
    private http: HttpClient,
  ) {}

  getHighScores(): Observable<HighScore[]> {
    return this.http.get<HighScore[]>(this.highScoresUrl);
  }

  postHighScore(highScore: HighScore): Observable<HighScore[]> {
    return this.http.post<HighScore[]>(this.highScoresUrl, highScore);
  }

  sortByScore(highScores: HighScore[]) {
    return [...highScores].sort((a,b) => (a.score - b.score));
  }
}
