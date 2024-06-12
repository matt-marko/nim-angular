import { Injectable } from '@angular/core';
import { Match } from '../interfaces/match';
import { Turn } from '../enums/turn';
import { Difficulty } from "../enums/difficulty";
import { PlayMode } from '../enums/play-mode';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private numPlayers: number;
  private matches: Match[][];
  private turn: Turn;
  private gameEnded: boolean;
  private moveIsInvalid: boolean;
  private computerIsThinking: boolean;
  private score: number;
  private difficulty: Difficulty;
  private playMode: PlayMode;
  private gameCode: string;
  
  // Indicates how many periods are displayed in the turn message
  // when the computer is thinking about which move to make.
  private computerThinkingPhase: number;

  private readonly numRows: number;

  constructor() {
    this.numPlayers = 0;
    this.turn = Turn.playerOne;
    this.gameEnded = false;
    this.moveIsInvalid = false;
    this.numRows = 4;
    this.computerIsThinking = false;
    this.computerThinkingPhase = 1;
    this.score = 0;
    this.difficulty = Difficulty.easy;
    this.playMode = PlayMode.local;
    this.gameCode = '';

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

  getDifficulty(): Difficulty {
    return this.difficulty;
  }

  setDifficulty(difficulty: Difficulty): void {
    this.difficulty = difficulty;
  }

  getMoveIsInvalid(): boolean {
    return this.moveIsInvalid;
  }

  getComputerThinkingPhase(): number {
    return this.computerThinkingPhase;
  }

  getPlayMode(): PlayMode {
    return this.playMode;
  }

  setPlayMode(playMode: PlayMode): void {
    this.playMode = playMode;
  }

  getGameCode(): string {
    return this.gameCode;
  } 

  setGameCode(gameCode: string): void {
    this.gameCode = gameCode;
  }

  handleMatchClick(clickedMatch: Match): void {
    if (!this.gameEnded && !this.computerIsThinking) {
      this.doPlayerMove(clickedMatch);

      if (this.matchesLeft() === 1) {
        this.gameEnded = true;
      }

      if (this.turn === Turn.computer && !this.gameEnded) {
        this.computerIsThinking = true;
        
        const computerThinkingPromise: Promise<void> = new Promise((resolve, reject) => {
          this.simulateComputerThinking(resolve, reject);
        });

        computerThinkingPromise.then(() => {
          // If the game has been reset and it's the player's turn again, then 
          // do not execute the computer's turn
          if (this.getTurn() === Turn.computer) {
            this.simulateComputerMove();

            if (this.matchesLeft() === 1) {
              this.gameEnded = true;
            }
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
    let selectedMatch: Match;

    if(this.getDifficulty() === Difficulty.easy) {
      selectedMatch = this.calculateEasyComputerMove();
    } else {
      selectedMatch = this.calculateImpossibleComputerMove()
    }

    this.removeMatches(selectedMatch);
    this.updateTurn();
    this.computerIsThinking = false;
  }

  /*
  * Simulates a random move
  */
  calculateEasyComputerMove(): Match {
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
     
    return this.getMatches()[selectedRow][selectedColumn];
  }

  /*
  * Simulates an optimal move
  */
  calculateImpossibleComputerMove(): Match {
    let nimSum: number = 0;
    let optimalMoveFound: boolean = false;
    let optimalMove: Match = this.getMatches()[0][0];

    if (!optimalMoveFound) {
      for (let row = 0; row < this.numRows; row++) {
        for (let column = 0; column <= 2 * row; column++) {
          if (this.getMatches()[row][column].isActive) {
            nimSum = this.nimSumAfterRemovingMatch(this.getMatches()[row][column]);

            if (nimSum === 0 && this.getMatches()[row][column].isActive) {
              optimalMoveFound = true;
            }

            if (optimalMoveFound) {
              optimalMove = this.getMatches()[row][column];

              // This condition is necessary because the person to remove
              // the last match LOSES
              if (this.moveWouldLeaveOnlyRowsOfSizeOne(optimalMove)) {
                optimalMove = this.leaveOddNumberOfRowsOfSizeOne();
              }

              break;
            }
          }
        }

        if (optimalMoveFound) {
          break;
        }
      }
    }

    // If the optimal move hasn't been found, there must be only two active
    // matches in two different rows.
    if (!optimalMoveFound) {
      for (let row = 0; row < this.numRows; row++) {
        for (let column = 0; column <= 2 * row; column++) {
          if (this.getMatches()[row][column].isActive) {
            optimalMove = this.getMatches()[row][column];
          }
        }
      }
    }

    return optimalMove;

  }

  private moveWouldLeaveOnlyRowsOfSizeOne(selectedMatch: Match): boolean {
    const matchesThatWouldBeLeft = this.matchesLeftInRow(selectedMatch.row) - this.matchesToRemove(selectedMatch);

    for (let row = 0; row < this.numRows; row++) {
      if (row !== selectedMatch.row) {
        if (this.matchesLeftInRow(row) >= 2) {
          return false;
        }
      }

      if (row === selectedMatch.row) {
        if (matchesThatWouldBeLeft >= 2) {
          return false;
        }
      }
    }

    return true;
  }

  private leaveOddNumberOfRowsOfSizeOne(): Match {
    let matchToRemove: Match = this.getMatches()[0][0];
    let rowsWithOneMatch: number = 0;

    for (let row = 0; row < this.numRows; row++) {
      if (this.matchesLeftInRow(row) === 1) {
        rowsWithOneMatch++;
      }
    }

    for (let row = 0; row < this.numRows; row++) {
      if (this.matchesLeftInRow(row) > 1) {
        matchToRemove = rowsWithOneMatch % 2 === 0 ?
          this.getMatches()[row][(2 * row) - 1] :
          this.getMatches()[row][2 * row];

        break;
      }
    }

    return matchToRemove;
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
    this.computerIsThinking = false;
    this.gameCode = '';

    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j <= 2 * i; j++) {
        this.matches[i][j].isActive = true;
      }
    }
  }

  private simulateComputerThinking(resolve: Function, reject: Function): void {
    if (this.computerThinkingPhase <= 3) {
      setTimeout(() => {
        this.computerThinkingPhase++;
        this.simulateComputerThinking(resolve, reject);
      }, 500);
    } else {
      this.computerThinkingPhase = 1;
      resolve();
    }
  }

  private nimSumAfterRemovingMatch(match: Match): number {
    const rowNimSums = Array(4);

    let matchCount: number = 0;
    let nimSum: number = 0;

    for (let row = 0; row < this.numRows; row++) {
      matchCount = 0;

      if (row === match.row) {
        for (let column = match.column + 1; column <= 2 * row; column++) {
          if (this.getMatches()[row][column].isActive) {
            matchCount++;
          }
        }
      } else {
        for (let column = 0; column <= 2 * row; column++) {
          if (this.getMatches()[row][column].isActive) {
            matchCount++;
          }
        }
      }

      rowNimSums[row] = matchCount;
    }

    for (let row = 0; row < this.numRows; row++) {
      nimSum ^= rowNimSums[row];
    }

    return nimSum;
  }

  /*
  * Performs the logic related to a user clicking on the specified match
  */
  private doPlayerMove(clickedMatch: Match): void {
    if (clickedMatch.isActive && this.getTurn() != Turn.computer) {
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
