import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { PlayMode } from '../../enums/play-mode';

@Component({
  selector: 'app-play-mode-select',
  templateUrl: './play-mode-select.component.html',
  styleUrls: ['./play-mode-select.component.css']
})
export class PlayModeSelectComponent {
  // This enables us to use the PlayMode enum in the template
  readonly PlayMode = PlayMode;
  constructor(private gameService: GameService) { }

  handlePlayModeSelect(playMode: PlayMode): void {
    this.gameService.setPlayMode(playMode);
  }
}
