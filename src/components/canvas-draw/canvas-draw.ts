import { Component, ViewChild, Renderer, ElementRef } from '@angular/core';
import { Platform, FabContainer } from 'ionic-angular';

@Component({
  selector: 'canvas-draw',
  templateUrl: 'canvas-draw.html'
})
export class CanvasDraw {

  @ViewChild('canvasDraw') canvas: ElementRef;
  @ViewChild('switchColorButton') switchColorButton: FabContainer;

  canvasElement: any;

  lastX: number;
  lastY: number;

  colorId: number = 0;
  colors: string[] = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFFFF'];

  constructor(
    public platform: Platform,
    public renderer: Renderer
  ) { }

  ngAfterViewInit(): void {
    this.canvasElement = this.canvas.nativeElement;
    this.renderer.setElementAttribute(this.canvasElement, 'width', this.platform.width() + '');
    this.renderer.setElementAttribute(this.canvasElement, 'height', this.platform.height() + '');
    this.reloadButtonColors();
  }

  handleStart(event) {
    this.lastX = event.touches[0].pageX;
    this.lastY = event.touches[0].pageY - 50;
  }

  handleMove(event) {
    let ctx = this.canvasElement.getContext('2d');
    let currentX = event.touches[0].pageX;
    let currentY = event.touches[0].pageY - 50;

    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.moveTo(this.lastX, this.lastY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();
    ctx.strokeStyle = this.colors[this.colorId];
    ctx.lineWidth = 5;
    ctx.stroke();

    this.lastX = currentX;
    this.lastY = currentY;
  }

  reloadButtonColors() {
    this.switchColorButton._mainButton.setElementStyle('background-color', this.colors[this.colorId]);
    //this.switchColorButton._mainButton.setElementStyle('color', 'black');
    this.switchColorButton._fabLists.first._fabs.forEach(
      (fab, index, arr) => {
        fab.setElementStyle('background-color', this.colors[index]);
      }
    )
  }

  handleEnd(event) {
  }

  switchColor(index: number) {
    this.colorId = index;
    this.reloadButtonColors();
  }
}
