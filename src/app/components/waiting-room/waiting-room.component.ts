import { Component } from '@angular/core';
import { NameService } from '../../services/name.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent {
  gameCode: string = '';
  playerOneName: string = '';

  constructor(
    private nameService: NameService,
    private webSocketService: WebSocketService,  
  ) {
  }

  ngOnInit(): void {
    this.playerOneName = this.nameService.getPlayerOneName();

    this.webSocketService.gameCode$.subscribe(gameCode => {
      this.gameCode = gameCode;
    });
  } 
}
