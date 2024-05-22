import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: [
    './calendar-day.component.css',
    "../schedule-calendar.component.css"
  ]
})
export class CalendarDayComponent implements OnInit, OnChanges {
  private solid = '8px';
  private medium = '4px';
  private normal = '1px';
  private borderColor = 'var(--border-color)';
  @Output('activeDateListener') activeDateListener:EventEmitter<any> = new EventEmitter();
  @Input('day') day = {
    date: '',
    day: '',
    dayName: '',
    color: '',
    holiday: false
  };
  @Input('disabledDateForRaportTime') disabledDateForRaportTime = [];
  @Input('project') project;
  @Input('index') index;
  public inactiveStyle = {
    borderColor: this.borderColor,
    borderStyle: 'solid',
    borderWidth: this.normal,
    color: ''
  };
  public activeStyle = {
    borderColor: '#BFE29C',
    borderStyle: 'solid',
    borderWidth: this.solid,
    color: ''
  };
  public containerStyle = {
    color: '',
    borderColor: '',
    borderWidth: ''
  };
  public selectedDate = '';
  @Input('selectedDate') set setSelectedDate(date) {
    this.selectedDate = date;
    this.setBorderStyle();
    this.setContainerColor();
  }; 
  constructor() { }
  ngOnInit(): void {
  }
  ngOnChanges() {
    this.shouldShowLockIcon();
  }
  setBorderStyle() {
    if (this.selectedDate === this.day.date) {
      this.containerStyle = this.activeStyle;
    } else {
      this.containerStyle = this.inactiveStyle;
    }
  }
  setHolidayWidth() {
    if (this.day.holiday) {
      this.containerStyle.borderWidth =  this.solid;
    }
  }
  setContainerColor() {
    this.containerStyle.color = this.day.color;
    this.containerStyle.borderColor = this.day.color;
  }
  emitActiveDate() {
    this.onMouseLeave();
    this.activeDateListener.emit({ date: this.day.date, index: this.index });
  }
  public showLock = false;
  shouldShowLockIcon() {
    this.showLock = !this.project || this.disabledDateForRaportTime.includes(this.day.date);
    if (this.showLock === true) {
      this.containerStyle.color = this.borderColor;
      this.containerStyle.borderColor = this.borderColor;
    }
  }

  onMouseEnter() {
    if (this.day.date !== this.selectedDate && !this.day.holiday) {
      this.containerStyle.borderWidth = this.medium;
    }
  }

  onMouseLeave() {
    if (this.day.date !== this.selectedDate && !this.day.holiday) {
      this.containerStyle.borderWidth = this.normal;
    }
  }
}
