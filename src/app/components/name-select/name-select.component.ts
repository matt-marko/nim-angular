import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NameService } from '../../services/name.service';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-name-select',
  templateUrl: './name-select.component.html',
  styleUrls: ['./name-select.component.css']
})
export class NameSelectComponent {
  nameForm: FormGroup = new FormGroup({
    playerOneName: new FormControl('', [
      Validators.required,
    ]),
    playerTwoName: new FormControl('', [
      Validators.required,
    ]),
  });

  numPlayers: number = this.gameService.getNumPlayers();

  constructor(
    private nameService: NameService,
    private gameService: GameService,
    private router: Router,
  ) { }

  get playerOneName() {
    return this.nameForm.get('playerOneName');
  }

  get playerTwoName() {
    return this.nameForm.get('playerTwoName');
  }

  onNameSelect(): void {
    this.nameForm.markAllAsTouched();

    const validForOnePlayer: boolean | undefined = this.numPlayers === 1
                                                && this.playerOneName?.valid;
    const validForTwoPlayers: boolean | undefined = this.numPlayers === 2
                                                && this.playerOneName?.valid
                                                && this.playerTwoName?.valid;

    if (validForOnePlayer || validForTwoPlayers) {
      this.startGame();
    }
  }

  startGame(): void {
    this.nameService.setPlayerOneName(this.nameForm.value.playerOneName);

    if (this.numPlayers === 2) {
      this.nameService.setPlayerTwoName(this.nameForm.value.playerTwoName);
    }

    // Reset the game in case it hasn't been properly reset before
    // due to the user using the back button
    this.gameService.resetGame();

    this.router.navigate(['/game']);
  }
}
