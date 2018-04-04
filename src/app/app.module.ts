import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'materialize-css';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterializeModule } from 'angular2-materialize';
import { SocketService } from './socket.service';
import { GamehomeComponent } from './gamehome/gamehome.component';
import { FormsModule } from '@angular/forms';
import { PlayerComponent } from './player/player.component'

@NgModule({
  declarations: [
    AppComponent,
    GamehomeComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    MaterializeModule,
    FormsModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
