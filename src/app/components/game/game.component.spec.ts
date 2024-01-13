import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { BoardComponent } from '../board/board.component';
import { ButtonComponent } from '../button/button.component';
import { MatchComponent } from '../match/match.component';
import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
import { Turn } from '../../turn';
import { GameService } from '../../services/game.service';
import { HttpClientModule } from '@angular/common/http';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let gameService: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GameComponent,
        BoardComponent,
        ButtonComponent,
        MatchComponent,
      ],
      imports: [
        HttpClientModule,
      ]
    }).overrideComponent(GameComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();

    gameService = TestBed.inject(GameService);

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly calculate the turn message', () => {
    component.playerOneName = 'Jon Snow';
    component.playerTwoName = 'Arya Stark';

    expect(component.calculateTurnMessage(Turn.playerOne, 2)).toBe('It\'s Jon Snow\'s turn!');
    expect(component.calculateTurnMessage(Turn.playerTwo, 2)).toBe('It\'s Arya Stark\'s turn!');
    expect(component.calculateTurnMessage(Turn.playerOne, 1)).toBe('It\'s your turn, Jon Snow!');
  });

  it('should correctly calculate the winner message', () => {
    component.playerOneName = 'Jim Hawkins';
    component.playerTwoName = 'Long John Silver';

    expect(component.calculateWinnerMessage(Turn.playerOne, 2)).toBe('Long John Silver wins!');
    expect(component.calculateWinnerMessage(Turn.playerTwo, 2)).toBe('Jim Hawkins wins!');
    expect(component.calculateWinnerMessage(Turn.playerOne, 1)).toBe('You lose. Better luck next time!');
    expect(component.calculateWinnerMessage(Turn.computer, 1)).toBe('You win. Congratulations!');
  });
});
