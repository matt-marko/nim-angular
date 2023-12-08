import { Injectable } from '@angular/core';
import { HighScore } from '../high-score';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HighScoreService {
  highScoresUrl: string = environment.apiUrl;

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
