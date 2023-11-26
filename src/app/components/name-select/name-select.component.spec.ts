import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameSelectComponent } from './name-select.component';
import { BoardComponent } from '../board/board.component';
import { ButtonComponent } from '../button/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NameSelectHeaderPipe } from '../../pipes/name-select-header.pipe';
import { PlayerOneNameLabelPipe } from '../../pipes/player-one-name-label.pipe';

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
          NameSelectHeaderPipe,
          PlayerOneNameLabelPipe,
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
