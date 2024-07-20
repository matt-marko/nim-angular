import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Match } from '../../interfaces/match';
import { Turn } from '../../enums/turn';
import { NameService } from '../../services/name.service';
import { HighScore } from '../../interfaces/high-score';
import { HighScoreService } from '../../services/high-score.service';
import { Subject, takeUntil } from 'rxjs';
import { PlayMode } from 'src/app/enums/play-mode';
import { MessageConstants, WebSocketService } from 'src/app/services/web-socket.service';
import { WebSocketMessage } from 'src/app/interfaces/WebSocketMessage';
import { Router } from '@angular/router';

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
  playMode: PlayMode = PlayMode.local;

  playerOneName: string = '';
  playerTwoName: string = '';

  notSavingHighScore: boolean = false;
  showHighScoreButtons: boolean = true;

  highScoreIsLoading: boolean = false;
  highScoreErrorOccurred: boolean = false;
  highScoreSuccess: boolean = false;

  opponentLeft: boolean = false;

  restartButtonIsLoading: boolean = false;

  destroy$ = new Subject<void>();

  // This enables us to use the Turn and PlayMode enums in the template
  readonly Turn = Turn;
  readonly PlayMode = PlayMode;

  constructor(
    private gameService: GameService,
    private nameService: NameService,
    private highScoreService: HighScoreService,
    private webSocketService: WebSocketService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.matches = this.gameService.getMatches();
    this.playMode = this.gameService.getPlayMode();

    this.resetHighScoreButtons();

    if (this.playMode !== PlayMode.local) {
      this.webSocketService.connectionMessages$
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (socketMessage: WebSocketMessage) => {
            if (socketMessage.webSocketCode === MessageConstants.USER_LEFT) {
              this.opponentLeft = true;
            } else if (socketMessage.webSocketCode === MessageConstants.TURN) {
              const row: number = Number(socketMessage.message[0]);
              const column: number = Number(socketMessage.message[2]);
              const match: Match = this.gameService.getMatches()[row][column]
              
              this.gameService.executeMove(match);
            } else if (socketMessage.webSocketCode === MessageConstants.GAME_RESTARTED) {
              this.restartButtonIsLoading = false;
              this.gameService.resetGame();
            }
          },
          error: () => {
            console.warn('The connection timed out');
            this.webSocketService.disconnect();
            this.router.navigate(['timeout-room']);
          }
      });
    }
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

  resetHighScoreButtons(): void {
    this.notSavingHighScore = false;
    this.showHighScoreButtons = true;
    this.highScoreIsLoading = false;
    this.highScoreSuccess = false;
    this.highScoreErrorOccurred = false;
  }

  onMatchClick(match: Match): void {
    if (!this.opponentLeft) {
      this.gameService.handleMatchClick(match);
    }
  }

  handleMatchHover(hoveredMatch: Match, isHovered: boolean): void {
    if (this.isCurrentPlayerTurn() && !this.gameEnded && !this.opponentLeft) {
      for (let i = 0; i <= hoveredMatch.column; i++) {
        this.matches[hoveredMatch.row][i].isHighlighted = isHovered;
      } 
    }
  }

  handleResetGame(): void {
    if (this.playMode === PlayMode.local) {
      this.gameService.resetGame();
      this.resetHighScoreButtons();
    } else {
      this.restartButtonIsLoading = true;
      this.webSocketService.sendMessage(`${MessageConstants.RESTART_GAME} ${this.gameService.getGameCode()}`);
    }
  }

  handleQuitGame(): void {
    this.webSocketService.disconnect();
    this.gameService.resetGame();
    this.resetHighScoreButtons();
    this.router.navigate(['']);
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
      .subscribe(() => {
        this.highScoreSuccess = true;
      }, (error: any) => {
        this.highScoreErrorOccurred = true;
        this.highScoreIsLoading = false;
      }, () => {
        this.highScoreIsLoading = false;
      });
  } 

  showRestartButton(): boolean {
    return this.playMode === PlayMode.local || 
      (this.gameEnded && this.playMode === this.PlayMode.onlineCreator && !this.restartButtonIsLoading);
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

  calculateWinnerMessage(): string {
    if (this.numPlayers === 1) { 
      if (this.turn === Turn.playerOne) {
        return 'You lose. Better luck next time!';
      } else {
        return 'You win. Congratulations!';
      }
    } else {
      if (this.turn === Turn.playerOne) {
        return 'The winner is ' + this.playerTwoName + '!';
      } else {
        return 'The winner is ' + this.playerOneName + '!'
      }
    }
  }

  calculateTurnMessage(): string {
    if (this.playMode !== PlayMode.local && this.opponentLeft) {
      const opponentName = this.playMode === PlayMode.onlineCreator ? this.playerTwoName : this.playerOneName;
      return opponentName + ' left the game!';
    }

    // Single player
    if (this.numPlayers === 1) {
      if (this.turn === Turn.playerOne) {
        return 'It\'s your turn, ' + this.playerOneName + '!';
      } else {
        return this.calculateComputerThinkingMessage();
      }
    }
    
    // Local two player
    if (this.numPlayers === 2 && this.playMode === PlayMode.local) {
      if (this.turn === Turn.playerOne) {
        return 'It\'s ' + this.playerOneName + '\'s turn!';
      } else {
        return 'It\'s ' + this.playerTwoName + '\'s turn!';
      }
    }
     
    // Online two player
    if (this.playMode !== PlayMode.local) {
      if (this.turn === Turn.playerOne && this.playMode === PlayMode.onlineCreator) {
        return 'It\'s your turn, ' + this.playerOneName + '!';
      } else if (this.turn === Turn.playerTwo && this.playMode === PlayMode.onlineJoiner) {
        return 'It\'s your turn, ' + this.playerTwoName + '!';
      } else if (this.turn === Turn.playerOne && this.playMode === PlayMode.onlineJoiner) {
        return this.playerOneName + ' is making a move...';
      } else if (this.turn === Turn.playerTwo && this.playMode === PlayMode.onlineCreator ) {
        return this.playerTwoName + ' is making a move...';
      }
    }

    return '';
  }

  calculateComputerThinkingMessage(): string {
    let message = 'The computer is thinking';

    for (let i = 0; i < this.computerThinkingPhase; i++) {
      message += '.';
    }

    return message;
  }

  isCurrentPlayerTurn(): boolean {
    if (this.playMode !== PlayMode.local) {
      return (this.turn === Turn.playerOne && this.playMode === PlayMode.onlineCreator) ||
             (this.turn === Turn.playerTwo && this.playMode === PlayMode.onlineJoiner);
    } else if (this.numPlayers === 1) {
      return this.turn === Turn.playerOne;
    } else {
      return true;
    }
  }
}
