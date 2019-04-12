import { Component, ViewChild, Renderer } from '@angular/core';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'canvas-draw',
  templateUrl: 'canvas-draw.html'
})
export class CanvasDraw {

  @ViewChild('canvasDraw') canvas: any;

  canvasElement: any;

  lastX: number;
  lastY: number;

  constructor(
    public platform: Platform,
    public renderer: Renderer
  ) { }

  ngAfterViewInit(): void {
    this.canvasElement = this.canvas.nativeElement;
    this.renderer.setElementAttribute(this.canvasElement, 'width', this.platform.width() + '');
    this.renderer.setElementAttribute(this.canvasElement, 'height', this.platform.height() + '');
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
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.stroke();

    this.lastX = currentX;
    this.lastY = currentY;
  }

  handleEnd(event) {
  }
}
