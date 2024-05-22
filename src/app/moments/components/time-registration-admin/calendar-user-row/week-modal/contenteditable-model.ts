import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from "@angular/core";

@Directive({
  selector: "[contenteditableModel]",
  host: {
    "(keyup)": "onKeyup()",
  },
})
export class ContenteditableModel {
  @Input("contenteditableModel") model: string;
  @Output("contenteditableModelChange") update = new EventEmitter();
  private lastViewModel: string;

  constructor(private elRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes["model"] &&
      changes["model"].currentValue !== this.lastViewModel
    ) {
      this.lastViewModel = this.model;
      this.refreshView();
    }
  }

  onKeyup() {
    var value = this.elRef.nativeElement.innerText;
    this.lastViewModel = value;
    this.update.emit(value);
  }

  private refreshView() {
    this.elRef.nativeElement.innerText = this.model;
  }
}
