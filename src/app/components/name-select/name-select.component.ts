import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NameService } from '../../services/name.service';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { PlayMode } from '../../enums/play-mode';
import { MessageConstants, WebSocketService } from '../../services/web-socket.service';
import { WebSocketMessage } from '../../interfaces/WebSocketMessage';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-name-select',
  templateUrl: './name-select.component.html',
  styleUrls: ['./name-select.component.css']
})
export class NameSelectComponent {
  gameForm: FormGroup = new FormGroup({
    playerOneName: new FormControl('', [
      Validators.required,
    ]),
    playerTwoName: new FormControl('', [
      Validators.required,
    ]),
    gameCode: new FormControl('', [
      Validators.required,
    ]),
  });

  numPlayers: number = this.gameService.getNumPlayers();
  playMode: PlayMode = this.gameService.getPlayMode();
  gameCodeToJoin: string = '';
  createdGameCode: string = '';

  isConnectionError: boolean = false;
  isLoading: boolean = false;
  gameNotFound: boolean = false;
  gameFull: boolean = false;
  hostHasSameName: boolean = false;

  destroy$ = new Subject<void>();

  // This enables us to use the PlayMode enum in the template
  readonly PlayMode = PlayMode;

  readonly GAME_CODE_LENGTH: number = 5;

  constructor(
    private nameService: NameService,
    private gameService: GameService,
    private webSocketService: WebSocketService,
    private router: Router,
  ) { }
  
  ngOnInit(): void {
    if (this.playMode !== PlayMode.local) {
      this.webSocketService.connectionMessages$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (socketMessage: WebSocketMessage) => {
          if (socketMessage.webSocketCode === MessageConstants.CONNECTION_OPENED) {
            if (this.playMode === PlayMode.onlineCreator) {
              this.webSocketService.sendMessage(MessageConstants.CREATE_GAME + ' ' + this.createdGameCode);
            } else if (this.playMode === PlayMode.onlineJoiner) {
              this.webSocketService.sendMessage(MessageConstants.JOIN_GAME + ' ' + this.gameCodeToJoin);
            }
          } else if (
            socketMessage.webSocketCode === MessageConstants.GAME_CREATED ||
            socketMessage.webSocketCode === MessageConstants.GAME_JOINED      
          ) {
            this.gameService.setGameCode(socketMessage.message);
            this.router.navigate(['/waiting-room']);
          } else if (socketMessage.webSocketCode === MessageConstants.GAME_NOT_FOUND) {
            this.isLoading = false;
            this.gameNotFound = true;
            this.webSocketService.disconnect();
          } else if (socketMessage.webSocketCode === MessageConstants.GAME_FULL) {
            this.isLoading = false;
            this.gameFull = true;
            this.webSocketService.disconnect();
          } else if (socketMessage.webSocketCode === MessageConstants.SAME_NAME) {
            this.isLoading = false;
            this.hostHasSameName = true;
            this.webSocketService.disconnect();
          }
        },
        error: () => {
          console.error('There was an error connecting');
          this.isLoading = false;
          this.isConnectionError = true;
          this.webSocketService.disconnect();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get playerOneName() {
    return this.gameForm.get('playerOneName');
  }

  get playerTwoName() {
    return this.gameForm.get('playerTwoName');
  }

  get gameCode() {
    return this.gameForm.get('gameCode');
  }

  onNameSelect(): void {
    this.gameForm.markAllAsTouched();
    this.gameForm.markAllAsTouched();

    const validForOnePlayer: boolean | undefined = this.numPlayers === 1
      && this.playerOneName?.valid;

    const validForTwoPlayersLocal: boolean | undefined = this.numPlayers === 2
      && this.playMode === PlayMode.local
      && this.playerOneName?.valid
      && this.playerTwoName?.valid;

    const validForOnlineJoiner: boolean | undefined = this.playMode === PlayMode.onlineJoiner
      && this.playerOneName?.valid
      && this.gameCode?.valid;

    const validForOnlineCreator: boolean | undefined = this.playMode === PlayMode.onlineCreator
      && this.playerOneName?.valid;

    if (validForOnePlayer || validForTwoPlayersLocal || validForOnlineJoiner || validForOnlineCreator) {
      this.startGame();
    }
  }

  startGame(): void {
    // Reset the game in case it hasn't been properly reset before
    // due to the user using the back button
    this.gameService.resetGame();

    if (this.playMode === PlayMode.local) {
      this.nameService.setPlayerOneName(this.gameForm.value.playerOneName);

      if (this.numPlayers === 2) {
        this.nameService.setPlayerTwoName(this.gameForm.value.playerTwoName);
      }

      this.router.navigate(['/game']);
    } else if (this.playMode === PlayMode.onlineCreator) {
      this.isConnectionError = false;
      this.isLoading = true;

      this.nameService.setPlayerOneName(this.gameForm.value.playerOneName);

      this.createdGameCode = this.generateGameCode();

      this.webSocketService.connect(this.nameService.getPlayerOneName(), this.createdGameCode);
    } else if (this.playMode === PlayMode.onlineJoiner) {
      this.isConnectionError = false;
      this.isLoading = true;
      this.gameNotFound = false;
      this.gameFull = false;
      this.hostHasSameName = false;

      this.nameService.setPlayerTwoName(this.gameForm.value.playerOneName);

      this.gameCodeToJoin = this.gameForm.value.gameCode.toUpperCase();

      this.webSocketService.connect(this.nameService.getPlayerTwoName(), this.gameCodeToJoin);
    }
  }

  calculateTitleText(): string {
    if (this.numPlayers === 1 || this.playMode === PlayMode.onlineCreator) {
      return 'Enter your name!';
    }

    if (this.playMode === PlayMode.onlineJoiner) {
      return 'Enter your name & game code!';
    }

    return 'Enter your names!';
  }

  calculatePlayButtonText(): string {
    switch (this.playMode) {
      case PlayMode.local:
        return 'Let\'s Play!';
      case PlayMode.onlineCreator:
        return 'Create game';
      case PlayMode.onlineJoiner:
        return 'Join game';
      default:
        return 'Let\'s play!';
    }
  }

  calculatePlayerOneLabelText(): string {
    if (this.numPlayers === 1 || this.playMode !== PlayMode.local) {
      return 'Your name: ';
    }

    return 'Player one\'s name: ';
  }

  handleBackButtonClick(): void {
    this.webSocketService.disconnect();
    this.router.navigate(['/player-select']);
  }

  private generateGameCode(): string {
    const validChars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let gameCode: string = '';
    let randomIndex: number = 0;

    for (let i = 0; i < this.GAME_CODE_LENGTH; i++) {
        randomIndex = Math.floor(validChars.length * Math.random());
        gameCode += validChars.charAt(randomIndex);
    }

    return gameCode;
  }
}
