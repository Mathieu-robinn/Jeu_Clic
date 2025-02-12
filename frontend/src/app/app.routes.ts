import { Routes } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { PseudoComponent } from './pseudo/pseudo.component';
import { GameComponent } from './game/game.component';
import { GameResultsComponent } from './game-results/game-results.component';

export const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'pseudo', component: PseudoComponent },
  { path: 'game-results', component: GameResultsComponent },
  { path: '', component: LandingPageComponent },
  { path: '**', component: LandingPageComponent }
];