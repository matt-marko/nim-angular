import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { PlayMode } from '../../enums/play-mode';

@Component({
  selector: 'app-player-select',
  templateUrl: './player-select.component.html',
  styleUrls: ['./player-select.component.css']
})
export class PlayerSelectComponent {
  constructor(private gameService: GameService) { }

  handlePlayerSelect(playerCount: number): void {
    this.gameService.setNumPlayers(playerCount);

    if (playerCount === 1) {
      this.gameService.setPlayMode(PlayMode.local);
    }
  }
}
