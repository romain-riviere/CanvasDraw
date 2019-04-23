import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CanvasDraw } from '../../components/canvas-draw/canvas-draw';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('canvas') canvas: CanvasDraw;

  constructor(public navCtrl: NavController) {
  }

  ngAfterViewInit(): void {
    console.log(this.canvas);
  }

}
