import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SocketService {

  private socket = io('http://192.168.43.228:2700');

  // constructor() { }

  emit(value, data)
  {
    this.socket.emit(value, data);
  }

  listen(value)
  {
    let observable = new Observable<any>((observer) => {
        this.socket.on(value, (data)=>{
            observer.next(data);
        });
    });
    return observable;
  }

}
