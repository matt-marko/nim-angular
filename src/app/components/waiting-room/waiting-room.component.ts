import { Component } from '@angular/core';
import { NameService } from '../../services/name.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { PlayMode } from 'src/app/enums/play-mode';
import { GameService } from 'src/app/services/game.service';
import { WebSocketMessage } from 'src/app/interfaces/WebSocketMessage';
import { WebSocketCode } from 'src/app/enums/webSocketCode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent {
  gameCode: string = '';
  playerOneName: string = '';
  playerTwoName: string = '';

  playerTwoJoined: boolean = false;
  playMode?: PlayMode;

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

    // TODO unsubscruibe on NgOnDestroy
    this.webSocketService.connectionMessages$.subscribe({
      next: (socketMessage: WebSocketMessage) => {
        if (socketMessage.webSocketCode === WebSocketCode.opponentName) {
          if (this.playMode === PlayMode.onlineCreator) {
            this.nameService.setPlayerTwoName(socketMessage.message);
            this.playerTwoName = socketMessage.message;
            this.playerTwoJoined = true;
          } else if (this.playMode === PlayMode.onlineJoiner) {
            this.nameService.setPlayerOneName(socketMessage.message);
            this.playerOneName = socketMessage.message;
          }
        }
      }
    });
  } 

  calculateTitle(): string {
    if (this.playMode === PlayMode.onlineCreator) {
      return 'Game has been created!'
    }
      
    return 'Succesfully joined!';
  }

  startGame(): void {
    this.webSocketService.sendMessage('START-GAME: ' + this.playerOneName);
    this.router.navigate(['/game']);
  }
}
