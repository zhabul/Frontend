import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-row-day",
  templateUrl: "./row-day.component.html",
  styleUrls: ["./row-day.component.css"],
})
export class RowDayComponent {
  public moments = false;
  public absences = false;
  public bound = false;
  @Input("visible") visible;
  @Input("calendar") calendar;
  @Input("day") day;
  @Input('queryParams') queryParams;
  public index = -1;
  @Input("index") set setIndex(value) {
    if (this.index != value) {
      this.index = value;
    }
  };
  _calendarStyle: any;
  get calendarStyle(): any {
    return this._calendarStyle;
  }
  @Input("calendarStyle") set calendarStyle(value: any) {
    if (value !== this.calendarStyle) {
      this._calendarStyle = value;
    }
  }
  @Input("user") set setUser(value) {
    if (value !== this.user) {
      this.user = value;

      if (this.index !== undefined && this.day) {
        this.setConditions();
      }
    }
  }
  @Output() updateAbsenceInfo = new EventEmitter<any>();
  public calendarBoundaries = {
    nrOfWeeks: 34,
    start: 0,
    end: 20,
  };
  @Input("calendarBoundaries") set setCalendarBoundaries(value) {
    if (value !== this.calendarBoundaries) {
      this.calendarBoundaries = value;
      this.setConditions();
    }
  }
  public user;


  setConditions() {
    this.resetConditions();
    this.dayCondition();
  }

  dayCondition() {
    const date = this.day.date;
    if (this.user.absences[date] && this.user.absences[date]?.length > 0) {
      this.absences = true;
    } else if (
      this.user.moments[this.day.date] &&
      (!this.user.absences[date] || this.user.absences[date]?.length == 0) &&
      this.user.moments[date].visible
    ) {
      this.moments = true;
    }
  }

  calcCalBound() {
    return (
      this.index >= this.calendarBoundaries.start &&
      this.index <= this.calendarBoundaries.nrOfWeeks
    );
  }

  updateAbsenceInfo_(event) {
    const key = event.key;
    this.user.absences[key] = event.newAbsenceInfo;
    this.updateAbsenceInfo.emit(event);
  }

  resetConditions() {
    this.moments = false;
    this.absences = false;
    this.bound = false;
  }
}
