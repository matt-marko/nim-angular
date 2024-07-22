import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, Subject } from 'rxjs';
import { WebSocketMessage } from '../interfaces/WebSocketMessage';

export const MessageConstants = {
  CONNECTION_OPENED: 'CONNECTION-OPENED:',
  CONNECTION_CLOSED: 'CONNECTION-CLOSED:',
  CREATE_GAME: 'CREATE-GAME:',
  GAME_CREATED: 'GAME-CREATED:',
  JOIN_GAME: 'JOIN-GAME:',
  GAME_JOINED: 'GAME-JOINED:',
  GAME_NOT_FOUND: 'GAME-NOT-FOUND:',
  GAME_FULL: 'GAME-FULL:',
  SAME_NAME: 'SAME-NAME:',
  OPPONENT_NAME: 'OPPONENT-NAME:',
  USER_LEFT: 'USER-LEFT:',
  START_GAME: 'START-GAME:',
  GAME_STARTED: 'GAME-STARTED:',
  TURN: 'TURN:',
  RESTART_GAME: 'RESTART-GAME:',
  GAME_RESTARTED: 'GAME-RESTARTED:',
};

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  webSocketUrl: string = environment.webSocketUrl;

  private socket?: WebSocket;

  private connectionMessagesSubject: Subject<WebSocketMessage> = new Subject<WebSocketMessage>();
  connectionMessages$: Observable<WebSocketMessage> = this.connectionMessagesSubject.asObservable();

  constructor() {} 

  connect(username: string, gameCode: string): void {
    this.socket = new WebSocket(this.webSocketUrl + username + '/' + gameCode);

    this.socket.onopen = (event: Event) => {}
  
    this.socket.onerror = () => {
      this.connectionMessagesSubject.error({
        webSocketCode: MessageConstants.CONNECTION_CLOSED,
        message: 'error',
      });

      console.error('An error occurred when connecting to the server.');
    }    

    this.socket.onclose = () => {
      this.connectionMessagesSubject.next({
        webSocketCode: MessageConstants.CONNECTION_CLOSED,
        message: 'close',
      });
    }   

    this.socket.onmessage = (event: MessageEvent) => {
      if (typeof event.data === 'string') {
        const webSocketCode: string = event.data.split(' ')[0];
        let message: string = event.data.split(' ')[1];

        if (Object.values(MessageConstants).includes(webSocketCode)) {
          this.connectionMessagesSubject.next({
            webSocketCode,
            message,
          });
        }
      }
    };
  }

  disconnect(): void {
    this.socket?.close();
  }

  sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('An error occurred when connecting to the server.');
    }
  }

  isConnected(): boolean {
    return this.socket?.readyState === 1;
  }
}
