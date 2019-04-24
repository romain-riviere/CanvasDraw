import { Component, ViewChild, Renderer, ElementRef } from '@angular/core';
import { Platform, FabContainer } from 'ionic-angular';

@Component({
  selector: 'canvas-draw',
  templateUrl: 'canvas-draw.html'
})
export class CanvasDraw {

  @ViewChild('canvasDraw') canvas: ElementRef;
  @ViewChild('switchColorButton') switchColorButton: FabContainer;
  @ViewChild('switchLineWidthButton') switchLineWidthButton: FabContainer;

  canvasElement: any;

  lastX: number;
  lastY: number;

  isDrawing: boolean = false;

  colors: string[] = ['#000000', '#db0f0f', '#0fbf0f', '#35a3e8', '#FFFFFF'];
  currentColor: string = this.colors[0];

  lineWidths: number[] = [12, 15, 20, 25, 30]; //Check button width to have thiner brushes
  currentLineWidth: number = this.lineWidths[0];

  actualState: number = 0;
  lastStates: ImageData[] = [];

  constructor(
    public platform: Platform,
    public renderer: Renderer,
  ) { }

  ngAfterViewInit(): void {
    this.canvasElement = this.canvas.nativeElement;
    this.renderer.setElementAttribute(this.canvasElement, 'width', this.platform.width() + '');
    this.renderer.setElementAttribute(this.canvasElement, 'height', this.platform.height() + '');
    let ctx = this.canvasElement.getContext('2d');
    this.lastStates.push(ctx.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height));
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
    ctx.strokeStyle = this.currentColor;
    ctx.lineWidth = this.currentLineWidth;
    ctx.stroke();

    this.lastX = currentX;
    this.lastY = currentY;

    this.isDrawing = true;
  }

  handleEnd(event) {
    if (this.isDrawing) {
      let ctx = this.canvasElement.getContext('2d');
      if (this.actualState + 1 < this.lastStates.length) this.lastStates.splice(this.actualState + 1, this.lastStates.length);
      this.lastStates.push(ctx.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height));
      if (this.lastStates.length > 20) this.lastStates.splice(0, 1);
      this.actualState = this.lastStates.length - 1;
    }
    this.isDrawing = !this.isDrawing;
  }

  clearDraw() {
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.lastStates.push(ctx.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height));
    if (this.lastStates.length > 20) this.lastStates.splice(0, 1);
    this.actualState = this.lastStates.length - 1;
  }

  switchColor(index: number) {
    this.currentColor = this.colors[index];
    this.switchColorButton.toggleList();
  }

  switchLineWidth(index: number) {
    this.currentLineWidth = this.lineWidths[index];
    this.switchLineWidthButton.toggleList();
  }

  isColorLight(color): boolean {

    // Variables for red, green, blue values
    var r, g, b, hsp;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      r = color[1];
      g = color[2];
      b = color[3];
    }
    else {

      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +("0x" + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'));

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    return hsp > 127.5
  }

  undoDraw() {
    if (this.actualState > 0) {
      this.actualState--;
      let ctx = this.canvasElement.getContext('2d');
      ctx.putImageData(this.lastStates[this.actualState], 0, 0);
    }
  }

  redoDraw() {
    if (this.actualState + 1 < this.lastStates.length) {
      this.actualState++;
      let ctx = this.canvasElement.getContext('2d');
      ctx.putImageData(this.lastStates[this.actualState], 0, 0);
    }
  }

  public getDrawData = () => {
    return this.canvasElement.toDataURL();
  }

  public setDrawFromData = (data: string) => {
    let img = new Image;
    let ctx = this.canvasElement.getContext('2d');
    img.onload = () => {
      ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      ctx.drawImage(img, 0, 0);
    }
    img.src = data;
  }
}