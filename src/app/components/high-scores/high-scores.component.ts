import { Component } from '@angular/core';
import { HighScoreService } from '../../services/high-score.service';
import { HighScore } from '../../interfaces/high-score';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-high-scores',
  templateUrl: './high-scores.component.html',
  styleUrls: ['./high-scores.component.css']
})
export class HighScoresComponent {
  isLoading: boolean = true;
  errorHasOccurred: boolean = false;

  highScores: HighScore[] = [];

  destroy$ = new Subject<void>();

  constructor(private highScoreService: HighScoreService) {}

  ngOnInit() {
    this.highScoreService.getHighScores()
      .pipe(takeUntil(this.destroy$))
      .subscribe((highScores: HighScore[]) => {
        this.highScores = this.highScoreService.sortByScore(highScores);
      }, (error) => {
        this.errorHasOccurred = true;
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
