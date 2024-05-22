import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import { ColumnStateStore } from "../column-state-store.service";


@Component({
  selector: "app-calendar-user-row",
  templateUrl: "./calendar-user-row.component.html",
  styleUrls: ["./calendar-user-row.component.css"],
}) 
export class CalendarUserRowComponent implements OnInit {

  public calendar = [];
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  @Input("calendar") set setCalendar(value) {
    if (value !== this.calendar) {
      this.calendar = value;
    }
  };

  public calendarBoundaries = {
    nrOfWeeks: 34,
    start: 0,
    end: 20,
  };

  @Input("days") days;

  public hideScreen;
  @Input("hideScreen") set setHideScreen(value) {
    if (value !== this.hideScreen) {
      this.hideScreen = value;
    }
  };

  @Input("momentsWrapper") momentsWrapper;

  @Input("user") set setUser(value) {
    if (value !== this.user) {
      if (this.user && this.user.id !== value.id) {
        this.initializeComponent();
      }
      this.user = value;
      this.user_number = this.user.RowNumber;
    }
  };

  public user;

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
      this.setUserPlaceholderStyle();
      this.setPlaceholderStyle();
      this.ref.detectChanges();
    }
  };

  @Input("modalMaxHeight") modalMaxHeight;
  @Input("queryParams") queryParams;

  @Output() activeUserEmitter = new EventEmitter<any>();

  public zIndex = 700;
  public computedStyles = {
    calendarColumnWidth: {},
    dateDayStyle: {},
    weekStyle: {},
    userPlaceholderStyle: {},
    placeholderStyle: {},
    userRowStyle: {},
  };
  public translateX = 0;
  public calendarSub;
  public calendarSpan = {};
  public openModalFromChatSub;

  public user_number = 0;
  
  public overlayUser = false
  @Input("RowNumber") set setActive(value) {
    if (value !== -1 && value !== this.user_number - 1) {
      this.overlayUser = true;
    } else {
      this.overlayUser = false;
    }
  };

  constructor(
    private ref: ChangeDetectorRef,
    private columnStateStore: ColumnStateStore
  ) {}

  ngOnInit() {
    this.initializeComponent();
    this.user_number = this.user.RowNumber;
  }

  initializeComponent() {
    this.setUserPlaceholderStyle();
    this.setPlaceholderStyle();
    this.subscribeToCalendarSpan();
  }

  subscribeToCalendarSpan() {
    this.calendarSub = this.columnStateStore.state$.subscribe((state) => {
      if (this) {
        this.calendarSpan = state.calendarSpan;
        this.translateX = state.scrollLeft;
        this.calendarBoundaries = state.boundaries;
        this.setUserRowStyle();
      }
    });
  }

  unsubFromCalendarInfo() {
    if (this.calendarSub) {
      this.calendarSub.unsubscribe();
    }
  }

  ngOnDestroy() {}

  setUserRowStyle() {
    this.computedStyles.userRowStyle = {
      height: this.calendarStyle.rowHeight,
      zIndex: this.zIndex,
      transform: `translate3d(${-this.translateX}px, 0px, 0px)`,
    };
    if (!this.ref["destroyed"]) {
      this.ref.detectChanges();
    }
  }

  printWeek(day, index) {
    const week = day.isoWeek;
    const v_week = "V." + week;
    const dayNumber = this.getDayNumber(day.date);
    if (dayNumber === 0 || index === this.calendar.length - 1) {
      return v_week;
    }
  }

  getDayNumber(date) {
    const day = new Date(date);
    return day.getDay();
  }

  setWeeksStyle() {
    return {
      position: "relative",
    };
  }

  setWeekStyle() {
    this.computedStyles.weekStyle = {
      paddingTop: this.calendarStyle.dayFieldColumnPadding + "px",
      fontSize: this.calendarStyle.columnHeaderFontSize + "px",
    };
  }

  setDateDayStyle(day) {
    return {
      height: this.calendarStyle.headerHeight / 2 + "px",
      width: this.calendarStyle.calendarColumnWidth + "px",
      backgroundColor:
        day.dayName === "Sat" || day.dayName === "Sun"
          ? "#F0EFED"
          : "transparent",
    };
  }

  setCalendarColumnWidth() {
    this.computedStyles.calendarColumnWidth = {
      width: this.calendarStyle.calendarColumnWidth + "px",
      height: this.calendarStyle.headerHeight / 2 + "px",
    };
  }

  setUserPlaceholderStyle() {
    this.computedStyles.userPlaceholderStyle = {
      left: -this.calendarStyle.userWrapperWidth + "px",
      height: this.calendarStyle.rowHeight + "px",
      width: this.calendarStyle.userWrapperWidth + "px",
      position: "relative",
    };
  }

  setPlaceholderStyle() {
    const calStyle = this.calendarStyle;
    const height = calStyle.rowHeight + "px";
    const width = calStyle.calendarColumnWidth + "px";
    this.computedStyles.placeholderStyle = {
      height: height,
      width: width,
      visibility: "visible",
      transitionProperty: "all",
      position: "relative",
    };
  }

  setStyles() {
    this.setCalendarColumnWidth();
    this.setWeekStyle();
    this.setUserPlaceholderStyle();
    this.setUserRowStyle();
  }


  calcCalBound(index) {
    return (
      index >= this.calendarBoundaries.start &&
      index <= this.calendarBoundaries.nrOfWeeks
    );
  }

  updateAbsenceInfo(event) {
    const key = event.key;
    this.user.absences[key] = event.newAbsenceInfo;
  }

  emitActiveUser(day) {
    this.activeUserEmitter.emit({ index: this.index, day: day });
  }
}