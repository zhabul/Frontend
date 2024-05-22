import { 
  Directive, 
  ElementRef, 
  HostListener, 
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Directive({
  selector: '[appScrollDetector]'
})
export class ScrollDetectorDirective {

  @Input('spinner') spinner;
  @Input('allFetched') allFetched;
  @Output('emitTrigger') emitTrigger:EventEmitter<any> = new EventEmitter();
  @Output('emitScrollLeft') emitScrollLeft:EventEmitter<number> = new EventEmitter();

  constructor(private scrollWindow: ElementRef) {}

  @HostListener('scroll') onScroll() {
    const el = this.scrollWindow.nativeElement;
    const scrollTop = el.scrollTop;
    const difference = el.scrollHeight - el.offsetHeight;
    const scrollLeft = el.scrollLeft;

    if( scrollTop >= difference && !this.spinner && !this.allFetched) {
      this.emitTrigger.emit(true);
    }

    this.emitScrollLeft.emit(scrollLeft);
  }

}
