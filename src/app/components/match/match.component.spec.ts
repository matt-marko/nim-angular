import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchComponent } from './match.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Match } from '../../match';

describe('MatchComponent', () => {
  let component: MatchComponent;
  let fixture: ComponentFixture<MatchComponent>;
  let testMatches: Match[] = [
    {
      isActive: true,
      row: 0,
      column: 0,
      isHighlighted: false,
    },
    {
      isActive: false,
      row: 1,
      column: 2,
      isHighlighted: false,
    },
    {
      isActive: true,
      row: 3,
      column: 6,
      isHighlighted: true,
    },
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchComponent]
    });
    fixture = TestBed.createComponent(MatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly set the class of the matches', () => {
    let matchElement: DebugElement;
    matchElement = fixture.debugElement.query(By.css('img'));

    component.match = testMatches[0];
    fixture.detectChanges();

    expect(matchElement.classes).toEqual({ active: true });

    component.match = testMatches[1];
    fixture.detectChanges();

    expect(matchElement.classes).toEqual({ inactive: true });

    component.match = testMatches[2];
    fixture.detectChanges();

    expect(matchElement.classes).toEqual({ highlighted: true });
  });
});
