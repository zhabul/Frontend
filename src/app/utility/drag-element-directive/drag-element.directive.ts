import { 
  Directive, 
  ElementRef, 
  HostListener
} from '@angular/core';


@Directive({
  selector: '[appDragElement]'
})
export class DragElementDirective {

  public tObj: {
    scale: number;
    panning: boolean;
    pointX: number;
    pointY: number;
    start: { x: number; y: number };
  } = {
        scale: 1,
        panning: false,
        pointX: 0,
        pointY: 0,
        start: { x: 0, y: 0 },
  };
  
  constructor(private hostElement: ElementRef) {}

  @HostListener('mousedown', ["$event"]) onMouseDown($event) {
    $event.preventDefault();
    this.tObj.start = {
        x: $event.clientX - this.tObj.pointX,
        y: $event.clientY - this.tObj.pointY,
    };
    this.tObj.panning = true;
  }

  @HostListener('mouseup') onMouseUp() {
    this.tObj.panning = false;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.tObj.panning = false;
  }

  @HostListener('mousemove', ["$event"]) onMouseMove($event) {
    $event.preventDefault();
    if (!this.tObj.panning) return;
    this.tObj.pointX = $event.clientX - this.tObj.start.x;
    this.tObj.pointY = $event.clientY - this.tObj.start.y;
    this.moveElement();
  }

  moveElement() {
      const element = this.hostElement.nativeElement;
      element.style.transform = `translate3d(${this.tObj.pointX}px,${this.tObj.pointY}px,0px)`;
  }
}