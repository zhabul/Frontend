import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { ColumnStateStore } from "../column-state-store.service";

@Component({
  selector: "app-sticky-weeks",
  templateUrl: "./sticky-weeks.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    "./sticky-weeks.component.css",
    "../time-registration-admin.component.css",
  ],
})
export class StickyWeeksComponent implements OnInit {
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

  public calendarBoundaries = {
    nrOfWeeks: 34,
    start: 0,
    end: 20,
  };
  @Input("calendarBoundaries") set setCalendarBoundaries(value) {
    if (value !== this.calendarBoundaries) {
      this.calendarBoundaries = value;
    }
  }

  public overlayUser = false
  @Input("RowNumber") set setActive(value) {
    if (value !== -1) { 
      this.overlayUser = true;
    } else {
      this.overlayUser = false;
    }
  };

  public computedStyles = {
    calendarColumnWidth: {},
    dateDayStyle: {},
    weekStyle: {},
    weeksStyle: {},
  };
  public translateX = 0;
  public calendarSpan = {};
  constructor(
    private ref: ChangeDetectorRef,
    private columnStateStore: ColumnStateStore
  ) {}
  public calendarSub;

  ngOnInit() {
    this.setStyles();
    this.calendarSub = this.columnStateStore.state$.subscribe((state) => {
      this.calendarSpan = state.calendarSpan;
      //this.translateX = state.scrollLeft;
      this.setWeeksStyle();
    });
  }

  ngOnDestroy() {
    if (this.calendarSub) {
      this.calendarSub.unsubscribe();
    }
  }

  getDayNumber(date) {
    const day = new Date(date);
    return day.getDay();
  }

  setWeeksStyle() {
    this.computedStyles.weekStyle = {
      position: "relative",
      height: this.calendarStyle.headerHeight / 2 + "px",
      //transform: `translate3d(${-this.translateX}px, 0px, 0px)`,
    };
    this.ref.detectChanges();
  }

  printWeek(day, index) {
    const week = day.isoWeek;
    const v_week = "V." + week;

    const dayNumber = this.getDayNumber(day.date);

    if (dayNumber === 0 || index === this.calendar.length - 1) {
      return v_week;
    }

    return "";
  }

  setCalendarColumnWidth() {
    this.computedStyles.calendarColumnWidth = {
      width: this.calendarStyle.calendarColumnWidth + "px",
      height: this.calendarStyle.headerHeight / 2 + "px",
      position: "relative",
    };
  }

  setStyles() {
    this.setCalendarColumnWidth();
    this.setWeeksStyle();
  }
}
