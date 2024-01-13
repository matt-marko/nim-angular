import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DifficultySelectComponent } from './difficulty-select.component';
import { BoardComponent } from '../board/board.component';
import { ButtonComponent } from '../button/button.component';

describe('DifficultySelectComponent', () => {
  let component: DifficultySelectComponent;
  let fixture: ComponentFixture<DifficultySelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DifficultySelectComponent,
        BoardComponent,
        ButtonComponent,
      ]
    });
    fixture = TestBed.createComponent(DifficultySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
