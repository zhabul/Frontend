import { AfterViewInit, Directive, Input } from '@angular/core';

@Directive({
  selector: '[appCounter]',
  exportAs: 'appCounter'
})
export class CounterDirective implements AfterViewInit {
  static nextIndex = 0;

  @Input() appCounter: number | string = '';

  index;

  constructor() {
    this.index = CounterDirective.nextIndex++;
  }
  
  ngAfterViewInit(): void {
    if (typeof this.appCounter === 'string') {
      return;
    }
    CounterDirective.nextIndex = this.appCounter;
  }
}