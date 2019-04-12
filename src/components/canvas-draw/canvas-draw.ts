import { Component } from '@angular/core';

/**
 * Generated class for the CanvasDrawComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'canvas-draw',
  templateUrl: 'canvas-draw.html'
})
export class CanvasDrawComponent {

  text: string;

  constructor() {
    console.log('Hello CanvasDrawComponent Component');
    this.text = 'Hello World';
  }

}
