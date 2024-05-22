import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-modal-placeholder",
  templateUrl: "./modal-placeholder.component.html",
  styleUrls: ["./modal-placeholder.component.css"],
})
export class ModalPlaceholderComponent implements OnInit {
  @Input("data") set setData(value) {
    if (value !== this.data) {
      this.data = value;
      if (this.calendarStyle) {
        this.setPlaceholderGeometry();
      }
    }
  }
  public data;
  _calendarStyle: any;
  get calendarStyle(): any {
    return this._calendarStyle;
  }
  @Input("calendarStyle") set calendarStyle(value: any) {
    if (value !== this.calendarStyle) {
      this._calendarStyle = value;
    }
  }

  @Input("hideScreen") set setHideScreen(value) {
    if (value !== this.hideScreen) {
      this.hideScreen = value;
    }
  }

  public hideScreen;
  public computedStyle = {
    placeholderGeometry: {},
    placeholderWeekend: {},
  };

  constructor() {}

  ngOnInit() {
    this.setPlaceholderGeometry();
  }

  setPlaceholderGeometry() {
    const status = this.data.status;
    const multiplier = status === false ? 7 : 2;
    this.computedStyle.placeholderGeometry = {
      height: this.calendarStyle.rowHeight + "px",
      width: this.calendarStyle.calendarColumnWidth * 7 + "px",
      left:
        this.data.position * this.calendarStyle.calendarColumnWidth * 7 + "px",
    };
    this.computedStyle.placeholderWeekend = {
      height: this.calendarStyle.rowHeight + "px",
      width: this.calendarStyle.calendarColumnWidth * multiplier + "px",
    };
  }
}
