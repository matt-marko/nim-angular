import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { BoardComponent } from '../board/board.component';
import { ButtonComponent } from '../button/button.component';
import { MatchComponent } from '../match/match.component';
import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
import { Turn } from '../../enums/turn';
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
    component.playerOneName = 'Davos Seaworth';
    component.playerTwoName = 'Sansa Stark';

    component.turn = Turn.playerOne;
    component.numPlayers = 2;

    expect(component.calculateTurnMessage()).toBe('It\'s Davos Seaworth\'s turn!');

    component.turn = Turn.playerTwo;

    expect(component.calculateTurnMessage()).toBe('It\'s Sansa Stark\'s turn!');

    component.turn = Turn.playerOne;
    component.numPlayers = 1;

    expect(component.calculateTurnMessage()).toBe('It\'s your turn, Davos Seaworth!');
  });

  it('should correctly calculate the winner message', () => {
    component.playerOneName = 'Jim Hawkins';
    component.playerTwoName = 'Long John Silver';

    component.turn = Turn.playerOne;
    component.numPlayers = 2;

    expect(component.calculateWinnerMessage()).toBe('The winner is Long John Silver!');

    component.turn = Turn.playerTwo;

    expect(component.calculateWinnerMessage()).toBe('The winner is Jim Hawkins!');

    component.turn = Turn.playerOne;
    component.numPlayers = 1;

    expect(component.calculateWinnerMessage()).toBe('You lose. Better luck next time!');

    component.turn = Turn.computer;

    expect(component.calculateWinnerMessage()).toBe('You win. Congratulations!');
  });
});
