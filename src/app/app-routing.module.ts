import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GamehomeComponent } from './gamehome/gamehome.component';
import { PlayerComponent } from './player/player.component';

const routes: Routes = [
  { path: 'gameHome', component: GamehomeComponent},
  { path: 'player', component: PlayerComponent},
  { path: '', redirectTo: 'gameHome', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
