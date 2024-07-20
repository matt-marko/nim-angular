import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { WebSocketService } from './services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Nim!';

  constructor(
    private router: Router,
    private webSocketService: WebSocketService,
  ) { }

  ngOnInit() {
    this.router.navigate(['']);

    // If the user presses the back button during an online game,
    // disconnect gracefully to prevent unusual behaviour
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && this.webSocketService.isConnected()) {
        if (event.navigationTrigger === 'popstate') {
          this.webSocketService.disconnect();
          this.router.navigate(['']);
        }
      }
    });
  }
}
