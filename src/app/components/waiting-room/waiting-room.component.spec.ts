import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingRoomComponent } from './waiting-room.component';
import { BoardComponent } from '../board/board.component';
import { ButtonComponent } from '../button/button.component';

describe('WaitingRoomComponent', () => {
  let component: WaitingRoomComponent;
  let fixture: ComponentFixture<WaitingRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        WaitingRoomComponent,
        BoardComponent,
        ButtonComponent,
      ]
    });
    fixture = TestBed.createComponent(WaitingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
