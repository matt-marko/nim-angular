import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, Subject } from 'rxjs';
import { WebSocketMessage } from '../interfaces/WebSocketMessage';

export const MessageConstants = {
  CONNECTION_OPENED: 'CONNECTION-OPENED:',
  CREATE_GAME: 'CREATE-GAME:',
  GAME_CREATED: 'GAME-CREATED:',
  JOIN_GAME: 'JOIN-GAME:',
  GAME_JOINED: 'GAME-JOINED:',
  GAME_NOT_FOUND: 'GAME-NOT-FOUND:',
  OPPONENT_NAME: 'OPPONENT-NAME:',
  USER_LEFT: 'USER-LEFT:',
  START_GAME: 'START-GAME:',
  GAME_STARTED: 'GAME-STARTED:',
}

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
    // TODO maybe remove console logs?

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

      // TODO this can surely be simplified, maybe with a loop
      if (typeof event.data === 'string') {
        if (event.data.includes(MessageConstants.CONNECTION_OPENED)) {
          this.connectionMessagesSubject.next({
            webSocketCode: MessageConstants.CONNECTION_OPENED,
            message: event.data.split(' ')[1],
          });
        } else if (event.data.includes(MessageConstants.GAME_CREATED)) {
          this.connectionMessagesSubject.next({
            webSocketCode: MessageConstants.GAME_CREATED,
            message: event.data.split(' ')[1],
          });
        } else if (event.data.includes(MessageConstants.GAME_JOINED)) {
          this.connectionMessagesSubject.next({
            webSocketCode: MessageConstants.GAME_JOINED,
            message: event.data.split(' ')[1],
          });
        } else if (event.data.includes(MessageConstants.GAME_NOT_FOUND)) {
          this.connectionMessagesSubject.next({
            webSocketCode: MessageConstants.GAME_NOT_FOUND,
            message: event.data.split(' ')[1],
          });
        } else if (event.data.includes(MessageConstants.OPPONENT_NAME)) {
          this.connectionMessagesSubject.next({
            webSocketCode: MessageConstants.OPPONENT_NAME,
            message: event.data.split(' ')[1],
         });
        } else if (event.data.includes(MessageConstants.USER_LEFT)) {
          this.connectionMessagesSubject.next({
            webSocketCode: MessageConstants.USER_LEFT,
            message: event.data.split(' ')[1],
         });
        } else if (event.data.includes(MessageConstants.GAME_STARTED)) {
          this.connectionMessagesSubject.next({
            webSocketCode: MessageConstants.GAME_STARTED,
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
