import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSelectComponent } from './player-select.component';
import { BoardComponent } from '../board/board.component';
import { ButtonComponent } from '../button/button.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PlayerSelectComponent', () => {
  let component: PlayerSelectComponent;
  let fixture: ComponentFixture<PlayerSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlayerSelectComponent,
        BoardComponent,
        ButtonComponent,
      ]
    });
    fixture = TestBed.createComponent(PlayerSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the correct number of players', () => {
    spyOn(component, 'handlePlayerSelect');

    let buttonElements: DebugElement[];
    buttonElements = fixture.debugElement.queryAll(By.css('app-button'));

    buttonElements[0].triggerEventHandler('click');
    buttonElements[1].triggerEventHandler('click');

    expect(component.handlePlayerSelect).toHaveBeenCalledWith(1);
    expect(component.handlePlayerSelect).toHaveBeenCalledWith(2);
  });
});
