import { Component } from '@angular/core';
import { GameService } from "../../services/game.service";
import { Difficulty } from "../../enums/difficulty";

@Component({
  selector: 'app-difficulty-select',
  templateUrl: './difficulty-select.component.html',
  styleUrls: ['./difficulty-select.component.css']
})
export class DifficultySelectComponent {
  readonly Difficulty = Difficulty;

  constructor(private gameService: GameService) {
  }

  handleDifficultySelect(difficulty: Difficulty): void {
    this.gameService.setDifficulty(difficulty);
  }
}
