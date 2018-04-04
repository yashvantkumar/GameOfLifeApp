import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service'

declare var $: any;
declare var Materialize:any;
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  name: String;
  unique_id;
  createGameBox = false;
  Game:any;
  AllPlayers: any;
  bonusCardsEvent = 'share';
  notification;

  constructor(private _socket: SocketService) { 
    if(localStorage.getItem('room')){
      this.Game = JSON.parse(localStorage.getItem('room'))
    } else {
      this.createGameBox = true;
    }
  }

  ngOnInit() {
    this.sideNavMat();
    $('.modal').modal();

    // Notification.requestPermission();

    // this.notification = new Notification(
    //   'Hello World!', {
    //     icon: 'https://blog.google/products/chrome/',
    //     body: 'Welcome'
    // });

    // new Notification(
    //     'Hello World!', {
    //       icon: 'https://blog.google/products/chrome/',
    //       body: 'Welcome'
    //   });
  
    
    if(this.Game && this.Game._id) {
      this._socket.emit('join player', {_id: this.Game._id});
      console.log(this.Game._id)
      // this._socket.emit('get players', {game_id: this.Game.game_id});
      this._socket.listen('room rejoined').subscribe((data) => {
        this.Game = data;
        localStorage.setItem('room', JSON.stringify(this.Game));
        this.createGameBox = false;
      });
      this._socket.listen('No player found').subscribe((data) => {
        this.Game = undefined;
        localStorage.removeItem('room')
        this.createGameBox = true;
      });
     
    }
    this._socket.listen('bonus card response').subscribe((data) => {
      if(data.to && (data.to._id == this.Game._id) && data.reply == 'share'){
        Materialize.toast(data.from.name+' wants to share wealth card with you')
      }else if(data.to && (data.to._id == this.Game._id) && data.reply == 'exemption'){
        Materialize.toast(data.from.name+'used exemption card')
      }
      else if(data.to){
        Materialize.toast(data.message,4000 );      
      }else{
        Materialize.toast(data.message,4000 );        
      }
    })
    this.playerJoined();
    this.joinedPlayers();

    this._socket.listen('game ended').subscribe((data) => { 
      Materialize.toast(data.message, 3000);
      localStorage.removeItem('room');                      
    });
    
    this._socket.listen('children update').subscribe((data) => {
      Materialize.toast(data, 3000);
      this.getMyData();
    });

    this._socket.listen('salary updated').subscribe((data) => {
      Materialize.toast(data, 3000);
      this.getMyData();
    });

    this._socket.listen('shared card').subscribe((data) => {
      Materialize.toast(data, 3000);      
      this.getMyData();      
    });

    this._socket.listen('deducted').subscribe((data) => {
      Materialize.toast(data, 3000);      
      this.getMyData();      
    });

    this._socket.listen('issued payday').subscribe((data) => {
      Materialize.toast(data, 3000);
      this.getMyData();                      
    });

    this._socket.listen('credited').subscribe((data) => {
      Materialize.toast(data, 3000);
      this.getMyData();                                               
    });

    this._socket.listen('issued promisary note').subscribe((data) => {
      Materialize.toast(data, 3000);
      this.getMyData(); 
    });

    this._socket.listen('issued insurance').subscribe((data) => {
      Materialize.toast(data, 3000);
      this.getMyData();
    });
  }

  sideNavMat() {
    $(".button-collapse").sideNav({
      menuWidth: 250, // Default is 300
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true,
    });
  }

  joinGame() {
    let data = {
      name: this.name,
      unique_id: this.unique_id
    }

    this._socket.emit('join game', data);
    this._socket.listen('room joined').subscribe((data) => {
      this.Game = data;
      localStorage.setItem('room', JSON.stringify(this.Game));
      this.createGameBox = false;
    });
  }

  playerJoined(){
    this._socket.listen('player joined').subscribe(data => {
      Materialize.toast(data.name +' has joined the game', 4000)
    });
  }

  joinedPlayers(){
    
    this._socket.listen('players').subscribe((data) => {
      this.AllPlayers = data;

    })
    this._socket.emit('get players', {game_id: this.Game.game_id});
        
  }

  openModal(data, event){
    $('#bonuscards').modal('open')
    if(event == 'share'){
      this.bonusCardsEvent = 'share';
    }else{
      this.bonusCardsEvent = 'exemption';      
    }
  }

  shareExemptCard(user){
    let data = {
      event: this.bonusCardsEvent,
      to: user._id,
      from: this.Game._id
    }
    if(data.to != data.from){
      this._socket.emit('bonus card', data)      
    }else{
      Materialize.toast('You cannot select yourself', 3000)
    }
    Materialize.toast('Request sent', 3000)
    $('#bonuscards').modal('close')
    this.getMyData();    
  }

  getMyData(){
    this._socket.emit('get my data', {_id: this.Game._id});
    this._socket.listen('my data').subscribe((data) => {
      localStorage.setItem('room', JSON.stringify(data));
      this.Game = data;
    })
  }

  // sendNotifications() {
  //   Notification.requestPermission();
  // }
}
