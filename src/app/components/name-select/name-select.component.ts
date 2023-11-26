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

    if (this.numPlayers === 1) {
      if (this.playerOneName?.valid) {
        this.nameService.setPlayerOneName(this.nameForm.value.playerOneName);
        this.router.navigate(['/game']);
      }
    } else if (this.numPlayers === 2) {
      if (this.playerOneName?.valid && this.playerTwoName?.valid) {
        this.nameService.setPlayerOneName(this.nameForm.value.playerOneName);
        this.nameService.setPlayerTwoName(this.nameForm.value.playerTwoName);
        this.router.navigate(['/game']);
      }
    }
  }
}
