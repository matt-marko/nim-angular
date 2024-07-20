import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayModeSelectComponent } from './play-mode-select.component';
import { BoardComponent } from '../board/board.component';
import { ButtonComponent } from '../button/button.component';

describe('PlayModeSelectComponent', () => {
  let component: PlayModeSelectComponent;
  let fixture: ComponentFixture<PlayModeSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlayModeSelectComponent,
        BoardComponent,
        ButtonComponent,
      ]
    });
    fixture = TestBed.createComponent(PlayModeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
