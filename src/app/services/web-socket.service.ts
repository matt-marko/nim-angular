import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  webSocketUrl: string = environment.webSocketUrl;

  private socket = webSocket(this.webSocketUrl);
  constructor() { }
}
