import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameSelectComponent } from './name-select.component';
import { BoardComponent } from '../board/board.component';
import { ButtonComponent } from '../button/button.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('NameSelectComponent', () => {
  let component: NameSelectComponent;
  let fixture: ComponentFixture<NameSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations:
        [
          NameSelectComponent,
          BoardComponent,
          ButtonComponent,
        ],
      imports: [
        ReactiveFormsModule,
      ]
    });
    fixture = TestBed.createComponent(NameSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
