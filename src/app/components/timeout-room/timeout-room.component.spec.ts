import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeoutRoomComponent } from './timeout-room.component';
import { BoardComponent } from '../board/board.component';
import { ButtonComponent } from '../button/button.component';

describe('TimeoutRoomComponent', () => {
  let component: TimeoutRoomComponent;
  let fixture: ComponentFixture<TimeoutRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimeoutRoomComponent,
        BoardComponent,
        ButtonComponent,
      ]
    });
    fixture = TestBed.createComponent(TimeoutRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
