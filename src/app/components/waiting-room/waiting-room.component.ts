import { Component } from '@angular/core';
import { NameService } from '../../services/name.service';
import { MessageConstants, WebSocketService } from 'src/app/services/web-socket.service';
import { PlayMode } from 'src/app/enums/play-mode';
import { GameService } from 'src/app/services/game.service';
import { WebSocketMessage } from 'src/app/interfaces/WebSocketMessage';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent {
  gameCode: string = '';
  playerOneName: string = '';
  playerTwoName: string = '';

  isLoading: boolean = false;
  playerTwoJoined: boolean = false;
  hostLeft: boolean = false;
  playMode?: PlayMode;

  destroy$ = new Subject<void>();

  // This enables us to use the PlayMode enum in the template
  readonly PlayMode = PlayMode;

  constructor(
    private gameService: GameService,
    private nameService: NameService,
    private webSocketService: WebSocketService,
    private router: Router, 
  ) {
  }

  ngOnInit(): void {
    this.playMode = this.gameService.getPlayMode();
    this.gameCode = this.gameService.getGameCode();

    if (this.playMode === PlayMode.onlineCreator) {
      this.playerOneName = this.nameService.getPlayerOneName();
    } else if (this.playMode === PlayMode.onlineJoiner) {
      this.playerTwoJoined = true;
      this.playerTwoName = this.nameService.getPlayerTwoName();
    }

    this.webSocketService.connectionMessages$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        // TODO add error after next?
        next: (socketMessage: WebSocketMessage) => {
          if (socketMessage.webSocketCode === MessageConstants.OPPONENT_NAME) {
            if (this.playMode === PlayMode.onlineCreator) {
              this.nameService.setPlayerTwoName(socketMessage.message);
              this.playerTwoName = socketMessage.message;
              this.playerTwoJoined = true;
            } else if (this.playMode === PlayMode.onlineJoiner) {
              this.nameService.setPlayerOneName(socketMessage.message);
              this.playerOneName = socketMessage.message;
            }
            // TODO account for error not just closing
          } else if (socketMessage.webSocketCode === MessageConstants.USER_LEFT) {
            if (this.playMode === PlayMode.onlineCreator) {
              this.playerTwoJoined = false;
            } else if (this.playMode === PlayMode.onlineJoiner) {
              this.hostLeft = true;
            }
          } else if (socketMessage.webSocketCode === MessageConstants.GAME_STARTED) {
            this.router.navigate(['/game']);
          }
        }
    });
  } 

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculateTitle(): string {
    if (this.playMode === PlayMode.onlineCreator) {
      return 'Game has been created!'
    }
      
    return 'Succesfully joined!';
  }

  calculateOnlineJoinerMessage(): string {
    if (this.hostLeft) {
      return 'The host left the game!';
    }

    return 'Waiting for the host to start the game...';
  }

  startGame(): void {
    this.webSocketService.sendMessage(MessageConstants.START_GAME + ' ' + this.gameService.getGameCode());
    this.isLoading = true;
  }

  goToMainMenu(): void {
    this.webSocketService.disconnect();
    this.router.navigate(['']);
  }
}
