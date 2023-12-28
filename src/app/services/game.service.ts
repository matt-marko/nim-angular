import { Injectable } from '@angular/core';
import { Match } from '../match';
import { Turn } from '../turn';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private numPlayers: number;
  private matches: Match[][];
  private turn: Turn;
  private gameEnded: boolean;
  private moveIsInvalid: boolean;
  private numRows: number;
  private computerIsThinking: boolean;
  private score: number;

  /*
  * Indicates how many periods are displayed in the turn message
  * when the computer is thinking about which move to make.
  */
  private computerThinkingPhase: number;

  constructor() {
    this.numPlayers = 0;
    this.turn = Turn.playerOne;
    this.gameEnded = false;
    this.moveIsInvalid = false;
    this.numRows = 4;
    this.computerIsThinking = false;
    this.computerThinkingPhase = 1;
    this.score = 0;

    // Initialize matches to all be active
    let matches: Match[][] = [];

    for (let i = 0; i < this.numRows; i++) {
      let row: Match[] = [];
      for (let j = 0; j <= 2 * i; j++) {
        row.push(
          {
            isActive: true,
            isHighlighted: false,
            row: i,
            column: j,
          }
        );
      }
      matches.push(row);
    }

    this.matches = matches;
  }

  getNumPlayers(): number {
    return this.numPlayers;
  }

  setNumPlayers(numPlayers: number): void {
    this.numPlayers = numPlayers;
  }

  getMatches(): Match[][] {
    return this.matches;
  }

  getTurn(): Turn {
    return this.turn;
  }

  setTurn(turn: Turn): void {
    this.turn = turn;
  }

  getGameEnded(): boolean {
    return this.gameEnded;
  }

  setGameEnded(gameEnded: boolean): void {
    this.gameEnded = gameEnded;
  }

  getScore(): number {
    return this.score
  }

  setScore(score: number): void {
    this.score = score;
  }

  getMoveIsInvalid(): boolean {
    return this.moveIsInvalid;
  }

  getComputerThinkingPhase(): number {
    return this.computerThinkingPhase;
  }

  handleMatchClick(clickedMatch: Match): void {
    if (this.gameEnded === false && this.computerIsThinking === false) {
      this.doPlayerMove(clickedMatch);

      if (this.matchesLeft() === 1) {
        this.gameEnded = true;
      }

      if (this.turn === Turn.computer && this.gameEnded === false) {
        this.computerIsThinking = true;

        const computerThinkingPromise: Promise<void> = new Promise((resolve) => {
          this.simulateComputerThinking(resolve);
        });

        computerThinkingPromise.then(() => {
          this.simulateComputerMove();

          if (this.matchesLeft() === 1) {
            this.gameEnded = true;
          }
        });
      }
    }
  }

  /*
  * Make selectedMatch and all matches to the left of it inactive.
  */
  removeMatches(selectedMatch: Match): void {
    for (let i = 0; i <= selectedMatch.column; i++) {
      this.matches[selectedMatch.row][i].isActive = false;
    }
  }

  simulateComputerMove(): void {
    let validRows: number[] = [];
    let selectedMatch: Match;
    let selectedRow: number;
    let selectedColumn: number;
    
    for (let row = 0; row < this.numRows; row++) {
      if (this.matchesLeftInRow(row) > 0) {
        validRows.push(row);
      }
    }

    if (validRows.length === 1) {
      selectedRow = validRows[0];

      const lowerBound = (2 * selectedRow) - (this.matchesLeftInRow(selectedRow) - 1);
      const upperBound = (selectedRow * 2) - 1;

      selectedColumn = this.randomIntFromInterval(lowerBound, upperBound);
    } else {
      selectedRow = validRows[this.randomIntFromInterval(0, validRows.length - 1)];

      const lowerBound = (2 * selectedRow) - (this.matchesLeftInRow(selectedRow) - 1);
      const upperBound = selectedRow * 2;

      selectedColumn = this.randomIntFromInterval(lowerBound, upperBound);
    }
     
    selectedMatch = this.matches[selectedRow][selectedColumn]

    this.removeMatches(selectedMatch);
    this.updateTurn();
    this.computerIsThinking = false;
  }

  /*
  * Returns the number of matches that are still active
  */
  matchesLeft(): number {
    let matchCount: number = 0;

    for (let row = 0; row < this.numRows; row++) {
      matchCount += this.matchesLeftInRow(row);
    }

    return matchCount;
  }

  /*
  * Returns the number of matches that are still active
  * in the specified row
  */
  matchesLeftInRow(row: number): number {
    let matchCount: number = 0;

    for (let column = 0; column <= 2 * row; column++) {
      if (this.getMatches()[row][column].isActive) {
        matchCount++;
      }
    }

    return matchCount;
  }

  /*
  * Returns the number of matches that would be removed if
  * clickedMatch were clicked.
  */
  matchesToRemove(clickedMatch: Match): number {
    let activeMatches: number = 0;

    for (let column = 0; column <= clickedMatch.column; column++) {
      if (this.getMatches()[clickedMatch.row][column].isActive) {
        activeMatches++;
      }
    }

    return activeMatches;
  }

  resetGame(): void {
    this.turn = Turn.playerOne;
    this.gameEnded = false;
    this.moveIsInvalid = false;
    this.score = 0;

    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j <= 2 * i; j++) {
        this.matches[i][j].isActive = true;
      }
    }
  }

  private simulateComputerThinking(resolve: Function): void {
    if (this.computerThinkingPhase <= 3) {
      setTimeout(() => {
        this.computerThinkingPhase++;
        this.simulateComputerThinking(resolve);
      }, 500);
    } else {
      this.computerThinkingPhase = 1;
      resolve();
    }
  }

  /*
  * Performs the logic related to a user clicking on the specified match
  */
  private doPlayerMove(clickedMatch: Match): void {
    if (clickedMatch.isActive && this.turn != Turn.computer) {
      if (this.matchesToRemove(clickedMatch) !== this.matchesLeft()) {

        this.moveIsInvalid = false;

        this.updateTurn();

        this.removeMatches(clickedMatch);

        this.score++;

      } else {
        this.moveIsInvalid = true;
      }
    }
  }

  private updateTurn(): void {
    if (this.numPlayers === 2) {
      if (this.turn === Turn.playerOne) {
        this.turn = Turn.playerTwo;
      } else {
        this.turn = Turn.playerOne;
      }
    } else {
      if (this.turn === Turn.playerOne) {
        this.turn = Turn.computer;
      } else {
        this.turn = Turn.playerOne;
      }
    }
  }

  /*
  * Select a random integer from the interval [min, max]
  */
  private randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
