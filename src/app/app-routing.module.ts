import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { HomeComponent } from './components/home/home.component';
import { InstructionsComponent } from './components/instructions/instructions.component';
import { PlayerSelectComponent } from './components/player-select/player-select.component';
import { NameSelectComponent } from './components/name-select/name-select.component';
import { HighScoresComponent } from './components/high-scores/high-scores.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'player-select', component: PlayerSelectComponent },
  { path: 'name-select', component: NameSelectComponent },
  { path: 'instructions', component: InstructionsComponent },
  { path: 'high-scores', component: HighScoresComponent },
  { path: 'game', component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
