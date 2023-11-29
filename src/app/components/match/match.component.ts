import { Component, Input } from '@angular/core';
import { Match } from '../../match';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent {
  imagePath: string = 'assets/match.png';

  @Input() match: Match = {
    isActive: true,
    isHighlighted: false,
    row: 0,
    column: 0,
  };

  determineClass(): string {
    if (this.match.isActive) {
      if (this.match.isHighlighted) {
        return 'highlighted';
      }
      return 'active';
    }
    return 'inactive';
  }
}

