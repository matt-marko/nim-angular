import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() buttonText: string = 'Click me!';
  @Input() buttonColour: string = 'green';
  @Input() buttonSize: string = 'medium';

  buttonClass: string = 'green medium';

  ngOnInit() {
    this.buttonClass = `${this.buttonColour} ${this.buttonSize}`
  }
}
