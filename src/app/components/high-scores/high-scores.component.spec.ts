import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighScoresComponent } from './high-scores.component';
import { BoardComponent } from '../board/board.component';
import { HttpClientModule } from '@angular/common/http';
import { HighScoreService } from '../../services/high-score.service';
import { ButtonComponent } from '../button/button.component';

describe('HighScoresComponent', () => {
  let component: HighScoresComponent;
  let fixture: ComponentFixture<HighScoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HighScoresComponent,
        BoardComponent,
        ButtonComponent,
      ],
      imports: [
        HttpClientModule,
      ],
    });
    fixture = TestBed.createComponent(HighScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
