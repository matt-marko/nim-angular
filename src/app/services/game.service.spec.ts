import { TestBed } from '@angular/core/testing';

import { GameService } from './game.service';
import { Match } from '../match';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the number of active matches', () => {
    expect(service.matchesLeft()).toEqual(16);

    spyOn(service, 'matchesLeftInRow').and.returnValues(1,3,3,3);
  
    expect(service.matchesLeft()).toEqual(10);
  });

  it('should return the number of active matches left in the specified row', () => {
    const mockMatches: Match[][] = getMockMatches();

    spyOn(service, 'getMatches').and.returnValue(mockMatches);

    expect(service.matchesLeftInRow(0)).toEqual(1);
    expect(service.matchesLeftInRow(1)).toEqual(3);
    expect(service.matchesLeftInRow(2)).toEqual(3);
    expect(service.matchesLeftInRow(3)).toEqual(2);
  });

  it('should determine the correct number of matches that would be removed on a click', () => {
    let matchToRemove: Match = {
      row: 2,
      column: 3,
      isActive: true,
      isHighlighted: false,
    }

    let result = service.matchesToRemove(matchToRemove);
    expect(result).toBe(4);

    matchToRemove = {
      row: 3,
      column: 1,
      isActive: true,
      isHighlighted: false,
    }

    result = service.matchesToRemove(matchToRemove);
    expect(result).toBe(2);
  });

  /*
  * Returns a mock match setup, where the first 3 matches in each row
  * are active, and the rest are inactive
  */
  function getMockMatches(): Match[][] {
    const matches: Match[][] = [];

    for (let i = 0; i < 4; i++) {
      const row: Match[] = [];

      for (let j = 0; j <= 2 * i; j++) {
        
        if (j < 3) {
          row.push(
            {
              isActive: true,
              isHighlighted: false,
              row: i, 
              column: j,
            }
          );
        } else {
          row.push(
            {
              isActive: false,
              isHighlighted: false,
              row: i, 
              column: j,
            }
          );
        }
      }

      matches.push(row);
    }

    return matches;
  }
});