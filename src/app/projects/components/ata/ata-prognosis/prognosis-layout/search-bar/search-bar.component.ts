import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from "rxjs";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.css"],
})
export class SearchBarComponent implements OnInit, AfterViewInit {
  @Input("timeToDebounce") timeToDebounce: number = 300;
  @Input("placeholder") placeholder: string = "SÖK";

  @Output("searchQuerty") searchQuery = new EventEmitter();

  @ViewChild("inputQuery") inputQuery: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    fromEvent(this.inputQuery.nativeElement, "keyup")
      .pipe(
        filter(Boolean),
        debounceTime(this.timeToDebounce),
        distinctUntilChanged(),
        tap((_) => {
          const value = this.inputQuery.nativeElement.value;
          this.onSearch(value);
        })
      )
      .subscribe();
  }

  onSearch(value) {
    this.searchQuery.emit(value);
  }

  onCancel() {
    if (!this.inputQuery) return;
    this.inputQuery.nativeElement.value = "";
    this.searchQuery.emit("");
  }
}
