import {
    Directive,
    Output,
    EventEmitter,
    HostListener, 
    ElementRef
  } from '@angular/core';
  
  @Directive({
    selector: '[fileLoadDirective]'
  })
  export class FileLoadDirective {
  
    @Output() fileLoaded = new EventEmitter<any>(); 
    element: ElementRef;
  
    constructor (el: ElementRef) {
      this.element = el;
    }
  
    @HostListener('load', ['$event']) public onload() {
      this.fileLoaded.emit(true);
    }
    @HostListener('error', ['$event']) public onerror() {
      this.fileLoaded.emit(true);
    }
  }
  