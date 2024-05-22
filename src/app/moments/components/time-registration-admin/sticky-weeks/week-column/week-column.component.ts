import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-week-column",
  templateUrl: "./week-column.component.html",
  styleUrls: [
    "./week-column.component.css",
    "../sticky-weeks.component.css",
    "../../time-registration-admin.component.css",
  ],
})
export class WeekColumnComponent implements OnInit {


  @Input("type") type;
  @Input("calendarSpan") calendarSpan;
  @Input("calendar") calendar;
  _calendarStyle: any;
  get calendarStyle(): any {
    return this._calendarStyle;
  }
  @Input("calendarStyle") set calendarStyle(value: any) {
    if (value !== this.calendarStyle) {
      this._calendarStyle = value;
      this.setStyles();
    }
  }

  @Input("calendarBoundaries") set setCalendarBoundaries(newBoundaries) {
    if (newBoundaries !== this.calendarBoundaries) {
      this.calendarBoundaries = newBoundaries;
      if (this._calendarStyle) {
        this.initializeComponent();
      }
    }
  }
  @Input("index") index;
  @Input("calendarColumnWidth") calendarColumnWidth;
  public day;
  @Input("day") set setDay(value) {
    if (this.day != value) {
      this.day = value;
      this.initializeComponent();
    }
  };

  public calendarBoundaries = {
    nrOfWeeks: 35,
    start: 0,
    end: 0,
  };

  public computedStyles = {
    dateDayStyle: {},
    displaceTextStyle: {},
    weekStyle: {},
  };
  public boundary_condition = false;
  public week = "";
  public bound;
  public currentDay = false;

  constructor() {}

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.calcCalBound();
    this.printWeek();
    this.setStyles();
    //this.setBoundaryCondition();
  }

  printWeek() {
    const week = this.day.isoWeek;
    const v_week = "V." + week;

    const dayNumber = this.getDayNumber(this.day.date);
    if (dayNumber === 4) {
      this.week = v_week;
    }
  }

  calcCalBound() {

    this.bound = true;
/*
    this.bound =
      this.index >= this.calendarBoundaries.start &&
      this.index <= this.calendarBoundaries.nrOfWeeks;*/

  }

  getDayNumber(date) {
    const day = new Date(date);
    return day.getDay();
  }

  getWeekColor() {
    return !this.day.boundary_condition ? "white" : "#858585";
  }

  getWeekBackgroundColor() {
    if (this.day.boundary_condition) {
      return "var(--main-bg)";
    }

    return "black";
  }

  setWeekStyle() {
    if (!this.calendarStyle) {
      return;
    }
    const style: any = {
      width: this.calendarColumnWidth + "px",
      color: this.getWeekColor(),
      backgroundColor: this.getWeekBackgroundColor(),
      borderBottom: "1px solid #707070",
      height: "100%",
      fontSize: this.calendarStyle.fontSizeMedium,
    };

    const dayNumber = this.getDayNumber(this.day.date);

    if (dayNumber === 0) {
      style.borderRight = "1px solid #707070";
    }

    this.computedStyles.weekStyle = style;
  }

  displaceWeekText() {

    if (!this.calendarStyle) {
      return;
    }
    const style: any = {
      position: "absolute",
      right: 0,
    };

    if (this.week !== "") {
      style.right =
        this.calendarStyle.calendarColumnWidth *
          (this.calendarStyle.calendarColumnWidth === 48 ? 3.35 : 3.4) +
        "px";
    }

    this.computedStyles.displaceTextStyle = style;
  }

  setDateDayStyle() {

    if (!this.calendarStyle) {
      return;
    }
    if (this.day.today) {
      this.currentDay = true;
    }

    this.computedStyles.dateDayStyle = {
      height: this.calendarStyle.headerHeight / 2 + "px",
      width: this.calendarStyle.calendarColumnWidth + "px",
      fontSize: this.calendarStyle.fontSizeMedium,
      borderBottom: "1px solid #707070",
      backgroundColor: this.currentDay
        ? "lightgreen"
        : this.getDayBackgroundColor(),
      color: this.getDayColor(),
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    };
  }

  getDayColor() {
    return !this.day.boundary_condition ? "black" : "#858585";
  }

  getDayBackgroundColor() {
    if (this.day.boundary_condition) {
      return "var(--main-bg)";
    }

    return this.day.dayName === "Sat" || this.day.dayName === "Sun"
      ? "#F0EFED"
      : "white";
  }

  setStyles() {
    this.setDateDayStyle();
    this.displaceWeekText();
    this.setWeekStyle();
  }

  setBoundaryCondition() {
    const cond =
      this.index >= this.calendarBoundaries.start &&
      this.index <= this.calendarBoundaries.end;

    if (cond !== this.boundary_condition) {
      this.boundary_condition = cond;
    }
  }
}
