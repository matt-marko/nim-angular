import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NameService } from '../../services/name.service';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { PlayMode } from '../../enums/play-mode';
import { WebSocketService } from '../../services/web-socket.service';

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

  isConnectionError: boolean = false;
  isLoading: boolean = false;

  connectionSuccess$ = this.webSocketService.connectionSuccess$;

  // This enables us to use the PlayMode enum in the template
  readonly PlayMode = PlayMode;

  constructor(
    private nameService: NameService,
    private gameService: GameService,
    private webSocketService: WebSocketService,
    private router: Router,
  ) { }

  ngOnInit(): void {

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
    this.nameService.setPlayerOneName(this.gameForm.value.playerOneName);

    if (this.numPlayers === 2) {
      this.nameService.setPlayerTwoName(this.gameForm.value.playerTwoName);
    }

    // Reset the game in case it hasn't been properly reset before
    // due to the user using the back button
    this.gameService.resetGame();

    if (this.playMode === PlayMode.local) {
      this.router.navigate(['/game']);
    } else {
      this.isConnectionError = false;
      this.isLoading = true;

      this.webSocketService.connect();

      this.webSocketService.connectionSuccess$.subscribe({
        next: (isSuccess) => {
          if(isSuccess) {
            this.router.navigate(['/waiting-room']);
          } else {
            this.isLoading = false;
            this.isConnectionError = true;
            this.webSocketService.disconnect();
          }
        }
      })
    };
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
}
