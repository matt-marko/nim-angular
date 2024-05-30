import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, Subject } from 'rxjs';
import { WebSocketCode } from '../enums/webSocketCode';
import { WebSocketMessage } from '../interfaces/WebSocketMessage';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  webSocketUrl: string = environment.webSocketUrl;

  private socket?: WebSocket;
  
  private connectionSuccessSubject: Subject<boolean> = new Subject<boolean>();
  connectionSuccess$: Observable<boolean> = this.connectionSuccessSubject.asObservable();

  private connectionMessagesSubject: Subject<WebSocketMessage> = new Subject<WebSocketMessage>();
  connectionMessages$: Observable<WebSocketMessage> = this.connectionMessagesSubject.asObservable();

  // TODO remove some subjects
  private gameCodeSubject: Subject<string> = new Subject<string>();
  gameCode$: Observable<string> = this.gameCodeSubject.asObservable();
  
  constructor() {} 

  connect(username: string, gameCode: string): void {
    this.socket = new WebSocket(this.webSocketUrl + username + '/' + gameCode);

    this.socket.onopen = (event: Event) => {
      console.log('Connection opened');
      this.connectionSuccessSubject.next(true);
    }
  
    this.socket.onerror = () => {
      console.error('Error occured when connecting');
      this.connectionSuccessSubject.next(false);
    }    

    this.socket.onclose = () => {
      console.error('Connection closed');
      this.connectionSuccessSubject.next(false);
    }   

    this.socket.onmessage = (event: MessageEvent) => {
      console.log('Message received from server:', event.data);

      // TODO STOP HARDCODING
      if (typeof event.data === 'string') {
        if (event.data.includes('CONNECTION-OPENED:')) {
          this.connectionMessagesSubject.next({
            webSocketCode: WebSocketCode.connectionOpened,
            message: event.data.split(' ')[1],
          });
        } else if (event.data.includes('GAME-CREATED:')) {
          this.connectionMessagesSubject.next({
            webSocketCode: WebSocketCode.gameCreated,
            message: event.data.split(' ')[1],
          });
        } else if (event.data.includes('GAME-JOINED:')) {
          this.connectionMessagesSubject.next({
            webSocketCode: WebSocketCode.gameJoined,
            message: event.data.split(' ')[1],
          });
        } else if (event.data.includes('GAME-NOT-FOUND:')) {
          this.connectionMessagesSubject.next({
            webSocketCode: WebSocketCode.gameNotFound,
            message: event.data.split(' ')[1],
          });
        } else if (event.data.includes('OPPONENT-NAME:')) {
          this.connectionMessagesSubject.next({
            webSocketCode: WebSocketCode.opponentName,
            message: event.data.split(' ')[1],
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

      // TODO change this message
      console.error('WebSocket is not open. Ready state:', this.socket?.readyState);
    }
  }
}
