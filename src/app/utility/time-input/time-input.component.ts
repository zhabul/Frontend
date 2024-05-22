import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.css']
})
export class TimeInputComponent implements OnInit, OnChanges {
 
  @Input('value') value = '00:00';
  @Input('disabled') disabled = false;
  @Output('saveEvent') saveEvent:EventEmitter<string> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
 
  }

  ngAfterViewInit() {
    this.initValue();
  }

  ngOnChanges() {
    this.initValue();
  }

  public hoursValue = '00';
  public minutesValue = '00';
  
  @ViewChild('minutes') minutes;
  @ViewChild('hours') hours;

  initValue() {
    if (!this.hours) return false;
    if (!this.minutes) return false;
    const splitTime = this.value.split(':');
    this.hoursValue = splitTime[0];
    this.minutesValue = splitTime[1];
    this.hours.nativeElement.value = this.hoursValue;
    this.minutes.nativeElement.value = this.minutesValue;
  }

  focus(type) {
    if (type === 'minutes') { 
      this.minutes.nativeElement.value = '';
    } else if (type === 'hours') {
      this.hours.nativeElement.value = '';
    }
  }
  resetValue($event, type) {
    const value = $event.target.value;
    if (type === 'minutes' && value === '') { 
      this.minutes.nativeElement.value = this.minutesValue;
    } else if (type === 'hours' && value === '') {
      this.hours.nativeElement.value = this.hoursValue;
    }
  }
  validateInput($event) {
    const data = $event.key;
    const value = $event.target.value;
    const regex = /^[\d./-]+$/;
    const test = regex.test(data);
    if (!test) { 
      $event.preventDefault();
    }
    if (value.length === 2) {
      $event.preventDefault();
    } 
  }

  validateTime($event, type) {
    const value = $event.target.value;
    const hoursType = type === 'hours';
    const minutesType = type === 'minutes';
    if (minutesType && value > 60) {
      $event.target.value = 60;
    } else if (minutesType && value < 0) {
      $event.target.value = '00';
    } else if (hoursType && value > 23) {
      $event.target.value = '00';
    } else if (hoursType && value < 0) {
      $event.target.value = '00';
    }

    if (hoursType && value.length === 2) {
      const minutesEl = this.minutes.nativeElement;
      minutesEl.value = '';
      minutesEl.focus();
    }

    if (minutesType && value.length === 2) {
      this.emitSaveEvent();
    }
  }

  emitSaveEvent() {

    const hours = this.formatNumber(this.hours.nativeElement.value);
    const minutes = this.formatNumber(this.minutes.nativeElement.value);
    const time = `${hours}:${minutes}`;
    this.saveEvent.emit(time);
  }

  formatNumber(number) {
    if (number.length === 1) {
      number = `0${number}`;
    }
    return number;
  }
}
