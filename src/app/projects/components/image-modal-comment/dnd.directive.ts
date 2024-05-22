import {
  Directive,
  Output,
  EventEmitter,
  HostBinding,
  HostListener,
  ElementRef,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { Subject, throttleTime } from "rxjs";

@Directive({
  selector: "[appDnd]",
})
export class DndDirective implements OnInit, OnDestroy {
  @HostBinding("class.attachment-dragover") fileOver: boolean;
  @Output() fileDropped = new EventEmitter<any>();
  element: ElementRef;

  dragoverSubject = new Subject<any>();
  dragoverObservable = this.dragoverSubject
    .asObservable()
    .pipe(throttleTime(200));
  dragoverObsSub: any;

  constructor(el: ElementRef) {
    this.element = el;
  }

  ngOnInit() {
    this.dragoverObsSub = this.dragoverObservable.subscribe((evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (!this.fileOver) {
        this.fileOver = true;
      }
    });
  }

  ngOnDestroy() {
    if (this.dragoverObsSub) {
      this.dragoverObsSub.unsubscribe();
    }
  }

  // Dragover listener
  @HostListener("dragover", ["$event"]) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (!this.fileOver) {
      this.fileOver = true;
    }
  }

  // Dragleave listener
  @HostListener("dragleave", ["$event"]) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (this.fileOver === true) {
      this.fileOver = false;
    }
  }

  // Drop listener
  @HostListener("drop", ["$event"]) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
