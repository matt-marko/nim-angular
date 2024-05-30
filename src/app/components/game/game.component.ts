import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Match } from '../../interfaces/match';
import { Turn } from '../../enums/turn';
import { NameService } from '../../services/name.service';
import { HighScore } from '../../high-score';
import { HighScoreService } from '../../services/high-score.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  matches: Match[][] = [];
  turn: Turn = Turn.playerOne;
  gameEnded: boolean = false;
  moveIsInvalid: boolean = false;
  numPlayers: number = 0;
  computerThinkingPhase: number = 1;
  score: number = 0;

  playerOneName: string = '';
  playerTwoName: string = '';

  notSavingHighScore: boolean = false;
  showHighScoreButtons: boolean = true;

  highScoreIsLoading: boolean = false;
  highScoreErrorOccurred: boolean = false;
  highScoreSuccess: boolean = false;

  destroy$ = new Subject<void>();

  // This enables us to use the Turn enum in the template
  readonly Turn = Turn;

  constructor(
    private gameService: GameService,
    private nameService: NameService,
    private highScoreService: HighScoreService,
  ) { }

  ngOnInit(): void {
    this.matches = this.gameService.getMatches();

    this.notSavingHighScore = false;
    this.showHighScoreButtons = true;
    this.highScoreIsLoading = false;
    this.highScoreSuccess = false;
    this.highScoreErrorOccurred = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterContentChecked(): void {
    this.turn = this.gameService.getTurn();
    this.gameEnded = this.gameService.getGameEnded();
    this.moveIsInvalid = this.gameService.getMoveIsInvalid();
    this.numPlayers = this.gameService.getNumPlayers();
    this.computerThinkingPhase = this.gameService.getComputerThinkingPhase();
    this.score = this.gameService.getScore();

    this.playerOneName = this.nameService.getPlayerOneName();
    this.playerTwoName = this.nameService.getPlayerTwoName();
  }

  onMatchClick(match: Match): void {
    this.gameService.handleMatchClick(match);
  }

  handleMatchHover(hoveredMatch: Match, isHovered: boolean): void {
    for (let i = 0; i <= hoveredMatch.column; i++) {
      this.matches[hoveredMatch.row][i].isHighlighted = isHovered;
    } 
  }

  handleResetGame(): void {
    this.gameService.resetGame();

    this.ngOnInit();
  }

  handleNotSavingHighScore(): void {
    this.notSavingHighScore = true;
    this.showHighScoreButtons = false;
  }

  handleSavingHighScore(): void {
    const highScore: HighScore = {
      name: this.playerOneName,
      score: this.score,
    }

    this.showHighScoreButtons = false;
    this.highScoreIsLoading = true;

    this.highScoreService.postHighScore(highScore)
      .pipe(takeUntil(this.destroy$))
      .subscribe((highScore: HighScore[]) => {
        this.highScoreSuccess = true;
      }, (error: any) => {
        this.highScoreErrorOccurred = true;
        this.highScoreIsLoading = false;
      }, () => {
        this.highScoreIsLoading = false;
      });
  } 

  calculateScoreMessage(): string {
    if (this.highScoreIsLoading) {
      return 'Loading...'
    } else if (this.notSavingHighScore) {
      return 'Fine then, have it your way!';
    } else if (this.highScoreSuccess) {
      return 'Your score of ' + this.score + ' has been submitted.'
    } else if (this.highScoreErrorOccurred) {
      return 'This is a bit embarrassing but... An error occurred! Please try again later.'
    } else {
      return 'Your won in  ' + this.score + ' turns. Would you like to submit your score?';
    }
  }

  calculateWinnerMessage(turn: Turn, numPlayers: number): string {
    if (numPlayers === 1) { 
      if (turn === Turn.playerOne) {
        return 'You lose. Better luck next time!';
      } else {
        return 'You win. Congratulations!';
      }
    } else {
      if (turn === Turn.playerOne) {
        return this.playerTwoName + ' wins!';
      } else {
        return this.playerOneName + ' wins!';
      }
    }
  }

  calculateTurnMessage(turn: Turn, numPlayers: number): string {
    if (numPlayers === 1) {
      if (turn === Turn.playerOne) {
        return 'It\'s your turn, ' + this.playerOneName + '!';
      } else {
        return this.calculateComputerThinkingMessage();
      }
    } else {
      if (turn === Turn.playerOne) {
        return 'It\'s ' + this.playerOneName + '\'s turn!';
      } else {
        return 'It\'s ' + this.playerTwoName + '\'s turn!';
      }
    }
  }

  calculateComputerThinkingMessage(): string {
    let message = 'The computer is thinking';

    for (let i = 0; i < this.computerThinkingPhase; i++) {
      message += '.';
    }

    return message;
  }
}
