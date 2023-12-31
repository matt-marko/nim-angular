import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NameService {
  private playerOneName: string;
  private playerTwoName: string;

  constructor() {
    this.playerOneName = 'Arthur'; // Default value
    this.playerTwoName = 'Guinevere'; // Default value
  }

  getPlayerOneName(): string {
    return this.playerOneName;
  }

  setPlayerOneName(name: string): void {
    this.playerOneName = name;
  }

  getPlayerTwoName(): string {
    return this.playerTwoName;
  }

  setPlayerTwoName(name: string): void {
    this.playerTwoName = name;
  }
}
