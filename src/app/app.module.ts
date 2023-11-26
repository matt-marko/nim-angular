import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ButtonComponent } from './components/button/button.component';
import { PlayerSelectComponent } from './components/player-select/player-select.component';
import { BoardComponent } from './components/board/board.component';
import { InstructionsComponent } from './components/instructions/instructions.component';
import { GameComponent } from './components/game/game.component';
import { MatchComponent } from './components/match/match.component';
import { NameSelectComponent } from './components/name-select/name-select.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HighScoresComponent } from './components/high-scores/high-scores.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ButtonComponent,
    PlayerSelectComponent,
    BoardComponent,
    InstructionsComponent,
    GameComponent,
    MatchComponent,
    NameSelectComponent,
    HighScoresComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
