import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service'

declare var Materialize: any;
declare var $: any;

@Component({
  selector: 'app-gamehome',
  templateUrl: './gamehome.component.html',
  styleUrls: ['./gamehome.component.scss']
})
export class GamehomeComponent implements OnInit {
  game_name: String;
  banker_name;
  createGameBox = false;
  Game;
  players;
  menuPlayerId;
  showMenuCard = false;
  setSalaryId;
  notification;
  
  constructor(private _socket: SocketService) {
    if(localStorage.getItem('game')){
      this.Game = JSON.parse(localStorage.getItem('game'))
    } else {
      this.createGameBox = true;
    }
  }
  
  ngOnInit() {
    $('.modal').modal();
    $('select').material_select();
    Notification.requestPermission();

    // this.notification = new Notification(
    //   'Hello World!', {
    //     body: 'Welcome'
    // });


    // setTimeout(this.notification.close.bind(this.notification), 6000);

    if(this.Game && this.Game._id) {
      this._socket.emit('join banker', {_id: this.Game._id});
      this._socket.emit('get players', {game_id: this.Game._id});
      this.joinedPlayers(); 
    }
       
    this.playerJoined();
    // console.log(this.Game)
    this._socket.listen('notifiactions').subscribe((data) => {
    });

    this._socket.listen('removed insurance').subscribe((data) => {
      this._socket.emit('get players', {game_id: this.Game._id});   
      Materialize.toast(data.message, 4000);
    });

    this._socket.listen('issued insurance').subscribe((data) => {
      this._socket.emit('get players', {game_id: this.Game._id});   
      Materialize.toast(data.message, 3000)                
    });

    this._socket.listen('added children').subscribe((data) => {
      console.log(data)
      this._socket.emit('get players', {game_id: this.Game._id}); 
      Materialize.toast('Children added', 3000)                      
    });

    this._socket.listen('issued promisary note').subscribe((data) => {
      this._socket.emit('get players', {game_id: this.Game._id}); 
      Materialize.toast(data.message, 3000)                      
    });

    this._socket.listen('issued bonus card').subscribe((data) => {
      this._socket.emit('get players', {game_id: this.Game._id}); 
      Materialize.toast(data.message, 3000)           
    }); 

    this._socket.listen('issued payday').subscribe((data) => {
      this._socket.emit('get players', {game_id: this.Game._id}); 
      Materialize.toast(data.message, 3000)                      
    });

    this._socket.listen('game ended').subscribe((data) => { 
      this._socket.emit('get players', {game_id: this.Game._id});       
      Materialize.toast(data.message, 3000)                      
    });

    this._socket.listen('deducted').subscribe((data) => {
      this._socket.emit('get players', {game_id: this.Game._id});        
      Materialize.toast(data.message, 3000)                      
    });

    this._socket.listen('credited').subscribe((data) => { 
      this._socket.emit('get players', {game_id: this.Game._id});              
      Materialize.toast(data.message, 3000)                      
    });

  }

  openPromModal() {
    $('#promCard').modal('open');
  }

  openCredModal() {
    $('#cred').modal('open');
  }

  openDeduceModal() {
    $('#deduce').modal('open');
  }

  openSalaryModal(id) {
    $('#setSal').modal('open');
    this.setSalaryId = id;
  } 

  openInsuranceModal() {
    $('#insurance').modal('open');
  }
  openChildrenModal() {
    $('#addChildren').modal('open');
  }
  createGame() {
    let data = {
      name: this.game_name,
      banker_name: this.banker_name
    }

    this._socket.emit('create game', data);
    this._socket.listen('game created').subscribe((data) => {
      this.Game = data;
      localStorage.setItem('game', JSON.stringify(this.Game));
      this.createGameBox = false;
    });
  }

  playerJoined(){
    
    this._socket.listen('player joined').subscribe((data) => {
      // this.Game = data;
      console.log('aaaaa',data);
      this._socket.emit('get players', {game_id: this.Game._id});
      // localStorage.setItem('room', JSON.stringify(this.Game));
      // this.createGameBox = false;
    });
  }

  joinedPlayers(){
    
    this._socket.listen('players').subscribe((data) => {
      console.log(data);
      this.players = data;
    })
    this._socket.emit('get players', {game_id: this.Game._id});
  }

  showMenu(id){
    this.menuPlayerId = id;
    this.showMenuCard = true;
  }

  closeMenu(){
    this.showMenuCard = false;
    this.menuPlayerId = '';
  }
  
  payDay() {
    this._socket.emit('issue payday', {_id: this.menuPlayerId});
  }

  issueCards() {
    this._socket.emit('issue bonus card', {_id: this.menuPlayerId});
  }

  issueInsurance(value) {
    this._socket.emit('issue insurance', {_id: this.menuPlayerId, insurance: value});
  }

  removeInsurance(id, insurance){
    this._socket.emit('remove insurance', {_id: id, insurance: insurance});
  }

  issuePromisary(count) {
    this._socket.emit('issue promisary note', {_id: this.menuPlayerId, count: count});
  }

  addChildren(count, gameId) {
    this._socket.emit('add children', {_id: this.menuPlayerId, count: count});
    
  }

  setSalary(sal) {
    this._socket.emit('set salary', {_id: this.setSalaryId, salary: sal});
  }

  deduceAmount(amt) {
    this._socket.emit('deduct', {_id: this.menuPlayerId, value: amt});    
  }

  creditAmount(amt) {
    this._socket.emit('credit', {_id: this.menuPlayerId, value: amt});        
  }

  endGame(id){
    this._socket.emit('end game', {_id: id});
  }
}
