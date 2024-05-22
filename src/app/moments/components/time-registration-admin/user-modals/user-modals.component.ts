import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { findConnectedWeeks, findConnectedWeeksReverse } from "./weeksUtility";
import { ChatStore } from "../calendar-user-row/week-modal/chat-store.service";
import { ColumnStateStore } from "../column-state-store.service";

@Component({
  selector: 'app-user-modals',
  templateUrl: './user-modals.component.html',
  styleUrls: ['./user-modals.component.css']
})
export class UserModalsComponent implements OnInit {

  public keysContainerStyle = {
    top: `0px`,
    left: `324px`,
    transform:  `translate3d(0px, 0px, 0px)`,
  };

  @Input('xTranslation') set setXTranslation(value) {
      this.keysContainerStyle = { 
        ...this.keysContainerStyle,
        transform:  `translate3d(0px, -${value}, 0px)`,
      };
  };

  public calendar = [];
  @Input("calendar") set setCalendar(value) {
    if (value !== this.calendar) {
      this.calendar = value;
    }
  };

  @Input("momentsWrapper") momentsWrapper;
  @Input("hideScreen") hideScreen;
  @Input("lastUser") lastUser;

  _calendarStyle: any;
  get calendarStyle(): any {
    return this._calendarStyle;
  };

  @Input("calendarStyle") set calendarStyle(value: any) {
    if (value !== this.calendarStyle) {

      this._calendarStyle = value;

      this.keysContainerStyle = {
        ...this.keysContainerStyle,
        left: `${this.calendarStyle.userWrapperWidth}px`
      };

      this.ref.detectChanges();
    }
  };

  public index = -1;
  @Input("index") set setIndex(value) {
    if (this.index != value) {
      this.index = value;
    }
  };

  public calendarBoundaries = {
    nrOfWeeks: 34,
    start: 0,
    end: 20,
  };


  
  @Output() hideScreenFunc = new EventEmitter<any>();
  @Output() updateUser = new EventEmitter<any>(); 
  @Output() updateDayStatus = new EventEmitter<any>();
  @Output() updateAbsences = new EventEmitter<any>();

  public modalKeys = [];
  
  public modalPosition = "top";

  public firstWeek = 0;
  public lastWeek = 0;
  public weeks = {};

  public firstModalDay = -1;
  public lastModalDay = -1;

  public zIndex = 0;

  public closeModalSub;
  public calendarSub;
  public openModalFromChatSub;

  public active;
  public user;
  @Input("active") set setDay(value) {
    if (value) {

      this.user = value.user;
      this.modalKeys = [];
      this.weeks = {}; 
      if (value && 
        this.calendar.length &&
        this.user &&
        !this.modalKeys.length &&
        this.calendarStyle
      ) {

        this.keysContainerStyle = {
          ...this.keysContainerStyle,
          top: `${value.RowNumber * this.calendarStyle.rowHeight}px`
        };
        this.index = value.index;
        this.openModal(value.day.index, value.day);

      }
    }
  };


  constructor(
    private ref: ChangeDetectorRef,
    private chatStore: ChatStore,
    private columnStateStore: ColumnStateStore,

    ) { }

  ngOnInit(): void {
    this.initializeComponent();
  }

  initializeComponent() {
    this.subscribeToCloseModal();
    this.subscribeToOpenModalFromChat();
  }

  unsubFromCalendarInfo() {
    if (this.calendarSub) {
      this.calendarSub.unsubscribe();
    }
  }

  unsubFromOpenModalFromChat() {
    if (this.openModalFromChatSub) {
      this.openModalFromChatSub.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubFromCalendarInfo();
    this.unsubFromOpenModalFromChat();
  }
  
  setWeekSpan() {
    if (this.calendar.length) {
      const height = this.momentsWrapper.clientHeight;
      const firstDay = this.calendar[0];
      this.firstWeek = firstDay.isoWeek;
      this.lastWeek = this.calendar[this.calendar.length - 1].isoWeek;
      let j = 0;
      for (let i = 0; i < this.calendar.length; i = i + 7) {
        const day = this.calendar[i];
        this.weeks[day.isoWeek] = {
          status: false,
          position: j,
          year: day.year,
          height: height, 
        };
        j = j + 1;
      }
      this.modalKeys = Object.keys(this.weeks);
    }
  }

  openWeekModal(info) {
    const day = info.day;
    if (this.modalKeys.length === 0) {
      this.setWeekSpan();
    } 
    const isoWeek = day.isoWeek;
    day.dayNameLong = this.getDayName(day.date, "en-En");
    this.setModalPosition();
    this.weeks[isoWeek] = { ...this.weeks[isoWeek], clickedDay: day };
    this.weeks[isoWeek].status = true;

  }

  
  removeWeek(isoWeek) {
    delete this.weeks[isoWeek];
    this.modalKeys = Object.keys(this.weeks);
  }

  setModalPosition() {
    if (this.index < 14) {
      this.modalPosition = "top";
    } else {
      this.modalPosition = "bottom";
    }
  }

  closeModal(week) {

    this.weeks = {
      ...this.weeks,
      [week]: { ...this.weeks[week], status: false },
    };
    this.emitHideScreen(false);
  }

  emitHideScreen(status) {
    this.hideScreenFunc.emit({
      status: status
    });
  }

  
  subscribeToCloseModal() {
    this.closeModalSub = this.columnStateStore.closeModals$.subscribe(() => {
      this.disableAllWeeks();
    });
  }

  subscribeToOpenModalFromChat() {
    this.openModalFromChatSub = this.columnStateStore.openModalFromChat$.subscribe((info) => {
      if (this.user.id == info.userId) {
        this.openModal(info.index, info.day);
      }
    });
  }


  
  shutDownModal() {
    if (this.zIndex === 1000) {
      this.disableAllWeeks();
    }
    this.unsubFromCalendarInfo();
    this.unsubFromCloseModal();
    this.unsubFromOpenModalFromChat();
  }

  openModal(index, day) {
    const absencesExist = this.user.absences[day.date];
    const absences = !absencesExist ? [] : this.user.absences[day.date];
    const daysToOpen = findConnectedWeeks({
      absences: absences,
      days: this.calendar,
      user: this.user,
      index: index,
    });
    const daysToOpenReverse = findConnectedWeeksReverse({
      absences: absences,
      days: this.calendar,
      user: this.user, 
      index: index,
    });
    const connectedWeeks = daysToOpen.concat(daysToOpenReverse);
    const allDays = [day].concat(connectedWeeks).sort((a, b) => {
      return a.isoWeek - b.isoWeek;
    });

    this.columnStateStore.closeModals(this.user.id);
    if (!this.allWeeksDisabled()) {
      const lastDayDate = allDays[allDays.length - 1].date;
      this.chatStore.initializeChat(lastDayDate, this.user.id, 500, 0);
    }
    this.generateFirstAndLastModalDay(allDays);
    allDays.forEach((day) => {
      this.openWeekModal({ day: day });
    });
    
  }

  unsubFromCloseModal() {
    if (this.closeModalSub) {
      this.closeModalSub.unsubscribe();
    }
  }

  
  allWeeksDisabled() {
    let flag = false;
    const weekKeys = Object.keys(this.weeks);
    for (let i = 0; i < weekKeys.length; i++) {
      const key = weekKeys[i];
      const week = this.weeks[key];
      if (week.status) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  disableAllWeeks() {
    const weekKeys = Object.keys(this.weeks);
    for (let i = 0; i < weekKeys.length; i++) {
      const key = weekKeys[i];
      const week = this.weeks[key];
      week.status = false;
    }
  }

  getDayName(dateStr, locale) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: "long" });
  }

  generateFirstAndLastModalDay(allDays) {
    
    let firstDay = allDays[0].index;
    let lastDay = allDays[allDays.length - 1].index;

    while (this.calendar[firstDay].dayName !== "Mon") {
      firstDay = firstDay - 1;
    }

    while (this.calendar[lastDay].dayName !== "Sun") {
      lastDay = lastDay + 1;
    }

    this.firstModalDay = this.calendar[firstDay].index;
    this.lastModalDay = this.calendar[lastDay].index;
  }
 
  updateDayStatus_(event) {
    this.updateDayStatus.emit(event); 
  }

  updateAbsences_(event) {
    this.updateAbsences.emit(event); 
  }
}