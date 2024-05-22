import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-row-wrapper",
  templateUrl: "./row-wrapper.component.html",
  styleUrls: [
    "./row-wrapper.component.css",
    "../time-registration-admin.component.css",
  ],
})
export class RowWrapperComponent implements OnInit {
  @Input("visible") visible;
  @Input("momentsWrapper") momentsWrapper;
  @Input("user") user;
  @Input("users") users;
  _calendarStyle: any;
  get calendarStyle(): any {
    return this._calendarStyle;
  }
  @Input("calendarStyle") set calendarStyle(value: any) {
    if (value !== this.calendarStyle) {
      this._calendarStyle = value;
    }
  }
  public calendar = [];
  @Input("calendar") set setCalendar(value) {
    if (value !== this.calendar) {
      this.calendar = value;
    }
  }
  public hideScreen;
  @Input("hideScreen") set setHideScreen(value) {
    if (value !== this.hideScreen) {
      this.hideScreen = value;
    }
  }

  constructor() {}

  ngOnInit() {}
}
