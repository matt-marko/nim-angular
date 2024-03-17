import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  webSocketUrl: string = environment.webSocketUrl;

  private socket?: WebSocket;
  
  private connectionSuccessSubject: Subject<boolean> = new Subject<boolean>();
  connectionSuccess$: Observable<boolean> = this.connectionSuccessSubject.asObservable();

  private connectionMessagesSubject: Subject<string> = new Subject<string>();
  connectionMessages$: Observable<string> = this.connectionMessagesSubject.asObservable();

  private gameCodeSubject: Subject<string> = new Subject<string>();
  gameCode$: Observable<string> = this.gameCodeSubject.asObservable();

  // TODO: remove this
  private gameCode: string = '';
  
  constructor() {} 

  connect(): void {
    this.socket = new WebSocket(this.webSocketUrl)

    this.socket.onopen = (event: Event) => {
      console.log('Connection opened');
      this.connectionSuccessSubject.next(true);
    }
  
    this.socket.onerror = () => {
      console.error('Error occured when connecting');
      this.connectionSuccessSubject.next(false);
    }    

    this.socket.onmessage = (event: MessageEvent) => {
      console.log('Message received from server:', event.data);

      if (typeof event.data === 'string') {
        if (event.data.includes('CODE:')) {
          this.gameCodeSubject.next(event.data.split(' ')[1]);
        }
      }
    };
  }

  disconnect(): void {
    this.socket?.close();
  }

  getGameCode(): string {
    return this.gameCode;
  }


  /*connect(): void {
    // You can add any necessary event listeners here
    this.socket.subscribe({
      next: (msg) => {
        console.log('message received: ' + JSON.stringify(msg)),
        this.connectionSuccessSubject.next(true);
      },
      error: (err) => {
        console.error(err);
        this.connectionSuccessSubject.next(false);
      }, 
      complete: () => console.log('complete'),
    });
      /*(message) => {
        // Handle incoming messages
        console.log('Received message:', message);
      },
      (error) => {
        // Handle errors
        console.error('WebSocket error:', error);
      },
      () => {
        // Handle closure of connection
        console.log('WebSocket connection closed');
      }
  }*/
}
